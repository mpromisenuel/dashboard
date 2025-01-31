<template>
  <div class="z-99999">
    <transition name="modal-animation">
      <div
        v-show="modalActive"
        class="z-99999 fixed inset-0 flex items-center justify-center bg-black/70"
      >
        <transition name="modal-animation-inner">
          <div
            v-show="modalActive"
            class="relative w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-6"
          >
            <div
              v-if="$slots.title"
              class="flex justify-center items-center text-xl font-medium font-montserrat"
            >
              <slot name="title" />
            </div>
            <!-- Modal Content -->
            <slot />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ modalActive: boolean }>();
</script>

<style scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}
</style>
