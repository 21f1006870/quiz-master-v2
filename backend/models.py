from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    qualification = db.Column(db.String(80), nullable=True)
    is_admin = db.Column(db.Boolean, default=False) # is the admin
    is_user = db.Column(db.Boolean, default=False) # is the user a normal user

    #Relationships a score belongs to a user
    scores = db.relationship('Score', backref='user', lazy=True)

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)

    #Relationships a subject has many chapters
    chapters = db.relationship('Chapter', backref='subject', lazy=True)

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False) # a chapter belongs to a subject

    #Relationships a chapter has many quizzes
    quizzes = db.relationship('Quiz', backref='chapter', lazy=True)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)  # a quiz belongs to a chapter
    time_duration = db.Column(db.Integer, nullable=False)

    #Relationships a quiz has many questions
    questions = db.relationship('Question', backref='quiz', lazy=True) # a quiz has many questions
    scores = db.relationship('Score', backref='quiz', lazy=True) # a quiz has many scores

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(120), nullable=False)
    option1 = db.Column(db.String(120), nullable=False)
    option2 = db.Column(db.String(120), nullable=False)
    option3 = db.Column(db.String(120), nullable=False)
    option4 = db.Column(db.String(120), nullable=False)
    correct_option = db.Column(db.String(120), nullable=False) # correct option
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False) # a question belongs to a quiz

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # a score belongs to a user
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False) 
    date = db.Column(db.DateTime, nullable=False)

