const Summary = {
  template: `  
    <div class="container mt-4">
      <h2 class="text-center">Admin Summary</h2>
      
      <!-- Summary Cards -->
      <div class="row text-center mt-4">
        <div class="col-md-4 col-lg-2 mb-3" v-for="(value, key) in totals" :key="key">
          <div class="card shadow-sm p-3">
            <h5 class="text-muted">{{ key.replace('_', ' ').toUpperCase() }}</h5>
            <h3 class="font-weight-bold text-primary">{{ value }}</h3>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="row mt-5">
        <div class="col-md-6">
          <div class="card p-3 shadow">
            <h5 class="text-center">Daily Quiz Attempts</h5>
            <canvas id="dailyAttemptsChart"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-3 shadow">
            <h5 class="text-center">Quiz Distribution</h5>
            <canvas id="quizDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-8 offset-md-2">
          <div class="card p-3 shadow">
            <h5 class="text-center">Average Quiz Scores</h5>
            <canvas id="averageScoreChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      totals: {},
      dailyAttempts: {},
      quizDistribution: {},
      averageQuizScores: {}  
    };
  },
  methods: {
    async fetchSummaryData() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }
      try {
        const response = await fetch("/api/summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        this.totals = {
          total_users: data.total_users,
          total_subjects: data.total_subjects,
          total_chapters: data.total_chapters,
          total_quizzes: data.total_quizzes,
          total_questions: data.total_questions
        };
        this.dailyAttempts = data.daily_attempts;
        this.quizDistribution = data.quiz_distribution;
        this.averageQuizScores = data.average_scores_per_quiz; 

        this.renderCharts();
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    },
    renderCharts() {
      // Daily Quiz Attempts Chart
      new Chart(document.getElementById("dailyAttemptsChart"), {
        type: "line",
        data: {
          labels: Object.keys(this.dailyAttempts),
          datasets: [{
            label: "Daily Attempts",
            data: Object.values(this.dailyAttempts),
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true
          }]
        }
      });

      // Quiz Distribution Chart
      new Chart(document.getElementById("quizDistributionChart"), {
        type: "pie",
        data: {
          labels: Object.keys(this.quizDistribution),
          datasets: [{
            data: Object.values(this.quizDistribution),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
          }]
        }
      });

      // Average Score Per Quiz Chart
      new Chart(document.getElementById("averageScoreChart"), {
        type: "bar",
        data: {
          labels: Object.keys(this.averageQuizScores),
          datasets: [{
            label: "Average Score",
            data: Object.values(this.averageQuizScores),
            backgroundColor: "#FFCE56"
          }]
        },
        options: { scales: { y: { beginAtZero: true, max: 100 } } } 
      });
    }
  },
  mounted() {
    this.fetchSummaryData();
  }
};

export default Summary;
