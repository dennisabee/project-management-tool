import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    tasks: [],
    columns: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getTasksByColumn: (state) => (columnId) => {
      return state.tasks.filter(task => task.columnId === columnId)
    },
    
    getTasksByProject: (state) => (projectId) => {
      return state.tasks.filter(task => task.projectId === projectId)
    },
    
    getProjectById: (state) => (id) => {
      return state.projects.find(project => project.id === id)
    }
  },

  actions: {
    async fetchProjects() {
      this.isLoading = true
      try {
        // Replace with actual API call
        this.projects = [
          {
            id: 1,
            name: 'Web Application Redesign',
            description: 'Complete overhaul of the company website',
            createdAt: '2025-07-15',
            members: []
          }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    async createProject(projectData) {
      try {
        // Replace with actual API call
        const newProject = {
          id: Date.now(),
          ...projectData,
          createdAt: new Date().toISOString()
        }
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateTask(task) {
      try {
        // Replace with actual API call
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = task
        }
      } catch (error) {
        this.error = error.message
      }
    },

    async saveTask(taskData) {
      try {
        // Replace with actual API call
        if (taskData.id) {
          await this.updateTask(taskData)
        } else {
          const newTask = {
            ...taskData,
            id: Date.now(),
            createdAt: new Date().toISOString()
          }
          this.tasks.push(newTask)
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async deleteTask(taskId) {
      try {
        // Replace with actual API call
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } catch (error) {
        this.error = error.message
      }
    },

    setCurrentProject(project) {
      this.currentProject = project
    },

    clearError() {
      this.error = null
    }
  }
})
