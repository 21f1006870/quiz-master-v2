const AttemptedQuizzes = {
  template: `
    <div class="container py-4">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container-fluid">
          <router-link to="/user/dashboard" class="navbar-brand">User Dashboard</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <router-link to="/attempted/quizzes" class="nav-link active">Attempted Quizzes</router-link> 
              </li>
            </ul>
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </div>
        </div>
      </nav>

      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body">
          <h1 class="h4 mb-4 text-center text-primary">📜 Attempted Quizzes</h1>

          <div v-if="attemptedQuizzes.length === 0" class="text-center text-muted">
            <p>You haven't attempted any quizzes yet.</p>
          </div>

          <div class="row">
            <div v-for="quiz in attemptedQuizzes" :key="quiz.quiz_id" class="col-md-6">
              <div class="card mb-3 border-0 shadow-sm p-3 rounded">
                <div class="card-body">
                  <h5 class="card-title text-dark fw-bold">{{ quiz.quiz_name }}</h5>
                  <p class="small text-secondary">
                    📖 Chapter: <b>{{ quiz.chapter_name }}</b> <br>
                    📚 Subject: <b>{{ quiz.subject_name }}</b> <br>
                    ✅ Score: <b>{{ quiz.score }}</b> <br>
                    📅 Attempt Date: <b>{{ quiz.attempt_date}}</b>
                  </p>
                  <router-link :to="'/quiz/' + quiz.quiz_id + '/review'" class="btn btn-info w-100">
                    📖 Review Quiz
                  </router-link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,

  data() {
    return { attemptedQuizzes: [] };
  },

  methods: {
    async fetchAttemptedQuizzes() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.replace('/');
          return;
        }
        const response = await fetch('/api/attempted/quizzes', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        this.attemptedQuizzes = data.attempted_quizzes || [];
      } catch (error) {
        console.error('Error fetching attempted quizzes:', error);
      }
    },

    async logout() {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      this.$router.replace('/');
    }
  },

  mounted() {
    this.fetchAttemptedQuizzes();
  }
};

export default AttemptedQuizzes;
