import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', {
  state: () => ({
    members: [],
    invitations: [],
    roles: [
      'Project Manager',
      'Frontend Developer',
      'Backend Developer',
      'UI/UX Designer',
      'QA Engineer',
      'DevOps Engineer'
    ],
    loading: false,
    error: null
  }),

  getters: {
    activeMembers: (state) => state.members.filter(member => member.isActive),
    membersByRole: (state) => (role) => state.members.filter(member => member.role === role),
    totalMembers: (state) => state.members.length
  },

  actions: {
    async fetchMembers() {
      this.loading = true
      try {
        // Replace with actual API call
        this.members = [
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'Project Manager',
            isActive: true,
            joinDate: '2024-01-15'
          }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async inviteMember(memberData) {
      try {
        // API call to invite member
        const newMember = {
          id: Date.now(),
          ...memberData,
          isActive: true,
          joinDate: new Date().toISOString()
        }
        this.members.push(newMember)
        return newMember
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateMember(memberData) {
      try {
        const index = this.members.findIndex(m => m.id === memberData.id)
        if (index !== -1) {
          this.members[index] = memberData
        }
      } catch (error) {
        this.error = error.message
      }
    },

    async removeMember(memberId) {
      try {
        this.members = this.members.filter(m => m.id !== memberId)
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
