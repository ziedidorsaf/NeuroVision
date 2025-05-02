from app import create_app, db
from app.models import User, Doctor  


# Create the Flask app
app = create_app()


# Initialize the database within the app context
with app.app_context():
    # Drop all tables 
    # db.drop_all()


    # Create all database tables
    db.create_all()
    print("Database and tables created!")


