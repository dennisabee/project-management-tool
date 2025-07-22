import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userInitials: (state) => {
      if (!state.user?.name) return 'U'
      return state.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        // Replace with actual API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (response.ok) {
          const userData = await response.json()
          this.user = userData.user
          this.isAuthenticated = true
          
          // Store token if provided
          if (userData.token) {
            localStorage.setItem('authToken', userData.token)
          }
          
          return { success: true }
        } else {
          const errorData = await response.json()
          this.error = errorData.message || 'Login failed'
          return { success: false, error: this.error }
        }
      } catch (error) {
        // For demo purposes, simulate login
        if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
          this.user = {
            id: 1,
            name: 'Joseph',
            email: 'demo@example.com',
            role: 'Project Manager',
            avatar: ''
          }
          this.isAuthenticated = true
          return { success: true }
        }
        
        this.error = 'Invalid credentials'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        // Call logout API if needed
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Logout error:', error)
      }
      
      this.user = null
      this.isAuthenticated = false
      this.error = null
      localStorage.removeItem('authToken')
    },

    async checkAuth() {
      const token = localStorage.getItem('authToken')
      if (!token) return false

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          this.user = userData
          this.isAuthenticated = true
          return true
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }

      // For demo, simulate logged in state
      this.user = {
        id: 1,
        name: 'Will Bettleheim',
        email: 'demo@example.com',
        role: 'Project Manager'
      }
      this.isAuthenticated = true
      return true
    },

    clearError() {
      this.error = null
    }
  }
})
