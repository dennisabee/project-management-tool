<template>
  <div class="projects-view">
    <AppHeader />
    <!-- Projects Header -->
    <div class="projects-header">
      <div class="header-content">
        <h1>Projects</h1>
        <p>Manage all your projects in one place</p>
      </div>
      <button @click="createNewProject" class="btn btn-primary">
        ➕ Create Project
      </button>
    </div>
    
    <!-- Project Stats -->
    <div class="project-stats">
      <div class="stat-item">
        <div class="stat-number">{{ stats.total }}</div>
        <div class="stat-label">Total Projects</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.active }}</div>
        <div class="stat-label">Active</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.completed }}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.onHold }}</div>
        <div class="stat-label">On Hold</div>
      </div>
    </div>
    
    <!-- Filters & Search -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search projects..."
          class="search-input"
        />
      </div>
      <div class="filter-buttons">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="filter-btn"
          :class="{ active: activeFilter === filter.value }"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>
    
    <!-- Projects Grid -->
    <div class="projects-grid">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="project-card"
        @click="openProject(project.id)"
      >
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <div class="project-menu" @click.stop="toggleProjectMenu(project.id)">
            ⋮
            <div v-if="activeMenu === project.id" class="menu-dropdown">
              <a @click="editProject(project.id)" class="menu-item">✏️ Edit</a>
              <a @click="viewKanban(project.id)" class="menu-item">📋 Kanban</a>
              <a @click="duplicateProject(project.id)" class="menu-item">📋 Duplicate</a>
              <div class="menu-divider"></div>
              <a @click="deleteProject(project.id)" class="menu-item danger">🗑️ Delete</a>
            </div>
          </div>
        </div>
        
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-progress">
          <div class="progress-info">
            <span>Progress</span>
            <span>{{ project.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${project.progress}%` }"
            ></div>
          </div>
        </div>
        
        <div class="project-meta">
          <div class="project-team">
            <div 
              v-for="member in project.team.slice(0, 3)" 
              :key="member.id"
              class="team-avatar"
              :title="member.name"
            >
              {{ getInitials(member.name) }}
            </div>
            <span v-if="project.team.length > 3" class="team-more">
              +{{ project.team.length - 3 }}
            </span>
          </div>
          
          <div class="project-status" :class="project.status">
            {{ project.status }}
          </div>
        </div>
        
        <div class="project-footer">
          <span class="project-date">
            Updated {{ formatDate(project.updatedAt) }}
          </span>
          <span class="project-tasks">
            {{ project.totalTasks }} tasks
          </span>
        </div>
      </div>
      
      <!-- Create New Project Card -->
      <div class="create-project-card" @click="createNewProject">
        <div class="create-icon">➕</div>
        <h3>Create New Project</h3>
        <p>Start a new project and invite your team</p>
      </div>
    </div>
    
    <!-- Create Project Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button @click="showCreateModal = false" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="handleCreateProject" class="project-form">
          <div class="form-group">
            <label>Project Name</label>
            <input 
              v-model="newProject.name" 
              type="text" 
              placeholder="Enter project name"
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="newProject.description" 
              placeholder="Project description..."
              rows="3"
              class="form-input"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Status</label>
              <select v-model="newProject.status" class="form-input">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Due Date</label>
              <input 
                v-model="newProject.dueDate" 
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

const searchQuery = ref('')
const activeFilter = ref('all')
const activeMenu = ref(null)
const showCreateModal = ref(false)

const newProject = ref({
  name: '',
  description: '',
  status: 'planning',
  dueDate: ''
})

const stats = ref({
  total: 12,
  active: 8,
  completed: 3,
  onHold: 1
})

const filters = ref([
  { label: 'All Projects', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planning', value: 'planning' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on-hold' }
])

const projects = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    status: 'active',
    progress: 75,
    totalTasks: 24,
    updatedAt: '2025-07-18',
    team: [
      { id: 1, name: 'Joe Goldberg' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' }
    ]
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'React Native app for iOS and Android platforms',
    status: 'planning',
    progress: 25,
    totalTasks: 18,
    updatedAt: '2025-07-17',
    team: [
      { id: 4, name: 'Sarah Wilson' },
      { id: 5, name: 'Tom Brown' }
    ]
  },
  {
    id: 3,
    name: 'Marketing Campaign Q3',
    description: 'Digital marketing strategy and campaign implementation for Q3',
    status: 'completed',
    progress: 100,
    totalTasks: 15,
    updatedAt: '2025-07-15',
    team: [
      { id: 6, name: 'Lisa Davis' },
      { id: 7, name: 'Chris Lee' },
      { id: 8, name: 'Anna Taylor' },
      { id: 9, name: 'David Kim' }
    ]
  },
  {
    id: 4,
    name: 'Database Migration',
    description: 'Migrate existing database to new cloud infrastructure',
    status: 'on-hold',
    progress: 45,
    totalTasks: 12,
    updatedAt: '2025-07-16',
    team: [
      { id: 10, name: 'Robert Chen' },
      { id: 11, name: 'Emily Zhang' }
    ]
  }
])

const filteredProjects = computed(() => {
  let filtered = projects.value
  
  // Filter by status
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(project => project.status === activeFilter.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(project => 
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return filtered
})

const createNewProject = () => {
  showCreateModal.value = true
}

const handleCreateProject = () => {
  const project = {
    id: Date.now(),
    ...newProject.value,
    progress: 0,
    totalTasks: 0,
    updatedAt: new Date().toISOString().split('T')[0],
    team: []
  }
  
  projects.value.unshift(project)
  showCreateModal.value = false
  
  // Reset form
  newProject.value = {
    name: '',
    description: '',
    status: 'planning',
    dueDate: ''
  }
  
  // Navigate to the new project's kanban board
  router.push(`/kanban/${project.id}`)
}

const openProject = (projectId) => {
  router.push(`/kanban/${projectId}`)
}

const viewKanban = (projectId) => {
  router.push(`/kanban/${projectId}`)
  activeMenu.value = null
}

const editProject = (projectId) => {
  console.log('Edit project:', projectId)
  activeMenu.value = null
}

const duplicateProject = (projectId) => {
  const original = projects.value.find(p => p.id === projectId)
  if (original) {
    const duplicate = {
      ...original,
      id: Date.now(),
      name: `${original.name} (Copy)`,
      progress: 0,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    projects.value.unshift(duplicate)
  }
  activeMenu.value = null
}

const deleteProject = (projectId) => {
  if (confirm('Are you sure you want to delete this project?')) {
    projects.value = projects.value.filter(p => p.id !== projectId)
  }
  activeMenu.value = null
}

const toggleProjectMenu = (projectId) => {
  activeMenu.value = activeMenu.value === projectId ? null : projectId
}

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
.projects-view {
  margin: 0;
  padding: 0;
  background: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

.projects-header {
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
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: #6b7280;
  margin: 0;
}

/* Add this for content spacing */
.page-content {
  padding: 0 2rem 2rem 2rem;
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
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.project-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 300px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover, .filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.project-menu {
  position: relative;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #6b7280;
}

.project-menu:hover {
  background: #f3f4f6;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 150px;
  z-index: 1000;
}

.menu-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item.danger {
  color: #ef4444;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.project-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.project-progress {
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

.project-status.on-hold {
  background: #fecaca;
  color: #991b1b;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.create-project-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 250px;
}

.create-project-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.create-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #6b7280;
}

.create-project-card h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.create-project-card p {
  color: #6b7280;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.project-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .projects-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
