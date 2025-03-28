const UpdateSubject = {
    template: `
      <div class="container mt-4">
        <h2>Update Subject</h2>
        <form @submit.prevent="updateSubject">
          <div class="mb-3">
            <label for="subjectName" class="form-label">Subject Name</label>
            <input type="text" id="subjectName" v-model="subjectName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="subjectDescription" class="form-label">Description</label>
            <input type="text" id="subjectDescription" v-model="subjectDescription" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Update Subject</button>
        </form>
      </div>
    `,
  
    data() {
      return {
        subjectName: '',
        subjectDescription: '',
      };
    },
  
    methods: {
      async updateSubject() {
        const updatedData = {
          name: this.subjectName,
          description: this.subjectDescription,
        };
  
        try {
          const response = await fetch(`/api/subjects/${this.$route.params.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedData),
          });
  
          if (response.ok) {
            alert("Subject updated successfully!");
            this.$router.push('/admin/dashboard');
          } else {
            const error = await response.json();
            console.error('Failed to update subject:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    },
  
    mounted() {
      this.subjectName = this.$route.query.name || '';
      this.subjectDescription = this.$route.query.description || '';
    },
  };
  
  export default UpdateSubject;
  