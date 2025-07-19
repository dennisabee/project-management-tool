<template>
  <div class="kanban-view">
    <AppHeader />
    
    <!-- Project Selector -->
    <div class="project-selector">
      <div class="container">
        <div class="selector-header">
          <div class="project-info">
            <h1>{{ currentProject.name }}</h1>
            <p>{{ currentProject.description }}</p>
          </div>
          
          <div class="project-actions">
            <div class="project-dropdown">
              <button @click="toggleProjectDropdown" class="project-btn">
                📋 Switch Project
                <span class="dropdown-arrow">▼</span>
              </button>
              
              <div v-if="showProjectDropdown" class="dropdown-menu">
                <div 
                  v-for="project in availableProjects" 
                  :key="project.id"
                  @click="switchProject(project.id)"
                  class="dropdown-item"
                  :class="{ active: project.id === currentProject.id }"
                >
                  <span class="project-name">{{ project.name }}</span>
                  <span class="project-status" :class="project.status">{{ project.status }}</span>
                </div>
                <div class="dropdown-divider"></div>
                <div @click="createNewProject" class="dropdown-item create-new">
                  ➕ Create New Project
                </div>
              </div>
            </div>
            
            <button @click="showTaskModal = true" class="action-btn primary">
              ➕ Add Task
            </button>
            
            <button @click="addColumn" class="action-btn secondary">
              📝 Add Column
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Kanban Board -->
    <div class="kanban-container">
      <KanbanBoard :project-id="currentProject.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import AppHeader from '@/components/AppHeader.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const showProjectDropdown = ref(false)
const showTaskModal = ref(false)

const availableProjects = ref([
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'active'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'React Native app for mobile platforms',
    status: 'planning'
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Q3 digital marketing strategy',
    status: 'completed'
  }
])

const currentProject = ref(availableProjects.value[0])

onMounted(() => {
  const projectId = route.params.projectId
  if (projectId) {
    const project = availableProjects.value.find(p => p.id == projectId)
    if (project) {
      currentProject.value = project
    }
  }
})

const toggleProjectDropdown = () => {
  showProjectDropdown.value = !showProjectDropdown.value
}

const switchProject = (projectId) => {
  const project = availableProjects.value.find(p => p.id === projectId)
  if (project) {
    currentProject.value = project
    router.push(`/kanban/${projectId}`)
  }
  showProjectDropdown.value = false
}

const createNewProject = () => {
  router.push('/projects/new')
  showProjectDropdown.value = false
}

const addColumn = () => {
  // Add column functionality
  console.log('Add column to project:', currentProject.value.id)
}
</script>

<style scoped>
.kanban-view {
  min-height: 100vh;
  background: #f8fafc;
}

.project-selector {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
}

.project-info h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.project-info p {
  color: #6b7280;
  margin: 0;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-dropdown {
  position: relative;
}

.project-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-btn:hover {
  background: #e5e7eb;
}

.action-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 250px;
  z-index: 1000;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.active {
  background: #eff6ff;
  color: #1d4ed8;
}

.dropdown-item.create-new {
  color: #3b82f6;
  font-weight: 500;
}

.project-name {
  font-weight: 500;
}

.project-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
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

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.kanban-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .selector-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .project-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .kanban-container {
    padding: 1rem;
  }
}
</style>
