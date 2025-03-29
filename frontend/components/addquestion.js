const AddQuestion = {
    template: `
      <div class="container mt-4">
        <h2>Add New Question</h2>
        <form @submit.prevent="addQuestion">
          <div class="mb-3">
            <label class="form-label">Question</label>
            <input type="text" class="form-control" v-model="question" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Options</label>
            <div v-for="(option, index) in options" :key="index" class="input-group mb-2">
              <input type="text" class="form-control" v-model="options[index]" required>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Correct Option</label>
            <select class="form-control" v-model="correct_option" required>
              <option v-for="(option, index) in options" :key="'correct_' + index" :value="index + 1">
                Option {{ index + 1 }}
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Add Question</button>
          <router-link :to="'/quizzes/' + quizId + '/questions'" class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
      </div>
    `,

    data() {
      return {
        question: '',
        options: ['', '', '', ''],  // Exactly 4 options
        correct_option: 1,
        subjectId: null,
        chapterId: null,
        quizId: null
      };
    },

    created() {
      this.subjectId = this.$route.params.subjectId;
      this.chapterId = this.$route.params.chapterId;
      this.quizId = this.$route.params.quizId;
    },

    methods: {
      async addQuestion() {
        if (!this.question.trim() || this.options.some(opt => !opt.trim())) {
          alert("Both fields are required.");
          return;
        }

        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/quizzes/${this.quizId}/questions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              question: this.question,
              option1: this.options[0],
              option2: this.options[1],
              option3: this.options[2],
              option4: this.options[3],
              correct_option: this.correct_option.toString()
            })
          });

          const data = await response.json();
          console.log("Response:", data);

          if (response.ok) {
            alert("Question added successfully!");
            this.$router.push(`/quizzes/${this.quizId}/questions`);
          } else {
            alert(data.message || "Failed to add question.");
          }
        } catch (error) {
          console.error("Error adding question:", error);
          alert("An error occurred while adding the question.");
        }
      }
    }
};

export default AddQuestion;
