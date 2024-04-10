from datetime import timedelta
from flask import Flask

def create_app(config_name):
    app = Flask(__name__)
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database_proyecto0.db'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@34.171.227.120:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'secret-key'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
    app.config['PROPAGATE_EXCEPTIONS'] = True
    return app
