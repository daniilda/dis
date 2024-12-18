# Норникель hack - команда MISIS IS ALL YOU NEED
## Задача
Задача заключалась в создании эффективного пайплайна для автоматического поиска и индексации документов с использованием мультимодального RAG и модели ColPali. Участникам предстоило разработать систему, которая сможет обрабатывать различные форматы данных, обеспечивая быструю и точную индексацию. Это решение значительно упростит доступ к информации и повысит продуктивность работы с документами в различных областях.

💰 Мы выиграли второе место, выигрыш которого был 150k руб

## Data
Были даны 100 pdf файлов и 2 docx файла, на основе которых нужно было давать ответа на входящие вопросы. Основная проблема была в формате данных - pdf, которые сложны в обработке и взятии информации.

## ML Технологии
Весь код был написан на языке Python.
1) Разделение pdf данных на слайды-фотографии благодаря библиотеки pdf2image
2) Использование модели ColPali для получения эмбединга слайда презентации
3) Развернули векторную БД Qdrant для эмбедингов ColPali
4) Разделениние слайда на смысловые фрагменты (текст, диаграммы, таблицы, картинки) детекцией дообученной YOLOv10
5) Кластеризация картинки на 4 класса благодаря KMeans
6) Ответ на вопрос пользоватаеля благодаря Qwen, благодаря разделению релевантной картинки на 4 части
7) Ответ LLM модели Vikhr-Nemo-12B-Instruct-R-21-09-24-4Bit-GPTQ

## Веб технологии
React, TypeScript, Tailwind, MobX
1) Окно для чата
2) Список историй чатов
3) Всплывающая плашка для загрузки PDF
4) В сообщениях указание на документ и ответ

## Архитектурное решение
Мы предоставили две реализации задачи

**Первая реализация:** При получении pdf, мы разделяем его на слайды и получение embeddings благодаря ColPali. Сохраняем в Qdrant. Пользователь вводит запрос -> Переводим в embedding вопрос user -> Находим самый близкий слайд из БД Qdrant -> Используем Qwen для ответа на вопрос user -> Выдаём ответ. **В итоге результат не углублённый, местами не точный**

**Вторая реализация:** Пользователь вводит запрос -> Находим самый близкий слайд и БД Qdrant -> С помощью библиотеки doclayout-yolo разделяем слайд на: текст картинки графики таблицы -> Делаем кластеризацию на 4 класса -> Вырезаем 4 фрагмента текста -> Обрабатываем каждый из фрагментов Qwen, чтобы она описала картинку/текст (а не дала ответ) -> Подаём в Vikhr-Nemo-12B-Instruct-R-21-09-24-4BitGPTQ как контекст и получаем ответ -> Выдаём ответ. **Данная реализация будет более точной и с углубленным ответом.**

## Product screencast
![image](https://github.com/MALINAYAGODA/dis/blob/master/image.png)

## Как запускать

1. Необходимо предварительно установить [Docker с поддержкой GPU](https://docs.docker.com/desktop/features/gpu/) и Docker Compose
2. Произвести клонирование репозитория на машину git clone https://github.com/daniilda/dis.git
3. docker-compose up -d