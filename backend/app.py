from backend import create_app
from backend.views.views import VistaLogIn, VistaSignUp, VistaTareasUsuario
from .models import db
from flask_restful import Api
from .views import VistaTareas, VistaTarea
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = create_app('default')
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()

cors = CORS(app)

api = Api(app)
api.add_resource(VistaSignUp, '/api/auth/signup/')
api.add_resource(VistaLogIn, 'api/auth/login/')
api.add_resource(VistaTareasUsuario, '/api/tasks/')
api.add_resource(VistaTareas, 'api/tasks/')
api.add_resource(VistaTarea, 'api/tasks/<int:id_task>/')

jwt = JWTManager(app)