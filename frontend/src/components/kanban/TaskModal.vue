<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ task?.id ? 'Edit Task' : 'Create Task' }}</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="task-form">
        <div class="form-group">
          <label>Title</label>
          <input 
            v-model="formData.title" 
            type="text" 
            required 
            class="form-input"
            placeholder="Enter task title"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            v-model="formData.description" 
            class="form-textarea"
            rows="3"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Column</label>
            <select v-model="formData.columnId" class="form-select">
              <option v-for="column in columns" :key="column.id" :value="column.id">
                {{ column.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Priority</label>
            <select v-model="formData.priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Assignee</label>
            <input 
              v-model="formData.assignee" 
              type="text" 
              class="form-input"
              placeholder="Assign to someone"
            />
          </div>

          <div class="form-group">
            <label>Due Date</label>
            <input 
              v-model="formData.dueDate" 
              type="date" 
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Tags</label>
          <input 
            v-model="tagsInput" 
            type="text" 
            class="form-input"
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ task?.id ? 'Update' : 'Create' }} Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  task: Object,
  columns: Array
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  title: '',
  description: '',
  columnId: null,
  priority: 'medium',
  assignee: '',
  dueDate: '',
  tags: []
})

const tagsInput = ref('')

// Initialize form data
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      ...newTask,
      columnId: newTask.columnId || props.columns[0]?.id
    }
    tagsInput.value = newTask.tags?.join(', ') || ''
  } else {
    formData.value = {
      title: '',
      description: '',
      columnId: props.columns[0]?.id,
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: []
    }
    tagsInput.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  const taskData = {
    ...formData.value,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
  }
  
  emit('save', taskData)
}
</script>

<style scoped>
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
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
  color: #6b7280;
  cursor: pointer;
}

.task-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
