from datetime import datetime
from flask_restful import Resource
from backend.models.models import Tarea, TareaSchema, Usuario, UsuarioSchema
from ..models import db
from flask import request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

usuario_schema = UsuarioSchema()
tarea_schema = TareaSchema()

class VistaSignUp(Resource):
    def post(self):
        yaExisteElUsuario = Usuario.query.filter(Usuario.email == request.json["email"]).first()
        if yaExisteElUsuario:
            return {'error': 'Ya existe el usuario'}
        else:
            nuevo_usuario = Usuario(username=request.json['username'],
                                    password=request.json['password'],
                                    email=request.json['email'])
            token_de_acceso = create_access_token(identity=request.json['email'])
            db.session.add(nuevo_usuario)
            db.session.commit()
            return {'mensaje': 'Usuario creado exitosamente',
                    'token_de_acceso': token_de_acceso,
                    'usuario': usuario_schema.dump(nuevo_usuario)}

class VistaLogIn(Resource):
    def post(self):
        usuario = Usuario.query.filter(Usuario.username == request.json["username"], Usuario.password == request.json["password"]).first()
        db.session.commit()
        if usuario is None:
            return {"error":"El usuario no existe"}
        else:
            token_de_acceso = create_access_token(identity = usuario.email)
            return {"mensaje":"Acceso concedido",
                    "token_de_acceso": token_de_acceso,
                    "usuario": usuario_schema.dump(usuario)}
    
class VistaTareas(Resource):
    @jwt_required()
    def post(self):
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        nueva_tarea = Tarea(fileName=request.json['fileName'],
                            newFormat=request.json['newFormat'],
                            timeStamp=datetime.strptime(request.json['timeStamp'].split("T")[0], "%Y-%m-%d").date(),
                            status=request.json['status'],
                            id_usuario=usuario.id)
        db.session.add(nueva_tarea)
        usuario.tareas.append(nueva_tarea)
        db.session.commit()
        return tarea_schema.dump(nueva_tarea)

class VistaTareasUsuario(Resource):
    @jwt_required()
    def get(self):
        usuario = Usuario.query.filter(Usuario.email == get_jwt_identity()).first()
        return [tarea_schema.dump(tarea) for tarea in Tarea.query.filter(Tarea.id_usuario == usuario.id)]

class VistaTarea(Resource):
    @jwt_required()
    def get(self, id_tarea):
        return tarea_schema.dump(Tarea.query.get_or_404(id_tarea))

    @jwt_required()
    def delete(self, id_tarea):
        tarea = Tarea.query.get_or_404(id_tarea)
        db.session.delete(tarea)
        db.session.commit()
        return 'Operacion exitosa', 204