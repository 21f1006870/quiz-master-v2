const Login = {
    template: `
    <section class="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div class="card p-4 shadow-lg" style="width: 350px;">
            <h3 class="text-center mb-3">Quiz Master</h3>

            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" v-model="username" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="password" required>
                </div>

                <button class="btn btn-primary w-100" type="submit">Login</button>
            </form>

            <div class="text-center mt-3">
                <p class="mb-1">Don't have an account?</p>
                <button @click="$router.push('/register')" class="btn btn-outline-secondary">Register</button>
            </div>
        </div>
    </section>
    `,
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.access_token);
                    if (data.role === 'admin') {
                        this.$router.push('/admin/dashboard');
                    } else {
                        this.$router.push('/user/dashboard');
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred during login');
            }
        },
    },
};

export default Login;
