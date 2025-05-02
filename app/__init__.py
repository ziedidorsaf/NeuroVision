import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1" 


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import tensorflow as tf


db = SQLAlchemy()
cors = CORS()


def create_app():

    app = Flask(__name__)

   
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///parkinson.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

    db.init_app(app)
    cors.init_app(app, supports_credentials=True)  # Enable CORS with credentials support

    from app import routes
    app.register_blueprint(routes.bp)

    return app


app = create_app() 



















