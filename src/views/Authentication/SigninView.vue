<script setup lang="ts">
import Input from '@/components/Input/InputView.vue'
import apiClient from '@/services/ApiService'
import { ref } from 'vue'
import SpinnerView from '@/components/SpinnerView.vue'
import { toast } from 'vue3-toastify'
// import router from '@/router'
import router from '@/router'

const email = ref(null)
const password = ref(null)
const isLoading = ref(false)

const error = ref({ type: '', message: '' })

const validEmail = (email: string) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const handleSubmit = async () => {
  error.value.type = ''
  error.value.message = ''
  if (!email.value) {
    error.value = {
      type: 'email',
      message: 'email name is required'
    }
    return
  }

  if (!password.value) {
    error.value = {
      type: 'password',
      message: 'password name is required'
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
    isLoading.value = true
    const newData = {
      email: email.value,
      password: password.value
    }
    const response = await apiClient.post('/individual/signin', newData)
    console.log('newData', response)
    localStorage.setItem('app_accessToken', response.data.token)
    localStorage.setItem('userId', response.data.entities[0].entity.id)

    isLoading.value = false
    toast.success('login successfully')
    if (response) {
      await router.push('/dashboard/category')
    }
  } catch (error: any) {
    isLoading.value = false
    toast.error(`${error.response.data.message}`)
    console.log(error, 'hhhhh')
  }
}
</script>

<template>
  <div
    class="rounded-sm border border-stroke h-screen bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="flex flex-wrap items-center justify-center h-screen">
      <div
        class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-1/2"
      >
        <h2 class="font-bold text-3xl mb-8 text-center">Sign In</h2>
        <form
          @submit.prevent="handleSubmit"
          class="flex justify-center items-center flex-col h-full"
        >
          <Input
            class="w-full"
            v-model:input="email"
            inputType="email"
            :error="error && error?.type == 'email' ? error.message : ''"
            label="email"
            type="email"
            placeholder="Enter your email name"
          />

          <Input
            class="w-full"
            v-model:input="password"
            inputType="password"
            :error="error && error?.type == 'password' ? error.message : ''"
            label="password"
            type="password"
            placeholder="Enter your  password"
          />

          <div class="mb-5 mt-6 w-full">
            <button
              :disabled="isLoading"
              class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90"
            >
              <div v-if="isLoading" class="flex items-center justify-center">
                <SpinnerView />
              </div>
              <h1 v-else>Sign In</h1>
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="font-medium">
              Don’t have any account?
              <router-link to="/auth/signup" class="text-primary">Sign Up</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
