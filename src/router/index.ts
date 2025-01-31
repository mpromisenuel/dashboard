import { createRouter, createWebHistory } from 'vue-router'
import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CategoryView from '@/views/Inventory/CategoryView.vue'
import CustomerView from '@/views/Inventory/CustomerView.vue'
import CustomerListView from '@/views/Inventory/CustomerListView.vue'

// Define your routes
const routes = [
  {
    path: '/',
    name: 'signin',
    component: SigninView,
    meta: { title: 'Signin', requiresAuth: false } // Public Route
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: { title: 'Signup', requiresAuth: false } // Public Route
  },
  
  {
    path: '/dashboard/category',
    name: 'category',
    component: CategoryView,
    meta: { title: 'Category', requiresAuth: true } // Protected Route
  },
  {
    path: '/dashboard/customer',
    name: 'customer',
    component: CustomerView,
    meta: { title: 'Customer', requiresAuth: true } // Protected Route
  },
  {
    path: '/dashboard/customerlist',
    name: 'customerlist',
    component: CustomerListView,
    meta: { title: 'Customer List', requiresAuth: true } // Protected Route
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

// Navigation Guard to protect routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('app_accessToken') // Check if user is logged in
  const userId= !!localStorage.getItem('userId')
  document.title = `${to.meta.title} | Promise Project`

  if (to.meta.requiresAuth && !isAuthenticated && userId) {
    // Redirect to sign-in if the route requires authentication and the user is not authenticated
    next({ name: '/' })
  } else {
    next() // Allow navigation
  }
})

export default router
