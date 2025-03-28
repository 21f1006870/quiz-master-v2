const Register = {
    template: `
    <section class="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div class="card p-4 shadow-lg" style="width: 350px;">
            <h3 class="text-center mb-3">Register</h3>

            <form @submit.prevent="register">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" v-model="username" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="password" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="name" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="email" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Qualification</label>
                    <input type="text" class="form-control" v-model="qualification" required>
                </div>

                <button class="btn btn-primary w-100" type="submit">Register</button>
            </form>

        </div>
    </section>
    `,
    data() {
        return {
            username: '',
            password: '',
            name: '',
            email: '',
            qualification: '',
        };
    },
    methods: {
        async register() {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                        name: this.name,
                        email: this.email,
                        qualification: this.qualification,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful');
                    this.$router.push('/');
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred');
            }
        },
    },
};

export default Register;
