<template>
  <v-dialog v-model="dialog" max-width="800" @after-enter="cargarDatos">
    <v-card>
      <v-toolbar color="blue-darken-2" title="Validar Solicitud de Pago Directo PEI">
        <template v-slot:prepend>
          <v-icon color="white">mdi-credit-card-check</v-icon>
        </template>
      </v-toolbar>

      <v-card-text>
        <!-- Indicador de carga -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="blue-darken-2"
          height="4"
          class="mb-4"
        ></v-progress-linear>

        <!-- Estadísticas -->
        <div v-if="!loading" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-h6">Solicitudes de Pago Directo</div>
              <div class="text-caption text-grey">Actividad ID: {{ props.actividadId }}</div>
              <div v-if="actividad" class="text-caption">
                <strong>{{ actividad.nombre_corto || 'Sin nombre' }}</strong>
              </div>
            </div>
            <div class="text-right">
              <div v-if="estadisticas" class="text-caption">
                {{ estadisticas.total_solicitudes || 0 }} solicitudes
              </div>
              <div v-if="estadisticas?.total_monto" class="text-caption text-green">
                Total: Bs. {{ formatNumber(estadisticas.total_monto) }}
              </div>
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
              :class="{
                'bg-grey-lighten-3': getValidationText(solicitud) === 'Pendiente',
                'bg-green-lighten-5': getValidationText(solicitud) === 'Validado',
              }"
            >
              <div class="d-flex justify-space-between align-start">
                <div class="solicitud-info flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <div class="font-weight-bold">
                      {{ solicitud.numeroFormulario || 'Sin número' }}
                    </div>
                    <v-chip size="x-small" class="ml-2" color="blue-lighten-4">
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
                      {{ solicitud.estado_validacion_display || getValidationText(solicitud) }}
                    </v-chip>
                    <span class="text-caption"
                      >Monto: {{ formatCurrency(solicitud.montoSolicitado) }}</span
                    >
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Actividad:</span>
                    {{ actividad?.nombre_corto || 'N/A' }}
                    <span v-if="actividad?.codigo" class="ml-1"> ({{ actividad.codigo }}) </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Fecha Solicitud:</span>
                    {{ formatDate(solicitud.fechaSolicitud) }}
                    <span v-if="solicitud.fechaRealizacionActividad" class="ml-2">
                      | <span class="font-weight-medium">Fecha Actividad:</span>
                      {{ formatDate(solicitud.fechaRealizacionActividad) }}
                    </span>
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Solicitante:</span>
                    {{ solicitud.solicitante?.nombre_completo || 'No especificado' }}
                    <span v-if="solicitud.solicitante?.cargo">
                      ({{ solicitud.solicitante?.cargo }})</span
                    >
                  </div>

                  <div class="text-caption mb-1">
                    <span class="font-weight-medium">Forma de pago:</span>
                    {{ solicitud.forma_pago_nombre || 'No especificada' }}
                  </div>

                  <!-- Detalles adicionales de transferencia/efectivo -->
                  <div v-if="solicitud.datos_forma_pago" class="text-caption">
                    <div
                      v-if="solicitud.formaPago === 2 && solicitud.datos_forma_pago.transferencia"
                    >
                      <span class="font-weight-medium">Cuenta:</span>
                      {{ solicitud.datos_forma_pago.transferencia.entidad_bancaria || 'N/A' }} -
                      {{ solicitud.datos_forma_pago.transferencia.numero_cuenta || 'N/A' }}
                    </div>
                    <div v-else-if="solicitud.formaPago === 1 && solicitud.datos_forma_pago.otros">
                      <span class="font-weight-medium">Recibe:</span>
                      {{ solicitud.datos_forma_pago.otros.nombre_otros || 'N/A' }}
                    </div>
                  </div>
                </div>

                <div class="solicitud-actions ml-3 d-flex flex-column">
                  <v-btn
                    color="blue-darken-2"
                    size="small"
                    :to="{
                      path: `/monitoreo/formulario088/${props.actividadId}`,
                      query: { solicitud_id: solicitud.id },
                    }"
                    @click.stop
                    class="mb-2"
                  >
                    Ver
                  </v-btn>

                  <div class="d-flex flex-column align-center">
                    <div
                      v-if="solicitud.validacionCoordinador && solicitud.validacionResponsable"
                      class="text-center"
                    >
                      <v-icon color="success" size="16">mdi-check-all</v-icon>
                      <div class="text-caption text-success">Validado</div>
                    </div>
                    <div
                      v-else-if="solicitud.validacionCoordinador || solicitud.validacionResponsable"
                      class="text-center"
                    >
                      <v-icon color="warning" size="16">mdi-check</v-icon>
                      <div class="text-caption text-warning">Parcial</div>
                    </div>
                    <div v-else class="text-center">
                      <v-icon color="grey" size="16">mdi-clock-outline</v-icon>
                      <div class="text-caption text-grey">Pendiente</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin solicitudes -->
          <div v-else-if="!loading && !error" class="pa-8 text-center">
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-credit-card-off</v-icon>
            <div class="text-h6 mb-2">No hay solicitudes de pago directo</div>
            <div class="text-caption text-grey">
              No se encontraron solicitudes de pago directo para esta actividad
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
import { useSolicitudPagoDirecto } from '../../composables/useSolicitudPagoDirecto'

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
const { listaSolPagoDirectoActividadPei, obtenerListaSolPagoDirectoPorIdActividadPei } =
  useSolicitudPagoDirecto()

// Estados adicionales
const loading = ref(false)
const error = ref(null)
const estadisticas = ref(null)
const actividad = ref(null)

// CORRECCIÓN: Acceso correcto a las solicitudes
const solicitudes = computed(() => {
  const data = listaSolPagoDirectoActividadPei.value

  if (data && data.solicitudes_pago_directo && Array.isArray(data.solicitudes_pago_directo)) {
    return data.solicitudes_pago_directo
  }
  return []
})

// Función de carga corregida
const cargarDatos = async () => {
  if (!props.actividadId) {
    error.value = 'ID de actividad no proporcionado'
    return
  }

  loading.value = true
  error.value = null
  estadisticas.value = null
  actividad.value = null

  try {
    await obtenerListaSolPagoDirectoPorIdActividadPei(props.actividadId)

    // Extraer estadísticas y actividad de la respuesta
    const data = listaSolPagoDirectoActividadPei.value

    if (data) {
      // CORRECCIÓN: actividad_pei en lugar de actividad
      actividad.value = data.actividad_pei || null
      estadisticas.value = data.estadisticas || null
    }

    console.log('Datos cargados (pago directo):', data)
    console.log('Actividad:', actividad.value)
    console.log('Estadísticas:', estadisticas.value)
    console.log('Solicitudes:', solicitudes.value)
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

const formatNumber = (num) => {
  return Number(num || 0).toFixed(2)
}

const getValidationColor = (item) => {
  if (item.validacionCoordinador && item.validacionResponsable) return 'success'
  if (item.validacionCoordinador || item.validacionResponsable) return 'warning'
  return 'grey'
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

.text-green {
  color: #4caf50;
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

.bg-green-lighten-5 {
  background-color: rgba(76, 175, 80, 0.05);
}

.v-chip {
  font-size: 12px;
  height: 24px;
}
</style>
