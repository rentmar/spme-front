<template>
  <v-overlay
    :model-value="isLoading"
    :persistent="persistent"
    class="align-center justify-center text-center"
    :opacity="opacity"
  >
    <div class="d-flex flex-column align-center w-100 px-4">
      <!-- Circular Progress -->
      <v-progress-circular
        v-if="progressType === 'circular'"
        :indeterminate="!showProgress"
        :model-value="loadingProgress"
        :size="size"
        :width="width"
        :color="color"
      ></v-progress-circular>

      <!-- Linear Progress -->
      <v-progress-linear
        v-else-if="progressType === 'linear'"
        :indeterminate="!showProgress"
        :model-value="loadingProgress"
        :height="8"
        :color="color"
        class="mt-2 w-100"
        rounded
        striped
      ></v-progress-linear>

      <!-- Mensaje -->
      <div v-if="loadingMessage" class="mt-4 text-body-1">
        {{ loadingMessage }}
      </div>

      <!-- Porcentaje -->
      <div v-if="showProgress && progressType === 'circular'" class="mt-2 text-caption">
        {{ loadingProgress }}%
      </div>

      <!-- Error -->
      <v-alert v-if="loadingError" type="error" class="mt-4">
        Error: {{ loadingError.message }}
      </v-alert>
    </div>
  </v-overlay>
</template>

<script setup>
defineProps({
  isLoading: { type: Boolean, required: true },
  loadingMessage: { type: String, default: '' },
  loadingProgress: { type: Number, default: 0 },
  loadingError: { type: [Error, null], default: null },
  persistent: { type: Boolean, default: false },
  size: { type: [Number, String], default: 64 },
  width: { type: [Number, String], default: 5 },
  color: { type: String, default: 'primary' },
  opacity: { type: [Number, String], default: 0.7 },
  showProgress: { type: Boolean, default: false },

  // Nuevo prop
  progressType: {
    type: String,
    default: 'circular', // o 'linear'
    validator: (value) => ['circular', 'linear'].includes(value),
  },
})
</script>

<style scoped>
.v-overlay {
  transition: opacity 0.3s ease;
}
.text-center {
  text-align: center;
}
</style>
