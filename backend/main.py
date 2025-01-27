from flask import Flask, render_template
from config import Config
import os

def createApp():
    app = Flask(__name__, template_folder=os.path.join(os.pardir, "frontend"),  static_folder=os.path.join(os.pardir, "frontend"))
    app.config.from_object(Config)
    return app

app = createApp()

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()