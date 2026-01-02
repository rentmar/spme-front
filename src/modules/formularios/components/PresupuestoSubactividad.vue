<template>
  <div class="presupuesto-subactividad-wrapper">
    <!-- Desglose de Presupuesto de Subactividad -->
    <div class="mb-6">
      <div class="d-flex justify-space-between align-center mb-3">
        <h4 class="text-h6 primary--text mb-0">Validación de Presupuesto - Subactividad</h4>

        <!-- Indicador de estado -->
        <v-chip :color="getColorEstado" variant="outlined" size="small" prepend-icon="mdi-cash">
          {{ estadoPresupuesto }}
        </v-chip>
      </div>

      <!-- CASO 1: Con datos de desglose (presupuestoDesglose existe y es array) -->
      <template v-if="tieneDesglose">
        <v-table class="elevation-1 rounded-lg mb-4">
          <thead>
            <tr>
              <th class="text-subtitle-2 font-weight-bold">Descripción</th>
              <th class="text-subtitle-2 font-weight-bold">Monto Planificado (Bs.)</th>
              <th class="text-subtitle-2 font-weight-bold">Monto Ejecutado (Bs.)</th>
              <th class="text-subtitle-2 font-weight-bold">Diferencia</th>
              <th class="text-subtitle-2 font-weight-bold">Verificado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in desgloseEditables" :key="item.id || index">
              <td class="font-weight-medium">
                {{ item.descripcion }}
              </td>
              <td class="text-right">{{ formatearMoneda(item.monto) }}</td>
              <td>
                <v-text-field
                  v-model.number="desgloseEditables[index].montoEjecutado"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :error="tieneErrorEjecutado(index)"
                  :error-messages="getErrorMensajeEjecutado(index)"
                  placeholder="0.00"
                  :min="0"
                  :max="item.monto"
                  step="0.01"
                  :disabled="desgloseEditables[index].verificado"
                  @update:model-value="actualizarMontoEjecutado(index, $event)"
                  @blur="validarMontoEjecutado(index)"
                >
                  <template v-if="desgloseEditables[index].verificado" v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="green" size="small">mdi-lock</v-icon>
                      </template>
                      <span>Monto bloqueado por verificación</span>
                    </v-tooltip>
                  </template>
                  <template v-if="tieneErrorEjecutado(index)" v-slot:append-inner>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="error" size="small">mdi-alert-circle</v-icon>
                      </template>
                      <span>El monto ejecutado no puede ser mayor al planificado</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </td>
              <td
                class="text-right"
                :class="
                  getColorDiferenciaItem(
                    item.monto - (desgloseEditables[index].montoEjecutado || 0),
                  )
                "
              >
                {{ formatearMoneda(item.monto - (desgloseEditables[index].montoEjecutado || 0)) }}
              </td>
              <td class="text-center">
                <v-checkbox
                  v-model="desgloseEditables[index].verificado"
                  hide-details
                  class="mt-0"
                  :disabled="tieneErrorEjecutado(index)"
                  @update:model-value="manejarVerificacion(index, $event)"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-weight-bold" style="background-color: #f5f5f5">
              <td class="text-subtitle-2" colspan="2">TOTAL DESGLOSE</td>
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

        <!-- Alerta de errores en montos ejecutados -->
        <v-alert v-if="tieneErroresMontosEjecutados" type="error" variant="tonal" class="mb-4">
          <template v-slot:prepend>
            <v-icon color="error">mdi-alert-circle</v-icon>
          </template>
          <strong>Error en montos ejecutados:</strong>
          Algunos montos ejecutados exceden el monto planificado. Corrija los valores antes de
          continuar.
        </v-alert>

        <!-- Validación de diferencia con presupuesto directo -->
        <v-alert
          v-if="diferenciaPresupuestoDirecto !== 0 && props.presupuesto > 0"
          :type="tipoAlerta"
          variant="tonal"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon :color="tipoAlerta === 'success' ? 'success' : 'warning'">{{
              iconoAlerta
            }}</v-icon>
          </template>
          <strong>Diferencia detectada:</strong>
          Hay una diferencia de {{ formatearMoneda(Math.abs(diferenciaPresupuestoDirecto)) }}
          {{ diferenciaPresupuestoDirecto > 0 ? 'a favor' : 'en contra' }} entre el presupuesto
          directo y el desglose.
        </v-alert>

        <v-alert type="info" variant="tonal" class="mb-4">
          <template v-slot:prepend>
            <v-icon color="info">mdi-information</v-icon>
          </template>
          <strong>Modo con desglose:</strong> Ingrese el monto ejecutado para cada item
          individualmente.
          <strong>Una vez verificado, el monto no podrá modificarse.</strong>
          <div class="mt-1 text-caption">
            <v-icon color="error" size="small" class="mr-1">mdi-alert-circle</v-icon>
            <strong>Validación:</strong> El monto ejecutado no puede ser mayor al monto planificado.
          </div>
        </v-alert>
      </template>

      <!-- CASO 2: Sin desglose pero con presupuesto directo -->
      <template v-else-if="tienePresupuestoDirecto">
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
            <strong>Subactividad sin presupuesto asignado.</strong>
            No se definió un presupuesto para esta subactividad.
          </div>
          <div v-else>
            <strong>Presupuesto sin desglose detallado.</strong>
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
                    :max="presupuestoTotalPlanificado"
                    step="0.01"
                    :error="tieneErrorEjecutadoManual"
                    :error-messages="getErrorMensajeEjecutadoManual"
                    :disabled="presupuestoVerificado"
                    bg-color="green-lighten-5"
                    placeholder="Ingrese el monto ejecutado total"
                    @update:model-value="actualizarEjecutadoManual"
                    @blur="validarMontoEjecutadoManual"
                    :hint="
                      presupuestoEjecutadoManual > 0 && !tieneErrorEjecutadoManual
                        ? `Diferencia: ${formatearMoneda(diferenciaTotalGeneral)}`
                        : ''
                    "
                    persistent-hint
                  >
                    <template v-if="presupuestoVerificado" v-slot:append>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="green" size="small">mdi-lock</v-icon>
                        </template>
                        <span>Monto bloqueado por verificación</span>
                      </v-tooltip>
                    </template>
                    <template v-if="tieneErrorEjecutadoManual" v-slot:append-inner>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="error" size="small"
                            >mdi-alert-circle</v-icon
                          >
                        </template>
                        <span>El monto ejecutado no puede ser mayor al planificado</span>
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
                    :disabled="tieneErrorEjecutadoManual"
                    hide-details
                    @update:model-value="manejarVerificacionManual($event)"
                  >
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <span>Verificar presupuesto ejecutado</span>
                        <v-tooltip v-if="presupuestoVerificado" location="top">
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
              <v-row
                v-if="presupuestoEjecutadoManual > 0 && !tieneErrorEjecutadoManual"
                class="mt-4"
              >
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

      <!-- CASO 3: Ambos son nulos (sin presupuesto) -->
      <template v-else>
        <v-alert type="warning" variant="tonal" class="mb-4">
          <template v-slot:prepend>
            <v-icon color="warning">mdi-alert</v-icon>
          </template>
          <strong>SubActividad sin presupuesto asignado</strong>
          Esta subactividad no tiene presupuesto asignado ni desglose presupuestario.
        </v-alert>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6 pa-4">
            <v-icon class="mr-2" color="warning">mdi-cash-remove</v-icon>
            Presupuesto no Definido
          </v-card-title>
          <v-card-text class="text-center py-6">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-cash-off</v-icon>
            <p class="text-body-1 text-grey">
              No se ha definido información de presupuesto para esta subactividad.
            </p>
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

            <!-- Información de fuente -->
            <div class="mt-3">
              <div class="d-flex align-center">
                <v-icon class="mr-2" size="small">{{ getIconoFuente }}</v-icon>
                <span class="text-caption text-grey">Fuente:</span>
                <v-chip size="small" class="ml-2" :color="getColorFuente" variant="outlined">
                  {{ getTextoFuente }}
                </v-chip>
              </div>
            </div>

            <!-- SECCIÓN DE OBSERVACIONES -->
            <v-divider
              class="my-3"
              v-if="observacionesPresupuesto || mostrarObservaciones"
            ></v-divider>

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

            <!-- Indicadores de ejecución -->
            <div
              class="mb-3"
              v-if="presupuestoTotalPlanificado > 0 && !tieneErroresMontosEjecutados"
            >
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

            <!-- Diferencia -->
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
                v-if="presupuestoTotalPlanificado > 0 && !tieneErroresMontosEjecutados"
              >
                {{ getEstadoEjecucion(porcentajeEjecucionTotal) }}
              </v-chip>
            </div>

            <!-- Estado de verificación general -->
            <v-alert
              v-if="
                (presupuestoVerificado || (todosVerificados && tieneDesglose)) &&
                !tieneErroresMontosEjecutados
              "
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

            <!-- Alerta de errores -->
            <v-alert
              v-if="tieneErroresMontosEjecutados"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-3"
            >
              <template v-slot:prepend>
                <v-icon color="error">mdi-alert-circle</v-icon>
              </template>
              Existen errores en los montos ejecutados. Corrija antes de registrar.
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
        :disabled="!puedeRegistrar || tieneErroresMontosEjecutados"
      >
        {{ getTextoBotonRegistrar }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs, watch } from 'vue'

// Props del componente
const props = defineProps({
  presupuesto: {
    type: [Number, String, null, undefined],
    default: null,
    validator: (value) => {
      if (value === null || value === undefined) return true
      const num = parseFloat(value)
      return !isNaN(num) && num >= 0
    },
  },
  presupuestoDesglose: {
    type: [Array, null, undefined],
    default: null,
    validator: (value) => {
      if (value === null || value === undefined) return true
      if (!Array.isArray(value)) return false
      if (value.length === 0) return true

      return value.every(
        (item) =>
          item && typeof item.monto !== 'undefined' && typeof item.descripcion !== 'undefined',
      )
    },
  },
  observacionesIniciales: {
    type: String,
    default: '',
  },
})

console.log('Presupuesto directo: ', props.presupuesto)
console.log('Presupuesto desglose: ', props.presupuestoDesglose)
console.log('Observaciones iniciales: ', props.observacionesIniciales)

// Emits para enviar datos al padre
const emit = defineEmits(['registrar-informacion', 'observaciones-actualizadas'])

// Convertir props a refs reactivos
const { presupuesto, presupuestoDesglose, observacionesIniciales } = toRefs(props)

// Datos internos reactivos
const desgloseEditables = ref([])
const presupuestoEjecutadoManual = ref(0)
const presupuestoVerificado = ref(false)
const registrando = ref(false)
const cambiosRealizados = ref(false)
const observacionesPresupuesto = ref('')

// Array para rastrear errores de validación
const erroresMontosEjecutados = ref([])
const errorEjecutadoManual = ref(false)

// Computed properties para determinar el estado
const tieneDesglose = computed(() => {
  return (
    presupuestoDesglose.value !== null &&
    presupuestoDesglose.value !== undefined &&
    Array.isArray(presupuestoDesglose.value) &&
    presupuestoDesglose.value.length > 0
  )
})

const tienePresupuestoDirecto = computed(() => {
  return (
    presupuesto.value !== null &&
    presupuesto.value !== undefined &&
    parseFloat(presupuesto.value) > 0
  )
})

// Inicializar datos editables del desglose
const inicializarDesgloseEditables = () => {
  if (tieneDesglose.value) {
    desgloseEditables.value = props.presupuestoDesglose.map((item, index) => ({
      ...item,
      id: item.id || index,
      montoEjecutado: item.montoEjecutado || 0,
      verificado: item.verificado || false,
    }))
    // Inicializar array de errores
    erroresMontosEjecutados.value = new Array(desgloseEditables.value.length).fill(false)
  } else {
    desgloseEditables.value = []
    erroresMontosEjecutados.value = []
  }
}

// Inicializar observaciones
const inicializarObservaciones = () => {
  observacionesPresupuesto.value = observacionesIniciales.value || ''
}

// Ejecutar inicialización cuando cambien los props
watch(
  [presupuestoDesglose, observacionesIniciales],
  () => {
    inicializarDesgloseEditables()
    inicializarObservaciones()
  },
  { immediate: true },
)

const totalPlanificado = computed(() => {
  if (tieneDesglose.value) {
    return desgloseEditables.value.reduce((total, item) => {
      return total + (parseFloat(item.monto) || 0)
    }, 0)
  }
  return parseFloat(presupuesto.value) || 0
})

const totalEjecutado = computed(() => {
  if (tieneDesglose.value) {
    return desgloseEditables.value.reduce((total, item) => {
      return total + (parseFloat(item.montoEjecutado) || 0)
    }, 0)
  } else {
    return presupuestoEjecutadoManual.value || 0
  }
})

const diferenciaTotal = computed(() => {
  return totalPlanificado.value - totalEjecutado.value
})

// Lógica de prioridad según requerimientos - Presupuesto final para validación
const presupuestoTotalPlanificado = computed(() => {
  // Prioridad 1: Si existe desglose, tomarlo como entrada primordial
  if (tieneDesglose.value) {
    return totalPlanificado.value
  }

  // Prioridad 2: Si no hay desglose, tomar el presupuesto directo
  if (tienePresupuestoDirecto.value) {
    return parseFloat(presupuesto.value) || 0
  }

  // Prioridad 3: Ambos son nulos
  return 0
})

const diferenciaPresupuestoDirecto = computed(() => {
  // Solo calcular diferencia si tenemos ambos valores para comparar
  if (tieneDesglose.value && tienePresupuestoDirecto.value) {
    return parseFloat(presupuesto.value) - totalPlanificado.value
  }
  return 0
})

const diferenciaTotalGeneral = computed(() => {
  return presupuestoTotalPlanificado.value - totalEjecutado.value
})

const sinPresupuesto = computed(() => {
  return !tieneDesglose.value && !tienePresupuestoDirecto.value
})

const porcentajeEjecucionTotal = computed(() => {
  if (presupuestoTotalPlanificado.value === 0) return 0
  const porcentaje = (totalEjecutado.value / presupuestoTotalPlanificado.value) * 100
  return Math.min(100, porcentaje).toFixed(2) // Limitar a 100% máximo
})

const todosVerificados = computed(() => {
  if (tieneDesglose.value) {
    return (
      desgloseEditables.value.length > 0 && desgloseEditables.value.every((item) => item.verificado)
    )
  }
  return false
})

const mostrarObservaciones = computed(() => {
  return (
    tieneDesglose.value || (tienePresupuestoDirecto.value && presupuestoTotalPlanificado.value > 0)
  )
})

// Validaciones de montos ejecutados
const tieneErrorEjecutado = computed(() => {
  return (index) => {
    if (!tieneDesglose.value || index >= erroresMontosEjecutados.value.length) return false
    return erroresMontosEjecutados.value[index]
  }
})

const getErrorMensajeEjecutado = computed(() => {
  return (index) => {
    if (tieneErrorEjecutado.value(index)) {
      return 'El monto ejecutado no puede ser mayor al planificado'
    }
    return ''
  }
})

const tieneErrorEjecutadoManual = computed(() => {
  return errorEjecutadoManual.value
})

const getErrorMensajeEjecutadoManual = computed(() => {
  return tieneErrorEjecutadoManual.value
    ? 'El monto ejecutado no puede ser mayor al planificado'
    : ''
})

const tieneErroresMontosEjecutados = computed(() => {
  if (tieneDesglose.value) {
    return erroresMontosEjecutados.value.some((error) => error)
  } else {
    return errorEjecutadoManual.value
  }
})

// Validar monto ejecutado individual
const validarMontoEjecutado = (index) => {
  if (!tieneDesglose.value || index >= desgloseEditables.value.length) return

  const item = desgloseEditables.value[index]
  const montoPlanificado = parseFloat(item.monto) || 0
  const montoEjecutado = parseFloat(item.montoEjecutado) || 0

  // Validar que el monto ejecutado no sea mayor al planificado
  erroresMontosEjecutados.value[index] = montoEjecutado > montoPlanificado

  // Si hay error, ajustar el monto al máximo permitido
  if (erroresMontosEjecutados.value[index]) {
    desgloseEditables.value[index].montoEjecutado = montoPlanificado
    cambiosRealizados.value = true
  }
}

// Validar monto ejecutado manual
const validarMontoEjecutadoManual = () => {
  const montoPlanificado = presupuestoTotalPlanificado.value
  const montoEjecutado = parseFloat(presupuestoEjecutadoManual.value) || 0

  // Validar que el monto ejecutado no sea mayor al planificado
  errorEjecutadoManual.value = montoEjecutado > montoPlanificado

  // Si hay error, ajustar el monto al máximo permitido
  if (errorEjecutadoManual.value) {
    presupuestoEjecutadoManual.value = montoPlanificado
    cambiosRealizados.value = true
  }
}

// Estados de validación y alertas
const tipoAlerta = computed(() => {
  if (Math.abs(diferenciaPresupuestoDirecto.value) <= 1) return 'success' // Tolerancia de $1
  return 'warning'
})

const iconoAlerta = computed(() => {
  switch (tipoAlerta.value) {
    case 'success':
      return 'mdi-check-circle'
    case 'warning':
      return 'mdi-alert-circle'
    default:
      return 'mdi-information'
  }
})

// Estados visuales
const estadoPresupuesto = computed(() => {
  if (tieneDesglose.value) return 'Con desglose'
  if (tienePresupuestoDirecto.value) return 'Directo'
  return 'Sin presupuesto'
})

const getColorEstado = computed(() => {
  if (tieneDesglose.value) return 'primary'
  if (tienePresupuestoDirecto.value) return 'blue'
  return 'warning'
})

const mostrarResumen = computed(() => {
  return tieneDesglose.value || tienePresupuestoDirecto.value
})

const mostrarBotonRegistrar = computed(() => {
  return tieneDesglose.value || tienePresupuestoDirecto.value
})

// Estados para la sección de planificado
const getColorIconoPlanificado = computed(() => {
  if (tieneDesglose.value) return 'primary'
  if (tienePresupuestoDirecto.value) return 'grey'
  return 'warning'
})

const getIconoPlanificado = computed(() => {
  if (sinPresupuesto.value) return 'mdi-cash-remove'
  if (tieneDesglose.value) return 'mdi-cash-multiple'
  return 'mdi-cash-clock'
})

const getTextoPlanificado = computed(() => {
  if (sinPresupuesto.value) return 'No Definido'
  if (tieneDesglose.value) return 'Planificado (Desglose)'
  return 'Planificado'
})

const getColorTextoPlanificado = computed(() => {
  if (sinPresupuesto.value) return 'warning--text'
  if (tieneDesglose.value) return 'primary--text'
  return 'grey--text'
})

const getSubtituloPlanificado = computed(() => {
  if (sinPresupuesto.value) return 'Presupuesto no definido'
  if (tieneDesglose.value) return 'Presupuesto Total (desglosado)'
  return 'Presupuesto Total'
})

const getIconoFuente = computed(() => {
  return tieneDesglose.value ? 'mdi-format-list-bulleted' : 'mdi-cash'
})

const getColorFuente = computed(() => {
  return tieneDesglose.value ? 'primary' : 'blue'
})

const getTextoFuente = computed(() => {
  return tieneDesglose.value ? 'Desglose' : 'Directo'
})

// Estados para la sección de validación
// const getColorIconoValidacion = computed(() => {
//   return 'green'
// })

// const getIconoValidacion = computed(() => {
//   return 'mdi-cash-check'
// })

// Colores para porcentajes
const getColorEstadoEjecucion = computed(() => {
  return getColorPorcentajeChip(porcentajeEjecucionTotal.value)
})

// Validación para registro - AÑADIMOS VALIDACIÓN DE ERRORES
const puedeRegistrar = computed(() => {
  if (!cambiosRealizados.value && observacionesPresupuesto.value === observacionesIniciales.value)
    return false

  // No permitir registro si hay errores en montos ejecutados
  if (tieneErroresMontosEjecutados.value) return false

  if (presupuestoTotalPlanificado.value === 0) {
    return true
  }

  // Verificar que todo esté verificado si hay desglose
  if (tieneDesglose.value) {
    return todosVerificados.value
  }

  return presupuestoVerificado.value
})

const getTextoBotonRegistrar = computed(() => {
  if (tieneDesglose.value) return 'Registrar Presupuesto'
  if (presupuestoTotalPlanificado.value === 0) return 'Registrar Ejecución'
  return 'Registrar Presupuesto'
})

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

const getColorDiferenciaItem = (diferencia) => {
  if (diferencia > 0) return 'green--text'
  if (diferencia < 0) return 'red--text'
  return 'grey--text'
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

const actualizarMontoEjecutado = (index, nuevoMonto) => {
  if (desgloseEditables.value[index].verificado) return

  const montoPlanificado = parseFloat(desgloseEditables.value[index].monto) || 0
  const montoEjecutado = parseFloat(nuevoMonto) || 0

  // Validar en tiempo real
  if (montoEjecutado > montoPlanificado) {
    erroresMontosEjecutados.value[index] = true
    // Limitar automáticamente al máximo permitido
    desgloseEditables.value[index].montoEjecutado = montoPlanificado
  } else {
    erroresMontosEjecutados.value[index] = false
    desgloseEditables.value[index].montoEjecutado = montoEjecutado
  }

  cambiosRealizados.value = true
}

const manejarVerificacion = (index, verificado) => {
  // No permitir verificar si hay error en el monto ejecutado
  if (erroresMontosEjecutados.value[index]) {
    desgloseEditables.value[index].verificado = false
    return
  }

  desgloseEditables.value[index].verificado = verificado
  cambiosRealizados.value = true
}

const actualizarEjecutadoManual = (nuevoMonto) => {
  // Bloquear si está verificado
  if (presupuestoVerificado.value) {
    console.log('No se puede modificar: presupuesto está verificado')
    return
  }

  const montoPlanificado = presupuestoTotalPlanificado.value
  const montoEjecutado = parseFloat(nuevoMonto) || 0

  // Validar en tiempo real
  if (montoEjecutado > montoPlanificado) {
    errorEjecutadoManual.value = true
    // Limitar automáticamente al máximo permitido
    presupuestoEjecutadoManual.value = montoPlanificado
  } else {
    errorEjecutadoManual.value = false
    presupuestoEjecutadoManual.value = montoEjecutado
  }

  cambiosRealizados.value = true
}

const manejarVerificacionManual = (verificado) => {
  // No permitir verificar si hay error en el monto ejecutado
  if (errorEjecutadoManual.value) {
    presupuestoVerificado.value = false
    return
  }

  presupuestoVerificado.value = verificado
  cambiosRealizados.value = true
}

// MÉTODO PARA ACTUALIZAR OBSERVACIONES
const actualizarObservaciones = (observaciones) => {
  observacionesPresupuesto.value = observaciones
  cambiosRealizados.value = true
  emit('observaciones-actualizadas', observaciones)
}

// MÉTODO REGISTRAR INFORMACIÓN
const registrarInformacion = async () => {
  if (!puedeRegistrar.value && !sinPresupuesto.value) return

  registrando.value = true

  try {
    const datosCompletos = getDatosCompletos()

    // Emitir el evento con los datos completos
    emit('registrar-informacion', datosCompletos)

    cambiosRealizados.value = false

    // Simular tiempo de procesamiento
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
    // Información general
    presupuestoFinal: presupuestoTotalPlanificado.value,
    totalEjecutado: totalEjecutado.value,
    diferenciaTotal: diferenciaTotal.value,
    diferenciaTotalGeneral: diferenciaTotalGeneral.value,
    diferenciaPresupuestoDirecto: diferenciaPresupuestoDirecto.value,
    porcentajeEjecucion: porcentajeEjecucionTotal.value,

    // Validaciones
    tieneErroresMontos: tieneErroresMontosEjecutados.value,

    // Observaciones
    observaciones: observacionesPresupuesto.value,

    // Estados
    tieneDesglose: tieneDesglose.value,
    tienePresupuestoDirecto: tienePresupuestoDirecto.value,
    estado: estadoPresupuesto.value,
    sinPresupuesto: sinPresupuesto.value,

    // Información detallada
    itemsDesglose: tieneDesglose.value ? desgloseEditables.value : [],
    presupuestoEjecutadoManual: presupuestoEjecutadoManual.value,
    presupuestoVerificado: presupuestoVerificado.value,
    todosVerificados: todosVerificados.value,

    // Metadatos
    timestamp: new Date().toISOString(),

    // Información detallada para el informe
    detalle: {
      fuente: tieneDesglose.value ? 'desglose' : 'directo',
      montoPlanificado: presupuestoTotalPlanificado.value,
      montoEjecutado: totalEjecutado.value,
      cantidadItems: tieneDesglose.value ? desgloseEditables.value.length : 0,
      equilibrio:
        diferenciaTotalGeneral.value === 0
          ? 'equilibrado'
          : diferenciaTotalGeneral.value > 0
            ? 'a_favor'
            : 'en_contra',
      porcentajeEjecucion: parseFloat(porcentajeEjecucionTotal.value),
      mensajeEstado: sinPresupuesto.value ? 'subactividad_sin_presupuesto' : 'presupuesto_asignado',
      verificacionCompleta: puedeRegistrar.value,
      observaciones: observacionesPresupuesto.value,
      validacionMontos: tieneErroresMontosEjecutados.value ? 'con_errores' : 'correcto',
    },
  }
}

// Métodos públicos para acceder desde el padre
defineExpose({
  getDatosCompletos,
  registrarInformacion,
  resetearValidacion: () => {
    presupuestoVerificado.value = false
    cambiosRealizados.value = false
    errorEjecutadoManual.value = false
    erroresMontosEjecutados.value = new Array(erroresMontosEjecutados.value.length).fill(false)
    observacionesPresupuesto.value = observacionesIniciales.value || ''
    // Resetear montos ejecutados si es necesario
    if (tieneDesglose.value) {
      desgloseEditables.value.forEach((item) => {
        item.montoEjecutado = 0
        item.verificado = false
      })
    } else {
      presupuestoEjecutadoManual.value = 0
    }
  },
  validarMontos: () => {
    if (tieneDesglose.value) {
      desgloseEditables.value.forEach((item, index) => {
        validarMontoEjecutado(index)
      })
    } else {
      validarMontoEjecutadoManual()
    }
    return !tieneErroresMontosEjecutados.value
  },
})
</script>

<style scoped>
.presupuesto-subactividad-wrapper {
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
