<template>
  <v-dialog v-model="dialog" max-width="800" @after-enter="cargarDatos">
    <v-card>
      <v-toolbar color="primary" title="Validar Solicitud de Fondos PEI">
        <template v-slot:prepend>
          <v-icon color="white">mdi-thumb-up</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <!-- Indicador de carga -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          height="4"
          class="mb-4"
        ></v-progress-linear>

        <!-- Estadísticas -->
        <div v-if="!loading && estadisticas" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Solicitudes de Fondos PEI</div>
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

        <!-- Lista de solicitudes - versión simple -->
        <div v-if="!loading">
          <div v-if="solicitudes.length > 0" class="solicitudes-list mt-4">
            <div
              v-for="solicitud in solicitudes"
              :key="solicitud.id"
              class="solicitud-item mb-3 pa-3"
              :class="{ 'bg-grey-lighten-3': solicitud.estado_validacion === 'pendiente' }"
            >
              <div class="d-flex justify-space-between align-start">
                <div class="solicitud-info flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <div class="font-weight-bold">{{ solicitud.numeroFormulario }}</div>
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
                    <span class="font-weight-medium">Fecha:</span>
                    {{ formatDate(solicitud.fechaSolicitud) }}
                    <span v-if="solicitud.lugarSolicitud">
                      | <span class="font-weight-medium">Lugar:</span>
                      {{ solicitud.lugarSolicitud }}</span
                    >
                  </div>

                  <div class="text-caption mb-1" v-if="solicitud.descripcion_actividad">
                    <span class="font-weight-medium">Descripción:</span>
                    {{ solicitud.descripcion_actividad }}
                  </div>

                  <div class="text-caption">
                    <span class="font-weight-medium">Solicitante:</span>
                    {{ solicitud.solicitante?.nombre_completo }}
                    <span v-if="solicitud.solicitante?.cargo">
                      ({{ solicitud.solicitante?.cargo }})</span
                    >
                  </div>

                  <div class="text-caption mt-1">
                    <span class="font-weight-medium">Forma de pago:</span>
                    {{ solicitud.forma_pago_nombre }}
                  </div>
                </div>

                <div class="solicitud-actions ml-3">
                  <v-btn
                    color="primary"
                    size="small"
                    :to="{
                      path: `/monitoreo/formulario011/${props.actividadId}`,
                      query: { solicitud_id: solicitud.id },
                    }"
                    @click.stop
                  >
                    Ver
                  </v-btn>

                  <div
                    v-if="solicitud.validacionCoordinador && solicitud.validacionResponsable"
                    class="text-center mt-1"
                  >
                    <v-icon color="success" size="16">mdi-check</v-icon>
                    <div class="text-caption text-success">Validado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin solicitudes -->
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
            <div class="text-h6 mb-2">No hay solicitudes de fondos PEI</div>
            <div class="text-caption text-grey">
              No se encontraron solicitudes de fondos para esta actividad
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
import { computed, ref, watch } from 'vue'
import { useSolucitudFondos } from '../../composables/useSolicitudFondos'

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

// Iniciar el composable
const { listaSolicitudesFondosActividadPei, obtenerListaSolFondosPorIdActividadPei } =
  useSolucitudFondos()

// Estados adicionales
const loading = ref(false)
const error = ref(null)
const estadisticas = ref(null)
const actividad = ref(null)

// Propiedad computada para obtener las solicitudes
const solicitudes = computed(() => {
  if (
    listaSolicitudesFondosActividadPei.value &&
    listaSolicitudesFondosActividadPei.value.solicitudes
  ) {
    return listaSolicitudesFondosActividadPei.value.solicitudes
  }
  return []
})

// Cargar datos cuando se abre el diálogo
const cargarDatos = async () => {
  if (!props.actividadId) return

  loading.value = true
  error.value = null
  estadisticas.value = null
  actividad.value = null

  try {
    await obtenerListaSolFondosPorIdActividadPei(props.actividadId)

    // Extraer estadísticas y actividad de la respuesta
    if (listaSolicitudesFondosActividadPei.value) {
      estadisticas.value = listaSolicitudesFondosActividadPei.value.estadisticas
      actividad.value = listaSolicitudesFondosActividadPei.value.actividad
    }

    console.log('Datos cargados:', listaSolicitudesFondosActividadPei.value)
    console.log('Estadísticas:', estadisticas.value)
  } catch (err) {
    console.error('Error al cargar datos:', err)
    error.value = err.message || 'Error desconocido'
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
  if (item.validacionCoordinador && item.validacionResponsable) return 'success'
  if (item.validacionCoordinador || item.validacionResponsable) return 'warning'
  return 'error'
}

const getValidationText = (item) => {
  if (item.validacionCoordinador && item.validacionResponsable) return 'Validado'
  if (item.validacionCoordinador || item.validacionResponsable) return 'Parcial'
  return 'Pendiente'
}

// Cargar datos cuando se abre el diálogo
watch(
  () => dialog.value,
  (newValue) => {
    if (newValue) {
      cargarDatos()
    }
  },
)

// También cargar cuando cambia la actividadId
watch(
  () => props.actividadId,
  () => {
    if (dialog.value) {
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
  min-width: 0; /* Permite que el texto se ajuste */
}

.solicitud-actions {
  flex-shrink: 0;
}

.bg-grey-lighten-3 {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Estilos para los chips de estadísticas */
.v-chip {
  font-size: 12px;
  height: 24px;
}
</style>
