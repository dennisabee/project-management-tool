<template>
  <div 
    class="task-card"
    :class="{ 'dragging': isDragging }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="$emit('edit', task)"
  >
    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
      <button @click.stop="$emit('delete', task.id)" class="delete-btn">
        ×
      </button>
    </div>

    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>

    <div v-if="task.tags?.length" class="task-tags">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="task-tag"
      >
        {{ tag }}
      </span>
    </div>

    <div class="task-footer">
      <div class="task-meta">
        <span v-if="task.assignee" class="assignee">
          {{ getInitials(task.assignee) }}
        </span>
        <span v-if="task.dueDate" class="due-date" :class="getDueDateClass()">
          {{ formatDate(task.dueDate) }}
        </span>
      </div>
      <div class="priority-indicator" :class="`priority-${task.priority}`"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'drag-start'])

const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
  emit('drag-start', props.task)
}

const handleDragEnd = () => {
  isDragging.value = false
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

const getDueDateClass = () => {
  const today = new Date()
  const due = new Date(props.task.dueDate)
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'urgent'
  return ''
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.task-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.delete-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.delete-btn:hover {
  color: #ef4444;
}

.task-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.task-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignee {
  background: #4f46e5;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.due-date {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.due-date.urgent {
  color: #f59e0b;
}

.due-date.overdue {
  color: #ef4444;
}

.priority-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-high {
  background: #ef4444;
}

.priority-medium {
  background: #f59e0b;
}

.priority-low {
  background: #10b981;
}
</style>
