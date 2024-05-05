from google.cloud import pubsub_v1
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(os.getcwd(), "backend", "file_processing", 'storagesa.json')  # TODO: Verificar que el archivo exista en /backend/views/

project_id = "proyectocloud-422409"
topic_name = "pubsubtopic"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_name)

# Data to publish
data = b"Hello, world!"

# Publish the message
future = publisher.publish(topic_path, data=data)
print(f"Published message ID: {future.result()}")