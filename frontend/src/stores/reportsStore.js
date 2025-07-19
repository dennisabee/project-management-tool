import { defineStore } from 'pinia'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    metrics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      teamProductivity: 0
    },
    projectProgress: [],
    teamPerformance: [],
    taskStatusData: [],
    loading: false,
    error: null
  }),

  getters: {
    completionRate: (state) => {
      if (state.metrics.totalTasks === 0) return 0
      return Math.round((state.metrics.completedTasks / state.metrics.totalTasks) * 100)
    },
    
    averageProjectProgress: (state) => {
      if (state.projectProgress.length === 0) return 0
      const total = state.projectProgress.reduce((sum, project) => sum + project.progress, 0)
      return Math.round(total / state.projectProgress.length)
    }
  },

  actions: {
    async fetchMetrics(period = 30) {
      this.loading = true
      try {
        // Replace with actual API call
        this.metrics = {
          totalTasks: 147,
          completedTasks: 98,
          inProgressTasks: 31,
          teamProductivity: 87
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchProjectProgress() {
      try {
        this.projectProgress = [
          {
            id: 1,
            name: 'Website Redesign',
            progress: 75,
            dueDate: '2025-08-15',
            teamSize: 5
          },
          {
            id: 2,
            name: 'Mobile App',
            progress: 45,
            dueDate: '2025-09-30',
            teamSize: 8
          }
        ]
      } catch (error) {
        this.error = error.message
      }
    },

    async fetchTeamPerformance() {
      try {
        this.teamPerformance = [
          {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Project Manager',
            tasksAssigned: 25,
            tasksCompleted: 22,
            completionRate: 88,
            performance: 'Excellent'
          }
        ]
      } catch (error) {
        this.error = error.message
      }
    },

    async exportReport(reportData) {
      try {
        // Generate report export
        const blob = new Blob([JSON.stringify(reportData, null, 2)], 
          { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        
        URL.revokeObjectURL(url)
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
