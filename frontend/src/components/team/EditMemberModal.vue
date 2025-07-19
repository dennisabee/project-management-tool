<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Team Member</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <form @submit.prevent="handleSave" class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label>First Name *</label>
            <input 
              v-model="editedMember.firstName"
              type="text"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Last Name *</label>
            <input 
              v-model="editedMember.lastName"
              type="text"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input 
            v-model="editedMember.email"
            type="email"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Role *</label>
          <select v-model="editedMember.role" required class="form-input">
            <option value="Project Manager">Project Manager</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  member: Object
})

const emit = defineEmits(['close', 'save'])

const editedMember = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
})

watch(() => props.member, (newMember) => {
  if (newMember) {
    const [firstName, ...lastNameParts] = newMember.name.split(' ')
    editedMember.value = {
      ...newMember,
      firstName,
      lastName: lastNameParts.join(' ')
    }
  }
}, { immediate: true })

const handleSave = () => {
  const updatedMember = {
    ...editedMember.value,
    name: `${editedMember.value.firstName} ${editedMember.value.lastName}`
  }
  emit('save', updatedMember)
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
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

.edit-form {
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
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}
</style>
