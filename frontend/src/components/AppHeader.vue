<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="app-logo" @click="navigateHome">ProjectFlow</h1>
        <nav class="main-nav">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/projects" class="nav-link">Projects</router-link>
          <router-link to="/kanban" class="nav-link">Kanban</router-link>
          <router-link to="/team" class="nav-link">Team</router-link>
          <router-link to="/reports" class="nav-link">Reports</router-link>
        </nav>
      </div>
      
      <div class="header-right">
        <div class="user-menu" @click="toggleUserMenu">
          <div class="user-avatar">U</div>
          <span class="user-name">User</span>
          <div v-if="showUserMenu" class="user-dropdown">
            <a href="#" class="dropdown-item">Profile</a>
            <a href="#" class="dropdown-item">Settings</a>
            <hr class="dropdown-divider">
            <a href="#" @click="logout" class="dropdown-item">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)

const navigateHome = () => {
  router.push('/dashboard')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  margin: 0;
  padding: 0;
  width: 100vw;
}

.header-content {
  max-width: none;
  margin: 0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  color: white;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-divider {
  margin: 0;
  border: none;
  height: 1px;
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .header-left {
    gap: 1rem;
  }
  
  .main-nav {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>
