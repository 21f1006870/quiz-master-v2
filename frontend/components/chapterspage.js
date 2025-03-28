const ChapterPage = {
  template: `
    <div class="chapter-page container py-4">
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
            <h1 class="h4 mb-0">Chapters</h1>
            <router-link :to="'/subjects/' + subjectId + '/chapters/add'" class="btn btn-primary">+ New Chapter</router-link>
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
                <tr v-if="chapters.length === 0">
                  <td colspan="3" class="text-center">No chapters found.</td>
                </tr>
                <tr v-for="chapter in chapters" :key="chapter.id">
                  <td>{{ chapter.name }}</td>
                  <td>{{ chapter.description }}</td>
                  <td>
                    <router-link :to="'/chapters/' + chapter.id + '/quizzes'" class="btn btn-info btn-sm">View Quiz</router-link>
                    <router-link :to="'/subjects/' + subjectId + '/chapters/' + chapter.id + '/edit'" class="btn btn-warning btn-sm">Edit</router-link>
                    <button class="btn btn-danger btn-sm" @click="deleteChapter(chapter.id)">Delete</button>
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
      chapters: [], 
      subjectId: this.$route.params.subjectId 
    };
  },
  methods: {
    async fetchChapters() {
      try {
        const response = await fetch(`/api/subjects/${this.subjectId}/chapters`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        this.chapters = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    },
    async deleteChapter(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await fetch(`/api/subjects/${this.subjectId}/chapters/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchChapters();
      } catch (error) {
        console.error('Error deleting chapter:', error);
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
  mounted() { this.fetchChapters(); }
};

export default ChapterPage;
