class Config:
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True 
    SECRET_KEY = "NEED_TO_BE_KEPT_SECRET"
    SQLALCHEMY_DATABASE_URI = "sqlite:///quizmaster-v2.sqlite3"
