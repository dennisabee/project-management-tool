<template>
  <div class="kanban-board">
    <div class="board-header">
      <h1 class="board-title">{{ project.name }}</h1>
      <div class="board-actions">
        <button @click="addColumn" class="btn btn-primary">
          + Add Column
        </button>
        <button @click="addTask" class="btn btn-secondary">
          + Add Task
        </button>
      </div>
    </div>

    <div class="kanban-columns">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        @drop="onDrop($event, column.id)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="column-header">
          <h3 class="column-title">{{ column.name }}</h3>
          <span class="task-count">{{ getTaskCount(column.id) }}</span>
        </div>

        <div class="column-content">
          <TransitionGroup name="task" tag="div">
            <TaskCard
              v-for="task in getColumnTasks(column.id)"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
              @drag-start="onDragStart"
            />
          </TransitionGroup>
        </div>

        <button 
          @click="addTaskToColumn(column.id)" 
          class="add-task-btn"
        >
          + Add a card
        </button>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      :columns="columns"
      @save="saveTask"
      @close="closeTaskModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'

const projectStore = useProjectStore()

const project = ref({ name: 'My Project' })
const columns = ref([
  { id: 1, name: 'To Do', color: '#e3f2fd' },
  { id: 2, name: 'In Progress', color: '#fff3e0' },
  { id: 3, name: 'Review', color: '#f3e5f5' },
  { id: 4, name: 'Done', color: '#e8f5e8' }
])

const tasks = ref([])
const showTaskModal = ref(false)
const selectedTask = ref(null)
const draggedTask = ref(null)

onMounted(() => {
  loadTasks()
})

const getColumnTasks = (columnId) => {
  return tasks.value.filter(task => task.columnId === columnId)
}

const getTaskCount = (columnId) => {
  return getColumnTasks(columnId).length
}

const onDragStart = (task) => {
  draggedTask.value = task
}

const onDrop = (event, columnId) => {
  if (draggedTask.value) {
    moveTask(draggedTask.value.id, columnId)
    draggedTask.value = null
  }
}

const moveTask = (taskId, newColumnId) => {
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  if (taskIndex !== -1) {
    tasks.value[taskIndex].columnId = newColumnId
    // Save to backend
    projectStore.updateTask(tasks.value[taskIndex])
  }
}

const addColumn = () => {
  const newColumn = {
    id: Date.now(),
    name: 'New Column',
    color: '#f5f5f5'
  }
  columns.value.push(newColumn)
}

const addTask = () => {
  selectedTask.value = null
  showTaskModal.value = true
}

const addTaskToColumn = (columnId) => {
  selectedTask.value = { columnId }
  showTaskModal.value = true
}

const editTask = (task) => {
  selectedTask.value = { ...task }
  showTaskModal.value = true
}

const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    projectStore.deleteTask(taskId)
  }
}

const saveTask = (taskData) => {
  if (taskData.id) {
    // Update existing task
    const index = tasks.value.findIndex(t => t.id === taskData.id)
    if (index !== -1) {
      tasks.value[index] = taskData
    }
  } else {
    // Create new task
    const newTask = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
  }
  
  closeTaskModal()
  // Save to backend
  projectStore.saveTask(taskData)
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const loadTasks = () => {
  // Sample data - replace with API call
  tasks.value = [
    {
      id: 1,
      title: 'Design System Setup',
      description: 'Create a comprehensive design system',
      assignee: 'Jonathan Moore',
      priority: 'high',
      columnId: 1,
      tags: ['design', 'frontend'],
      dueDate: '2025-07-25'
    },
    {
      id: 2,
      title: 'API Integration',
      description: 'Connect frontend with backend APIs',
      assignee: 'Jane Smith',
      priority: 'medium',
      columnId: 2,
      tags: ['backend', 'api'],
      dueDate: '2025-07-30'
    }
  ]
}
</script>

<style scoped>
.kanban-board {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.board-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.board-actions {
  display: flex;
  gap: 1rem;
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

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.kanban-columns {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.kanban-column {
  min-width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.column-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.task-count {
  background: #6b7280;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.column-content {
  min-height: 400px;
  margin-bottom: 1rem;
}

.add-task-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.05);
}

.task-enter-active,
.task-leave-active {
  transition: all 0.3s ease;
}

.task-enter-from,
.task-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
