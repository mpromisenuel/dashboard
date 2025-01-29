<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { RiEditFill } from 'oh-vue-icons/icons'
import ModalView from '@/components/ModalView.vue'
import { OhVueIcon } from 'oh-vue-icons'
import Input from '@/components/Input/InputView.vue'
import SpinnerView from '@/components/SpinnerView.vue'
import { toast } from 'vue3-toastify'
import apiClient from '@/services/ApiService'
import router from '@/router'
const deleteId = ref("")
const modalActive = ref(false)

const editModalActive = ref(false)

const isDeletingItem = ref(false)

const isLoading = ref(false)

const addModalActive = ref(false)

const edit = ref(null)
const editData = ref(null)

const addNewCat = ref(null)

const error = ref({ type: '', message: '' })

const entityId = localStorage.getItem('userId')

const allCategories = ref(null)

const pageTitle = ref('Category')

async function fetchAllCategory() {
  try {
    isLoading.value = true
    const response = await apiClient.get(`/inventory/category/list/${entityId}/`)
    console.log('newData', response)
    allCategories.value = response.data.categories
    isLoading.value = false
  } catch (error: any) {
    isLoading.value = false
    toast.error(`${error.response.data.message}`)
    console.log(error, 'hhhhh')
  }
}

const handleAddSubmit = async () => {
  error.value.type = ''
  error.value.message = ''

  if (!addNewCat.value) {
    error.value = {
      type: 'addNewCat',
      message: 'you have not added any category'
    }
    return
  }
  try {
    isLoading.value = true
    const newData = {
      category_name: addNewCat.value,
      entity_id: entityId
    }
    const response = await apiClient.post('/inventory/category/add/', newData)
    console.log('newData', response)
    isLoading.value = false
    fetchAllCategory()
    toast.success('Category added successfully')
    addModalActive.value = false
  } catch (error: any) {
    isLoading.value = false
    isLoading.value = false
    toast.error(`${error.response.data.message}`)
    console.log(error, 'hhhhh')
  }
}

const editSubmit = async () => {
  error.value.type = ''
  error.value.message = ''
  if (!edit.value) {
    error.value = {
      type: 'edit',
      message: 'your filled is required'
    }
    return
  }

  try {
    isLoading.value = true
    const newData = {
      category_name: edit.value
    }
    const response = await apiClient.put(
      `/inventory/category/${editData.value.id}/update/`,
      newData
    )
    console.log('newData', response)
    isLoading.value = false
    toast.success('Category edited successfully')
    fetchAllCategory()
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

    await apiClient.delete(`/inventory/category/${deleteId.value}/delete/`)

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



const toggleModal = (id: any) => {
  deleteId.value = id // Set category data before deletion
  modalActive.value = !modalActive.value
}

const toggleEditModal = (params: any) => {
  editData.value = params
  edit.value = params.name
  editModalActive.value = !editModalActive.value
}
const toggleAddModal = () => {
  addModalActive.value = !addModalActive.value
}

onMounted(() => {
  fetchAllCategory()
})
</script>

<template>
  <div>
    <DefaultLayout>
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <div class="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <button @click="toggleAddModal" class="flex items-center font-bold hover:text-primary">
          <h1 class="text-3xl">+</h1>
          <h1>Category</h1>
        </button>
      </div>
      <div>
        <div
          class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        >
          <div class="max-w-full overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-2 text-left dark:bg-meta-4">
                  <th
                    class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
                  >
                    Category Name
                  </th>
                  <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(category, index) in allCategories" :key="index">
                  <td class="py-5 px-4 pl-9 xl:pl-11">
                    <h5 class="font-medium text-black dark:text-white">
                      {{ category.category_name }}
                    </h5>
                  </td>

                  <td class="py-5 px-4">
                    <div class="flex items-center space-x-3.5">
                      <button
                        @click="toggleEditModal({ name: category.category_name, id: category.id })"
                        class="hover:text-primary"
                      >
                        edit
                      </button>

                      <button @click="toggleModal(category.id)" class="hover:text-primary">
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

    <ModalView @close="toggleEditModal" :modalActive="editModalActive">
      <template #title> Confirmation Dialog</template>

      <div class="">
        <form
          @submit.prevent="editSubmit"
          class="flex justify-center items-center flex-col h-full p-5"
        >
          <Input
            class="w-[60%]"
            v-model:input="edit"
            inputType="edit"
            :error="error && error?.type == 'edit' ? error.message : ''"
            type="edit"
            label="Edit name"
            placeholder=" edit name"
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

    <ModalView @close="toggleAddtModal" :modalActive="addModalActive">
      <template #title> Confirmation Dialog</template>

      <div class="">
        <form
          @submit.prevent="handleAddSubmit"
          class="flex justify-center items-center flex-col h-full p-5"
        >
          <Input
            class="w-[60%]"
            v-model:input="addNewCat"
            inputType="addNewCat"
            :error="error && error?.type == 'addNewCat' ? error.message : ''"
            type="addNewCat"
            label="Add Category"
            placeholder=" new category"
          />

          <button
            :disabled="isLoading"
            class="w-[40%] cursor-pointer mt-6 rounded-lg border border-primary bg-primary p-2 font-medium text-white transition hover:bg-opacity-90"
          >
            <div v-if="isLoading" class="flex pr-9 items-center justify-center">
              <SpinnerView />
            </div>
            <span v-else> Add </span>
          </button>
        </form>

        <div class="flex items-center justify-center">
          <button
            class="btn btn-sm btn-secondary text-lg font-bold hover:text-primary"
            @click="toggleAddModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalView>
  </div>
</template>
