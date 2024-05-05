from concurrent import futures
from datetime import datetime
import os
from typing import Callable
from gcloud import storage
from google.cloud import pubsub_v1
import json
import tempfile
from flask_restful import Resource
from backend.models.models import Tarea, TareaSchema, Usuario, UsuarioSchema
from ..models import db
from ..auth import auth
from flask import request, send_file
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
usuario_schema = UsuarioSchema()
tarea_schema = TareaSchema()

os.environ.setdefault("GCLOUD_PROJECT", "proyectocloud")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/readings/backend/views/storagesa.json'  # TODO: Verificar que el archivo exista en /backend/views/

class VistaSignUp(Resource):
    def post(self):
        yaExisteElUsuario = Usuario.query.filter(Usuario.email == request.json["email"]).first()
        if yaExisteElUsuario:
            return {'error': 'Ya existe un usuario con este correo '}
        else:
            if (request.json['password1'] != request.json['password2']):
                return {'error': 'Las contrasenias no coinciden'}
            else:
                user_password= auth.hashear_contrasenia(request.json['password1'])
                nuevo_usuario = Usuario(username=request.json['username'],
                                        password=user_password,
                                        email=request.json['email'])
                token_de_acceso = create_access_token(identity=request.json['email'])
                db.session.add(nuevo_usuario)
                db.session.commit()
                return {'mensaje': 'Usuario creado exitosamente',
                        'token_de_acceso': token_de_acceso,
                        'usuario': usuario_schema.dump(nuevo_usuario)}

class VistaLogIn(Resource):
    def post(self):
        usuario = Usuario.query.filter(Usuario.email == request.json["email"]).first()
        db.session.commit()
        if usuario is None:
            return {"error":"El usuario no existe"}
        else:
            if not auth.verificar_contrasenia(request.json["password"], usuario.password):
                 return {'error': 'Credenciales inválidas'}
            token_de_acceso = create_access_token(identity = usuario.email)
            return {"mensaje":"Acceso concedido",
                    "token_de_acceso": token_de_acceso,
                    "usuario": usuario_schema.dump(usuario)}

class VistaUsuario(Resource):   
    @jwt_required()
    def delete(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        db.session.delete(usuario)
        db.session.commit()
        return 'Operacion exitosa', 204

class VistaTareas(Resource):
    @jwt_required()
    def post(self):
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()

        file = request.files['file']
        parts = file.filename.split(".")
        oldFormat = parts[-1]

        json_data = json.loads(request.form.get('data'))
        nueva_tarea = Tarea(fileName=file.filename,
                            oldFormat=oldFormat,
                            newFormat=json_data['newFormat'],
                            status="UPLOADED",
                            id_usuario=usuario.id)

        db.session.add(nueva_tarea)
        usuario.tareas.append(nueva_tarea)
        db.session.commit()

        input_path = str(nueva_tarea.id) + "_" + file.filename
        output_path = str(nueva_tarea.id) + "_" + ".".join(parts[:-1]) + ".pdf"

        gcs = storage.Client()
        bucket = gcs.get_bucket("bucketproyectocloud")
        blob = bucket.blob(input_path)
        blob.upload_from_file(file)

        project_id = "proyectocloud-422409"
        topic_name = "proyecto3pubsub"

        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(project_id, topic_name)

        match oldFormat:
            case "docx":
                data = f"docx;{input_path};{output_path};{nueva_tarea.id}".encode('utf-8')
                future = publisher.publish(topic_path, data=data)

                print(f"Published message ID: {future.result()}")

                #docx_a_pdf.delay(input_path, output_path, nueva_tarea.id)

            case "pptx":
                data = f"pptx;{input_path};{output_path};{nueva_tarea.id}".encode('utf-8')
                future = publisher.publish(topic_path, data=data)

                #pptx_a_pdf.delay(input_path, output_path, nueva_tarea.id)

            case "xlsx":
                data = f"xlsx;{input_path};{output_path};{nueva_tarea.id}".encode('utf-8')
                future = publisher.publish(topic_path, data=data)
        
                #xlsx_a_pdf.delay(input_path, output_path, nueva_tarea.id)
            
            case "odt":
                data = f"odt;{input_path};{output_path};{nueva_tarea.id}".encode('utf-8')
                future = publisher.publish(topic_path, data=data)

                #odt_a_pdf.delay(input_path, output_path, nueva_tarea.id)

            case _:
                ...

        return tarea_schema.dump(nueva_tarea)

class VistaTareasUsuario(Resource):
    @jwt_required()
    def get(self):
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        return [tarea_schema.dump(tarea) for tarea in Tarea.query.filter(Tarea.id_usuario == usuario.id)]

class VistaTarea(Resource):
    @jwt_required()
    def get(self, id_task):
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        tarea = Tarea.query.get_or_404(id_task)
        if usuario.id != tarea.id_usuario:
            return 'El archivo no existe', 404
        else:
            return tarea_schema.dump(tarea)

    @jwt_required()
    def delete(self, id_task):
        tarea = Tarea.query.get_or_404(id_task)
        if str(tarea.status) == "Estado.PROCESSED":
            parts = tarea.fileName.split(".")

            storage_client = storage.Client()
            bucket = storage_client.bucket("bucketproyectocloud")

            blob = bucket.blob(str(id_task) + "_" + tarea.fileName)
            blob.delete()

            blob = bucket.blob(str(id_task) + "_" + ".".join(parts[:-1]) + ".pdf")
            blob.delete()

            db.session.delete(tarea)
            db.session.commit()
            return 'Operacion exitosa', 204
        return {'error': 'El archivo no se ha procesado...'}
    
class VistaArchivo(Resource):
    @jwt_required()
    def get(self, filename):
        parts = filename.split("_")
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        tarea = Tarea.query.get_or_404(parts[0])

        if (tarea is None) or (usuario.id != tarea.id_usuario):
            return 'El archivo no existe', 404
        elif tarea.status == "UPLOADED":
            return {'error': 'Procesando archivo...'}
        else:
            parts = filename.split(".")
            name = ".".join(parts[:-1]) + ".pdf"

            gcs = storage.Client()
            bucket = gcs.get_bucket("bucketproyectocloud")
            blob_download = bucket.blob(name)

            with tempfile.TemporaryDirectory() as temp_dir:
                temp_file_path = os.path.join(temp_dir, name)
                blob_download.download_to_filename(temp_file_path)

                mime_type = 'application/pdf'
                return send_file(temp_file_path, as_attachment=True, mimetype=mime_type, download_name=name)
