<template>
  <v-dialog
    :model-value="props.visible"
    @update:modelValue="cerrarModal"
    max-width="1200"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="headline bg-primary">
        Informe de SubActividad
        <v-btn icon @click="cerrarModal" variant="text" class="float-right">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <p>Cargando detalles del informe ID: {{ props.informeId }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="cerrarModal"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue'

// 1. Definimos los 'props'
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  informeId: {
    type: Number,
    default: null,
  },
})

// 2. Definimos los eventos que puede emitir el componente
const emit = defineEmits(['update:visible', 'cerrar'])

// 3. Función para cerrar el modal
const cerrarModal = () => {
  // Emitimos un evento para indicarle al padre que cambie el estado de 'visible' a false.
  emit('update:visible', false)
  emit('cerrar') // Evento de cierre adicional si lo necesitas
}

// 4. (Opcional) Usamos un 'watch' para reaccionar al cambio de 'informeId'
//    Esto es útil si el modal ya está abierto y se cambia el ID
watch(
  () => props.informeId,
  (newId) => {
    if (props.visible && newId !== null) {
      console.log(`El ID del informe ha cambiado a: ${newId}. Iniciar carga de datos...`)
      // Aquí pondrías la lógica para cargar los datos del informe
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
