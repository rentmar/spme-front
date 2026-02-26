<template>
  <v-dialog v-model="dialog" max-width="800" @after-enter="cargarDatos">
    <v-card>
      <v-toolbar color="amber-darken-3" title="Validar Solicitud de Reposición (Subactividad) PEI">
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

        <!-- Estadísticas con IDs visibles -->
        <div v-if="!loading" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Solicitudes de Reposición</div>
              <div class="d-flex flex-wrap align-center gap-2 mt-1">
                <v-chip size="small" color="amber-darken-3" variant="outlined">
                  <v-icon start size="16">mdi-clipboard-list</v-icon>
                  Actividad ID: {{ props.actividadId }}
                </v-chip>
                <v-chip size="small" color="amber-darken-3" variant="outlined">
                  <v-icon start size="16">mdi-checkbox-marked-outline</v-icon>
                  Tarea ID: {{ props.tareaId }}
                </v-chip>
                <div class="text-caption text-grey">
                  {{ tarea?.titulo || 'Sin título' }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div v-if="estadisticas" class="text-caption">
                {{ estadisticas.total_solicitudes }} solicitudes
              </div>
              <!-- <div v-if="estadisticas?.total_monto" class="text-caption text-green">
                Total: Bs. {{ formatNumber(estadisticas.total_monto) }}
              </div> -->
            </div>
          </div>

          <!-- Chips de estadísticas -->
          <div v-if="estadisticas" class="d-flex flex-wrap gap-2">
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
                      Solicitud ID: {{ solicitud.id }}
                    </v-chip>
                    <v-chip size="x-small" class="ml-1" color="green-lighten-4">
                      Tarea ID: {{ solicitud.tarea }}
                    </v-chip>
                    <v-chip size="x-small" class="ml-1" color="orange-lighten-4">
                      Actividad ID: {{ solicitud.actividad }}
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
                    <span class="text-caption">
                      Monto: {{ formatCurrency(solicitud.montoSolicitado) }}
                    </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Actividad:</span>
                    {{ actividad?.nombre || 'N/A' }}
                    <span v-if="actividad?.descripcion" class="text-grey ml-1">
                      - {{ actividad.descripcion }}
                    </span>
                    <span class="text-grey ml-1">[ID: {{ props.actividadId }}]</span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">SubActividad:</span>
                    {{ tarea?.titulo || 'N/A' }}
                    <span v-if="tarea?.descripcion" class="text-grey ml-1">
                      - {{ tarea.descripcion }}
                    </span>
                    <span class="text-grey ml-1">[ID: {{ props.tareaId }}]</span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Fechas:</span>
                    Solicitud: {{ formatDate(solicitud.fechaSolicitud) }}
                    <span v-if="solicitud.fechaRealizacionActividad" class="ml-2">
                      | Actividad: {{ formatDate(solicitud.fechaRealizacionActividad) }}
                    </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Solicitante:</span>
                    {{ solicitud.solicitante?.nombre_completo }}
                    <span v-if="solicitud.solicitante?.cargo">
                      ({{ solicitud.solicitante?.cargo }})</span
                    >
                    <span class="text-grey ml-1"> [ID: {{ solicitud.solicitante?.id }}] </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Descripción Actividad:</span>
                    {{ solicitud.descripcion_actividad || 'No especificada' }}
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Objetivo Actividad:</span>
                    {{ solicitud.objetivo_actividad || 'No especificado' }}
                  </div>

                  <div class="text-caption">
                    <span class="font-weight-medium">Forma de pago:</span>
                    {{ solicitud.forma_pago_nombre || 'No especificado' }}
                    <span class="text-grey ml-1"> [FormaPago ID: {{ solicitud.formaPago }}] </span>
                    <span v-if="solicitud.lugarSolicitud" class="ml-2">
                      | <span class="font-weight-medium">Lugar:</span>
                      {{ solicitud.lugarSolicitud }}
                    </span>
                  </div>

                  <!-- Detalle de gastos de reposición -->
                  <!-- <div v-if="solicitud.detalleDestinoFondos" class="mt-2">
                    <v-expansion-panels variant="accordion" flat>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="text-caption py-1">
                          <span class="font-weight-medium">Detalle de gastos a reponer</span>
                          <template v-slot:actions>
                            <v-icon color="amber-darken-3">mdi-chevron-down</v-icon>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-caption">
                          <div
                            v-if="solicitud.detalleDestinoFondos.items"
                            v-for="(item, index) in solicitud.detalleDestinoFondos.items"
                            :key="index"
                          >
                            <div class="d-flex justify-space-between">
                              <div>
                                <span class="font-weight-medium">{{ item.concepto }}</span>
                                <div class="text-grey">
                                  Fecha: {{ formatDate(item.fecha) }} | Partida: {{ item.partida }}
                                  <span v-if="item.factura_recibo">
                                    | Factura: {{ item.factura_recibo }}
                                  </span>
                                </div>
                              </div>
                              <div class="font-weight-medium">
                                {{ formatCurrency(item.monto) }}
                              </div>
                            </div>
                            <v-divider
                              v-if="index < solicitud.detalleDestinoFondos.items.length - 1"
                              class="my-1"
                            />
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div> -->

                  <!-- Información de pago específica -->
                  <!-- <div v-if="solicitud.datos_forma_pago" class="mt-2">
                    <v-expansion-panels variant="accordion" flat>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="text-caption py-1">
                          <span class="font-weight-medium">Información de pago</span>
                          <template v-slot:actions>
                            <v-icon color="amber-darken-3">mdi-chevron-down</v-icon>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-caption">
                          <div
                            v-if="
                              solicitud.formaPago === 2 && solicitud.datos_forma_pago.transferencia
                            "
                          >
                            <div class="font-weight-medium">Transferencia Bancaria:</div>
                            <div>
                              Nombre:
                              {{ solicitud.datos_forma_pago.transferencia.nombre_transferencia }}
                            </div>
                            <div>
                              CI: {{ solicitud.datos_forma_pago.transferencia.ci_transferencia }}
                            </div>
                            <div>
                              Banco: {{ solicitud.datos_forma_pago.transferencia.entidad_bancaria }}
                            </div>
                            <div>
                              Tipo Cuenta:
                              {{ solicitud.datos_forma_pago.transferencia.tipo_cuenta }}
                            </div>
                            <div>
                              N° Cuenta:
                              {{ solicitud.datos_forma_pago.transferencia.numero_cuenta }}
                            </div>
                          </div>
                          <div
                            v-else-if="
                              solicitud.formaPago === 1 && solicitud.datos_forma_pago.otros
                            "
                          >
                            <div class="font-weight-medium">Efectivo:</div>
                            <div>Recibe: {{ solicitud.datos_forma_pago.otros.nombre_otros }}</div>
                            <div>CI: {{ solicitud.datos_forma_pago.otros.ci_otros }}</div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div> -->
                </div>

                <div class="solicitud-actions ml-3">
                  <v-btn
                    color="amber-darken-3"
                    size="small"
                    :to="{
                      path: `/monitoreo/pei/formulariopei033/${props.actividadId}`,
                      query: {
                        solicitud_id: solicitud.id,
                        tarea_id: props.tareaId,
                      },
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
            <div class="d-flex justify-center gap-2 mt-2">
              <v-chip size="small" color="amber-darken-3" variant="outlined">
                Actividad ID: {{ props.actividadId }}
              </v-chip>
              <v-chip size="small" color="amber-darken-3" variant="outlined">
                Tarea ID: {{ props.tareaId }}
              </v-chip>
            </div>
            <div class="text-caption text-grey mt-2">
              No se encontraron solicitudes de reposición para esta tarea
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error && !loading" class="pa-4 text-center">
          <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <div class="text-h6 mb-2 text-error">Error al cargar datos</div>
          <div class="d-flex justify-center gap-2 mb-3">
            <v-chip size="small" color="error" variant="outlined">
              Actividad ID: {{ props.actividadId }}
            </v-chip>
            <v-chip size="small" color="error" variant="outlined">
              Tarea ID: {{ props.tareaId }}
            </v-chip>
          </div>
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
  tareaId: {
    type: Number,
    required: true,
  },
})

// Iniciar el composable
const { listaSolReposicionTareaPei, obtenerListaSolReposicionPorIdTareaPei } =
  useSolicitudReposicion()

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// Estados adicionales
const loading = ref(false)
const error = ref(null)
const estadisticas = ref(null)
const actividad = ref(null)
const tarea = ref(null)

// Propiedad computada para obtener las solicitudes
const solicitudes = computed(() => {
  if (listaSolReposicionTareaPei.value && listaSolReposicionTareaPei.value.solicitudes) {
    return listaSolReposicionTareaPei.value.solicitudes
  }
  return []
})

// Función de carga
const cargarDatos = async () => {
  if (!props.actividadId || !props.tareaId) return

  loading.value = true
  error.value = null
  estadisticas.value = null
  actividad.value = null
  tarea.value = null

  try {
    await obtenerListaSolReposicionPorIdTareaPei(props.actividadId, props.tareaId)

    // Extraer estadísticas, actividad y tarea de la respuesta
    if (listaSolReposicionTareaPei.value) {
      estadisticas.value = listaSolReposicionTareaPei.value.estadisticas
      actividad.value = listaSolReposicionTareaPei.value.actividad
      tarea.value = listaSolReposicionTareaPei.value.tarea
    }

    console.log('Datos cargados (reposición tarea):', listaSolReposicionTareaPei.value)
    console.log('Estadísticas (reposición tarea):', estadisticas.value)
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

// const formatNumber = (num) => {
//   return Number(num || 0).toFixed(2)
// }

const getValidationColor = (item) => {
  if (item.validacionResponsable && item.validacionCoordinador) return 'success'
  if (item.validacionResponsable || item.validacionCoordinador) return 'warning'
  return 'error'
}

const getValidationText = (item) => {
  if (item.validacionResponsable && item.validacionCoordinador) return 'Validado'
  if (item.validacionResponsable || item.validacionCoordinador) return 'Parcial'
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

// También cargar cuando cambian los IDs
watch(
  () => [props.actividadId, props.tareaId],
  () => {
    if (dialog.value) {
      cargarDatos()
    }
  },
  { deep: true },
)
</script>

<style scoped>
.text-error {
  color: #f44336;
}

.text-green {
  color: #4caf50;
}

.text-red {
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
