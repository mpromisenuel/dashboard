<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import Input from '@/components/Input/InputView.vue'
import SpinnerView from '@/components/SpinnerView.vue'
import apiClient from '@/services/ApiService'
import { toast } from 'vue3-toastify'
import router from '@/router'

const pageTitle = ref('Customer')
const name = ref(null)
const phoneNumber = ref(null)
const address = ref(null)
const email = ref(null)
const error = ref({ type: '', message: '' })
const isLoading = ref(false)
const customers = ref(null)
const editModalActive = ref(false)

const entityId = localStorage.getItem('userId')

const validEmail = (email: string) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

async function fetchAllCategory() {
  try {
    isLoading.value = true
    const response = await apiClient.get(`/inventory/customers/list/${entityId}/`)
    customers.value = response.data.customers // Update customers list
    isLoading.value = false
  } catch (error: any) {
    isLoading.value = false
    toast.error(`${error.response.data.message}`)
    console.log(error, 'hhhhh')
  }
}

const handleSubmit = async () => {
  error.value.type = ''
  error.value.message = ''
  if (!name.value) {
    error.value = {
      type: 'name',
      message: 'name is required'
    }
    return
  }
  if (!email.value) {
    error.value = {
      type: 'email',
      message: 'Email is required'
    }
    return
  }
  if (!phoneNumber.value) {
    error.value = {
      type: 'phone_number',
      message: 'phone number is required'
    }
    return
  }

  if (!address.value) {
    error.value = {
      type: 'address',
      message: 'address is required'
    }
    return
  }
  if (email.value) {
    const emailErr = validEmail(email.value)
    if (!emailErr) {
      error.value = {
        type: 'email',
        message: 'Please enter a valid email address'
      }
      return
    }
  }
  try {
    isLoading.value = true;
    const newData = {
      name: name.value,
      email: email.value,
      phone_number: phoneNumber.value,
      address: address.value,
      category_id: 1,
      entity_id: entityId,
    };

    await apiClient.post('/inventory/customers/add/', newData);
    toast.success('Customer added successfully');

    // Refresh the customer list
    await fetchAllCategory();

    // Navigate to customer list
    await router.push("/dashboard/customerlist");
  } catch (error: any) {
    isLoading.value = false;
    toast.error(error.response?.data?.message || "Failed to add customer");
    console.log(error);
  }
};

onMounted(() => {
  fetchAllCategory()
})
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <form @submit.prevent="handleSubmit" class="flex justify-center items-center flex-col h-full">
      <Input
        class="w-full"
        v-model:input="name"
        inputType="name"
        :error="error && error?.type == 'name' ? error.message : ''"
        label=" name"
        type="name"
        placeholder="Enter your name"
      />
      <Input
        class="w-full"
        v-model:input="email"
        inputType="email"
        :error="error && error?.type == 'email' ? error.message : ''"
        label="email"
        type="email"
        placeholder="Enter your email"
      />
      <Input
        class="w-full"
        v-model:input="phoneNumber"
        inputType="phone number"
        :error="error && error?.type == 'phone_number' ? error.message : ''"
        label="phone number"
        type="number"
        placeholder="Enter your phone number"
      />
      <Input
        class="w-full"
        v-model:input="address"
        inputType="address"
        :error="error && error?.type == 'address' ? error.message : ''"
        label="address"
        type="address"
        placeholder="Enter your address"
      />

      <div class="mb-5 mt-6 w-full">
        <button
          :disabled="isLoading"
          class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90"
        >
          <div v-if="isLoading" class="flex items-center justify-center">
            <SpinnerView />
          </div>
          <h1 v-else>New Customer</h1>
        </button>
      </div>
    </form>
  </DefaultLayout>
</template>
