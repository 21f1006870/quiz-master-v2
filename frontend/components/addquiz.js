const AddQuiz = {
    template: `
      <div class="container mt-4">
        <h2>Add New Quiz</h2>
        <form @submit.prevent="addQuiz">
          <div class="mb-3">
            <label class="form-label">Quiz Name</label>
            <input type="text" class="form-control" v-model="name" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="description" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Time Duration (minutes)</label>
            <input type="number" class="form-control" v-model="time_duration" required min="1">
          </div>
          <button type="submit" class="btn btn-primary">Add Quiz</button>
          <router-link :to="'/chapters/' + chapterId + '/quizzes'" class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
      </div>
    `,
  
    data() {
      return {
        name: '',
        description: '',
        time_duration: 30,
        subjectId: null,
        chapterId: null
      };
    },
  
    created() {
      this.subjectId = this.$route.params.subjectId;
      this.chapterId = this.$route.params.chapterId;
    },
  
    methods: {
      async addQuiz() {
        if (!this.name.trim() || !this.description.trim()) {
          alert("All fields are required.");
          return;
        }
  
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/chapters/${this.chapterId}/quizzes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              name: this.name,
              description: this.description,
              time_duration: this.time_duration
            })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert("Quiz added successfully!");
            this.$router.push(`/chapters/${this.chapterId}/quizzes`);
          } else {
            alert(data.message || "Failed to add quiz.");
          }
        } catch (error) {
          console.error("Error adding quiz:", error);
          alert("An error occurred while adding the quiz.");
        }
      }
    }
  };
  
  export default AddQuiz;
  