const ReviewQuiz = {
    template: `
      <div class="container py-4">
        <h1 class="h4 mb-4 text-center text-primary">📖 Review Quiz - {{ quiz.quiz_name }}</h1>
  
        <div v-if="quiz.attempted_questions.length === 0" class="text-center text-muted">
          <p>No questions found for this quiz.</p>
        </div>

        <div class="card mb-3 p-3 shadow-sm" v-for="question in quiz.attempted_questions" :key="question.question_id">
          <h5 class="fw-bold">{{ question.question }}</h5>
          <ul class="list-group mt-2">
            <li v-for="(option, index) in question.options" :key="index"
                :class="{
                  'list-group-item': true,
                  'bg-success text-white': index + 1 === question.correct_answer && index + 1 === question.user_answer, // Correct and selected
                  'bg-danger text-white': index + 1 === question.user_answer && index + 1 !== question.correct_answer // Wrong answer
                }">
              {{ option }}
            </li>
          </ul>
          <p class="mt-2 text-success fw-bold">✅ Correct Answer: {{ question.options[question.correct_answer - 1] }}</p>
        </div>
  
        <router-link to="/user/dashboard" class="btn btn-secondary mt-3">🔙 Back to Dashboard</router-link>
      </div>
    `,

    data() {
      return {
        quiz: {
          quiz_name: "",
          attempted_questions: []
        }
      };
    },

    methods: {
      async fetchQuizReview() {
        try {
          const quizId = this.$route.params.quizId;
          const response = await fetch(`/api/quiz/${quizId}/review`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          this.quiz = data;
        } catch (error) {
          console.error("Error fetching quiz review:", error);
        }
      }
    },

    mounted() {
      this.fetchQuizReview();
    }
};

export default ReviewQuiz;
