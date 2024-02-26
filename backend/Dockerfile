FROM python:3.12

WORKDIR /readings/backend

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["sh", "-c", "exec flask run --host=0.0.0.0"]
