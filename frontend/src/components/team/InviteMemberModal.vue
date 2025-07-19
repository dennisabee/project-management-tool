<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Invite Team Member</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <form @submit.prevent="handleInvite" class="invite-form">
        <div class="form-group">
          <label>Email Address *</label>
          <input 
            v-model="memberData.email"
            type="email"
            placeholder="member@example.com"
            required
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>First Name *</label>
            <input 
              v-model="memberData.firstName"
              type="text"
              placeholder="John"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Last Name *</label>
            <input 
              v-model="memberData.lastName"
              type="text"
              placeholder="Doe"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Role *</label>
          <select v-model="memberData.role" required class="form-input">
            <option value="">Select Role</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="QA Engineer">QA Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        <div class="form-group">
          <label>Skills</label>
          <div class="skills-input">
            <input 
              v-model="newSkill"
              type="text"
              placeholder="Add a skill..."
              class="form-input"
              @keyup.enter="addSkill"
            />
            <button type="button" @click="addSkill" class="add-skill-btn">Add</button>
          </div>
          <div v-if="memberData.skills?.length" class="skills-list">
            <span 
              v-for="(skill, index) in memberData.skills"
              :key="index"
              class="skill-tag"
            >
              {{ skill }}
              <button @click="removeSkill(index)" class="remove-skill">×</button>
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Send Invitation
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'invite'])

const memberData = ref({
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  skills: []
})

const newSkill = ref('')

const addSkill = () => {
  if (newSkill.value.trim() && !memberData.value.skills.includes(newSkill.value.trim())) {
    memberData.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  memberData.value.skills.splice(index, 1)
}

const handleInvite = () => {
  const inviteData = {
    ...memberData.value,
    name: `${memberData.value.firstName} ${memberData.value.lastName}`
  }
  emit('invite', inviteData)
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
  cursor: pointer;
  color: #6b7280;
}

.invite-form {
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

.skills-input {
  display: flex;
  gap: 0.5rem;
}

.add-skill-btn {
  padding: 0.75rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-skill {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
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
