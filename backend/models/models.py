import enum
from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields

db = SQLAlchemy()

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64))
    password = db.Column(db.String(64))
    email = db.Column(db.String(64), unique=True)
    tareas = db.relationship('Tarea', cascade='all, delete, delete-orphan')

class Estado(enum.Enum):
    UPLOADED = 1
    PROCESSED = 2

class Tarea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fileName = db.Column(db.String(256))
    oldFormat = db.Column(db.String(64))
    newFormat = db.Column(db.String(64))
    timeStamp = db.Column(db.Date)
    status = db.Column(db.Enum(Estado))
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    
class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True

class EnumADiccionario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return {'llave':value.name, 'valor':value.value}

class TareaSchema(SQLAlchemyAutoSchema):
    status = EnumADiccionario(attribute=('status'))
    id_usuario = fields.Int()
    class Meta:
        model = Tarea
        include_relationships = True
        load_instance = True