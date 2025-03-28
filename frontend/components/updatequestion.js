const UpdateQuestion = {
    template: `
      <div class="container mt-4">
        <h2>Update Question</h2>
        <form @submit.prevent="updateQuestion">
          <div class="mb-3">
            <label class="form-label">Question</label>
            <input type="text" class="form-control" v-model="question.text" required>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Options</label>
            <div v-for="(option, index) in question.options" :key="index" class="input-group mb-2">
              <input type="text" class="form-control" v-model="question.options[index]" required>
            </div>
          </div>
  
          <div class="mb-3">
            <label class="form-label">Correct Option</label>
            <select class="form-control" v-model="question.correct_option" required>
              <option v-for="(option, index) in question.options" :key="index" :value="index+1">
                Option {{ index + 1 }}
              </option>
            </select>
          </div>
  
          <button type="submit" class="btn btn-primary">Update Question</button>
          <router-link :to="'/quizzes/' + quizId + '/questions'" class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
      </div>
    `,
  
    data() {
      return {
        question: {
          text: '',
          options: ['', '', '', ''],
          correct_option: 1
        },
        subjectId: null,
        chapterId: null,
        quizId: null,
        questionId: null
      };
    },
  
    async created() {
      this.subjectId = this.$route.params.subjectId;
      this.chapterId = this.$route.params.chapterId;
      this.quizId = this.$route.params.quizId;
      this.questionId = this.$route.params.questionId;
      await this.fetchQuestion();
    },
  
    methods: {
      async updateQuestion() {
        if (!this.question.text.trim() || this.question.options.some(opt => !opt.trim())) {
          alert("All fields are required.");
          return;
        }
  
        try {
          const response = await fetch(`/api/quizzes/${this.quizId}/questions/${this.questionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              question: this.question.text,
              option1: this.question.options[0],
              option2: this.question.options[1],
              option3: this.question.options[2],
              option4: this.question.options[3],
              correct_option: this.question.correct_option
            })
          });
  
          const data = await response.json();
          if (response.ok) {
            alert("Question updated successfully!");
            this.$router.push(`/quizzes/${this.quizId}/questions`);
          } else {
            alert(data.message || "Failed to update question.");
          }
        } catch (error) {
          console.error("Error updating question:", error);
          alert("An error occurred while updating the question.");
        }
      }
    }
  };
  
  export default UpdateQuestion;
  