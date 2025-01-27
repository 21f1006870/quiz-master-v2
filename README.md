Quiz Master - V2
It is a multi-user app (one requires an administrator and other users) that acts as an exam preparation site for multiple courses.


Frameworks used

SQLite for data storage
Flask for API
VueJS for UI
VueJS Advanced with CLI (only if required, not necessary)
Jinja2 templates if using CDN only for entry point (Not to be used for UI)
Bootstrap for HTML generation and styling (No other CSS framework is allowed)
SQLite for database (No other database is permitted)
Redis for caching
Redis and Celery for batch jobs


The platform will have two roles:

Admin - root access - It is the superuser of the app and requires no registratio

User - Can attempt any quiz of its choice


Core Functionalities
Admin login and User login

A login/register form with fields like username, password etc. for user and admin login
The application should have only one admin identified by its role
You can either use Flask security (session or token) or JWT based Token based authentication to implement role-based access control
The app must have a suitable model to store and differentiate all types of users
Admin Dashboard - for the Admin

The admin should be added, whenever a new database is created
The admin creates/edits/deletes a subject
The admin creates/edits/deletes a chapter under the subject
The admin will create a new quiz under a chapter
Each quiz contains a set of questions  (MCQ - only one option correct)
The admin can search the users/subjects/quizzes
Shows the summary charts

Quiz management - for the Admin

Edit/delete a quiz
The admin specifies the date and duration(HH: MM) of the quiz
The admin creates/edits/deletes the SOC questions inside the specific quiz

User dashboard - for the User

The user can attempt any quiz of his/her interest
Every quiz has a timer
Each quiz score is recorded
The earlier quiz attempts are shown

