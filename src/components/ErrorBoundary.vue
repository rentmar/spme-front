<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mb-2">Ha ocurrido un error</h2>
      <p class="text-body-1 mb-4">{{ errorMessage }}</p>
      <v-btn color="primary" @click="reloadPage" prepend-icon="mdi-refresh">
        Recargar página
      </v-btn>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error, instance, info) => {
  console.error('Error capturado:', error)
  console.error('Componente:', instance)
  console.error('Info:', info)

  hasError.value = true
  errorMessage.value = error.message || 'Error desconocido al cargar el componente'

  // Si es un error de carga de módulo, sugerir recarga
  if (error.message?.includes('Failed to fetch dynamically imported module')) {
    errorMessage.value = 'Error al cargar el componente. Por favor, recargue la página.'
  }

  // Retornar false para prevenir que el error se propague
  return false
})

const reloadPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px;
}

.error-container {
  text-align: center;
  max-width: 500px;
}
</style>
