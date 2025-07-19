<template>
  <div class="team-view">
    <AppHeader />
    <div class="team-header">
      <div class="header-content">
        <h1>Team Management</h1>
        <p>Manage your project team members and permissions</p>
      </div>
      <div class="header-actions">
        <button @click="showInviteModal = true" class="btn btn-primary">
          + Invite Member
        </button>
        <button @click="exportTeamData" class="btn btn-secondary">
          📊 Export Data
        </button>
      </div>
    </div>

    <!-- Team Stats -->
    <div class="team-stats">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ teamMembers.length }}</h3>
          <p>Total Members</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ activeMembers }}</h3>
          <p>Active Members</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>{{ totalTasks }}</h3>
          <p>Assigned Tasks</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <h3>{{ avgPerformance }}%</h3>
          <p>Avg Performance</p>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="team-controls">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search team members..."
          class="search-input"
        />
      </div>
      <div class="filter-buttons">
        <button 
          @click="filterByRole('')"
          class="filter-btn"
          :class="{ active: selectedRole === '' }"
        >
          All
        </button>
        <button 
          v-for="role in uniqueRoles" 
          :key="role"
          @click="filterByRole(role)"
          class="filter-btn"
          :class="{ active: selectedRole === role }"
        >
          {{ role }}
        </button>
      </div>
    </div>

    <!-- Team Members Grid -->
    <div class="team-grid">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id"
        class="team-member-card"
        :class="{ 'offline': !member.isActive }"
      >
        <div class="member-header">
          <div class="member-avatar">
            <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
            <span v-else class="avatar-initials">{{ getInitials(member.name) }}</span>
            <div class="status-indicator" :class="member.isActive ? 'online' : 'offline'"></div>
          </div>
          <div class="member-actions">
            <button @click="editMember(member)" class="action-btn">✏️</button>
            <button @click="removeMember(member)" class="action-btn danger">🗑️</button>
          </div>
        </div>

        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <p class="member-email">{{ member.email }}</p>
        </div>

        <div class="member-stats">
          <div class="stat-item">
            <span class="stat-label">Tasks:</span>
            <span class="stat-value">{{ member.assignedTasks || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed:</span>
            <span class="stat-value">{{ member.completedTasks || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Performance:</span>
            <span class="stat-value">{{ member.performance || 0 }}%</span>
          </div>
        </div>

        <div class="member-skills">
          <span 
            v-for="skill in member.skills?.slice(0, 3)" 
            :key="skill"
            class="skill-tag"
          >
            {{ skill }}
          </span>
          <span v-if="member.skills?.length > 3" class="skill-more">
            +{{ member.skills.length - 3 }}
          </span>
        </div>

        <div class="member-footer">
          <span class="join-date">Joined {{ formatDate(member.joinDate) }}</span>
          <span class="last-active">Last active {{ formatDate(member.lastActive) }}</span>
        </div>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <InviteMemberModal 
      v-if="showInviteModal"
      @close="showInviteModal = false"
      @invite="handleInvite"
    />

    <!-- Edit Member Modal -->
    <EditMemberModal 
      v-if="showEditModal"
      :member="selectedMember"
      @close="showEditModal = false"
      @save="handleUpdateMember"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import AppHeader from '@/components/AppHeader.vue'
import InviteMemberModal from '@/components/team/InviteMemberModal.vue'
import EditMemberModal from '@/components/team/EditMemberModal.vue'

const teamStore = useTeamStore()

const showInviteModal = ref(false)
const showEditModal = ref(false)
const selectedMember = ref(null)
const searchQuery = ref('')
const selectedRole = ref('')

const teamMembers = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Project Manager',
    avatar: '',
    isActive: true,
    assignedTasks: 12,
    completedTasks: 8,
    performance: 87,
    skills: ['Project Management', 'Agile', 'Leadership'],
    joinDate: '2024-01-15',
    lastActive: '2025-07-19'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@example.com',
    role: 'Frontend Developer',
    avatar: '',
    isActive: true,
    assignedTasks: 8,
    completedTasks: 6,
    performance: 92,
    skills: ['Vue.js', 'React', 'TypeScript', 'CSS'],
    joinDate: '2024-02-20',
    lastActive: '2025-07-19'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'UI/UX Designer',
    avatar: '',
    isActive: false,
    assignedTasks: 5,
    completedTasks: 4,
    performance: 95,
    skills: ['Figma', 'Adobe XD', 'User Research'],
    joinDate: '2024-03-10',
    lastActive: '2025-07-18'
  },
  {
    id: 4,
    name: 'David Park',
    email: 'david@example.com',
    role: 'Backend Developer',
    avatar: '',
    isActive: true,
    assignedTasks: 10,
    completedTasks: 7,
    performance: 88,
    skills: ['Node.js', 'Python', 'Database Design'],
    joinDate: '2024-04-05',
    lastActive: '2025-07-19'
  }
])

const filteredMembers = computed(() => {
  let filtered = teamMembers.value
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filter by role
  if (selectedRole.value) {
    filtered = filtered.filter(member => member.role === selectedRole.value)
  }
  
  return filtered
})

const activeMembers = computed(() => 
  teamMembers.value.filter(member => member.isActive).length
)

const totalTasks = computed(() => 
  teamMembers.value.reduce((sum, member) => sum + (member.assignedTasks || 0), 0)
)

const avgPerformance = computed(() => {
  const total = teamMembers.value.reduce((sum, member) => sum + (member.performance || 0), 0)
  return Math.round(total / teamMembers.value.length)
})

const uniqueRoles = computed(() => {
  const roles = teamMembers.value.map(member => member.role)
  return [...new Set(roles)]
})

const filterByRole = (role) => {
  selectedRole.value = role
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editMember = (member) => {
  selectedMember.value = { ...member }
  showEditModal.value = true
}

const removeMember = (member) => {
  if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== member.id)
    teamStore.removeMember(member.id)
  }
}

const handleInvite = (memberData) => {
  const newMember = {
    id: Date.now(),
    ...memberData,
    isActive: true,
    assignedTasks: 0,
    completedTasks: 0,
    performance: 0,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString()
  }
  teamMembers.value.push(newMember)
  teamStore.inviteMember(newMember)
  showInviteModal.value = false
}

const handleUpdateMember = (updatedMember) => {
  const index = teamMembers.value.findIndex(m => m.id === updatedMember.id)
  if (index !== -1) {
    teamMembers.value[index] = updatedMember
    teamStore.updateMember(updatedMember)
  }
  showEditModal.value = false
}

const exportTeamData = () => {
  const csvContent = teamMembers.value.map(member => 
    `${member.name},${member.email},${member.role},${member.assignedTasks},${member.completedTasks},${member.performance}%`
  ).join('\n')
  
  const blob = new Blob([`Name,Email,Role,Assigned Tasks,Completed Tasks,Performance\n${csvContent}`], 
    { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'team-data.csv'
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  teamStore.fetchMembers()
})
</script>

<style scoped>
.team-view {
  margin: 0;
  padding: 0;
  background: #f8fafc;
  min-height: 100vh;
  width: 100%;
}

.team-header {
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
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.team-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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
  border-color: #4f46e5;
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
  font-size: 0.875rem;
}

.filter-btn:hover, .filter-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.team-member-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.team-member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #4f46e5;
}

.team-member-card.offline {
  opacity: 0.7;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.member-avatar {
  position: relative;
  width: 60px;
  height: 60px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-initials {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #10b981;
}

.status-indicator.offline {
  background: #6b7280;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.member-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.member-role {
  color: #4f46e5;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.member-email {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.member-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skill-more {
  background: #d1d5db;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.member-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .team-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .team-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
