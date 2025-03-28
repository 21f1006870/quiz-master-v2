const QuizPage = {
  template: `
    <div class="container py-4">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container-fluid">
          <router-link to="/admin/dashboard" class="navbar-brand">Admin Panel</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <router-link to="/admin/summary" class="nav-link">Summary</router-link>
              </li>
            </ul>
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </div>
        </div>
      </nav>

      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0">Quizzes</h1>
            <router-link :to="'/chapters/' + chapterId + '/quizzes/add'" class="btn btn-primary">+ New Quiz</router-link>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Time (mins)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="quizzes.length === 0">
                  <td colspan="4" class="text-center">No quizzes found.</td>
                </tr>
                <tr v-for="quiz in quizzes" :key="quiz.id">
                  <td>{{ quiz.name }}</td>
                  <td>{{ quiz.description }}</td>
                  <td>{{ quiz.time_duration }}</td>
                  <td>
                    <router-link :to="'/quizzes/' + quiz.id + '/questions'" class="btn btn-info btn-sm">View Questions</router-link>
                    <router-link :to="'/chapters/' + chapterId + '/quizzes/' + quiz.id + '/edit'" class="btn btn-warning btn-sm">Edit</router-link>
                    <button class="btn btn-danger btn-sm" @click="deleteQuiz(quiz.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      quizzes: [],
      subjectId: this.$route.params.subjectId,
      chapterId: this.$route.params.chapterId,
    };
  },
  methods: {
    async fetchQuizzes() {
      try {
        const response = await fetch(`/api/chapters/${this.chapterId}/quizzes`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        this.quizzes = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    async deleteQuiz(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await fetch(`/api/chapters/${this.chapterId}/quizzes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    },
    async logout() {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      this.$router.replace('/');
    }
  },
  mounted() { this.fetchQuizzes(); }
};

export default QuizPage;
