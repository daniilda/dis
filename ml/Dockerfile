FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN apt-get update
RUN apt install poppler-utils

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN pip install "fastapi[standard]"


COPY ./app /code/app


CMD ["fastapi", "run", "app/main.py", "--port", "80"]