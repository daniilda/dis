import asyncio
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info
import torch
from PIL import Image
import time
from pdf2image import convert_from_path
from PIL import Image


class QwenAnswerGenerator:
    def __init__(self, model_name: str = "Qwen/Qwen2-VL-2B-Instruct", device: str = "cuda"):
        # Инициализация модели и процессора
        self.device = device
        self.model = self._load_model(model_name)
        self.processor = self._load_processor(model_name)

    def _load_model(self, model_name: str) -> Qwen2VLForConditionalGeneration:
        # Загрузка модели
        model = Qwen2VLForConditionalGeneration.from_pretrained(
            model_name,
            trust_remote_code=True,
            torch_dtype=torch.bfloat16
        ).to(self.device).eval()
        return model

    def _load_processor(self, model_name: str) -> AutoProcessor:
        # Загрузка процессора
        processor = AutoProcessor.from_pretrained(model_name, trust_remote_code=True)
        return processor

    async def generate_answer(self, image: Image, query: str) -> str:
        """
        Асинхронная генерация ответа на основе изображения и текстового запроса.
        """
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": query},
                ],
            }
        ]

        start = time.time()

        # Преобразование входных данных
        text = self.processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = self.processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            # Генерация текста на основе модели
            generated_ids = self.model.generate(**inputs, max_new_tokens=100)
            generated_ids_trimmed = [
                out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
            ]
            output_text = self.processor.batch_decode(
                generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
            )

        # Очистка памяти GPU
        del generated_ids
        del inputs
        torch.cuda.empty_cache()

        print(f"Query processed in {time.time() - start:.2f} seconds.")
        return output_text[0]


# images = convert_from_path("/workspace/file_2.pdf", size=(1024, 1024))
answer_generator = QwenAnswerGenerator(model_name="Qwen/Qwen2-VL-2B-Instruct", device="cuda")