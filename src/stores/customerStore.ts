import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/ApiService'
import { toast } from 'vue3-toastify'
import router from '@/router'



export const useCustomerStore = defineStore('customer', () => {
    const isLoading=ref(false)
    const customers = ref<null>(null)
    const entityCustomerId = localStorage.getItem('userId')
    const customersList = ref<any[]>([])
    const entityCustomerListId = localStorage.getItem('userId')
    const editCustomerModalActive = ref(false)
    // const editModalActive = ref(false)


    async function fetchAllCustomer() {
        try {
          isLoading.value = true
          const response = await apiClient.get(`/inventory/customers/list/${entityCustomerId}/`)
          customers.value = response.data.customers // Update customers list
          isLoading.value = false
        } catch (error: any) {
          isLoading.value = false
          toast.error(`${error.response.data.message}`)
          
        }
      }

const handleCustomerSubmit = async (newCustomerData:any) => {
    try {
      isLoading.value = true
      await apiClient.post('/inventory/customers/add/', newCustomerData)
      toast.success('Customer added successfully')
  
      // Refresh the customer list
      await fetchAllCustomer()
  
      // Navigate to customer list
      await router.push('/dashboard/customerlist')
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to add customer')
    }
  }

  async function fetchCustomersList() {
    try {
      isLoading.value = true
      const response = await apiClient.get(`/inventory/customers/list/${entityCustomerListId}/`)
      customersList.value = response.data.customer
      isLoading.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to fetch customers')
    }
  }
  
  const HandleEditCustomerSubmit = async ({name , email, phone_number,category_id, address}:any) => {
    try {
      isLoading.value = true
      await apiClient.put(`/inventory/customers/${category_id}/`, {name, email, phone_number, address})
      toast.success('Customer edited successfully')
      await fetchCustomersList()
      editCustomerModalActive.value = false
    } catch (error: any) {
      isLoading.value = false
      toast.error(error.response?.data?.message || 'Failed to add category')
    }
  }
return{fetchAllCustomer,fetchCustomersList,handleCustomerSubmit,HandleEditCustomerSubmit,editCustomerModalActive,isLoading,customersList}
})