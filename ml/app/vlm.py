import asyncio
from pdf2image import convert_from_bytes
import os
from PIL import Image
import torch
from typing import Dict, List, Optional, Union
from colpali_engine.models import ColPali, ColPaliProcessor
from collections import defaultdict
import time
from qdrant_client.http import models


class PDFProcessor:
    def __init__(self, device: str = "cuda", hf_token: Optional[str] = None, path_image: str = ""):
        # Инициализация модели и процессора
        self.device = device
        self.model = self._load_model(hf_token)
        self.processor = self._load_processor(hf_token)
        self.documents = []  # defaultdict(lambda: {'embeddings': [], 'images': []})
        self.get_id_documents = []
        self.path_image = path_image

    def _load_model(self, hf_token: Optional[str] = None):
        pretrained_model_name_or_path = "vidore/colpali-v1.2"
        model = ColPali.from_pretrained(
            pretrained_model_name_or_path,
            torch_dtype=torch.bfloat16,
            device_map="cuda" if self.device == "cuda" else None,
            token=hf_token
        )
        return model.eval().to(self.device)

    def _load_processor(self, hf_token: Optional[str] = None):
        pretrained_model_name_or_path = "vidore/colpali-v1.2"
        processor = ColPaliProcessor.from_pretrained(
            pretrained_model_name_or_path,
            token=hf_token
        )
        return processor

    def _process_pdf(self, qdrant_client, pdf: bytes, doc_id: str):
        # Преобразование PDF в изображения и извлечение эмбеддингов
        images = convert_from_bytes(pdf, thread_count=os.cpu_count() - 1)
        start_id_image = len(self.get_id_documents)
        id_document = len(self.documents)
        for idx, i in enumerate(images):
            if not os.path.exists(f"/workspace/image_folder/{doc_id}"):
                os.makedirs(f"/workspace/image_folder/{doc_id}")
            i.save(f"/workspace/image_folder/{doc_id}/page_{idx}.png", "PNG")
            self.get_id_documents.append((id_document, idx))
        self.documents.append(id_document)

        doc_embeddings = []

        for i, image in enumerate(images):
            processed_image = self.processor.process_images([image])

            with torch.inference_mode():
                processed_image = {
                    k: v.to(self.device).to(
                        self.model.dtype if v.dtype in [torch.float16, torch.bfloat16, torch.float32] else v.dtype)
                    for k, v in processed_image.items()
                }
                embedding = self.model(**processed_image)
            doc_embeddings.append(torch.unbind(embedding.to("cpu")))

        # используем Qdrant
        points = []
        for j, embedding in enumerate(doc_embeddings):
            # Convert the embedding to a list of vectors
            multivector = embedding[0].cpu().float().numpy().tolist()
            points.append(
                models.PointStruct(
                    id=start_id_image + j,  # we just use the index as the ID

                    vector=multivector,  # This is now a list of vectors
                    payload={
                        "source": "internet archive",
                        "doc_id": doc_id,
                        "page": j
                    },  # can also add other metadata/data
                )
            )
        qdrant_client.upsert(
            collection_name="ufo-binary",
            points=points,
            wait=False,
        )

    def load_pdf(self, qdrant_client, pdf: bytes, id: str) -> str:
        # Загрузка нового файла и создание эмбеддингов
        self._process_pdf(qdrant_client, pdf, id)
        return id

    async def _process_query(self, query: str) -> torch.Tensor:
        # Преобразование запроса в вектор
        batch_query = self.processor.process_queries([query])
        batch_query = {k: v.to(self.device).to(
            self.model.dtype if v.dtype in [torch.float16, torch.bfloat16, torch.float32] else v.dtype) for k, v in
            batch_query.items()}
        return self.model(**batch_query)

    async def search_slide(self, qdrant_client, query: str) -> Dict[str, Union[int, int]]:
        embeddings_query = await self._process_query(query)
        query_embeddings = list(torch.unbind(embeddings_query.to("cpu")))
        res = query_embeddings[0].cpu().float().numpy().tolist()

        search_result = qdrant_client.query_points(
            collection_name="ufo-binary",
            query=res,
            limit=3,
            timeout=100,
            search_params=models.SearchParams(
                quantization=models.QuantizationSearchParams(
                    ignore=False,
                    rescore=True,
                    oversampling=2.0,
                )
            )
        )

        doc_id = search_result.points[0].payload["doc_id"]
        slide_id = search_result.points[0].payload["page"]

        # req_embeddings = [torch.cat(embedding, dim=0) for doc in self.documents.values() for embedding in doc['embeddings']]
        # scores = self.processor.score(query_embeddings, req_embeddings).cpu().numpy()
        # top_index = scores.argsort(axis=1)[0][-1]
        # doc_id, slide_id = divmod(top_index, len(self.documents[0]['embeddings']))

        return {"document_id": doc_id, "slide_id": slide_id}

    def delete_document(self, doc_id: int) -> bool:
        if doc_id in self.documents:
            del self.documents[doc_id]
            return True
        else:
            print(f"Document with ID {doc_id} not found.")
            return False


pdf_processor = PDFProcessor(device="cuda", hf_token="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")
from qdrant_client import QdrantClient

qdrant_client = QdrantClient(
    url= os.getenv("QDRANT_ADDRESS", "http://90.156.159.212:80")
)

collection_name = "ufo-binary"
if not qdrant_client.collection_exists(collection_name):
    qdrant_client.create_collection(
        collection_name=collection_name,
        on_disk_payload=True,  # store the payload on disk
        vectors_config=models.VectorParams(
            size=128,
            distance=models.Distance.COSINE,
            on_disk=True,  # move original vectors to disk
            multivector_config=models.MultiVectorConfig(
                comparator=models.MultiVectorComparator.MAX_SIM
            ),
            quantization_config=models.BinaryQuantization(
                binary=models.BinaryQuantizationConfig(
                    always_ram=True  # keep only quantized vectors in RAM
                ),
            ),
        ),
    )
