import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import TablesView from '@/views/TablesView.vue'
import CategoryView from '@/views/Inventory/CategoryView.vue'
import CustomerView from '@/views/Inventory/CustomerView.vue'
import CustomerListView from '@/views/Inventory/CustomerListView.vue'

const routes = [
  {
    path: '/dashboard/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables'
    }
  },
  {
    path: '/dashboard/category',
    name: 'category',
    component: CategoryView,
    meta: {
      title: 'Category'
    }
  },
  {
    path: '/dashboard/customer',
    name: 'customer',
    component: CustomerView,
    meta: {
      title: 'Customer'
    }
  },
  {
    path: '/dashboard/customerlist',
    name: 'customerlist',
    component: CustomerListView,
    meta: {
      title: 'CustomerList'
    }
  },
  {
    path: '/',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Promise Project`
  next()
})

export default router
