<template>
  <div class="procedencia-fondos-wrapper">
    <!-- Desglose de Procedencia de Fondos -->
    <div class="mb-6">
      <div class="d-flex justify-space-between align-center mb-3">
        <h4 class="text-h6 primary--text mb-0">Procedencia de Fondos y Presupuesto</h4>

        <!-- Indicador de estado -->
        <v-chip :color="getColorEstado" variant="outlined" size="small" prepend-icon="mdi-cash">
          {{ estadoPresupuesto }}
        </v-chip>
      </div>

      <!-- CASO 1: Con datos de procedencia (fondos existe y es array) -->
      <template v-if="tieneDatosFondos">
        <v-table class="elevation-1 rounded-lg mb-4">
          <thead>
            <tr>
              <th class="text-subtitle-2 font-weight-bold">Fuente de Fondos</th>
              <th class="text-subtitle-2 font-weight-bold">Tipo</th>
              <th class="text-subtitle-2 font-weight-bold">Monto Planificado (Bs.)</th>
              <th class="text-subtitle-2 font-weight-bold">Monto Ejecutado (Bs.)</th>
              <th class="text-subtitle-2 font-weight-bold">Diferencia</th>
              <th class="text-subtitle-2 font-weight-bold">Verificado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fondo, index) in procedenciaFondos" :key="fondo.id || index">
              <td class="font-weight-medium">{{ fondo.nombre }}</td>
              <td>
                <v-chip :color="fondo.esExistente ? 'blue' : 'orange'" size="small">
                  {{ fondo.esExistente ? 'Existente' : 'Nuevo' }}
                </v-chip>
              </td>
              <td class="text-right">{{ formatearMoneda(fondo.monto) }}</td>
              <td>
                <v-text-field
                  v-model.number="fondosEditables[index].montoEjecutado"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="0.00"
                  :min="0"
                  :max="fondo.monto"
                  step="0.01"
                  :disabled="fondosEditables[index].verificado"
                  @update:model-value="actualizarFondo(index, $event)"
                >
                  <template v-if="fondosEditables[index].verificado" v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="green" size="small">mdi-lock</v-icon>
                      </template>
                      <span>Monto bloqueado por verificación</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </td>
              <td
                class="text-right"
                :class="
                  getColorDiferencia(fondo.monto - (fondosEditables[index].montoEjecutado || 0))
                "
              >
                {{ formatearMoneda(fondo.monto - (fondosEditables[index].montoEjecutado || 0)) }}
              </td>
              <td class="text-center">
                <v-checkbox
                  v-model="fondosEditables[index].verificado"
                  hide-details
                  class="mt-0"
                  @update:model-value="manejarVerificacion(index, $event)"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-weight-bold" style="background-color: #f5f5f5">
              <td class="text-subtitle-2" colspan="2">TOTAL</td>
              <td class="text-right text-subtitle-2">
                {{ formatearMoneda(totalPlanificado) }}
              </td>
              <td class="text-right text-subtitle-2">
                {{ formatearMoneda(totalEjecutado) }}
              </td>
              <td class="text-right text-subtitle-2" :class="getColorDiferencia(diferenciaTotal)">
                {{ formatearMoneda(diferenciaTotal) }}
              </td>
              <td class="text-center">
                <v-icon
                  :color="todosVerificados ? 'success' : 'grey'"
                  :title="todosVerificados ? 'Todos verificados' : 'Pendientes de verificar'"
                >
                  {{ todosVerificados ? 'mdi-check-circle' : 'mdi-progress-clock' }}
                </v-icon>
              </td>
            </tr>
          </tfoot>
        </v-table>

        <v-alert type="info" variant="tonal" class="mb-4">
          <template v-slot:prepend>
            <v-icon color="info">mdi-information</v-icon>
          </template>
          <strong>Modo con desglose:</strong> Ingrese el monto ejecutado para cada fuente de fondos
          individualmente. <strong>Una vez verificado, el monto no podrá modificarse.</strong>
        </v-alert>
      </template>

      <!-- CASO 2: Sin datos de procedencia (fondos es null) pero con presupuestoTotal -->
      <template v-else-if="tienePresupuestoTotal">
        <v-alert
          :type="presupuestoTotalPlanificado === 0 ? 'warning' : 'info'"
          variant="tonal"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon :color="presupuestoTotalPlanificado === 0 ? 'warning' : 'info'">
              {{ presupuestoTotalPlanificado === 0 ? 'mdi-alert' : 'mdi-information' }}
            </v-icon>
          </template>
          <div v-if="presupuestoTotalPlanificado === 0">
            <strong>Actividad sin presupuesto asignado.</strong>
            No se definió un presupuesto para esta actividad.
          </div>
          <div v-else>
            <strong>Presupuesto sin desglose de procedencia.</strong>
            Puede ingresar el presupuesto ejecutado de forma manual.
          </div>
        </v-alert>

        <template v-if="presupuestoTotalPlanificado > 0">
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-h6 pa-4">
              <v-icon class="mr-2" color="primary">mdi-cash</v-icon>
              Presupuesto Manual
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="formatearMoneda(presupuestoTotalPlanificado)"
                    label="Presupuesto Total Planificado"
                    variant="outlined"
                    readonly
                    bg-color="grey-lighten-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="presupuestoEjecutadoManual"
                    label="Presupuesto Total Ejecutado"
                    variant="outlined"
                    type="number"
                    :min="0"
                    step="0.01"
                    :disabled="presupuestoVerificado"
                    bg-color="green-lighten-5"
                    placeholder="Ingrese el monto ejecutado total"
                    @update:model-value="actualizarEjecutadoManual"
                    :hint="
                      presupuestoEjecutadoManual > 0
                        ? `Diferencia: ${formatearMoneda(diferenciaTotalGeneral)}`
                        : ''
                    "
                    persistent-hint
                  >
                    <template v-if="presupuestoVerificado" v-slot:append>
                      <!-- CORRECCIÓN AQUÍ: quitar .value -->
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="green" size="small">mdi-lock</v-icon>
                        </template>
                        <span>Monto bloqueado por verificación</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <!-- Verificación para presupuesto manual -->
              <v-row class="mt-2">
                <v-col cols="12">
                  <v-checkbox
                    v-model="presupuestoVerificado"
                    label="Verificar presupuesto ejecutado"
                    color="primary"
                    hide-details
                    @update:model-value="manejarVerificacionManual($event)"
                  >
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <span>Verificar presupuesto ejecutado</span>
                        <v-tooltip v-if="presupuestoVerificado" location="top">
                          <!-- CORRECCIÓN AQUÍ: quitar .value -->
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" color="green" class="ml-2" size="small"
                              >mdi-lock</v-icon
                            >
                          </template>
                          <span>El presupuesto está verificado y bloqueado</span>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>

              <!-- Resumen rápido -->
              <v-row v-if="presupuestoEjecutadoManual > 0" class="mt-4">
                <v-col cols="12">
                  <v-card variant="flat" color="grey-lighten-4" class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="text-caption">Diferencia</div>
                        <div :class="['text-h6', getColorDiferencia(diferenciaTotalGeneral)]">
                          {{ formatearMoneda(diferenciaTotalGeneral) }}
                        </div>
                      </div>
                      <div>
                        <div class="text-caption">Porcentaje de Ejecución</div>
                        <div class="text-h6" :class="getColorDiferencia(diferenciaTotalGeneral)">
                          {{ porcentajeEjecucionTotal }}%
                        </div>
                      </div>
                      <v-chip :color="getColorPorcentajeChip(porcentajeEjecucionTotal)">
                        {{ getEstadoEjecucion(porcentajeEjecucionTotal) }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </template>

      <!-- CASO 3: Ambos son nulos (fondos null y presupuestoTotal null o 0) -->
      <template v-else>
        <v-alert type="warning" variant="tonal" class="mb-4">
          <template v-slot:prepend>
            <v-icon color="warning">mdi-alert</v-icon>
          </template>
          <strong>Presupuesto no definido.</strong>
          Esta actividad no tiene información de presupuesto ni procedencia de fondos.
        </v-alert>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6 pa-4">
            <v-icon class="mr-2" color="warning">mdi-cash-remove</v-icon>
            Presupuesto no Definido
          </v-card-title>
          <v-card-text class="text-center py-6">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-cash-off</v-icon>
            <p class="text-body-1 text-grey">
              No se ha definido información de presupuesto para esta actividad.
            </p>
            <p class="text-caption text-grey mt-2">
              Si corresponde, puede registrar el monto ejecutado manualmente:
            </p>

            <v-row class="mt-4">
              <v-col cols="12" md="6" offset-md="3">
                <v-text-field
                  v-model.number="presupuestoEjecutadoManual"
                  label="Monto Ejecutado (opcional)"
                  variant="outlined"
                  type="number"
                  :min="0"
                  step="0.01"
                  :disabled="presupuestoVerificado"
                  bg-color="orange-lighten-5"
                  placeholder="Ingrese monto si corresponde"
                  @update:model-value="actualizarEjecutadoManual"
                  hint="Este campo es opcional para actividades sin presupuesto"
                  persistent-hint
                >
                  <template v-if="presupuestoVerificado" v-slot:append>
                    <!-- CORRECCIÓN AQUÍ: quitar .value -->
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="green" size="small">mdi-lock</v-icon>
                      </template>
                      <span>Monto bloqueado por verificación</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- Verificación opcional -->
            <v-row v-if="presupuestoEjecutadoManual > 0" class="mt-2">
              <v-col cols="12">
                <v-checkbox
                  v-model="presupuestoVerificado"
                  label="Verificar monto ejecutado (opcional)"
                  color="primary"
                  hide-details
                  @update:model-value="manejarVerificacionManual($event)"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </div>

    <!-- Resumen de Presupuesto (solo mostrar si hay datos) -->
    <div class="mb-6" v-if="mostrarResumen">
      <h4 class="text-h6 mb-3 primary--text">Resumen Presupuestario</h4>
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-4 h-100">
            <v-card-title class="text-h6 pa-0 mb-2">
              <v-icon class="mr-2" :color="getColorIconoPlanificado">
                {{ getIconoPlanificado }}
              </v-icon>
              {{ getTextoPlanificado }}
            </v-card-title>

            <div class="text-center py-4">
              <div class="text-h4 font-weight-bold" :class="getColorTextoPlanificado">
                {{ formatearMoneda(presupuestoTotalPlanificado) }}
              </div>
              <div class="text-caption text-grey mt-1">
                {{ getSubtituloPlanificado }}
              </div>
            </div>

            <v-divider class="my-3" v-if="observacionesPresupuesto"></v-divider>

            <v-textarea
              v-model="observacionesPresupuesto"
              label="Observaciones del Presupuesto"
              variant="outlined"
              rows="2"
              placeholder="Observaciones adicionales sobre el presupuesto..."
              @update:model-value="actualizarObservaciones"
              v-if="mostrarObservaciones"
            ></v-textarea>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-4 h-100">
            <v-card-title class="text-h6 pa-0 mb-2">
              <v-icon class="mr-2" color="green">mdi-cash-check</v-icon>
              Ejecutado
            </v-card-title>

            <div class="text-center py-4">
              <div class="text-h4 font-weight-bold green--text">
                {{ formatearMoneda(totalEjecutado) }}
              </div>
              <div class="text-caption text-grey mt-1">Monto Total Ejecutado</div>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Indicadores de ejecución (solo si hay presupuesto planificado) -->
            <div class="mb-3" v-if="presupuestoTotalPlanificado > 0">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Progreso de ejecución:</span>
                <span class="text-caption font-weight-medium">
                  {{ porcentajeEjecucionTotal }}%
                </span>
              </div>
              <v-progress-linear
                :model-value="parseFloat(porcentajeEjecucionTotal)"
                height="10"
                :color="getColorPorcentajeBar(porcentajeEjecucionTotal)"
                rounded
              ></v-progress-linear>
            </div>

            <!-- Diferencia (solo si hay presupuesto planificado o ejecutado) -->
            <div
              v-if="presupuestoTotalPlanificado > 0 || totalEjecutado > 0"
              class="d-flex justify-space-between align-center"
            >
              <div>
                <div class="text-caption">Diferencia</div>
                <div :class="['text-h6', getColorDiferencia(diferenciaTotalGeneral)]">
                  {{ formatearMoneda(diferenciaTotalGeneral) }}
                </div>
              </div>
              <v-chip
                :color="getColorEstadoEjecucion"
                size="small"
                v-if="presupuestoTotalPlanificado > 0"
              >
                {{ getEstadoEjecucion(porcentajeEjecucionTotal) }}
              </v-chip>
            </div>

            <!-- Mensaje cuando no hay presupuesto planificado pero sí ejecutado -->
            <div v-else-if="totalEjecutado > 0" class="text-center py-2">
              <v-chip color="orange" variant="outlined" size="small">
                Sin presupuesto planificado de referencia
              </v-chip>
            </div>

            <!-- Estado de verificación general -->
            <v-alert
              v-if="presupuestoVerificado || (todosVerificados && tieneDatosFondos)"
              type="success"
              variant="tonal"
              density="compact"
              class="mt-3"
            >
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              Presupuesto verificado y bloqueado
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Botón para registrar información en el padre -->
    <div class="d-flex justify-end mt-6" v-if="mostrarBotonRegistrar">
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-content-save"
        size="large"
        @click="registrarInformacion"
        :loading="registrando"
        :disabled="!puedeRegistrar"
      >
        {{ getTextoBotonRegistrar }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from 'vue'

// Props del componente
const props = defineProps({
  fondos: {
    type: [Array, null, undefined],
    default: null,
    validator: (value) => {
      if (value === null || value === undefined) return true
      if (!Array.isArray(value)) return false
      if (value.length === 0) return true

      return value.every(
        (fondo) =>
          fondo &&
          typeof fondo.id !== 'undefined' &&
          typeof fondo.monto !== 'undefined' &&
          typeof fondo.nombre !== 'undefined' &&
          typeof fondo.esExistente !== 'undefined',
      )
    },
  },
  presupuestoTotal: {
    type: [Number, String, null, undefined],
    default: null,
    validator: (value) => {
      if (value === null || value === undefined) return true
      const num = parseFloat(value)
      return !isNaN(num) && num >= 0
    },
  },
  presupuestoEjecutadoInicial: {
    type: [Number, String],
    default: 0,
  },
  observacionesIniciales: {
    type: String,
    default: '',
  },
})

console.log('Procedencia de fondos: ', props.fondos)
console.log('Presupuesto total: ', props.presupuestoTotal)

// Emits para enviar datos al padre
const emit = defineEmits([
  'fondos-actualizados',
  'presupuesto-actualizado',
  'observaciones-actualizadas',
  'registrar-informacion',
])

// Convertir props a refs reactivos
const { fondos, presupuestoTotal, presupuestoEjecutadoInicial, observacionesIniciales } =
  toRefs(props)

// Datos internos reactivos
const procedenciaFondos = ref([])
const fondosEditables = ref([])
const presupuestoEjecutadoManual = ref(0)
const observacionesPresupuesto = ref('')
const registrando = ref(false)

// Estado de verificación para presupuesto manual - REF simple
const presupuestoVerificado = ref(false)

// Track de cambios
const cambiosRealizados = ref(false)

// Computed properties para determinar el estado
const tieneDatosFondos = computed(() => {
  return (
    fondos.value !== null &&
    fondos.value !== undefined &&
    Array.isArray(fondos.value) &&
    fondos.value.length > 0
  )
})

const tienePresupuestoTotal = computed(() => {
  return presupuestoTotal.value !== null && presupuestoTotal.value !== undefined
})

const presupuestoTotalPlanificado = computed(() => {
  if (tieneDatosFondos.value) {
    return procedenciaFondos.value.reduce(
      (total, fondo) => total + (parseFloat(fondo.monto) || 0),
      0,
    )
  }

  if (tienePresupuestoTotal.value) {
    return parseFloat(presupuestoTotal.value) || 0
  }

  return 0
})

const totalPlanificado = computed(() => {
  return presupuestoTotalPlanificado.value
})

const totalEjecutado = computed(() => {
  if (tieneDatosFondos.value) {
    return fondosEditables.value.reduce(
      (total, fondo) => total + (parseFloat(fondo.montoEjecutado) || 0),
      0,
    )
  } else {
    return presupuestoEjecutadoManual.value || 0
  }
})

const diferenciaTotal = computed(() => {
  return totalPlanificado.value - totalEjecutado.value
})

const diferenciaTotalGeneral = computed(() => {
  return presupuestoTotalPlanificado.value - totalEjecutado.value
})

const porcentajeEjecucionTotal = computed(() => {
  if (presupuestoTotalPlanificado.value === 0) return 0
  return ((totalEjecutado.value / presupuestoTotalPlanificado.value) * 100).toFixed(2)
})

const todosVerificados = computed(() => {
  return (
    fondosEditables.value.length > 0 && fondosEditables.value.every((fondo) => fondo.verificado)
  )
})

const hayCambiosPendientes = computed(() => {
  return cambiosRealizados.value
})

// Verificación completa - CORRECCIÓN: usar directamente presupuestoVerificado
const verificacionCompleta = computed(() => {
  if (tieneDatosFondos.value) {
    return todosVerificados.value
  } else {
    if (presupuestoTotalPlanificado.value === 0) {
      return true
    }
    return presupuestoVerificado.value // CORRECCIÓN: usar .value
  }
})

// Estados visuales
const estadoPresupuesto = computed(() => {
  if (tieneDatosFondos.value) return 'Con desglose'
  if (tienePresupuestoTotal.value) {
    return presupuestoTotalPlanificado.value === 0 ? 'Sin presupuesto' : 'Sin desglose'
  }
  return 'No definido'
})

const getColorEstado = computed(() => {
  if (tieneDatosFondos.value) return 'primary'
  if (tienePresupuestoTotal.value) {
    return presupuestoTotalPlanificado.value === 0 ? 'orange' : 'blue'
  }
  return 'warning'
})

const mostrarResumen = computed(() => {
  return (
    tieneDatosFondos.value ||
    (tienePresupuestoTotal.value && presupuestoTotalPlanificado.value > 0) ||
    totalEjecutado.value > 0
  )
})

const mostrarObservaciones = computed(() => {
  return (
    tieneDatosFondos.value || (tienePresupuestoTotal.value && presupuestoTotalPlanificado.value > 0)
  )
})

const mostrarBotonRegistrar = computed(() => {
  return (
    tieneDatosFondos.value ||
    (tienePresupuestoTotal.value && presupuestoTotalPlanificado.value > 0) ||
    totalEjecutado.value > 0
  )
})

// Estados para la sección de planificado
const getColorIconoPlanificado = computed(() => {
  if (tieneDatosFondos.value) return 'primary'
  if (tienePresupuestoTotal.value) {
    return presupuestoTotalPlanificado.value === 0 ? 'orange' : 'grey'
  }
  return 'warning'
})

const getIconoPlanificado = computed(() => {
  if (!tienePresupuestoTotal.value && !tieneDatosFondos.value) return 'mdi-cash-remove'
  if (presupuestoTotalPlanificado.value === 0) return 'mdi-cash-remove'
  if (tieneDatosFondos.value) return 'mdi-cash-multiple'
  return 'mdi-cash-clock'
})

const getTextoPlanificado = computed(() => {
  if (!tienePresupuestoTotal.value && !tieneDatosFondos.value) return 'No Definido'
  if (presupuestoTotalPlanificado.value === 0) return 'Sin Presupuesto'
  if (tieneDatosFondos.value) return 'Planificado (Desglose)'
  return 'Planificado'
})

const getColorTextoPlanificado = computed(() => {
  if (!tienePresupuestoTotal.value && !tieneDatosFondos.value) return 'warning--text'
  if (presupuestoTotalPlanificado.value === 0) return 'orange--text'
  if (tieneDatosFondos.value) return 'primary--text'
  return 'grey--text'
})

const getSubtituloPlanificado = computed(() => {
  if (!tienePresupuestoTotal.value && !tieneDatosFondos.value) return 'Presupuesto no definido'
  if (presupuestoTotalPlanificado.value === 0) return 'Sin presupuesto asignado'
  if (tieneDatosFondos.value) return 'Presupuesto Total (desglosado)'
  return 'Presupuesto Total'
})

const getColorEstadoEjecucion = computed(() => {
  return getColorPorcentajeChip(porcentajeEjecucionTotal.value)
})

// Validación para registro
const puedeRegistrar = computed(() => {
  if (!hayCambiosPendientes.value) return false

  if (presupuestoTotalPlanificado.value === 0) {
    return true
  }

  return verificacionCompleta.value
})

const getTextoBotonRegistrar = computed(() => {
  if (tieneDatosFondos.value) return 'Registrar Desglose'
  if (presupuestoTotalPlanificado.value === 0) return 'Registrar Ejecución'
  return 'Registrar Presupuesto'
})

// Inicializar datos cuando cambien las props
const inicializarDatos = () => {
  procedenciaFondos.value = []
  fondosEditables.value = []
  presupuestoEjecutadoManual.value = 0
  presupuestoVerificado.value = false // CORRECCIÓN: reiniciar correctamente

  if (tieneDatosFondos.value) {
    procedenciaFondos.value = [...fondos.value]

    fondosEditables.value = procedenciaFondos.value.map((fondo) => ({
      id: fondo.id,
      montoEjecutado: fondo.montoEjecutado || 0,
      verificado: fondo.verificado || false,
    }))
  } else if (tienePresupuestoTotal.value) {
    presupuestoEjecutadoManual.value = parseFloat(presupuestoEjecutadoInicial.value) || 0
    presupuestoVerificado.value = false // CORRECCIÓN: reiniciar correctamente
  } else {
    presupuestoEjecutadoManual.value = parseFloat(presupuestoEjecutadoInicial.value) || 0
    presupuestoVerificado.value = false // CORRECCIÓN: reiniciar correctamente
  }

  observacionesPresupuesto.value = observacionesIniciales.value || ''
  cambiosRealizados.value = false
}

// Métodos
const formatearMoneda = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return `Bs. ${parseFloat(monto).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const getColorDiferencia = (diferencia) => {
  if (diferencia > 0) return 'text-green'
  if (diferencia < 0) return 'text-red'
  return 'text-grey'
}

const getColorPorcentajeBar = (porcentaje) => {
  if (porcentaje >= 100) return 'success'
  if (porcentaje >= 80) return 'primary'
  if (porcentaje >= 50) return 'warning'
  return 'error'
}

const getColorPorcentajeChip = (porcentaje) => {
  if (porcentaje >= 100) return 'green'
  if (porcentaje >= 80) return 'blue'
  if (porcentaje >= 50) return 'orange'
  return 'red'
}

const getEstadoEjecucion = (porcentaje) => {
  if (porcentaje >= 100) return 'Completo'
  if (porcentaje >= 80) return 'Avanzado'
  if (porcentaje >= 50) return 'Moderado'
  if (porcentaje > 0) return 'Inicial'
  return 'Sin ejecutar'
}

const actualizarFondo = (index, nuevoMonto) => {
  if (fondosEditables.value[index].verificado) return

  fondosEditables.value[index].montoEjecutado = parseFloat(nuevoMonto) || 0
  cambiosRealizados.value = true
  emitirDatosActualizados()
}

const manejarVerificacion = (index, verificado) => {
  fondosEditables.value[index].verificado = verificado
  cambiosRealizados.value = true

  if (!verificado) {
    cambiosRealizados.value = true
  }

  emitirDatosActualizados()
}

// CORRECCIÓN: Método mejorado para manejar verificación manual
const manejarVerificacionManual = (verificado) => {
  presupuestoVerificado.value = verificado
  cambiosRealizados.value = true

  // Log para debugging
  console.log('Verificación manual cambiada a:', verificado)
  console.log('presupuestoVerificado.value:', presupuestoVerificado.value)

  emitirDatosActualizados()
}

// CORRECCIÓN: Método mejorado para actualizar ejecutado manual
const actualizarEjecutadoManual = (nuevoMonto) => {
  // Bloquear si está verificado
  if (presupuestoVerificado.value) {
    console.log('No se puede modificar: presupuesto está verificado')
    return
  }

  presupuestoEjecutadoManual.value = parseFloat(nuevoMonto) || 0
  cambiosRealizados.value = true
  emitirDatosActualizados()
}

const actualizarObservaciones = (observaciones) => {
  observacionesPresupuesto.value = observaciones
  cambiosRealizados.value = true
  emit('observaciones-actualizadas', observaciones)
}

const emitirDatosActualizados = () => {
  const datosActualizados = {
    fondos: procedenciaFondos.value.map((fondo, index) => ({
      ...fondo,
      montoEjecutado: fondosEditables.value[index].montoEjecutado,
      verificado: fondosEditables.value[index].verificado,
    })),
    totalPlanificado: totalPlanificado.value,
    totalEjecutado: totalEjecutado.value,
    diferenciaTotal: diferenciaTotal.value,
    diferenciaTotalGeneral: diferenciaTotalGeneral.value,
    porcentajeEjecucion: porcentajeEjecucionTotal.value,
    observaciones: observacionesPresupuesto.value,
    presupuestoEjecutadoManual: presupuestoEjecutadoManual.value,
    tieneDatosFondos: tieneDatosFondos.value,
    tienePresupuestoTotal: tienePresupuestoTotal.value,
    presupuestoTotalPlanificado: presupuestoTotalPlanificado.value,
    presupuestoVerificado: presupuestoVerificado.value, // CORRECCIÓN: usar .value
    todosVerificados: todosVerificados.value,
    estado: estadoPresupuesto.value,
    timestamp: new Date().toISOString(),
  }

  emit('fondos-actualizados', datosActualizados)
  emit('presupuesto-actualizado', datosActualizados)
}

// Método para registrar información en el padre
const registrarInformacion = async () => {
  if (!puedeRegistrar.value) return

  registrando.value = true

  try {
    const datosCompletos = getDatosCompletos()
    emit('registrar-informacion', datosCompletos)
    cambiosRealizados.value = false
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Error al registrar información:', error)
  } finally {
    registrando.value = false
  }
}

// Método para obtener datos completos
const getDatosCompletos = () => {
  return {
    fondosCompletos: procedenciaFondos.value.map((fondo, index) => ({
      ...fondo,
      montoEjecutado: fondosEditables.value[index].montoEjecutado,
      verificado: fondosEditables.value[index].verificado,
    })),
    totalPlanificado: totalPlanificado.value,
    totalEjecutado: totalEjecutado.value,
    diferenciaTotal: diferenciaTotal.value,
    diferenciaTotalGeneral: diferenciaTotalGeneral.value,
    porcentajeEjecucion: porcentajeEjecucionTotal.value,
    observaciones: observacionesPresupuesto.value,
    presupuestoEjecutadoManual: presupuestoEjecutadoManual.value,
    tieneDatosFondos: tieneDatosFondos.value,
    tienePresupuestoTotal: tienePresupuestoTotal.value,
    presupuestoTotalPlanificado: presupuestoTotalPlanificado.value,
    presupuestoVerificado: presupuestoVerificado.value, // CORRECCIÓN: usar .value
    todosVerificados: todosVerificados.value,
    verificacionCompleta: verificacionCompleta.value,
    estado: estadoPresupuesto.value,
    timestamp: new Date().toISOString(),
  }
}

// Watchers
watch(
  [fondos, presupuestoTotal],
  () => {
    inicializarDatos()
  },
  { immediate: true },
)

watch(observacionesIniciales, (nuevoValor) => {
  observacionesPresupuesto.value = nuevoValor || ''
})

// Métodos públicos para acceder desde el padre
defineExpose({
  getDatosCompletos,
  resetearDatos: () => {
    inicializarDatos()
  },
  forzarRegistro: () => {
    registrarInformacion()
  },
})
</script>

<style scoped>
.procedencia-fondos-wrapper {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.text-green {
  color: #4caf50;
}

.text-red {
  color: #f44336;
}

.text-grey {
  color: #9e9e9e;
}

.v-table {
  border-collapse: separate;
  border-spacing: 0;
}

.v-table tfoot tr {
  border-top: 2px solid #e0e0e0;
}

.v-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .v-row {
    flex-direction: column;
  }

  .v-col {
    width: 100%;
  }
}
</style>
