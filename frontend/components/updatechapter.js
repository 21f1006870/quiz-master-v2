const UpdateChapter = {
    template: `
      <div class="container mt-4">
        <h2>Update Chapter</h2>
        <form @submit.prevent="updateChapter">
          <div class="mb-3">
            <label for="chapterName" class="form-label">Chapter Name</label>
            <input type="text" id="chapterName" v-model="chapterName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="chapterDescription" class="form-label">Description</label>
            <input type="text" id="chapterDescription" v-model="chapterDescription" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Update Chapter</button>
          <router-link :to="'/subject' + 'subject.id' + '/chapters' " class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
      </div>
    `,
  
    data() {
      return {
        chapterName: '',
        chapterDescription: '',
      };
    },
  
    methods: {
      async updateChapter() {
        const updatedData = {
          name: this.chapterName,
          description: this.chapterDescription,
        };
  
        try {
          const response = await fetch(`/api/subjects/${this.$route.params.subjectId}/chapters/${this.$route.params.chapterId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedData),
          });
  
          if (response.ok) {
            alert("Chapter updated successfully!");
            this.$router.push(`/subjects/${this.$route.params.subjectId}/chapters`);
          } else {
            const error = await response.json();
            console.error('Failed to update chapter:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    },
  
    mounted() {
      this.chapterName = this.$route.query.name || '';
      this.chapterDescription = this.$route.query.description || '';
    },
  };
  
  export default UpdateChapter;
