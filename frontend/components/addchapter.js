const AddChapter = {
    template: `
    <div class="container mt-4">
        <h2>Add New Chapter</h2>
        <form @submit.prevent="addChapter">
            <div class="mb-3">
                <label class="form-label">Chapter Name</label>
                <input type="text" class="form-control" v-model="name" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="description" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Add Chapter</button>
            <router-link :to="'/subjects/' + subjectId + '/chapters'" class="btn btn-secondary ms-2">Cancel</router-link>
        </form>
    </div>
    `,
    data() {
        return {
            name: '',
            description: '',
            subjectId: null
        };
    },
    created() {
        this.subjectId = this.$route.params.subjectId;
    },
    methods: {
        async addChapter() {
            if (!this.name.trim() || !this.description.trim()) {
                alert("Both fields are required.");
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/subjects/${this.subjectId}/chapters`, {
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
                console.log("Response:", data); 

                if (response.ok) {
                    alert("Chapter added successfully!");
                    this.$router.push(`/subjects/${this.subjectId}/chapters`); 
                } else {
                    alert(data.message || "Failed to add chapter.");
                }
            } catch (error) {
                console.error("Error adding chapter:", error);
                alert("An error occurred while adding the chapter.");
            }
        }
    }
};

export default AddChapter;
