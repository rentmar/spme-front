<template>
  <div v-if="actividadId">
    <v-card>
      <v-card-title class="bg-blue-darken-2 text-white">
        <v-icon icon="mdi-map-marker-path" class="mr-2"></v-icon>
        Ruta de Actividad al Proyecto
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="24"
          class="ml-4"
        ></v-progress-circular>
      </v-card-title>

      <v-card-text class="pa-4">
        <div v-if="error" class="text-error text-center py-4">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ error }}
        </div>

        <div v-else-if="!loading && !datosApi" class="text-center py-4">
          No se encontraron datos para la actividad #{{ actividadId }}
        </div>

        <template v-else>
          <!-- Timeline horizontal -->
          <v-timeline
            direction="horizontal"
            align="start"
            line-inset="12"
            truncate-line="start"
            class="py-4"
          >
            <v-timeline-item
              v-for="(item, index) in rutaCompleta"
              :key="`${item.tipo}-${item.id}`"
              :dot-color="obtenerColor(item.tipo)"
              :icon="obtenerIcono(item.tipo)"
              size="small"
              fill-dot
            >
              <div class="text-caption text-center">
                {{ formatearTipo(item.tipo) }}
              </div>
            </v-timeline-item>
          </v-timeline>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useTrazador } from '../../composables/useTrazador'

// Props - recibe el ID de la actividad
const props = defineProps({
  actividadId: {
    type: Number,
    default: null,
  },
})

// Composables
const {
  rutasDeLaActividadIndicador: datosApi,
  obtenerAllRutaActividadIndicador,
  loading: isLoadingTrace,
  error: errorTrace,
} = useTrazador()

// Estado reactivo
const loading = ref(false)
const error = ref(null)

// Computed property para obtener la ruta completa
const rutaCompleta = computed(() => {
  if (
    !datosApi.value ||
    !datosApi.value.rutas_posibles ||
    datosApi.value.rutas_posibles.length === 0
  ) {
    return []
  }

  // Seleccionar la primera ruta disponible
  return datosApi.value.rutas_posibles[0].ruta
})

// Función para obtener el icono según el tipo
const obtenerIcono = (tipo) => {
  return iconos[tipo] || 'mdi-help-circle-outline'
}

// Función para obtener el color según el tipo
const obtenerColor = (tipo) => {
  return colores[tipo] || 'grey'
}

// Función para formatear el nombre del tipo
const formatearTipo = (tipo) => {
  return nombresTipos[tipo] || tipo
}

// Watcher para cambios en el ID de actividad
watch(
  () => props.actividadId,
  (newId) => {
    if (newId) {
      cargarDatos()
    } else {
      datosApi.value = null
    }
  },
)

// Cargar datos cuando el componente se monta
onMounted(() => {
  if (props.actividadId) {
    cargarDatos()
  }
})

// Llamada a la rest api
const cargarDatos = async () => {
  loading.value = true
  error.value = null

  try {
    await obtenerAllRutaActividadIndicador(props.actividadId)

    // Verificar si hay error del composable
    if (errorTrace.value) {
      error.value = errorTrace.value
    }
  } catch (e) {
    error.value = e.message || 'Error al cargar los datos'
    console.error('Error al cargar datos:', e)
  } finally {
    loading.value = false
  }
}

// Mapeo de iconos por tipo
const iconos = {
  Actividad: 'mdi-checkbox-marked-circle-outline',
  Proceso: 'mdi-cog-outline',
  ProductoOE: 'mdi-package-variant',
  ResultadoOG: 'mdi-chart-bell-curve',
  ObjetivoEspecifico: 'mdi-target',
  ObjetivoGeneral: 'mdi-bullseye-arrow',
  Proyecto: 'mdi-clipboard-text-outline',
}

// Mapeo de colores por tipo
const colores = {
  Actividad: 'blue',
  Proceso: 'purple',
  ProductoOE: 'indigo',
  ResultadoOG: 'orange',
  ObjetivoEspecifico: 'teal',
  ObjetivoGeneral: 'cyan',
  Proyecto: 'green',
}

// Mapeo de nombres de tipos
const nombresTipos = {
  Actividad: 'Actividad',
  Proceso: 'Proceso',
  ProductoOE: 'Producto OE',
  ResultadoOG: 'Resultado OG',
  ObjetivoEspecifico: 'Objetivo Específico',
  ObjetivoGeneral: 'Objetivo General',
  Proyecto: 'Proyecto',
}
</script>

<style scoped>
.text-error {
  color: #f44336;
}
</style>
