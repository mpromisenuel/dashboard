
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/ApiService'
import { toast } from 'vue3-toastify'
import router from '@/router'

export const useCategoryStore = defineStore('category', () => {

    const isLoading = ref(false)
    const entityCategoryId = localStorage.getItem('userId')
    const addModalActive = ref(false)
    // const editData = ref<null>(null)
    const editModalActive=ref(false)
    const allCategories = ref<any[]>([])
    const modalActive = ref(false)



const fetchAllCategory = async () => {
    try {
      isLoading.value = true
      const response = await apiClient.get(`/inventory/category/list/${entityCategoryId}/`)
      allCategories.value = response.data.categories
      isLoading.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to fetch categories')
    }
  }

  const handleAddCategorySubmit = async (newDataCategory: any) => {
    try {
      isLoading.value = true
      await apiClient.post('/inventory/category/add/', newDataCategory)
      await fetchAllCategory()
      toast.success('Category added successfully')
      addModalActive.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to add category')
    }
  }
  const handleDeleteCategory = async (deleteId:any) => {
    try {
      isLoading.value = true
  
      await apiClient.delete(`/inventory/category/${deleteId}/delete/`)
  
      toast.success('Category deleted successfully')
  
      // Refresh category list
      fetchAllCategory()
  
      // Close modal
      modalActive.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to delete category')
      console.error(error)
    }
  }

  const handleEditCategorySubmit = async ({category_name, category_id}:any) => {
    try {
      isLoading.value = true
        await apiClient.put(`/inventory/category/${category_id}/update/`, {category_name})
        toast.success('Category edited successfully')
        await fetchAllCategory()
        editModalActive.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to update category')
    }
  }
  return {fetchAllCategory,handleAddCategorySubmit,handleDeleteCategory,handleEditCategorySubmit,isLoading,modalActive, allCategories, editModalActive, addModalActive}
})