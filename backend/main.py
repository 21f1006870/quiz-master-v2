from flask import Flask, render_template
from config import Config
import os
from models import db
from models import User
from flask_jwt_extended import JWTManager
from api import api
from werkzeug.security import generate_password_hash
from api import cache

app = Flask(__name__, template_folder=os.path.join(os.pardir, "frontend"),  static_folder=os.path.join(os.pardir, "frontend"))
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
api.init_app(app)
cache.init_app(app)
jwt = JWTManager(app)

#function to create an admin
def create_admin():
    with app.app_context():
        admin_user = User.query.filter_by(is_admin = True).first()
        if not admin_user:
            admin_user = User(username = "admin", name = "Admin", email = "admin@gmail.com", password = generate_password_hash('admin'), is_admin = True)
            db.session.add(admin_user)
            db.session.commit()
            print("admin user created successfully")

# Create database tables if they don't exist
with app.app_context():
    db.create_all()
    create_admin()

@app.route("/")
def index():
    return render_template("index.html")

# Catch all other routes and serve the index file
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

if __name__ == "__main__":
    app.run()