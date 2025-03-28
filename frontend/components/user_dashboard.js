const UserDashboard = {
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
                  <router-link to="/attempted/quizzes" class="nav-link">Attempted Quizzes</router-link>
                </li>
              </ul>
              <button class="btn btn-outline-danger" @click="logout">Logout</button>
            </div>
          </div>
        </nav>
  
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body">
            <h1 class="h4 mb-4 text-center text-primary">📚 Available Quizzes</h1>
            
            <div v-if="quizzes.length === 0" class="text-center text-muted">
              <p>No quizzes available at the moment.</p>
            </div>
  
            <div class="row">
              <div v-for="quiz in quizzes" :key="quiz.id" class="col-md-6">
                <div class="card mb-3 border-0 shadow-sm p-3 rounded">
                  <div class="card-body">
                    <h5 class="card-title text-dark fw-bold">{{ quiz.name }}</h5>
                    <p class="card-text text-muted">{{ quiz.description }}</p>
                    <p class="small text-secondary">
                      ⏳ Duration: <b>{{ quiz.time_duration }} mins</b> <br>
                      📖 Chapter: <b>{{ quiz.chapter_name }}</b> <br>
                      🏫 Subject: <b>{{ quiz.subject_name }}</b>
                    </p>
                    <router-link :to="'/quiz/' + quiz.id + '/attempt' \" class="btn btn-primary w-100">
                      🚀 Start Quiz
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
      return { quizzes: [] };
    },
  
    methods: {
      async fetchQuizzes() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.$router.replace('/');
            return;
          }
          const response = await fetch('/api/user/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          this.quizzes = Array.isArray(data) ? data : [];
        } catch (error) {
          console.error('Error fetching quizzes:', error);
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
  
    mounted() {
      this.fetchQuizzes();
    }
  };
  
  export default UserDashboard;
  