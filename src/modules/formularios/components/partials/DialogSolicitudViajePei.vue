<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-toolbar color="deep-purple" title="Validar Solicitud de Viaje PEI">
        <template v-slot:prepend>
          <v-icon color="white">mdi-thumb-up</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <!-- Indicador de carga -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="deep-purple"
          height="4"
          class="mb-4"
        ></v-progress-linear>

        <!-- Estadísticas -->
        <div v-if="!loading && estadisticas" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Solicitudes de Viaje</div>
              <div class="text-caption text-grey">Actividad ID: {{ props.actividadId }}</div>
            </div>
            <div class="text-right">
              <div class="text-caption">{{ estadisticas.total_solicitudes }} solicitudes</div>
            </div>
          </div>

          <!-- Chips de estadísticas -->
          <div class="d-flex flex-wrap gap-2">
            <v-chip size="small" color="grey" variant="outlined">
              <v-icon start size="16">mdi-clock</v-icon>
              Pendientes: {{ estadisticas.por_estado?.pendientes || 0 }}
            </v-chip>
            <v-chip size="small" color="success" variant="outlined">
              <v-icon start size="16">mdi-check-circle</v-icon>
              Validadas: {{ estadisticas.por_estado?.validadas_completamente || 0 }}
            </v-chip>
          </div>
        </div>

        <!-- Lista de solicitudes -->
        <div v-if="!loading">
          <div v-if="solicitudes.length > 0" class="solicitudes-list mt-4">
            <div
              v-for="solicitud in solicitudes"
              :key="solicitud.id"
              class="solicitud-item mb-3 pa-3"
              :class="{ 'bg-grey-lighten-3': getValidationText(solicitud) === 'Pendiente' }"
            >
              <div class="d-flex justify-space-between align-start">
                <div class="solicitud-info flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <div class="font-weight-bold">
                      {{ solicitud.numeroFormulario || 'Sin número' }}
                    </div>
                    <v-chip size="x-small" class="ml-2" color="grey-lighten-2">
                      ID: {{ solicitud.id }}
                    </v-chip>
                  </div>

                  <div class="d-flex align-center mb-1">
                    <v-chip
                      small
                      :color="getValidationColor(solicitud)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getValidationText(solicitud) }}
                    </v-chip>
                    <span class="text-caption"
                      >Monto: {{ formatCurrency(solicitud.montoSolicitado) }}</span
                    >
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Evento:</span>
                    {{ solicitud.evento || 'No especificado' }}
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Fecha Evento:</span>
                    {{ formatDate(solicitud.fechaEvento) }}
                    <span v-if="solicitud.lugarEvento">
                      | <span class="font-weight-medium">Lugar:</span>
                      {{ solicitud.lugarEvento }}</span
                    >
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Solicitante:</span>
                    {{ solicitud.solicitante?.nombre_completo || 'No especificado' }}
                    <span v-if="solicitud.solicitante?.cargo">
                      ({{ solicitud.solicitante.cargo }})</span
                    >
                  </div>

                  <div class="text-caption mt-1">
                    <span class="font-weight-medium">Forma de pago:</span>
                    {{ solicitud.forma_pago_nombre || 'No especificado' }}
                  </div>
                </div>

                <div class="solicitud-actions ml-3">
                  <v-btn
                    color="deep-purple"
                    size="small"
                    :to="{
                      path: `/monitoreo/formulario055/${props.actividadId}`,
                      query: { solicitud_id: solicitud.id },
                    }"
                    @click.stop
                  >
                    Ver
                  </v-btn>

                  <div v-if="getValidationText(solicitud) === 'Validado'" class="text-center mt-1">
                    <v-icon color="success" size="16">mdi-check</v-icon>
                    <div class="text-caption text-success">Validado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin solicitudes -->
          <div v-else-if="!loading && solicitudes.length === 0 && !error" class="pa-8 text-center">
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-airplane-check</v-icon>
            <div class="text-h6 mb-2">No hay solicitudes de viaje</div>
            <div class="text-caption text-grey">
              No se encontraron solicitudes de viaje para esta actividad
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error && !loading" class="pa-4 text-center">
          <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <div class="text-h6 mb-2 text-error">Error al cargar datos</div>
          <div class="text-caption">{{ error }}</div>
          <v-btn color="primary" @click="cargarDatos" class="mt-2">Reintentar</v-btn>
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
import { computed, ref, watch, nextTick } from 'vue'
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
})

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// Estados reactivos locales
const loading = ref(false)
const error = ref(null)
const estadisticas = ref(null)
const solicitudesList = ref([]) // Variable local para las solicitudes

// Iniciar el composable
const { listaSolicitudViajeActividadPei, obtenerListaSolViajesPorIdActividadPei } =
  useSolicitudViaje()

// Propiedad computada para obtener las solicitudes
const solicitudes = computed(() => {
  return solicitudesList.value
})

// Función de carga mejorada
const cargarDatos = async () => {
  if (!props.actividadId) {
    error.value = 'ID de actividad no proporcionado'
    return
  }

  loading.value = true
  error.value = null
  estadisticas.value = null
  solicitudesList.value = []

  try {
    console.log('Cargando datos para actividad ID:', props.actividadId)

    await obtenerListaSolViajesPorIdActividadPei(props.actividadId)

    // Depuración: Verificar qué devuelve el composable
    console.log('Respuesta del composable:', listaSolicitudViajeActividadPei.value)

    // Verificar diferentes posibles estructuras de respuesta
    if (listaSolicitudViajeActividadPei.value) {
      const data = listaSolicitudViajeActividadPei.value

      // Caso 1: La respuesta tiene propiedad 'solicitudes'
      if (data.solicitudes && Array.isArray(data.solicitudes)) {
        solicitudesList.value = data.solicitudes
        estadisticas.value = data.estadisticas || {}
      }
      // Caso 2: La respuesta es directamente un array
      else if (Array.isArray(data)) {
        solicitudesList.value = data
        estadisticas.value = {
          total_solicitudes: data.length,
          por_estado: {
            pendientes: data.filter((s) => !s.validacionCoordinador && !s.validacionResponsable)
              .length,
            validadas_completamente: data.filter(
              (s) => s.validacionCoordinador && s.validacionResponsable,
            ).length,
          },
        }
      }
      // Caso 3: Tiene estructura diferente
      else if (data.data && Array.isArray(data.data)) {
        solicitudesList.value = data.data
        estadisticas.value = data.meta || data.estadisticas || {}
      }
      // Caso 4: Propiedad con otro nombre
      else {
        // Intentar encontrar arrays en el objeto
        for (const key in data) {
          if (Array.isArray(data[key])) {
            solicitudesList.value = data[key]
            break
          }
        }
      }
    }

    console.log('Solicitudes cargadas:', solicitudesList.value.length)
    console.log('Estadísticas:', estadisticas.value)
  } catch (err) {
    console.error('Error al obtener la información:', err)
    error.value = err.message || 'Error desconocido al cargar los datos'
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  return `Bs. ${num.toFixed(2)}`
}

const getValidationColor = (item) => {
  const coordinador = item.validacionCoordinador === true || item.validacionCoordinador === 1
  const responsable = item.validacionResponsable === true || item.validacionResponsable === 1

  if (coordinador && responsable) return 'success'
  if (coordinador || responsable) return 'warning'
  return 'error'
}

const getValidationText = (item) => {
  const coordinador = item.validacionCoordinador === true || item.validacionCoordinador === 1
  const responsable = item.validacionResponsable === true || item.validacionResponsable === 1

  if (coordinador && responsable) return 'Validado'
  if (coordinador || responsable) return 'Parcial'
  return 'Pendiente'
}

// Cargar datos cuando se abre el diálogo
watch(
  () => dialog.value,
  (newValue) => {
    if (newValue) {
      // Esperar a que el diálogo esté completamente abierto
      nextTick(() => {
        cargarDatos()
      })
    }
  },
)

// También cargar cuando cambia la actividadId (solo si el diálogo está abierto)
watch(
  () => props.actividadId,
  (newId, oldId) => {
    if (dialog.value && newId !== oldId) {
      cargarDatos()
    }
  },
)
</script>

<style scoped>
.text-error {
  color: #f44336;
}

.solicitud-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.solicitud-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.solicitud-info {
  min-width: 0;
}

.solicitud-actions {
  flex-shrink: 0;
}

.bg-grey-lighten-3 {
  background-color: rgba(0, 0, 0, 0.03);
}

.v-chip {
  font-size: 12px;
  height: 24px;
}

.gap-2 {
  gap: 8px;
}
</style>
