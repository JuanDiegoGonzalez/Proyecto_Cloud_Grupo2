from datetime import datetime
import os
import json
from flask_restful import Resource
from backend.models.models import Tarea, TareaSchema, Usuario, UsuarioSchema
from ..models import db
from ..auth import auth
from flask import request, send_file
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from ..file_processing.tasks import docx_a_pdf, pptx_a_pdf, xlsx_a_pdf, odt_a_pdf
usuario_schema = UsuarioSchema()
tarea_schema = TareaSchema()

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

        input_path = os.path.join("backend","files", "uploaded", str(nueva_tarea.id) + "_" + file.filename)
        output_path = os.path.join("backend","files", "processed", str(nueva_tarea.id) + "_" + ".".join(parts[:-1]) + ".pdf")
        file.save(input_path)

        match oldFormat:
            case "docx":
                docx_a_pdf(input_path, output_path, nueva_tarea.id)

            case "pptx":
                pptx_a_pdf(input_path, output_path, nueva_tarea.id)

            case "xlsx":
                xlsx_a_pdf(input_path, output_path, nueva_tarea.id)
            
            case "odt":
                odt_a_pdf(input_path, output_path, nueva_tarea.id)

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
            os.remove(os.path.join("files", "uploaded", str(id_task) + "_" + tarea.fileName))
            os.remove(os.path.join("files", "processed", str(id_task) + "_" + ".".join(parts[:-1]) + ".pdf"))
            db.session.delete(tarea)
            db.session.commit()
            return 'Operacion exitosa', 204
        return {'error': 'El archivo no se ha procesado...'}
    
class VistaArchivo(Resource):
    @jwt_required()
    def get(self, filename):
        parts = filename.split("_")
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        tarea = Tarea.query.filter(Tarea.fileName == "_".join(parts[1:])).first()

        if (tarea is None) or (usuario.id != tarea.id_usuario):
            return 'El archivo no existe', 404
        elif tarea.status == "UPLOADED":
            return {'error': 'Procesando archivo...'}
        else:
            parts = filename.split(".")
            return send_file(os.path.join("files", "processed", ".".join(parts[:-1]) + ".pdf"), as_attachment=True)