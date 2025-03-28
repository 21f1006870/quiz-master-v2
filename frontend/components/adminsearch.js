const AdminSearch = {
  template: `
    <div class="container py-4">
      <h2>Search Results</h2>

      <!-- Subjects Section -->
      <div v-if="searchResults.subjects.length > 0">
        <h3>Subjects:</h3>
        <div v-for="subject in searchResults.subjects" :key="subject.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ subject.name }}</h5>
            <p class="card-text">{{ subject.description }}</p>
            <router-link :to="'/subjects/' + subject.id + '/chapters'" class="btn btn-primary">View Chapters</router-link>
          </div>
        </div>
      </div>

      <!-- Chapters Section -->
      <div v-if="searchResults.chapters.length > 0">  
        <h3>Chapters:</h3>
        <div v-for="chapter in searchResults.chapters" :key="chapter.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ chapter.name }}</h5>
            <p class="card-text">{{ chapter.description }}</p>
            <router-link :to="'/subjects/' + subjectId + '/chapters/' + chapter.id + '/quizzes'" class="btn btn-success">View Quiz</router-link>
          </div>
        </div>
      </div>

      <!-- Quizzes Section -->
      <div v-if="searchResults.quizzes.length > 0">
        <h3>Quizzes:</h3>
        <div v-for="quiz in searchResults.quizzes" :key="quiz.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ quiz.name }}</h5>
            <p class="card-text">{{ quiz.description }}</p>
            <router-link :to="'/subjects/' + subjectId + '/chapters/' + chapterId + '/quizzes/' + quiz.id + '/questions'" class="btn btn-info">View Questions</router-link>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="noResults" class="alert alert-warning mt-3">No results found.</div>
    </div>
  `,

  data() {
    return {
      searchResults: {
        subjects: [],
        chapters : [],
        quizzes: [],
      },
      noResults: false,
    };
  },

  created() {
    this.search();
  },

  methods: {
    async search() {
      const query = this.$route.query.query;
      if (query) {
        try {
          const response = await fetch(`/api/search?query=${query}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
          });

          if (response.ok) {
            const data = await response.json();
            this.searchResults = data;
            this.noResults =
              data.subjects.length === 0 &&
              data.chapters.length === 0 &&
              data.quizzes.length === 0;
          } else {
            console.error('Search failed');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    },
  },
};

export default AdminSearch;
