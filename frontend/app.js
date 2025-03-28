import Login from './components/login.js';
import Register from './components/register.js';
import AdminDashboard from './components/admin_dashboard.js';
import UserDashboard from './components/user_dashboard.js';
import AddSubject from './components/addsubject.js';
import UpdateSubject from './components/updatesubject.js';
import ChaptersPage from './components/chapterspage.js';
import AddChapter from './components/addchapter.js';
import UpdateChapter from './components/updatechapter.js'; 
import QuizPage from './components/quizpage.js';
import AddQuiz from './components/addquiz.js';
import UpdateQuiz from './components/updatequiz.js';
import QuestionPage from './components/questionpage.js';
import AddQuestion from './components/addquestion.js';
import UpdateQuestion from './components/updatequestion.js';
import QuizAttempt from './components/quizattempt.js';
import AttemptedQuizzes from './components/attemptedquiz.js';
import ReviewQuiz from './components/reviewquiz.js';
import AdminSearch from './components/adminsearch.js';
import Summary from './components/summary.js';

const routes = [
    { path: '/', component: Login },
    { path: '/register', component: Register },
    { path: '/admin/dashboard', component: AdminDashboard },
    { path: '/user/dashboard', component: UserDashboard },
    { path: '/subjects/add', component: AddSubject },
    { path: '/subjects/:id/edit', component: UpdateSubject },
    { path: '/subjects/:subjectId/chapters', component: ChaptersPage },
    { path: '/subjects/:subjectId/chapters/add', component: AddChapter },
    { path: '/subjects/:subjectId/chapters/:chapterId/edit', component: UpdateChapter },
    { path: '/chapters/:chapterId/quizzes', component: QuizPage },
    { path: '/chapters/:chapterId/quizzes/add', component: AddQuiz },
    { path: '/chapters/:chapterId/quizzes/:quizId/edit', component: UpdateQuiz },
    { path: '/quizzes/:quizId/questions', component: QuestionPage },
    { path: '/quizzes/:quizId/questions/add', component: AddQuestion },
    { path: '/quizzes/:quizId/questions/:questionId/edit', component: UpdateQuestion },
    { path: '/quiz/:quizId/attempt', component: QuizAttempt },
    { path: '/attempted/quizzes', component: AttemptedQuizzes },
    { path: '/quiz/:quizId/review', component: ReviewQuiz },
    { path: '/admin/search-results', component: AdminSearch },
    { path: '/admin/summary', component: Summary },
    { path: '/:catchAll(.*)', redirect: '/' },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

const app = Vue.createApp({});
app.use(router);
app.mount('#app');