<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon="mdi-close" @click="cerrarModal"></v-btn>

        <v-toolbar-title>
          {{ titulo }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn text="Cerrar" variant="text" @click="cerrarModal" prepend-icon="mdi-close">
            Cerrar
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-container fluid>
          <SeleccionEstructuraActividad
            :proyecto-data="proyectoData"
            @crear-actividad="onCrearActividad"
            @cancelar="cerrarModal"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  proyectoData: {
    type: Object,
    default: () => ({}),
  },
  titulo: {
    type: String,
    default: 'Agregar Nueva Actividad/Proceso',
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'crear-actividad', 'cerrar'])

// Variable local para el dialog
const dialog = ref(false)

// Watcher para sincronizar con el v-model
watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal
  },
)

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('cerrar')
  }
})

// Métodos
const cerrarModal = () => {
  dialog.value = false
}

const onCrearActividad = (datosActividad) => {
  emit('crear-actividad', datosActividad)
  // Opcional: cerrar modal automáticamente después de crear
  // cerrarModal()
}
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
.v-card {
  border-radius: 0;
}

.v-toolbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
