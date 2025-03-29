from datetime import timedelta

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "NEED_TO_BE_KEPT_SECRET"
    SQLALCHEMY_DATABASE_URI = "sqlite:///quizmaster-v2.sqlite3"
    JWT_ACCESS_TOKEN_EXPIRES= timedelta(hours=2)
    JWT_SECRET_KEY = "NEED_TO_BE_KEPT_SECRET"  
    DEBUG = True 

    # Cache settings
    CACHE_REDIS_HOST = "localhost"
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 300
    CACHE_REDIS_PORT = 6379
