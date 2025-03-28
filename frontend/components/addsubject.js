const AddSubject = {
  template: `
  <div class="container mt-4">
      <h2>Add New Subject</h2>
      <form @submit.prevent="addSubject">
          <div class="mb-3">
              <label class="form-label">Subject Name</label>
              <input type="text" class="form-control" v-model="name" required>
          </div>
          <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="description" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Subject</button>
          <router-link to="/admin/subjects" class="btn btn-secondary ms-2">Cancel</router-link>
      </form>
  </div>
  `,
  data() {
      return {
          name: '',
          description: ''
      };
  },
  methods: {
      async addSubject() {
          if (!this.name.trim() || !this.description.trim()) {
              alert("Both fields are required.");
              return;
          }
          try {
              const token = localStorage.getItem('token');
              const response = await fetch('/api/subjects', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                      name: this.name,
                      description: this.description
                  })
              });
              const data = await response.json();
              if (response.ok) {
                  alert("Subject added successfully!");
                  this.$router.push('/admin/dashboard');
              } else {
                  alert(data.message || "Failed to add subject.");
              }
          } catch (error) {
              console.error("Error adding subject:", error);
              alert("An error occurred while adding the subject.");
          }
      }
  }
};

export default AddSubject;
