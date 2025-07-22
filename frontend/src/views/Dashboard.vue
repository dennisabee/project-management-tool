<template>
  <div class="dashboard">
    <AppHeader />
    
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome back, {{ user.name }}! 👋</h1>
        <p class="welcome-subtitle">Here's what's happening with your projects today</p>
      </div>
      
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Projects</h3>
            <div class="stat-number">{{ stats.totalProjects }}</div>
            <div class="stat-change positive">+2 this month</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Completed Tasks</h3>
            <div class="stat-number">{{ stats.completedTasks }}</div>
            <div class="stat-change positive">+12 this week</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>In Progress</h3>
            <div class="stat-number">{{ stats.inProgressTasks }}</div>
            <div class="stat-change neutral">{{ stats.pendingTasks }} pending</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Team Members</h3>
            <div class="stat-number">{{ stats.teamMembers }}</div>
            <div class="stat-change positive">2 active today</div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Recent Projects -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Recent Projects</h2>
            <router-link to="/projects" class="view-all-link">View All</router-link>
          </div>
          
          <div class="projects-list">
            <div 
              v-for="project in recentProjects" 
              :key="project.id"
              class="project-card"
              @click="goToProject(project.id)"
            >
              <div class="project-header">
                <h4>{{ project.name }}</h4>
                <div class="project-status" :class="project.status">
                  {{ project.status }}
                </div>
              </div>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-footer">
                <div class="project-team">
                  <div 
                    v-for="member in project.team.slice(0, 3)" 
                    :key="member.id"
                    class="team-avatar"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                  <span v-if="project.team.length > 3" class="team-more">
                    +{{ project.team.length - 3 }}
                  </span>
                </div>
                <span class="project-due">Due: {{ formatDate(project.dueDate) }}</span>
              </div>
            </div>
          </div>
          
          <div class="create-project-card" @click="createNewProject">
            <div class="create-icon">➕</div>
            <h4>Create New Project</h4>
            <p>Start a new project and invite your team</p>
          </div>
        </div>
        
        <!-- Quick Actions & Tasks -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div class="quick-actions">
            <div class="action-card" @click="createTask">
              <div class="action-icon">📝</div>
              <div class="action-content">
                <h4>Create Task</h4>
                <p>Add a new task to any project</p>
              </div>
            </div>
            
            <div class="action-card" @click="inviteTeamMember">
              <div class="action-icon">👤</div>
              <div class="action-content">
                <h4>Invite Member</h4>
                <p>Add someone to your team</p>
              </div>
            </div>
            
            <div class="action-card" @click="viewReports">
              <div class="action-icon">📈</div>
              <div class="action-content">
                <h4>View Reports</h4>
                <p>Check project analytics</p>
              </div>
            </div>
          </div>
          
          <!-- Recent Tasks -->
          <div class="recent-tasks">
            <h3>Your Recent Tasks</h3>
            <div class="task-list">
              <div 
                v-for="task in recentTasks" 
                :key="task.id"
                class="task-item"
              >
                <div class="task-content">
                  <h5>{{ task.title }}</h5>
                  <span class="task-project">{{ task.projectName }}</span>
                </div>
                <div class="task-priority" :class="task.priority"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const projectStore = useProjectStore()

const stats = ref({
  totalProjects: 8,
  completedTasks: 45,
  inProgressTasks: 12,
  pendingTasks: 8,
  teamMembers: 6
})

const recentProjects = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    dueDate: '2025-08-15',
    team: [
      { id: 1, name: 'Sarah Johnson' },
      { id: 2, name: 'Mike Chen' },
      { id: 3, name: 'Emily Rodriguez' }
    ]
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'React Native app for iOS and Android platforms',
    status: 'planning',
    dueDate: '2025-09-20',
    team: [
      { id: 4, name: 'Alex Wilson' },
      { id: 5, name: 'Lisa Park' }
    ]
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Q3 digital marketing strategy and implementation',
    status: 'completed',
    dueDate: '2025-07-30',
    team: [
      { id: 6, name: 'David Kim' },
      { id: 7, name: 'Emma Davis' },
      { id: 8, name: 'Tom Anderson' },
      { id: 9, name: 'Ryan Wilson' }
    ]
  }
])

const recentTasks = ref([
  { id: 1, title: 'Design homepage mockup', projectName: 'Website Redesign', priority: 'high' },
  { id: 2, title: 'Set up development environment', projectName: 'Mobile App', priority: 'medium' },
  { id: 3, title: 'Review marketing materials', projectName: 'Marketing Campaign', priority: 'low' }
])

const user = ref({ name: 'User' })

onMounted(() => {
  // Load user data
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData)
      user.value = parsedUser.name ? parsedUser : { name: 'User' }
    } catch (error) {
      console.error('Error parsing user data:', error)
      user.value = { name: 'User' }
    }
  }
  
  // Fetch project data
  if (projectStore.fetchProjects) {
    projectStore.fetchProjects()
  }
})

// Navigation methods - properly mapped to existing routes
const goToProject = (projectId) => {
  router.push(`/kanban/${projectId}`)
}

const createNewProject = () => {
  router.push('/projects')
}

const createTask = () => {
  // Navigate to kanban board to create a task
  router.push('/kanban')
}

const inviteTeamMember = () => {
  // Navigate to team page for inviting members
  router.push('/team')
}

const viewReports = () => {
  router.push('/reports')
}

// Utility methods
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive { color: #10b981; }
.stat-change.negative { color: #ef4444; }
.stat-change.neutral { color: #6b7280; }

.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.project-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.project-status.active {
  background: #dcfce7;
  color: #166534;
}

.project-status.planning {
  background: #fef3c7;
  color: #92400e;
}

.project-status.completed {
  background: #dbeafe;
  color: #1e40af;
}

.project-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-team {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.team-avatar {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid white;
}

.team-more {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.project-due {
  font-size: 0.875rem;
  color: #6b7280;
}

.create-project-card {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-project-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.create-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.create-project-card h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.create-project-card p {
  color: #6b7280;
  margin: 0;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.action-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.action-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.recent-tasks h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
}

.task-content h5 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-project {
  font-size: 0.75rem;
  color: #6b7280;
}

.task-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.task-priority.high { background: #ef4444; }
.task-priority.medium { background: #f59e0b; }
.task-priority.low { background: #10b981; }

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
