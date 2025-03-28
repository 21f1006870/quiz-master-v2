from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from datetime import datetime,timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import or_
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask import jsonify, request
from models import db, User, Subject as SubjectModel, Chapter, Quiz, Question, UserAnswer, Score
from flask_caching import Cache

api=Api()
cache = Cache()

# user registration/login parser
user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=True, help='Username is required')
user_parser.add_argument('name', type=str, required=True, help='Name is required')
user_parser.add_argument('email', type=str, required=True, help='Email is required')
user_parser.add_argument('password', type=str, required=True, help='Password is required')
user_parser.add_argument('qualification', type=str, required=False)

login_parser = reqparse.RequestParser()
login_parser.add_argument('username', type=str, required=True, help='Username is required')
login_parser.add_argument('password', type=str, required=True, help='Password is required')

# subject parser
subject_parser = reqparse.RequestParser()
subject_parser.add_argument('name', type=str, required=True, help='Subject Name is required')
subject_parser.add_argument('description', type=str, required=True, help='Description is required')

# chapter parser
chapter_parser = reqparse.RequestParser()   
chapter_parser.add_argument('name', type=str, required=True, help='Chapter Name is required')
chapter_parser.add_argument('description', type=str, required=True, help='Description is required')

# quiz parser
quiz_parser = reqparse.RequestParser()
quiz_parser.add_argument('name', type=str, required=True, help='Quiz Name is required')
quiz_parser.add_argument('description', type=str, required=True, help='Description is required')
quiz_parser.add_argument('time_duration', type=int, required=True, help='Time Duration is required')

# question parser
question_parser = reqparse.RequestParser()
question_parser.add_argument('question', type=str, required=True, help='Question is required')
question_parser.add_argument('option1', type=str, required=True, help='Option1 is required')
question_parser.add_argument('option2', type=str, required=True, help='Option2 is required')
question_parser.add_argument('option3', type=str, required=True, help='Option3 is required')
question_parser.add_argument('option4', type=str, required=True, help='Option4 is required')
question_parser.add_argument('correct_option', type=int, required=True, help='Correct Option is required')

#--------------------User Registration------------------------

class UserRegistration(Resource):
    def post(self):
        args = user_parser.parse_args()
        username = args['username']
        name = args['name']
        email = args['email']
        password = generate_password_hash(args['password'])
        qualification = args['qualification']

        if User.query.filter_by(username=username).first():
            return {"message": "Username already exists"}, 400

        if User.query.filter_by(email=email).first():
            return {"message": "Email already registered"}, 400

        new_user = User(username=username, password=password, name=name, email=email, qualification=qualification)
        
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User registered successfully"}, 201

#--------------------User Login/Logout------------------------

class UserLogin(Resource):
    def post(self):
        args = login_parser.parse_args()
        username = args['username']
        password = args['password']

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return {"message": "Invalid username or password"}, 401

        access_token = create_access_token(identity={"id": user.id, "role": "admin" if user.is_admin else "user"}, expires_delta=timedelta(hours=1))
        return {"message": "Login successful", 
                "access_token": access_token, 
                "role": "admin" if user.is_admin else "user"}, 200

class UserLogout(Resource):
    @jwt_required()
    def post(self):
        return {"message": "Logout successful"}, 200
    
#--------------------Admin Dashboard------------------------

class AdminDashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Only admin can access"}, 403
        return {"message": "Welcome to admin dashboard"}, 200
    
#--------------------User Dashboard------------------------

class UserDashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or user.is_admin:
            return {"message": "Unauthorized access"}, 401
        
        quizzes = Quiz.query.all()
        quiz_list = []

        for quiz in quizzes:
            chapter = Chapter.query.get(quiz.chapter_id)
            subject = SubjectModel.query.get(chapter.subject_id) if chapter else None
            
            quiz_list.append({
                "id": quiz.id,
                "name": quiz.name,
                "description": quiz.description,
                "time_duration": quiz.time_duration,
                "chapter_name": chapter.name if chapter else "Chapter",
                "subject_name": subject.name if subject else "Subject"
            })

        return quiz_list, 200

#--------------------Subject List(GET & POST)------------------------

class SubjectList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401
        subjects = SubjectModel.query.all()
        return([{
            "id": s.id, 
            "name": s.name, 
            "description": s.description
            } for s in subjects])

    @jwt_required()
    def post(self):
        args = subject_parser.parse_args()
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        new_subject = SubjectModel(
            name=args['name'],
            description=args['description']
            )
        db.session.add(new_subject)
        db.session.commit()
        return {"message": "Subject added successfully"}, 201

#--------------------Subject Detail(EDIT & DELETE)------------------------

class SubjectDetail(Resource):
    @jwt_required()
    def put(self, subject_id):
        args = subject_parser.parse_args()
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        subject = SubjectModel.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404

        subject.name = args['name']
        subject.description = args['description']
        db.session.commit()
        return {"message": "Subject updated successfully"}, 200

    @jwt_required()
    def delete(self, subject_id):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        subject = SubjectModel.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404

        db.session.delete(subject)
        db.session.commit()
        return {"message": "Subject deleted successfully"}, 200
    
#--------------------Chapter List(GET & POST)------------------------

class ChapterList(Resource):
    @jwt_required()
    def get(self, subject_id):
        chapters = Chapter.query.filter_by(subject_id=subject_id).all()
        return [{
            "id": c.id,
            "name": c.name,
            "description": c.description
        } for c in chapters], 200

    @jwt_required()
    def post(self, subject_id):  # Accept subject_id from URL
        args = chapter_parser.parse_args()
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        # Validate that the subject exists
        subject = SubjectModel.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404

        new_chapter = Chapter(
            name=args['name'],
            description=args['description'],
            subject_id=subject_id  # Use subject_id from URL, not from request body
        )
        db.session.add(new_chapter)
        db.session.commit()
        return {"message": "Chapter added successfully"}, 201
    
#--------------------Chapter Detail(EDIT & DELETE)------------------------

class ChapterDetail(Resource):
    @jwt_required()
    def put(self, subject_id, chapter_id):  # Accept subject_id
        args = chapter_parser.parse_args()
        chapter = Chapter.query.filter_by(id=chapter_id, subject_id=subject_id).first()  # Ensure chapter belongs to subject
        
        if not chapter:
            return {"message": "Chapter not found"}, 404

        chapter.name = args['name']
        chapter.description = args['description']
        db.session.commit()
        return {"message": "Chapter updated successfully"}, 200

    @jwt_required()
    def delete(self, subject_id, chapter_id):  # Accept subject_id
        chapter = Chapter.query.filter_by(id=chapter_id, subject_id=subject_id).first()  # Ensure chapter belongs to subject

        if not chapter:
            return {"message": "Chapter not found"}, 404

        db.session.delete(chapter)
        db.session.commit()
        return {"message": "Chapter deleted successfully"}, 200
    
#--------------------Quiz List(GET & POST)------------------------

class QuizList(Resource):
    @jwt_required()
    def get(self, chapter_id): 
        """Get all questions for a quiz"""
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {"message": "Chapter not found"}, 404    
               
        quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()
        return [{
            "id": q.id,
            "name": q.name,
            "description": q.description,
            "time_duration": q.time_duration
        } for q in quizzes], 200

    @jwt_required()
    def post(self, chapter_id):  
        """Add a new question (Admin only)"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {"message": "Chapter not found"}, 404

        args = quiz_parser.parse_args()
        new_quiz = Quiz(
            name=args['name'],
            description=args['description'],
            chapter_id=chapter_id,
            time_duration=args['time_duration']
        )
        db.session.add(new_quiz)
        db.session.commit()
        return {"message": "Quiz added successfully"}, 201
    
#--------------------Quiz Detail(EDIT & DELETE)------------------------

class QuizDetail(Resource):
    @jwt_required()
    def put(self, chapter_id, quiz_id):  
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        quiz = Quiz.query.filter_by(id=quiz_id, chapter_id=chapter_id).first()
        if not quiz:
            return {"message": "Quiz not found"}, 404

        args = quiz_parser.parse_args()
        quiz.name = args['name']
        quiz.description = args['description']
        quiz.time_duration = args['time_duration']
        db.session.commit()
        return {"message": "Quiz updated successfully"}, 200

    @jwt_required()
    def delete(self, chapter_id, quiz_id):  
        """Delete a quiz (Admin only)"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        quiz = Quiz.query.filter_by(id=quiz_id, chapter_id=chapter_id).first()
        if not quiz:
            return {"message": "Quiz not found"}, 404

        db.session.delete(quiz)
        db.session.commit()
        return {"message": "Quiz deleted successfully"}, 200
    
#--------------------Question List(GET & POST)------------------------

class QuestionList(Resource):
    @jwt_required()
    def get(self, quiz_id):
        """Get all questions for a quiz"""
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404

        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        return [{
            "id": q.id,
            "question": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4],
            "correct_option": q.correct_option
        } for q in questions], 200

    @jwt_required()
    def post(self, quiz_id):
        """Add a new question (Admin only)"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404

        args = question_parser.parse_args()
        new_question = Question(
            question=args['question'],
            option1=args['option1'],
            option2=args['option2'],
            option3=args['option3'],
            option4=args['option4'],
            correct_option=args['correct_option'],
            quiz_id=quiz_id
        )
        db.session.add(new_question)
        db.session.commit()
        return {"message": "Question added successfully"}, 201

#--------------------Question Detail(EDIT & DELETE)------------------------

class QuestionDetail(Resource):
    @jwt_required()
    def put(self, quiz_id, question_id):
        """Update a question (Admin only)"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        question = Question.query.filter_by(id=question_id, quiz_id=quiz_id).first()
        if not question:
            return {"message": "Question not found"}, 404

        args = question_parser.parse_args()
        question.question = args['question']
        question.option1 = args['option1']
        question.option2 = args['option2']
        question.option3 = args['option3']
        question.option4 = args['option4']
        question.correct_option = args['correct_option']

        db.session.commit()
        return {"message": "Question updated successfully"}, 200

    @jwt_required()
    def delete(self, quiz_id, question_id):
        """Delete a question (Admin only)"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401

        question = Question.query.filter_by(id=question_id, quiz_id=quiz_id).first()
        if not question:
            return {"message": "Question not found"}, 404

        db.session.delete(question)
        db.session.commit()
        return {"message": "Question deleted successfully"}, 200
    
#--------------------Quiz API(get all available quiz)-----------------------
    
class QuizApi(Resource):
    @jwt_required()
    def get(self, quiz_id):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or user.is_admin:
            return {"message": "Unauthorized access"}, 401
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404
        return {
            "id": quiz.id,
            "name": quiz.name,
            "description": quiz.description,
            "time_duration": quiz.time_duration
        }
    
#--------------------Question API(get all questions for a quiz)-----------------------

class QuestionApi(Resource):
    @jwt_required()
    def get(self, quiz_id):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or user.is_admin:
            return {"message": "Unauthorized access"}, 401
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        return [{
            "id": q.id,
            "question": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4],
        } for q in questions], 200
    
#--------------------Submit Quiz------------------------

class SubmitQuiz(Resource):
    @jwt_required()
    def post(self, quiz_id):
        """Submit a quiz, store user answers, and calculate the score"""
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)

        if not user or user.is_admin:
            return {"message": "Unauthorized access"}, 401

        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404

        data = request.get_json()
        answers = data.get("answer", {})  # Dictionary of question_id: selected_option

        # Calculate score and store answers
        total_questions = len(answers)
        correct_answers = 0

        for q_id, selected_option in answers.items():
            question = Question.query.get(q_id)
            if question:
                # Check correctness
                if question.correct_option == selected_option:
                    correct_answers += 1
                
                # Store user answer in UserAnswer table
                user_answer = UserAnswer(
                    user_id=user_id,
                    quiz_id=quiz_id,
                    question_id=q_id,
                    selected_option=selected_option
                )
                db.session.add(user_answer)

        # Store percentage score in Score table
        score_value = round((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        new_score = Score(user_id=user_id, quiz_id=quiz_id, score=score_value)
        db.session.add(new_score)

        db.session.commit()  # Commit both user answers and score

        return {
            "message": "Quiz submitted successfully",
            "correct_answers": correct_answers,
            "total_questions": total_questions
        }, 201
    
#--------------------Attempted Quiz------------------------

class AttemptedQuiz(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or user.is_admin:
            return {"message": "Unauthorized access"}, 401
        scores = Score.query.filter_by(user_id=user_id).all()
        attempted_quizzes = [
            {
                "quiz_id": score.quiz_id,
                "quiz_name":score.quiz.name,
                "chapter_name": score.quiz.chapter.name,
                "subject_name": score.quiz.chapter.subject.name,
                "score": score.score,
                "total_questions": len(score.quiz.questions),
                "attempt_date": score.date.strftime("%d-%m-%Y %H:%M:%S")
            }
            for score in scores
        ]
        return { "attempted_quizzes" : attempted_quizzes }, 200
    
#--------------------Review Quiz------------------------
    
class ReviewQuiz(Resource):
    @jwt_required()
    def get(self, quiz_id):
        user_id = get_jwt_identity().get("id")
        score = Score.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()

        if not score:
            return {"message": "Quiz attempt not found"}, 404

        quiz = score.quiz
        attempted_questions = []

        for q in quiz.questions:
            user_answer = UserAnswer.query.filter_by(user_id=user_id, question_id=q.id).first()
            attempted_questions.append({
                "question_id": q.id,
                "question": q.question,
                "options": [q.option1, q.option2, q.option3, q.option4],
                "user_answer": user_answer.selected_option if user_answer else None,
                "correct_answer": q.correct_option
            })

        return {
            "quiz_name": quiz.name,
            "chapter_name": quiz.chapter.name,
            "subject_name": quiz.chapter.subject.name,
            "score": score.score,
            "total_questions": len(quiz.questions),
            "attempted_questions": attempted_questions
        }, 200
    
#--------------------Search API------------------------

class SearchAPI(Resource):
    @jwt_required()
    def get(self):
        """Search subjects,chapters and quizzes"""
        query = request.args.get("query")

        if not query:
            return {"message": "Query parameter is required"}, 400

        subjects = SubjectModel.query.filter(or_(SubjectModel.name.ilike(f"%{query}%"),SubjectModel.description.ilike(f"%{query}%"))).all()
        chapters = Chapter.query.filter(or_(Chapter.name.ilike(f"%{query}%"),Chapter.description.ilike(f"%{query}%"))).all()
        quizzes = Quiz.query.filter(or_(Quiz.name.ilike(f"%{query}%"),Quiz.description.ilike(f"%{query}%"))).all()
        results = {
            "subjects" : [{"id": s.id, "name": s.name, "description": s.description} for s in subjects],
            "chapters" : [{"id": c.id, "name": c.name, "description": c.description} for c in chapters],
            "quizzes" : [{"id": q.id, "name": q.name, "description": q.description} for q in quizzes]
        }
        return results, 200
    
#--------------------Summary------------------------
    
class Summary(Resource):
    "@cache.cached(timeout=20)" # Cache for 20 seconds
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity().get("id")
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return {"message": "Unauthorized access"}, 401
        
        # Total Counts
        total_users = User.query.count()
        total_subjects = SubjectModel.query.count()
        total_chapters = Chapter.query.count()
        total_quizzes = Quiz.query.count()
        total_questions = Question.query.count()

        # Daily Quiz Attempts (Last 7 days)
        scores = Score.query.all()
        daily_attempts_data = {}
        for score in scores:
            day = score.date.day
            daily_attempts_data[day] = daily_attempts_data.get(day, 0) + 1

        # Quiz Distribution by Subject
        quiz_distribution_data = {}
        subjects = SubjectModel.query.all()
        for subject in subjects:
            quiz_count = Quiz.query.filter_by(id=subject.id).count()
            quiz_distribution_data[subject.name] = quiz_count

        # Average Quiz Score
        all_scores = [score.score for score in Score.query.all()]
        avg_quiz_score = round(sum(all_scores) / len(all_scores), 2) if all_scores else 0

        summary = {
            "total_users": total_users,
            "total_subjects": total_subjects,
            "total_chapters": total_chapters,
            "total_quizzes": total_quizzes,
            "total_questions": total_questions,
            "daily_attempts": daily_attempts_data,
            "quiz_distribution": quiz_distribution_data,
            "average_quiz_score": avg_quiz_score
        }
        return summary, 200

#--------------------API Endpoints------------------------

api.add_resource(UserRegistration, "/api/register") # post(create)
api.add_resource(UserLogin, "/api/login") # post(login)   
api.add_resource(UserLogout, "/api/logout") # post(logout)
api.add_resource(SubjectList, "/api/subjects") # get(all subjects), post(add subject)
api.add_resource(SubjectDetail, "/api/subjects/<int:subject_id>") # get(subject by id), put(update subject), delete(delete subject)
api.add_resource(ChapterList, "/api/subjects/<int:subject_id>/chapters") # get(all chapters), post(add chapter)
api.add_resource(ChapterDetail, "/api/subjects/<int:subject_id>/chapters/<int:chapter_id>") # put(update chapter), delete(delete chapter)
api.add_resource(QuizList, "/api/chapters/<int:chapter_id>/quizzes") # get(all quizzes), post(add quiz)
api.add_resource(QuizDetail, "/api/chapters/<int:chapter_id>/quizzes/<int:quiz_id>") # put(update quiz), delete(delete quiz)
api.add_resource(QuestionList, "/api/quizzes/<int:quiz_id>/questions") # get(all questions), post(add question)
api.add_resource(QuestionDetail, "/api/quizzes/<int:quiz_id>/questions/<int:question_id>") # put(update question), delete(delete question)
api.add_resource(AdminDashboard, "/api/admin/dashboard") # get(admin dashboard)
api.add_resource(UserDashboard, "/api/user/dashboard") # get(user dashboard)
api.add_resource(QuizApi, "/api/quiz/<int:quiz_id>") # get(all quizzes)
api.add_resource(QuestionApi, "/api/quiz/<int:quiz_id>/questions") # get(all questions)
api.add_resource(SubmitQuiz, "/api/quiz/<int:quiz_id>/submit") # post(submit quiz)
api.add_resource(AttemptedQuiz, "/api/attempted/quizzes") # get(attempted quizzes)
api.add_resource(ReviewQuiz, "/api/quiz/<int:quiz_id>/review") # get(review quiz)
api.add_resource(SearchAPI, "/api/search") # get(search)
api.add_resource(Summary, "/api/summary") # get(summary)