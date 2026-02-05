<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-toolbar color="error" title="Validar Rendición de Cuentas (Tarea)">
        <template v-slot:prepend>
          <v-icon color="white">mdi-thumb-up</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <div class="pa-4 text-center">
          <v-icon size="64" color="error" class="mb-4">mdi-file-chart</v-icon>
          <div class="text-h6 mb-2">Rendiciones de Cuentas</div>
          <div class="text-body-1">ID de Actividad: {{ props.actividadId }}</div>
          <div class="text-body-1">ID de Tarea: {{ props.tareaId }}</div>
          <div class="text-caption text-grey mt-2">
            Aquí se mostrarán las rendiciones de cuentas pendientes de validación para esta tarea<br />
            {{ listaRendicionCuentasTarea }}
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
import { useRendicionCuentas } from '../../composables/useRendicionCuentas'

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

//Iniciar el composable
const { listaRendicionCuentasTarea, obtenerListaRendicionCuentasPorIdTarea } = useRendicionCuentas()

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
/************************************** Carga de Informacion******************************************/
const loading = ref(false)
const error = ref(null)

const cargarDatos = async () => {
  loading.value = true
  try {
    await obtenerListaRendicionCuentasPorIdTarea(props.actividadId, props.tareaId)
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
