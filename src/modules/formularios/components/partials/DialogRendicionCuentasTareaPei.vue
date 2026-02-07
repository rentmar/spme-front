<template>
  <v-dialog v-model="dialog" max-width="800" @after-enter="cargarDatos">
    <v-card>
      <v-toolbar color="red-darken-2" title="Validar Rendición de Cuentas (Subactividad)">
        <template v-slot:prepend>
          <v-icon color="white">mdi-file-chart-check</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <!-- Indicador de carga -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="red-darken-2"
          height="4"
          class="mb-4"
        ></v-progress-linear>

        <!-- Estadísticas con IDs visibles -->
        <div v-if="!loading" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Rendiciones de Cuentas</div>
              <div class="d-flex flex-wrap align-center gap-2 mt-1">
                <v-chip size="small" color="red-darken-2" variant="outlined">
                  <v-icon start size="16">mdi-clipboard-list</v-icon>
                  Actividad ID: {{ props.actividadId }}
                </v-chip>
                <v-chip size="small" color="red-darken-2" variant="outlined">
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
                {{ estadisticas.total_solicitudes }} rendiciones
              </div>
              <!-- <div v-if="estadisticas?.total_monto_descargado" class="text-caption text-green">
                Descargado: Bs. {{ formatNumber(estadisticas.total_monto_descargado) }}
              </div> -->
              <!-- <div
                v-if="estadisticas?.total_saldo"
                class="text-caption"
                :class="getSaldoColor(estadisticas.total_saldo)"
              >
                Saldo: Bs. {{ formatNumber(estadisticas.total_saldo) }}
              </div> -->
            </div>
          </div>

          <!-- Chips de estadísticas -->
          <div v-if="estadisticas" class="d-flex flex-wrap gap-2">
            <v-chip size="small" color="grey" variant="outlined">
              <v-icon start size="16">mdi-clock</v-icon>
              Pendientes: {{ estadisticas.por_estado?.pendientes || 0 }}
            </v-chip>
            <v-chip size="small" color="warning" variant="outlined">
              <v-icon start size="16">mdi-check</v-icon>
              Parciales: {{ estadisticas.por_estado?.validadas_parcialmente || 0 }}
            </v-chip>
            <v-chip size="small" color="success" variant="outlined">
              <v-icon start size="16">mdi-check-all</v-icon>
              Completas: {{ estadisticas.por_estado?.validadas_completamente || 0 }}
            </v-chip>
          </div>
        </div>

        <!-- Lista de rendiciones -->
        <div v-if="!loading">
          <div v-if="rendiciones.length > 0" class="rendiciones-list mt-4">
            <div
              v-for="rendicion in rendiciones"
              :key="rendicion.id"
              class="rendicion-item mb-3 pa-3"
              :class="{ 'bg-grey-lighten-3': rendicion.estado_validacion === 'pendiente' }"
            >
              <div class="d-flex justify-space-between align-start">
                <div class="rendicion-info flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <div class="font-weight-bold">{{ rendicion.numeroFormulario }}</div>
                    <v-chip size="x-small" class="ml-2" color="red-lighten-4">
                      Rendición ID: {{ rendicion.id }}
                    </v-chip>
                    <v-chip size="x-small" class="ml-1" color="green-lighten-4">
                      Tarea ID: {{ rendicion.tarea }}
                    </v-chip>
                    <v-chip size="x-small" class="ml-1" color="orange-lighten-4">
                      Actividad ID: {{ rendicion.actividad }}
                    </v-chip>
                  </div>

                  <div class="d-flex align-center mb-1">
                    <v-chip
                      small
                      :color="getValidationColor(rendicion)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getValidationText(rendicion) }}
                    </v-chip>
                    <span class="text-caption">
                      Descargado: {{ formatCurrency(rendicion.montoDescargado) }}
                    </span>
                  </div>

                  <!-- Información de montos -->
                  <div class="d-flex flex-wrap gap-2 mb-2">
                    <div class="text-caption">
                      <span class="font-weight-medium">Asignado:</span>
                      {{ formatCurrency(rendicion.montoAsignado) }}
                    </div>
                    <div class="text-caption">
                      <span class="font-weight-medium">Saldo:</span>
                      <span :class="getSaldoColor(rendicion.saldo)">
                        {{ formatCurrency(rendicion.saldo) }}
                      </span>
                    </div>
                    <div class="text-caption">
                      <span class="font-weight-medium">Comprobante:</span>
                      {{ rendicion.cpteDiario || 'N/A' }}
                    </div>
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
                    Rendición: {{ formatDate(rendicion.fechaRendicion) }}
                    <span v-if="rendicion.fechaDesembolso" class="ml-2">
                      | Desembolso: {{ formatDate(rendicion.fechaDesembolso) }}
                    </span>
                    <span v-if="rendicion.fechaActividad" class="ml-2">
                      | Actividad: {{ formatDate(rendicion.fechaActividad) }}
                    </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Rendidor:</span>
                    {{ rendicion.usuario_info?.nombre_completo }}
                    <span v-if="rendicion.usuario_info?.cargo">
                      ({{ rendicion.usuario_info?.cargo }})</span
                    >
                    <span class="text-grey ml-1"> [ID: {{ rendicion.usuario_info?.id }}] </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Descripción Actividad:</span>
                    {{ rendicion.descripcionActividad || 'No especificada' }}
                  </div>

                  <div class="text-caption">
                    <span class="font-weight-medium">Lugares:</span>
                    Actividad: {{ rendicion.lugarActividad || 'N/A' }}
                    <span v-if="rendicion.lugarRendicion" class="ml-2">
                      | Rendición: {{ rendicion.lugarRendicion }}
                    </span>
                  </div>

                  <!-- Detalle de gastos rendidos -->
                  <!-- <div
                    v-if="rendicion.detalleDestinoFondos && rendicion.detalleDestinoFondos.length"
                    class="mt-2"
                  >
                    <v-expansion-panels variant="accordion" flat>
                      <v-expansion-panel>
                        <v-expansion-panel-title class="text-caption py-1">
                          <span class="font-weight-medium">Detalle de gastos rendidos</span>
                          <template v-slot:actions>
                            <v-icon color="red-darken-2">mdi-chevron-down</v-icon>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-caption">
                          <div
                            v-for="(item, index) in rendicion.detalleDestinoFondos"
                            :key="index"
                            class="mb-1"
                          >
                            <div class="d-flex justify-space-between">
                              <div>
                                <span class="font-weight-medium">{{ item.descripcion }}</span>
                                <div class="text-grey">
                                  Fecha: {{ formatDate(item.fecha) }} | Partida: {{ item.partida }}
                                  <span v-if="item.factura_recibo">
                                    | Factura: {{ item.factura_recibo }}
                                  </span>
                                </div>
                              </div>
                              <div class="text-right">
                                <div class="font-weight-medium">
                                  {{ formatCurrency(item.monto) }}
                                </div>
                              </div>
                            </div>
                            <v-divider
                              v-if="index < rendicion.detalleDestinoFondos.length - 1"
                              class="my-1"
                            />
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div> -->

                  <!-- Información de relaciones -->
                  <div class="text-caption mt-1">
                    <span class="font-weight-medium">Solicitud Fondos ID:</span>
                    {{ rendicion.solicitudFondos || 'N/A' }}
                    <span v-if="rendicion.solicitudReembolso" class="ml-2">
                      | <span class="font-weight-medium">Reembolso ID:</span>
                      {{ rendicion.solicitudReembolso }}
                    </span>
                    <span v-if="rendicion.solicitudViaje" class="ml-2">
                      | <span class="font-weight-medium">Viaje ID:</span>
                      {{ rendicion.solicitudViaje }}
                    </span>
                    <span v-if="rendicion.solicitudPagoDirecto" class="ml-2">
                      | <span class="font-weight-medium">Pago Directo ID:</span>
                      {{ rendicion.solicitudPagoDirecto }}
                    </span>
                  </div>
                </div>

                <div class="rendicion-actions ml-3">
                  <v-btn
                    color="red-darken-2"
                    size="small"
                    :to="{
                      path: `/monitoreo/formulario022/${props.actividadId}`,
                      query: {
                        solicitud_id: rendicion.id,
                        tarea_id: props.tareaId,
                      },
                    }"
                    @click.stop
                  >
                    Ver
                  </v-btn>

                  <div
                    v-if="
                      rendicion.validacionCoordinador &&
                      rendicion.validacionResponsable &&
                      rendicion.validacionContador &&
                      rendicion.validacionAdministrador
                    "
                    class="text-center mt-1"
                  >
                    <v-icon color="success" size="16">mdi-check-all</v-icon>
                    <div class="text-caption text-success">Validado</div>
                  </div>
                  <div
                    v-else-if="
                      rendicion.validacionCoordinador ||
                      rendicion.validacionResponsable ||
                      rendicion.validacionContador ||
                      rendicion.validacionAdministrador
                    "
                    class="text-center mt-1"
                  >
                    <v-icon color="warning" size="16">mdi-check</v-icon>
                    <div class="text-caption text-warning">Parcial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin rendiciones -->
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-file-remove</v-icon>
            <div class="text-h6 mb-2">No hay rendiciones de cuentas</div>
            <div class="d-flex justify-center gap-2 mt-2">
              <v-chip size="small" color="red-darken-2" variant="outlined">
                Actividad ID: {{ props.actividadId }}
              </v-chip>
              <v-chip size="small" color="red-darken-2" variant="outlined">
                Tarea ID: {{ props.tareaId }}
              </v-chip>
            </div>
            <div class="text-caption text-grey mt-2">
              No se encontraron rendiciones de cuentas para esta tarea
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

// Iniciar el composable
const { listaRendicionCuentasTareaPei, obtenerListaRendicionCuentasPorIdTareaPei } =
  useRendicionCuentas()

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

// Propiedad computada para obtener las rendiciones
const rendiciones = computed(() => {
  if (listaRendicionCuentasTareaPei.value && listaRendicionCuentasTareaPei.value.solicitudes) {
    return listaRendicionCuentasTareaPei.value.solicitudes
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
    await obtenerListaRendicionCuentasPorIdTareaPei(props.actividadId, props.tareaId)

    // Extraer estadísticas, actividad y tarea de la respuesta
    if (listaRendicionCuentasTareaPei.value) {
      estadisticas.value = listaRendicionCuentasTareaPei.value.estadisticas
      actividad.value = listaRendicionCuentasTareaPei.value.actividad
      tarea.value = listaRendicionCuentasTareaPei.value.tarea
    }

    console.log('Datos cargados (rendición tarea):', listaRendicionCuentasTareaPei.value)
    console.log('Estadísticas (rendición tarea):', estadisticas.value)
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
  // Para rendición de cuentas, hay 4 validaciones
  if (
    item.validacionCoordinador &&
    item.validacionResponsable &&
    item.validacionContador &&
    item.validacionAdministrador
  )
    return 'success'
  if (
    item.validacionCoordinador ||
    item.validacionResponsable ||
    item.validacionContador ||
    item.validacionAdministrador
  )
    return 'warning'
  return 'error'
}

const getValidationText = (item) => {
  if (
    item.validacionCoordinador &&
    item.validacionResponsable &&
    item.validacionContador &&
    item.validacionAdministrador
  )
    return 'Validado'
  if (
    item.validacionCoordinador ||
    item.validacionResponsable ||
    item.validacionContador ||
    item.validacionAdministrador
  )
    return 'Parcial'
  return 'Pendiente'
}

const getSaldoColor = (saldo) => {
  const num = Number(saldo) || 0
  if (num >= 0) return 'text-green'
  return 'text-red'
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

.rendicion-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.rendicion-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.rendicion-info {
  min-width: 0;
}

.rendicion-actions {
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
  background-color: rgba(244, 67, 54, 0.05) !important;
}
</style>
