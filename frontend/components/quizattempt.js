const QuizAttempt = {
  template: `
    <div class="container py-4">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body">
          <h1 class="h4 mb-4 text-center text-primary">📝 {{ quiz.name }}</h1>
          <p class="text-muted text-center">{{ quiz.description }}</p>
          
          <div v-if="timer > 0" class="text-center text-danger mb-3">
            ⏳ Time Left: <b>{{ timer }} seconds</b>
          </div>

          <div v-if="questions.length === 0" class="text-center text-muted">
            <p>No questions available for this quiz.</p>
          </div>

          <form @submit.prevent="submitQuiz">
            <div v-for="(question, index) in questions" :key="question.id" class="mb-3">
              <h5 class="fw-bold">{{ index + 1 }}. {{ question.question }}</h5>
              <div class="form-check" v-for="(option, optIndex) in question.options" :key="optIndex">
                <input 
                  type="radio" 
                  class="form-check-input"
                  :name="'question_' + question.id" 
                  :value="optIndex + 1" 
                  v-model="answers[question.id]"
                >
                <label class="form-check-label">{{ option }}</label>
              </div>
            </div>
            <button type="submit" class="btn btn-success w-100 mt-3">🚀 Submit Quiz</button>
          </form>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      quiz: {},
      questions: [],
      answers: {},
      timer: 0,
      interval: null
    };
  },

  methods: {
    async fetchQuizDetails() {
      try {
        const quizId = this.$route.params.quizId;
        
        if (!quizId) {
          console.error("Quiz ID is undefined!");
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          console.error(" No auth token found!");
          return;
        }

        // Fetch Quiz Details
        console.log(`Fetching quiz details for Quiz ID: ${quizId}`);
        const quizResponse = await fetch(`/api/quiz/${quizId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!quizResponse.ok) {
          throw new Error(` Quiz fetch failed: ${quizResponse.status}`);
        }
        this.quiz = await quizResponse.json();
        console.log(" Quiz Details:", this.quiz);

        // Fetch Quiz Questions
        console.log(`Fetching questions for Quiz ID: ${quizId}`);
        const questionResponse = await fetch(`/api/quiz/${quizId}/questions`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!questionResponse.ok) {
          throw new Error(` Questions fetch failed: ${questionResponse.status}`);
        }

        this.questions = await questionResponse.json();
        console.log(" Questions Fetched:", this.questions);

        if (!Array.isArray(this.questions)) {
          throw new Error("Invalid response format: Expected an array of questions.");
        }

        this.timer = this.quiz.time_duration ? this.quiz.time_duration * 60 : 0;
        this.startTimer();

      } catch (error) {
        console.error('Error fetching quiz:', error.message);
      }
    },

    startTimer() {
      if (this.timer > 0) {
        this.interval = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            clearInterval(this.interval);
            this.submitQuiz();  // Auto-submit if time runs out
          }
        }, 1000);
      }
    },

    async submitQuiz() {
      clearInterval(this.interval); // Stop timer
      
      try {
        const quizId = this.$route.params.quizId;
        const token = localStorage.getItem('token');
    
        const formattedAnswers = {};
        for (const [questionId, option] of Object.entries(this.answers)) {
          formattedAnswers[questionId] = Number(option);  
        }
        
        const response = await fetch(`/api/quiz/${quizId}/submit`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: formattedAnswers })  
        });
    
        if (!response.ok) throw new Error(` Quiz submission failed: ${response.status}`);
        
        const result = await response.json();
    
        alert(`🎉 You got ${result.correct_answers} out of ${result.total_questions} correct!`);
        this.$router.replace('/user/dashboard');  
      } catch (error) {
        console.error(' Error submitting quiz:', error);
      }
    }
  },

  mounted() {
    this.fetchQuizDetails();
  }
};

export default QuizAttempt;
