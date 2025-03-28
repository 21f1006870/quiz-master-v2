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

    #Relationships a score belongs to a user
    scores = db.relationship('Score', backref='user', lazy=True)

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)

    #Relationships a subject has many chapters
    chapters = db.relationship('Chapter', backref='subject', lazy=True, cascade="all,delete-orphan")

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(120), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False) # a chapter belongs to a subject

    #Relationships a chapter has many quizzes
    quizzes = db.relationship('Quiz', backref='chapter', lazy=True, cascade="all,delete-orphan")

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(120), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)  # a quiz belongs to a chapter
    time_duration = db.Column(db.Integer, nullable=False)

    #Relationships a quiz has many questions
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade="all,delete-orphan" ) # a quiz has many questions
    scores = db.relationship('Score', backref='quiz', lazy=True) # a quiz has many scores

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(120), unique=True, nullable=False)
    option1 = db.Column(db.String(120), nullable=False)
    option2 = db.Column(db.String(120), nullable=False)
    option3 = db.Column(db.String(120), nullable=False)
    option4 = db.Column(db.String(120), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False) # correct option number
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False) # a question belongs to a quiz

class UserAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    selected_option = db.Column(db.Integer, nullable=True)  # Stores option number (1,2,3,4)

    user = db.relationship("User", backref="user_answers")
    quiz = db.relationship("Quiz", backref="user_answers")
    question = db.relationship("Question", backref="user_answers")

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # a score belongs to a user
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False) 
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow) # date of the score

