# 🧠 NeuroVision

A Deep Learning Web Application for Parkinson’s Detection via Eye Movement Analysis

## NeuroVision Interface
![NeuroVision Hero Section]("C:\Users\dorsa\Downloads\démo_web_app_V1.mp4")

# 🌟 Overview
NeuroVision is a Flask-based web application that uses a deep learning model to detect Parkinson’s disease from eye movement images. Built for neurologists and medical researchers, it provides:

⚡ Real-time AI predictions: Instantly classify images as Parkinson’s Detected or No Parkinson’s

🔐 User authentication: Secure login/signup using a SQLite database

🧭 Neurologist locator: Search and locate specialists via an interactive map

💻 Modern UI: Responsive single-page interface with a sleek glassmorphism design

🔬 Developed as part of a research project to bridge AI and clinical diagnosis.


# 🛠️ Tech Stack
| Component     | Technologies Used                                                  |
| ------------- | ------------------------------------------------------------------ |
| **Frontend**  | HTML5, CSS3 (Flexbox/Grid), JavaScript (Vanilla), Leaflet.js (Map) |
| **Backend**   | Python, Flask (REST API), SQLAlchemy (ORM)                         |
| **AI Model**  | TensorFlow (Convolutional Neural Network for classification)       |
| **Database**  | SQLite (Lightweight, serverless)                                   |
| **Dev Tools** | VS Code, Git                                                       |




# 🚀 Features
# 1. 🧑‍💻 User-Friendly Interface
Single-page layout for seamless experience

Drag-and-drop image uploads with preview

Animated modals for login and signup

# 2. 🤖 AI-Powered Detection
Upload eye movement images for instant predictions

CNN model trained on preprocessed data (resizing, normalization)

Displays prediction confidence and visual feedback

# 3. 🧭 Neurologist Finder
Interactive, searchable table of neurologists

Embedded Leaflet.js map with clickable location markers

# 4. 🔒 Secure & Scalable
Passwords hashed with Bcrypt

Session handling using localStorage

Modular Flask backend for future scalability

