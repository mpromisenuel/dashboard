<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore' // Adjust path based on your project
import SpinnerView from '@/components/SpinnerView.vue'
import Input from '@/components/Input/InputView.vue'

// Use Auth Store
const authStore = useAuthStore()

// Ensure isLoading remains reactive
const { isLoading } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const error = ref({ type: '', message: '' })

const handleValidate = async () => {
  if (!email.value || !password.value) {
    error.value = { type: 'credentials', message: 'Email and password are required' }
    return
  }

  try {
    isLoading.value = true // ✅ Reactively update isLoading
    await authStore.handleSignInSubmit({
      email: email.value,
      password: password.value
    })
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false // ✅ Ensure loading stops
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
          @submit.prevent="handleValidate"
          class="flex justify-center items-center flex-col h-full"
        >
          <Input
            class="w-full"
            v-model:input="email"
            inputType="email"
            :error="error && error?.type == 'credentials' ? error.message : ''"
            label="email"
            type="email"
            placeholder="Enter your email name"
          />

          <Input
            class="w-full"
            v-model:input="password"
            inputType="password"
            :error="error && error?.type == 'credentials' ? error.message : ''"
            label="password"
            type="password"
            placeholder="Enter your  password"
          />

          <div class="mb-5 mt-6 w-full">
            <button
              :disabled="authStore.isLoading"
              class="w-full cursor-pointer rounded-lg border pr-9 border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90"
            >
              <div v-if="authStore.isLoading" class="flex items-center justify-center">
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
