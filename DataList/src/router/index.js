import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DataTableView from '../views/DataTableView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/table', name: 'table', component: DataTableView , meta:{roles:['ROLE_USER','ROLE_ADMIN']}},
  { path: '/dashboard', name: 'dashboard', component: DashboardView , meta:{roles:'ROLE_USER'} } ,

  { 
    path: '/403', 
    component: () => import('@/views/NoAccess.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
   const authStore = useAuthStore()
   const rolesPermitidos = to.meta.roles

   if (!rolesPermitidos) return next()
    
   if (!authStore.token) return next('/login')
    
   const tieneAcceso = authStore.roles.some(rol => rolesPermitidos.includes(rol))

   tieneAcceso ? next() : next('/403') 

});

export default router
