<template>
  <v-dialog v-model="dialog" max-width="800" @after-enter="cargarDatos">
    <v-card>
      <v-toolbar color="amber-darken-3" title="Validar Solicitud de Reposición PEI">
        <template v-slot:prepend>
          <v-icon color="white">mdi-cash-sync</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <!-- Indicador de carga -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="amber-darken-3"
          height="4"
          class="mb-4"
        ></v-progress-linear>

        <!-- Estadísticas -->
        <div v-if="!loading && estadisticas" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Solicitudes de Reposición</div>
              <div class="text-caption text-grey">Actividad ID: {{ props.actividadId }}</div>
            </div>
            <div class="text-right">
              <div class="text-caption">{{ estadisticas.total_solicitudes }} solicitudes</div>
              <div class="text-caption text-green">
                Total monto: Bs. {{ estadisticas.total_monto?.toFixed(2) || '0.00' }}
              </div>
            </div>
          </div>

          <!-- Chips de estadísticas -->
          <div class="d-flex flex-wrap gap-2">
            <v-chip size="small" color="grey" variant="outlined">
              <v-icon start size="16">mdi-clock</v-icon>
              Pendientes: {{ estadisticas.por_estado?.pendientes || 0 }}
            </v-chip>

            <v-chip size="small" color="success" variant="outlined">
              <v-icon start size="16">mdi-check-all</v-icon>
              Completas: {{ estadisticas.por_estado?.validadas_completamente || 0 }}
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
              :class="{ 'bg-grey-lighten-3': solicitud.estado_validacion === 'pendiente' }"
            >
              <div class="d-flex justify-space-between align-start">
                <div class="solicitud-info flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <div class="font-weight-bold">{{ solicitud.numeroFormulario }}</div>
                    <v-chip size="x-small" class="ml-2" color="amber-lighten-4">
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
                    <span class="font-weight-medium">Actividad:</span>
                    {{ actividad?.nombre || 'N/A' }}
                    <span v-if="actividad?.codigo" class="ml-1"> ({{ actividad.codigo }}) </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Fecha Solicitud:</span>
                    {{ formatDate(solicitud.fechaSolicitud) }}
                    <span v-if="solicitud.fechaRealizacion" class="ml-2">
                      | <span class="font-weight-medium">Fecha Reposición:</span>
                      {{ formatDate(solicitud.fechaRealizacion) }}
                    </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Solicitante:</span>
                    {{ solicitud.solicitante?.nombre_completo }}
                    <span v-if="solicitud.solicitante?.cargo">
                      ({{ solicitud.solicitante?.cargo }})</span
                    >
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Motivo:</span>
                    {{ solicitud.motivoReposicion || 'No especificado' }}
                  </div>

                  <div class="text-caption">
                    <span class="font-weight-medium">Forma de pago:</span>
                    {{ solicitud.forma_pago_nombre || 'No especificado' }}
                  </div>

                  <!-- Detalles de gastos -->
                  <div v-if="solicitud.detalleGasto && solicitud.detalleGasto.items" class="mt-2">
                    <v-expansion-panels variant="accordion" flat>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="text-caption py-1">
                          <span class="font-weight-medium">Detalle de gastos</span>
                          <template v-slot:actions>
                            <v-icon color="amber-darken-3">mdi-chevron-down</v-icon>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-caption">
                          <div v-for="(item, index) in solicitud.detalleGasto.items" :key="index">
                            {{ item.concepto }}: Bs. {{ item.monto?.toFixed(2) || '0.00' }}
                            <span v-if="item.partida_sf" class="text-grey">
                              ({{ item.partida_sf }})
                            </span>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </div>

                <div class="solicitud-actions ml-3">
                  <v-btn
                    color="amber-darken-3"
                    size="small"
                    :to="{
                      path: `/monitoreo/formulario033/${props.actividadId}`,
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
                    <v-icon color="success" size="16">mdi-check-all</v-icon>
                    <div class="text-caption text-success">Validado</div>
                  </div>
                  <div
                    v-else-if="solicitud.validacionCoordinador || solicitud.validacionResponsable"
                    class="text-center mt-1"
                  >
                    <v-icon color="warning" size="16">mdi-check</v-icon>
                    <div class="text-caption text-warning">Parcial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin solicitudes -->
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-cash-remove</v-icon>
            <div class="text-h6 mb-2">No hay solicitudes de reposición</div>
            <div class="text-caption text-grey">
              No se encontraron solicitudes de reposición para esta actividad
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
import { useSolicitudReposicion } from '../../composables/useSolicitudReposicion'

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
const { listaSolReposicionActividadPei, obtenerListaSolReposicionPorIdActividadPei } =
  useSolicitudReposicion()

// Estados adicionales
const loading = ref(false)
const error = ref(null)
const estadisticas = ref(null)
const actividad = ref(null)

// Propiedad computada para obtener las solicitudes
const solicitudes = computed(() => {
  if (
    listaSolReposicionActividadPei.value &&
    listaSolReposicionActividadPei.value.solicitudes_reembolso
  ) {
    return listaSolReposicionActividadPei.value.solicitudes_reembolso
  }
  return []
})

// Función de carga
const cargarDatos = async () => {
  if (!props.actividadId) return

  loading.value = true
  error.value = null
  estadisticas.value = null
  actividad.value = null

  try {
    await obtenerListaSolReposicionPorIdActividadPei(props.actividadId)

    // Extraer estadísticas y actividad de la respuesta
    if (listaSolReposicionActividadPei.value) {
      estadisticas.value = listaSolReposicionActividadPei.value.estadisticas
      actividad.value = listaSolReposicionActividadPei.value.actividad
    }

    console.log('Datos cargados (reposición):', listaSolReposicionActividadPei.value)
    console.log('Estadísticas (reposición):', estadisticas.value)
  } catch (err) {
    console.error('Error al obtener la información:', err)
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

/* Estilos específicos para el panel de expansión */
.v-expansion-panel {
  background-color: transparent !important;
}

.v-expansion-panel-text {
  background-color: rgba(255, 193, 7, 0.05) !important;
}
</style>
