import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/ApiService'
import { toast } from 'vue3-toastify'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const entityCategoryId = localStorage.getItem('userId')
  const addModalActive = ref(false)
  const editData = ref<null>(null)
  const allCategories = ref<any[]>([])
  






  const handleSignInSubmit = async (newDataSignIn: any) => {
    try {
      isLoading.value = true
      const response = await apiClient.post('/individual/signin', newDataSignIn)
      localStorage.setItem('app_accessToken', response.data.token)
      localStorage.setItem('userId', response.data.entities[0].entity.id)
      isLoading.value = false
      toast.success('Login successfully')
      await router.push('/dashboard/category')
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const handleSignUpSubmit = async (newDataSignOut: any) => {
    try {
      isLoading.value = true
      const response = await apiClient.post('/entity/signup', newDataSignOut)
      localStorage.setItem('app_accessToken', response.data.token)
      localStorage.setItem('userId', response.data.entities[0].entity.id)
      isLoading.value = false
      toast.success('Account created successfully')
      await router.push('/dashboard/category')
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Signup failed')
    }
  }

  return {
    handleSignInSubmit,
    handleSignUpSubmit,
    allCategories,
    editData,
    isLoading,
    addModalActive,
    entityCategoryId
  }
})
