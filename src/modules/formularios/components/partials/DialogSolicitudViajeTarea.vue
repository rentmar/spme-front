<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-toolbar color="deep-purple" title="Validar Solicitud de Viaje (Tarea)">
        <template v-slot:prepend>
          <v-icon color="white">mdi-thumb-up</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <div class="pa-4 text-center">
          <v-icon size="64" color="deep-purple" class="mb-4">mdi-airplane</v-icon>
          <div class="text-h6 mb-2">Solicitudes de Viaje</div>
          <div class="text-body-1">ID de Actividad: {{ props.actividadId }}</div>
          <div class="text-body-1">ID de Tarea: {{ props.tareaId }}</div>
          <div class="text-caption text-grey mt-2">
            Aquí se mostrarán las solicitudes de viaje pendientes de validación para esta tarea<br />
            {{ listaSolicitudViajeTarea }}
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="dialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useSolicitudViaje } from '../../composables/useSolicitudViaje'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  actividadId: {
    type: Number,
    required: true,
  },
  tareaId: {
    type: Number,
    required: true,
  },
})

//Iniciar el COmposable
const { listaSolicitudViajeTarea, obtenerListaSolViajesPorIdTarea } = useSolicitudViaje()

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
/******************** Cargar Datos  ***********************/
const loading = ref(false)
const error = ref(null)
const cargarDatos = async () => {
  loading.value = true
  try {
    await obtenerListaSolViajesPorIdTarea(props.actividadId, props.tareaId)
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}

//hook
onMounted(() => {
  cargarDatos()
})
</script>
