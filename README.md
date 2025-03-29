Quiz Master - V2
It is a multi-user app (one requires an administrator and other users) that acts as an exam preparation site for multiple courses.

Key features include:

Role-based access for Admins and User.
Real-time updates for dashboards using Vue.js.
JWT-based authentication and authorization.
All CURD(Create,Update,Read,Delete) operations for subjects, chapters, quiz and questions where the admin can create, update, read and delete. 
Search functionality where admin can search based on subject, chapters and quiz.
Summary where admin can visualize statistics of application. 
Users can attempt time based quizzes.
Users can check their previously attempted quizzes and review them.
Implemented caching.

Technologies Used:

Flask : A lightweight backend framework for building web applications with Python. 
SQLAlchemy : ORM (Object-Relational Mapping) tool for database interactions. 
SQLite : Database management system for storing application data. 
Vue.js: A progressive JavaScript framework for building user interfaces and enhancing interactivity
Flask JWT Extended: An extension that provides tools for managing user sessions and authentication using JSON Web Tokens (JWT). 
Flask Restful: A Python library that simplifies the creation of RESTful APIs for web applications. 
Redis: An in-memory data structure store used as a caching database to optimize application performance. 
ChartJS: Used for creating charts on the admin dashboard.

Steps to run application:

1. Create Virtual Environment
python -m venv venv

2. Activate Virtual Environment
On Windows
venv\Scripts\activate

On macOS/Linux
source venv/bin/activate

3. Install Dependencies
pip install -r req.txt

4. Start the application
python main.py

5. Start Redis server
sudo service redis-server start
redis-server


