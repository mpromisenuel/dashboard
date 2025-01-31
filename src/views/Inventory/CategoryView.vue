<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ModalView from '@/components/ModalView.vue'
import Input from '@/components/Input/InputView.vue'
import SpinnerView from '@/components/SpinnerView.vue'
import { toast } from 'vue3-toastify'
import apiClient from '@/services/ApiService'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

// Use Auth Store
const categoryStore = useCategoryStore()
const {fetchAllCategory, handleAddCategorySubmit,handleDeleteCategory} = useCategoryStore()

const { isLoading } = storeToRefs(categoryStore)

const deleteId = ref('')

const isDeletingItem = ref(false)

 const editData = ref<any>(null)

const edit = ref("")

const addNewCat = ref<any>(null)

const error = ref({ type: '', message: '' })

 const entityAddCategoryId = localStorage.getItem('userId')


const pageTitle = ref('Category')

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
    await handleAddCategorySubmit({
      category_name: addNewCat.value,
      entity_id: entityAddCategoryId
    })
    addNewCat.value=""
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false //  Ensure loading stops
  }
}

const editSubmit = async () => {
  error.value.type = '';
  error.value.message = '';

  if (!edit.value) {
    error.value = {
      type: 'edit',
      message: 'Your field is required',
    };
    return;
  }

  try {
    isLoading.value = true;

    await categoryStore.handleEditCategorySubmit({
      category_name: edit.value, // Ensure this is defined correctly
      category_id: editData.value.id
    });
    
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false // Ensure loading stops
  }
};

const handleDelete=async()=>{
await handleDeleteCategory(deleteId.value)
}

const toggleModal = (id: any) => {
  deleteId.value = id // Set category data before deletion
  categoryStore.modalActive = !categoryStore.modalActive
}

const toggleEditModal = (params: any) => {
  editData.value = params // This is used to get the ID
  edit.value = params.name; // Ensure you're setting the category name correctly
  categoryStore.editModalActive = !categoryStore.editModalActive
};

const toggleAddModal = () => {
  categoryStore.addModalActive = !categoryStore.addModalActive
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
                <tr v-for="(category, index) in categoryStore.allCategories" :key="index">
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

    <ModalView @close="toggleModal" :modalActive="categoryStore.modalActive">
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

    <ModalView @close="toggleEditModal" :modalActive="categoryStore.editModalActive">
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
            :disabled="categoryStore.isLoading"
            class="w-[40%] cursor-pointer mt-6 rounded-lg border border-primary bg-primary p-2 font-medium text-white transition hover:bg-opacity-90"
          >
            <div v-if="categoryStore.isLoading" class="flex pr-9 items-center justify-center">
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

    <ModalView @close="toggleAddModal" :modalActive="categoryStore.addModalActive">
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
