FROM python:3.12

WORKDIR /readings/backend

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["sh", "-c", "cd .. && gunicorn --bind 0.0.0.0:5000 backend.app:app"]