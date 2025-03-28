const AdminDashboard = {
  template: `
    <div class="admin-dashboard container py-4">
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
            <form @submit.prevent="search" class="d-flex me-3">
              <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search..." aria-label="Search">
              <button class="btn btn-outline-light" type="submit">Search</button>
            </form>
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </div>
        </div>
      </nav>

      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0">Subjects</h1>
            <router-link to="/subjects/add" class="btn btn-primary">+ New Subject</router-link>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="subjects.length === 0">
                  <td colspan="3" class="text-center">No subjects found.</td>
                </tr>
                <tr v-for="subject in subjects" :key="subject.id">
                  <td>{{ subject.name }}</td>
                  <td>{{ subject.description }}</td>
                  <td>
                    <router-link :to="'/subjects/' + subject.id + '/chapters'" class="btn btn-info btn-sm">View Chapters</router-link>
                    <router-link :to="'/subjects/' + subject.id + '/edit'" class="btn btn-warning btn-sm">Edit</router-link>
                    <button class="btn btn-danger btn-sm" @click="deleteSubject(subject.id)">Delete</button>
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
    return { subjects: [] };
  },
  methods: {
    async fetchSubjects() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.replace('/');
          return;
        }
        const response = await fetch('/api/subjects', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        this.subjects = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },
    async deleteSubject(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await fetch(`/api/subjects/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchSubjects();
      } catch (error) {
        console.error('Delete subject error:', error);
      }
    },
    async logout() {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      this.$router.replace('/');
    },
    search() {
      if (this.searchQuery.trim() !== "") {
        this.$router.push(`/admin/search-results?query=${encodeURIComponent(this.searchQuery)}`);
      }
    }
  },
  mounted() { this.fetchSubjects(); }
};

export default AdminDashboard;
