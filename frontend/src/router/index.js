import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import KanbanView from '../views/KanbanView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import TeamView from '../views/TeamView.vue'
import ReportsView from '../views/ReportsView.vue'
import LoginPage from '../components/LoginPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/kanban/:projectId?',
    name: 'Kanban',
    component: KanbanView,
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
