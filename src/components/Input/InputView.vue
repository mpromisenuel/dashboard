<script lang="ts" setup>
import { toRefs, ref, computed } from 'vue'

const emit = defineEmits(['update:input'])
const props = defineProps<{
  input: string
  placeholder: string
  label: string
  max?: number
  type: string
  error?: string
}>()

const { input, max, error } = toRefs(props)

const isFocused = ref(false)

const inputComputed = computed({
  get: () => input.value,
  set: (val: string) => emit('update:input', val)
})
</script>

<template>
  <div>
    <client-only>
      <label class="mb-2.5 block font-medium text-black dark:text-white">{{ props.label }}</label>

      <input
        :placeholder="props.placeholder"
        :maxlength="max"
        class="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
        :class="{
          'border-gray-700': !isFocused && !error,

          'border-red-600': error
        }"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :type="props.type"
        v-model="inputComputed"
        autocomplete="off"
      />
    </client-only>

    <span v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
/* Tailwind CSS is being used, scoped styles are unnecessary. */
</style>
