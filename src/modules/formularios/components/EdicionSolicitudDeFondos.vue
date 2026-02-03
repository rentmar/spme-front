<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title> Diálogo de Solicitud </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrarDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-4">
        <div class="text-body-1 mb-4">Parámetros recibidos:</div>

        <!-- CORREGIDO: Usar v-table en lugar de v-simple-table -->
        <v-table density="compact">
          <tbody>
            <tr>
              <td><strong>ID Actividad:</strong></td>
              <td>{{ props.idactividad || 'No proporcionado' }}</td>
            </tr>
            <tr>
              <td><strong>ID Solicitud:</strong></td>
              <td>{{ props.idsolicitud || 'No proporcionado' }}</td>
            </tr>
            <tr>
              <td><strong>ID Tarea:</strong></td>
              <td>{{ props.idtarea || 'No proporcionado' }}</td>
            </tr>
          </tbody>
        </v-table>

        <div class="mt-4 text-caption text-grey">Tipo detectado: {{ tipoDetectado }}</div>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cerrarDialog"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props del componente - CORREGIDO: Asegurar conversión de tipos
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  idactividad: {
    type: [Number, String], // Acepta ambos tipos
    default: null,
  },
  idsolicitud: {
    type: [Number, String], // Acepta ambos tipos
    default: null,
  },
  idtarea: {
    type: [Number, String], // Acepta ambos tipos
    default: null,
  },
})

// Emits para comunicación con el componente padre
const emit = defineEmits(['update:modelValue', 'cerrado'])

// Variable reactiva para controlar la visibilidad del diálogo
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Computed para determinar el tipo de solicitud basado en los props
const tipoDetectado = computed(() => {
  const actividad = props.idactividad
  const solicitud = props.idsolicitud
  const tarea = props.idtarea

  if (solicitud) {
    return 'Edición de Solicitud Existente'
  } else if (actividad) {
    return 'Nueva Solicitud para Actividad'
  } else if (tarea) {
    return 'Nueva Solicitud para Tarea'
  }
  return 'Tipo no determinado'
})

// Función para cerrar el diálogo
const cerrarDialog = () => {
  dialogVisible.value = false
  emit('cerrado')
}

// Watch para detectar cuando se abre el diálogo
watch(dialogVisible, (nuevoValor) => {
  if (nuevoValor) {
    console.log('Diálogo abierto con parámetros:', {
      idactividad: props.idactividad,
      idsolicitud: props.idsolicitud,
      idtarea: props.idtarea,
    })
  }
})

// Exponer métodos si se necesitan desde el componente padre
defineExpose({
  cerrarDialog,
})
</script>
