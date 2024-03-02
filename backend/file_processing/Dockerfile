FROM python:3.11

WORKDIR /readings/backend/file_processing

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y celery

CMD celery -A tasks worker -l info
