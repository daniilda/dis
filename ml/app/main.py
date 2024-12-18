import io
import os
from xml.etree.ElementTree import tostring

from PIL import Image
from fastapi import FastAPI, UploadFile
from qdrant_client import QdrantClient

from qwen import QwenAnswerGenerator
from vlm import PDFProcessor

qdrant_client = QdrantClient(
    url= os.getenv("QDRANT_ADDRESS", "http://90.156.159.212:80")
)
app = FastAPI()
vlm = PDFProcessor()
qwen = QwenAnswerGenerator()

@app.post("/index")
async def index(file: UploadFile, id: str):
    return vlm.load_pdf(qdrant_client, await file.read(), id)

@app.post("/query")
async def query(query: str):
    a = await vlm.search_slide(qdrant_client, query)
    id = a['document_id']
    page = a['slide_id']
    with Image.open(f"/workspace/image_folder/{id}/page_{page}.png", "r") as i:
        res = await qwen.generate_answer(i, page)
    return {'response':res, 'document_id': id, 'page': page}


@app.get("/page")
async def get_page(doc_id: str, page: int):
    img_byte_arr = io.BytesIO()
    with Image.open(f"/workspace/image_folder/{doc_id}/page_{page}.png", "r") as i:
        i.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        return img_byte_arr

