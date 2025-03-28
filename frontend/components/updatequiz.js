const UpdateQuiz = {
    template: `
      <div class="container mt-4">
        <h2>Update Quiz</h2>
        <form @submit.prevent="updateQuiz">
          <div class="mb-3">
            <label for="quizName" class="form-label">Quiz Name</label>
            <input type="text" id="quizName" v-model="quizName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="quizDescription" class="form-label">Description</label>
            <input type="text" id="quizDescription" v-model="quizDescription" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="timeDuration" class="form-label">Time Duration (minutes)</label>
            <input type="number" id="timeDuration" v-model="timeDuration" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Update Quiz</button>
        </form>
      </div>
    `,
  
    data() {
      return {
        quizName: '',
        quizDescription: '',
        timeDuration: null,
      };
    },
  
    methods: {
      async updateQuiz() {
        const updatedData = {
          name: this.quizName,
          description: this.quizDescription,
          time_duration: this.timeDuration
        };
  
        try {
          const response = await fetch(`/api/chapters/${this.$route.params.chapterId}/quizzes/${this.$route.params.quizId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedData),
          });
  
          if (response.ok) {
            alert("Quiz updated successfully!");
            this.$router.push(`/chapters/${this.$route.params.chapterId}/quizzes`);
          } else {
            const error = await response.json();
            console.error('Failed to update quiz:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    },
  
    mounted() {
      this.quizName = this.$route.query.name || '';
      this.quizDescription = this.$route.query.description || '';
      this.timeDuration = this.$route.query.time_duration || 0;
    },
  };
  
  export default UpdateQuiz;
