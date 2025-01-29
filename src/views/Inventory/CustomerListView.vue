<script setup lang="ts">
import { ref,onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import router from '@/router'
import apiClient from '@/services/ApiService'
import { toast } from 'vue3-toastify'
import ModalView from '@/components/ModalView.vue'
import Input from '@/components/Input/InputView.vue'
import SpinnerView from '@/components/SpinnerView.vue'





const pageTitle = ref('Customer List')
const customers = ref<any[]>([]);
const isLoading = ref(false);
const entityId = localStorage.getItem('userId');
const modalActive = ref(false)

const editModalActive = ref(false)

const isDeletingItem = ref(false)

const editName = ref(null)
const editEmail=ref(null)
const editPhoneNumber=ref(null)
const editAddress=ref(null)
const editData = ref(null)
const addModalActive = ref(false)
const error = ref({ type: '', message: '' })




async function fetchCustomers() {
  try {
    isLoading.value = true;
    const response = await apiClient.get(`/inventory/customers/list/${entityId}/`);
    console.log("newData",response)
    customers.value = response.data.customer;
    isLoading.value = false;
  } catch (error: any) {
    isLoading.value = false;
    toast.error(error.response?.data?.message || 'Failed to fetch customers');
  }
}
 
const editSubmit = async () => {
  error.value.type = ''
  error.value.message = ''
  if (!editName.value) {
    error.value = {
      type: 'edit',
      message: 'your filled is required'
    }
    return
  }

  if (!editEmail.value) {
    error.value = {
      type: 'editEamil',
      message: 'your filled is required'
    }
    return
  }
  if (!editPhoneNumber.value) {
    error.value = {
      type: 'editPhoneNumber',
      message: 'your filled is required'
    }
    return
  }
  if (!editAddress.value) {
    error.value = {
      type: 'editAddress',
      message: 'your filled is required'
    }
    return
  }

  try {
    isLoading.value = true
    const newData = {
        name: editName.value,
      email: editEmail.value,
      phone_number: editPhoneNumber.value,
      address: editAddress.value,
      category_id: 1,
      entity_id: entityId,
    }
    const response = await apiClient.put(
      `/inventory/customers/03dd2258-e5dc-4444-8399-b5ce95510761/`,
      newData
    )
    console.log('newData', response)
    isLoading.value = false
    toast.success('Customer edited successfully')
    fetchCustomers()
    addModalActive.value = false
  } catch (error: any) {
    isLoading.value = false
    isLoading.value = false
    toast.error(`${error.response.data.message}`)
    console.log(error, 'hhhhh')
  }
}

const handleDelete = async () => {
  try {
    

    isLoading.value = true

    await apiClient.delete(`/inventory/customers/2b9b6e9d-1b95-412c-9103-ce92dd4334d9/`)

    toast.success('Customer deleted successfully')

    // Refresh category list
    fetchCustomers()

    // Close modal
    modalActive.value = false
  } catch (error: any) {
    isLoading.value = false
    toast.error(error.response?.data?.message || 'Failed to delete category')
    console.error(error)
  }
}


const toggleModal = (category: any) => {
  editData.value = category // Set category data before deletion
  modalActive.value = !modalActive.value
}

const toggleEditModal = (params: any) => {
  editData.value = params
  editName.value = params.name
  editEmail.value= params.email
  editPhoneNumber.value= params.number
  editAddress.value= params.address
  editModalActive.value = !editModalActive.value
}
// const toggleAddModal = () => {
//   addModalActive.value = !addModalActive.value
// }

onMounted(() => {
  fetchCustomers();
});

const route = () => {
  router.push('/dashboard/customer')
}
</script>

<template>
    <div>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <button @click="route" class="flex items-center font-bold hover:text-primary">
        <h1 class="text-3xl">+</h1>
        <h1>Customer</h1>
      </button>
    </div>
    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th class="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th class="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th class="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                    Phone Number
                  </th>
                <th class="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">Address</th>
                <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(customer, index) in customers" :key="index">
              <td class="py-5 px-4">
                <h5 class="font-medium text-black dark:text-white">{{ customer.name }}</h5>
              </td>
              <td class="py-5 px-4">
                <p class="text-sm">{{ customer.email }}</p>
              </td>
              <td class="py-5 px-4">
                <p class="text-black dark:text-white">{{ customer.phone_number }}</p>
              </td>
              <td class="py-5 px-4">
                <p class="text-black dark:text-white">{{ customer.address }}</p>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center space-x-3.5">
                  <button @click="toggleEditModal({ name: customer.name, email: customer.email ,number: customer.phone_number,address: customer.address  })" class="hover:text-primary">edit</button>
                  <button @click="toggleModal()" class="hover:text-primary">delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>

  <ModalView @close="toggleModal" :modalActive="modalActive">
    <template #title> Confirmation Dialog</template>

    <div class="">
      <h5 class="modal_text">Are you sure you want to delete this project?</h5>

      <div class="flex items-center justify-between">
        <button
          class="btn btn-sm btn-secondary text-lg font-bold hover:text-primary"
          @click="toggleModal"
        >
          Cancel
        </button>

        <button
          class="btn btn-sm btn-danger font-bold text-lg hover:text-primary"
          @click="handleDelete"
          :disabled="isDeletingItem"
        >
          <span class="sm-loader" v-if="isDeletingItem"></span>
          <div v-else>Delete</div>
        </button>
      </div>
    </div>
  </ModalView>

  <ModalView @close="toggleModal" :modalActive="modalActive">
    <template #title> Confirmation Dialog</template>

    <div class="">
      <h5 class="modal_text">Are you sure you want to delete this project?</h5>

      <div class="flex items-center justify-between">
        <button
          class="btn btn-sm btn-secondary text-lg font-bold hover:text-primary"
          @click="toggleModal"
        >
          Cancel
        </button>

        <button
          class="btn btn-sm btn-danger font-bold text-lg hover:text-primary"
          @click="handleDelete"
          :disabled="isDeletingItem"
        >
          <span class="sm-loader" v-if="isDeletingItem"></span>
          <div v-else>Delete</div>
        </button>
      </div>
    </div>
  </ModalView>

  <ModalView @close="toggleEditModal" :modalActive="editModalActive">
    <template #title> Confirmation Dialog</template>

    <div class="">
      <form
        @submit.prevent="editSubmit"
        class="flex justify-center items-center flex-col h-full p-5"
      >
        <Input
          class="w-[60%]"
          v-model:input="editName"
          inputType="editName"
          :error="error && error?.type == 'editName' ? error.message : ''"
          type="editName"
          label="Edit name"
          placeholder=" edit name"
        />
        <Input
          class="w-[60%]"
          v-model:input="editEmail"
          inputType="editEmail"
          :error="error && error?.type == 'editEmail' ? error.message : ''"
          type="editEmail"
          label="Edit Email"
          placeholder=" edit Email"
        />
        <Input
        class="w-[60%]"
        v-model:input="editPhoneNumber"
        inputType="editPhoneNumber"
        :error="error && error?.type == 'editPhoneNumber' ? error.message : ''"
        type="editPhoneNumber"
        label="Edit Phone Number"
        placeholder=" edit Phone Number"
      />
      <Input
          class="w-[60%]"
          v-model:input="editAddress"
          inputType="editAddress"
          :error="error && error?.type == 'editAddress' ? error.message : ''"
          type="editAddress"
          label="Edit Address"
          placeholder=" edit Address"
        />

        <button
          :disabled="isLoading"
          class="w-[40%] cursor-pointer mt-6 rounded-lg border border-primary bg-primary p-2 font-medium text-white transition hover:bg-opacity-90"
        >
          <div v-if="isLoading" class="flex pr-9 items-center justify-center">
            <SpinnerView />
          </div>
          <span v-else> Edit </span>
        </button>
      </form>

      <div class="flex items-center justify-center">
        <button
          class="btn btn-sm btn-secondary text-lg font-bold hover:text-primary"
          @click="toggleEditModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </ModalView>

    </div>
</template>
