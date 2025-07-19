<template>
  <div class="reports-view">
  <AppHeader />
    <div class="reports-header">
      <div class="header-content">
        <h1>Reports & Analytics</h1>
        <p>Comprehensive insights into your project performance</p>
      </div>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="period-select">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        <button @click="exportReport" class="btn btn-primary">
          📊 Export Report
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">📋</div>
        <div class="metric-content">
          <h3>{{ totalTasks }}</h3>
          <p>Total Tasks</p>
          <span class="metric-change positive">+12% from last period</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">✅</div>
        <div class="metric-content">
          <h3>{{ completedTasks }}</h3>
          <p>Completed Tasks</p>
          <span class="metric-change positive">+8% from last period</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">⏱️</div>
        <div class="metric-content">
          <h3>{{ avgCompletionTime }}h</h3>
          <p>Avg Completion Time</p>
          <span class="metric-change negative">+2h from last period</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">👥</div>
        <div class="metric-content">
          <h3>{{ teamProductivity }}%</h3>
          <p>Team Productivity</p>
          <span class="metric-change positive">+5% from last period</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Task Completion Trend</h3>
        <div class="chart-placeholder">
          <canvas ref="taskTrendChart" width="400" height="200"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Team Performance</h3>
        <div class="chart-placeholder">
          <canvas ref="teamPerformanceChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="detailed-reports">
      <div class="report-section">
        <h3>Project Progress</h3>
        <div class="progress-list">
          <div v-for="project in projectProgress" :key="project.id" class="progress-item">
            <div class="project-info">
              <h4>{{ project.name }}</h4>
              <p>{{ project.description }}</p>
            </div>
            <div class="progress-stats">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
            <div class="project-meta">
              <span class="due-date">Due: {{ formatDate(project.dueDate) }}</span>
              <span class="team-size">👥 {{ project.teamSize }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h3>Team Performance Breakdown</h3>
        <div class="performance-table">
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Tasks Assigned</th>
                <th>Tasks Completed</th>
                <th>Completion Rate</th>
                <th>Avg Time</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in teamPerformance" :key="member.id">
                <td>
                  <div class="member-cell">
                    <div class="member-avatar">{{ getInitials(member.name) }}</div>
                    <div>
                      <div class="member-name">{{ member.name }}</div>
                      <div class="member-role">{{ member.role }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ member.tasksAssigned }}</td>
                <td>{{ member.tasksCompleted }}</td>
                <td>
                  <span class="completion-rate" :class="getCompletionRateClass(member.completionRate)">
                    {{ member.completionRate }}%
                  </span>
                </td>
                <td>{{ member.avgTime }}h</td>
                <td>
                  <div class="performance-score" :class="getPerformanceClass(member.performance)">
                    {{ member.performance }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Task Status Distribution -->
    <div class="status-distribution">
      <h3>Task Status Distribution</h3>
      <div class="status-grid">
        <div v-for="status in taskStatusData" :key="status.name" class="status-card">
          <div class="status-color" :style="{ backgroundColor: status.color }"></div>
          <div class="status-info">
            <h4>{{ status.count }}</h4>
            <p>{{ status.name }}</p>
            <span class="status-percentage">{{ status.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useReportsStore } from '@/stores/reportsStore'
import AppHeader from '@/components/AppHeader.vue'

const reportsStore = useReportsStore()

const selectedPeriod = ref(30)
const taskTrendChart = ref(null)
const teamPerformanceChart = ref(null)

// Sample data - replace with real API data
const totalTasks = ref(147)
const completedTasks = ref(98)
const avgCompletionTime = ref(18)
const teamProductivity = ref(87)

const projectProgress = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete UI/UX overhaul of company website',
    progress: 75,
    dueDate: '2025-08-15',
    teamSize: 5
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Native iOS and Android application',
    progress: 45,
    dueDate: '2025-09-30',
    teamSize: 8
  },
  {
    id: 3,
    name: 'Database Migration',
    description: 'Migration to new cloud infrastructure',
    progress: 90,
    dueDate: '2025-07-30',
    teamSize: 3
  }
])

const teamPerformance = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Project Manager',
    tasksAssigned: 25,
    tasksCompleted: 22,
    completionRate: 88,
    avgTime: 12,
    performance: 'Excellent'
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Frontend Developer',
    tasksAssigned: 18,
    tasksCompleted: 16,
    completionRate: 89,
    avgTime: 15,
    performance: 'Excellent'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UI/UX Designer',
    tasksAssigned: 12,
    tasksCompleted: 11,
    completionRate: 92,
    avgTime: 10,
    performance: 'Excellent'
  }
])

const taskStatusData = ref([
  { name: 'To Do', count: 23, percentage: 16, color: '#e5e7eb' },
  { name: 'In Progress', count: 31, percentage: 21, color: '#fbbf24' },
  { name: 'Review', count: 15, percentage: 10, color: '#a78bfa' },
  { name: 'Done', count: 78, percentage: 53, color: '#10b981' }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getCompletionRateClass = (rate) => {
  if (rate >= 90) return 'excellent'
  if (rate >= 75) return 'good'
  if (rate >= 60) return 'average'
  return 'poor'
}

const getPerformanceClass = (performance) => {
  switch (performance.toLowerCase()) {
    case 'excellent': return 'excellent'
    case 'good': return 'good'
    case 'average': return 'average'
    default: return 'poor'
  }
}

const exportReport = () => {
  const reportData = {
    period: selectedPeriod.value,
    metrics: {
      totalTasks: totalTasks.value,
      completedTasks: completedTasks.value,
      avgCompletionTime: avgCompletionTime.value,
      teamProductivity: teamProductivity.value
    },
    projects: projectProgress.value,
    team: teamPerformance.value,
    taskStatus: taskStatusData.value,
    generatedAt: new Date().toISOString()
  }
  
  reportsStore.exportReport(reportData)
}

onMounted(() => {
  nextTick(() => {
    initializeCharts()
  })
  
  // Load data from store
  reportsStore.fetchMetrics(selectedPeriod.value)
  reportsStore.fetchProjectProgress()
  reportsStore.fetchTeamPerformance()
})

const initializeCharts = () => {
  // Task trend chart
  if (taskTrendChart.value) {
    const ctx = taskTrendChart.value.getContext('2d')
    
    // Simple line chart implementation
    ctx.beginPath()
    ctx.moveTo(0, 150)
    ctx.lineTo(100, 120)
    ctx.lineTo(200, 100)
    ctx.lineTo(300, 80)
    ctx.lineTo(400, 60)
    ctx.strokeStyle = '#4f46e5'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Add gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)')
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')
    
    ctx.beginPath()
    ctx.moveTo(0, 150)
    ctx.lineTo(100, 120)
    ctx.lineTo(200, 100)
    ctx.lineTo(300, 80)
    ctx.lineTo(400, 60)
    ctx.lineTo(400, 200)
    ctx.lineTo(0, 200)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
  }
  
  // Team performance chart
  if (teamPerformanceChart.value) {
    const ctx = teamPerformanceChart.value.getContext('2d')
    
    // Simple bar chart
    const barWidth = 60
    const barSpacing = 80
    const data = [85, 92, 78, 88, 95]
    
    data.forEach((value, index) => {
      const x = index * barSpacing + 40
      const height = (value / 100) * 150
      const y = 180 - height
      
      // Draw bar
      ctx.fillStyle = '#4f46e5'
      ctx.fillRect(x, y, barWidth, height)
      
      // Draw value on top
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${value}%`, x + barWidth/2, y - 5)
    })
  }
}
</script>

<style scoped>
.reports-view {
  margin: 0;
  padding: 0;
  background: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 2rem 0;
  background: white;
  padding: 2rem;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Add this for content spacing */
.page-content {
  padding: 0 2rem 2rem 2rem;
}

.period-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-icon {
  font-size: 2.5rem;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.metric-content p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detailed-reports {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.report-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.project-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.project-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.performance-table {
  overflow-x: auto;
}

.performance-table table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th,
.performance-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.performance-table th {
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.member-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.member-name {
  font-weight: 600;
  color: #1f2937;
}

.member-role {
  font-size: 0.875rem;
  color: #6b7280;
}

.completion-rate {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.completion-rate.excellent {
  background: #d1fae5;
  color: #065f46;
}

.completion-rate.good {
  background: #dbeafe;
  color: #1e40af;
}

.completion-rate.average {
  background: #fef3c7;
  color: #92400e;
}

.completion-rate.poor {
  background: #fee2e2;
  color: #991b1b;
}

.performance-score {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.performance-score.excellent {
  background: #d1fae5;
  color: #065f46;
}

.performance-score.good {
  background: #dbeafe;
  color: #1e40af;
}

.performance-score.average {
  background: #fef3c7;
  color: #92400e;
}

.performance-score.poor {
  background: #fee2e2;
  color: #991b1b;
}

.status-distribution {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-distribution h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-info h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.status-info p {
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.status-percentage {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .reports-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .detailed-reports {
    grid-template-columns: 1fr;
  }
  
  .performance-table {
    font-size: 0.875rem;
  }
}
</style>
