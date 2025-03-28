const QuestionPage = {
  template: `
    <div class="question-page container py-4">
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
            <h1 class="h4 mb-0">Questions</h1>
            <router-link :to="'/quizzes/' + quizId + '/questions/add'" class="btn btn-primary"> + New Question </router-link>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Question</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="questions.length === 0">
                  <td colspan="2" class="text-center">No questions found.</td>
                </tr>
                <tr v-for="question in questions" :key="question.id">
                  <td>{{ question.question }}</td> 
                  <td>
                    <router-link 
                      :to="'/quizzes/' + quizId + '/questions/' + question.id + '/edit'"
                      class="btn btn-warning btn-sm">
                      Edit
                    </router-link>
                    <button class="btn btn-danger btn-sm" @click="deleteQuestion(question.id)">Delete</button>
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
      questions: [],
      subjectId: null,
      chapterId: null,
      quizId: null
    };
  },

  methods: {
    async fetchQuestions() {
      console.log("Fetching questions for Quiz ID:", this.quizId);
      if (!this.quizId) {
        console.error("Quiz ID is undefined. Cannot fetch questions.");
        return;
      }

      try {
        const response = await fetch(`/api/quizzes/${this.quizId}/questions`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          this.questions = data; // Directly store the array
          console.log("Questions loaded:", this.questions);
        } else {
          console.error("Unexpected response format:", data);
          this.questions = [];
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },

    async deleteQuestion(id) {
      if (!confirm('Are you sure you want to delete this question?')) return;

      try {
        const response = await fetch(`/api/quizzes/${this.quizId}/questions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          this.fetchQuestions(); // Refresh questions after deletion
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete question.');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
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
    this.subjectId = this.$route.params.subjectId;
    this.chapterId = this.$route.params.chapterId;
    this.quizId = this.$route.params.quizId;

    console.log("Subject ID:", this.subjectId);
    console.log("Chapter ID:", this.chapterId);
    console.log("Quiz ID:", this.quizId);

    if (this.quizId) {
      this.fetchQuestions();
    } else {
      console.error("Quiz ID is undefined. Skipping API call.");
    }
  }
};

export default QuestionPage;
