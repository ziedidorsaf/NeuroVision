import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1" 

from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import User
import bcrypt
import re
import tensorflow as tf
import numpy as np
from PIL import Image
from werkzeug.utils import secure_filename

bp = Blueprint('routes', __name__)


def is_password_valid(password):
    return len(password) >= 10 and re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)


@bp.route('/')
def home():
    return render_template('base.html')


@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not email or not password or not confirm_password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400
    if password != confirm_password:
        return jsonify({"error": "Les mots de passe ne correspondent pas"}), 400
    if not is_password_valid(password):
        return jsonify({"error": "Le mot de passe doit avoir au moins 10 caractères et contenir des caractères spéciaux"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Le nom d'utilisateur existe déjà"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "L'email existe déjà"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(username=username, email=email, password=hashed_password.decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Utilisateur créé avec succès"}), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Email ou mot de passe invalide"}), 401

    return jsonify({
        "message": "Connexion réussie",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "status": user.status,
            "image": user.image
        }
    }), 200


MODEL_PATH = "app/best_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

class_labels = ["Parkinson Detected","No Parkinson"]

def process_image(filepath):
    img = Image.open(filepath).convert("RGB")
    img = img.resize((200, 200))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_class(img_array):
    prediction = model.predict(img_array)
    prob_parkinson = float(prediction[0][0])
    prob_no_parkinson = 1.0 - prob_parkinson
    predicted_class = class_labels[int(prob_parkinson >= 0.5)]
    return predicted_class, prob_parkinson, prob_no_parkinson

@bp.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "Aucun fichier envoyé"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "error": "Aucun fichier sélectionné"}), 400

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    filename = secure_filename(file.filename)
    filepath = os.path.join('uploads', filename)
    file.save(filepath)

    try:
        img_array = process_image(filepath)
        predicted_class, prob_parkinson, prob_no_parkinson = predict_class(img_array)
    except Exception as e:
        return jsonify({"success": False, "error": f"Erreur lors du traitement de l'image: {str(e)}"}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

    return jsonify({
        "success": True,
        "prediction": predicted_class,
        "probabilities": {
            "No Parkinson": round(prob_no_parkinson, 4),
            "Parkinson Detected": round(prob_parkinson, 4)
        }
    })

@bp.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files and 'image' not in request.files:
        return jsonify({"error": "Aucun fichier envoyé"}), 400

    file = request.files.get('file') or request.files.get('image')
    if file.filename == '':
        return jsonify({"error": "Aucun fichier sélectionné"}), 400

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    filepath = os.path.join('uploads', secure_filename(file.filename))
    file.save(filepath)

    try:
        img_array = process_image(filepath)
        predicted_class, prob_parkinson, prob_no_parkinson = predict_class(img_array)
    except Exception as e:
        return jsonify({"error": f"Erreur lors du traitement de l'image: {str(e)}"}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

    return jsonify({
        "prediction": predicted_class,
        "probabilities": {
            "No Parkinson": round(prob_no_parkinson, 4),
            "Parkinson Detected": round(prob_parkinson, 4)
        }
    })
