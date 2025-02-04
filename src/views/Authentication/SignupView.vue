<script setup lang="ts">
// import InputGroup from '@/components/Auths/InputGroup.vue'
import Input from '@/components/Input/InputView.vue'
import apiClient from '@/services/ApiService'
import { ref } from 'vue'
import SpinnerView from '@/components/SpinnerView.vue'
import { toast } from 'vue3-toastify'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const organizationName = ref('')
const firstName = ref("")
const lastName = ref("")
const otherName = ref("")
const phoneNumber = ref("")
const address = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const error = ref({ type: '', message: '' })
// Use Auth Store
const authStore = useAuthStore()

// Ensure isLoading remains reactive
const { isLoading } = storeToRefs(authStore)

const validEmail = (email: string) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const handleValidate = async () => {
  error.value.type = ''
  error.value.message = ''
  if (!organizationName.value) {
    error.value = {
      type: 'organization_name',
      message: 'organization name is required'
    }
    return
  }

  if (!firstName.value) {
    error.value = {
      type: 'first_name',
      message: 'first name is required'
    }
    return
  }

  if (!lastName.value) {
    error.value = {
      type: 'last_name',
      message: 'last name is required'
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

  if (!email.value) {
    error.value = {
      type: 'email',
      message: 'Email is required'
    }
    return
  }

  if (!password.value) {
    error.value = {
      type: 'password',
      message: 'password is required'
    }
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = {
      type: 'confirm_password',
      message: 'password does not match'
    }
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
    // Math.floor(Math.random() *9)

    try {
      isLoading.value = true
      await authStore.handleSignUpSubmit({
        name: organizationName.value,
        type: 'Organisation',
        market: 1,
        admin_first_name: firstName.value,
        admin_last_name: lastName.value,
        admin_other_names: otherName.value,
        admin_phone: phoneNumber.value,
        address: address.value,
        admin_email: email.value,
        admin_password: password.value
      })
    } catch (err) {
      console.error(err)
    } finally {
      isLoading.value = false // ✅ Ensure loading stops
    }
  }
}
</script>

<template>
  <div
    class="rounded-sm border border-stroke h-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="flex flex-wrap items-center justify-center h-full">
      <div
        class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-1/2"
      >
        <h2 class="font-bold text-3xl mb-8 text-center">Sign Up with Us</h2>
        <form
          @submit.prevent="handleValidate"
          class="flex justify-center items-center flex-col h-full"
        >
          <Input
            class="w-full"
            v-model:input="organizationName"
            inputType="name"
            :error="error && error?.type == 'organization_name' ? error.message : ''"
            label="organization name"
            type="name"
            placeholder="Enter your organization name"
          />
          <Input
            class="w-full"
            v-model:input="firstName"
            inputType="name"
            :error="error && error?.type == 'first_name' ? error.message : ''"
            label="first name"
            type="name"
            placeholder="Enter your first name"
          />
          <Input
            class="w-full"
            v-model:input="lastName"
            inputType="name"
            :error="error && error?.type == 'last_name' ? error.message : ''"
            label="last name"
            type="name"
            placeholder="Enter your last name"
          />
          <Input
            class="w-full"
            v-model:input="otherName"
            inputType="other name"
            :error="error && error?.type == 'other_name' ? error.message : ''"
            label="other name"
            type="name"
            placeholder="Enter other names"
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
          <Input
            class="w-full"
            v-model:input="email"
            inputType="email"
            :error="error && error?.type == 'email' ? error.message : ''"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <Input
            class="w-full"
            v-model:input="password"
            inputType="password"
            :error="error && error?.type == 'password' ? error.message : ''"
            label="password"
            type="password"
            placeholder="Enter your password"
          />
          <Input
            class="w-full"
            v-model:input="confirmPassword"
            inputType="confirm password"
            :error="error && error?.type == 'confirm_password' ? error.message : ''"
            label="confirm password"
            type="password"
            placeholder="Enter your password again"
          />

          <div class="mb-5 mt-6 w-full">
            <button
              :disabled="authStore.isLoading"
              class="w-full cursor-pointer rounded-lg border pr-9 border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90"
            >             
              <div v-if="authStore.isLoading" class="flex items-center justify-center">
                <SpinnerView />
              </div>
              <h1 v-else>Sign Up</h1>
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="font-medium">
              Already have an account?
              <router-link to="/" class="text-primary">Sign in</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
