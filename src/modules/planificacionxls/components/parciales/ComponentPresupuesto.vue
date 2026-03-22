<template>
  <v-dialog v-model="dialog" max-width="800" persistent scrollable>
    <v-card class="elevation-4">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="text-h6 font-weight-medium">
          <v-icon class="mr-2">mdi-cash-multiple</v-icon>
          Desglose de Presupuesto
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <!-- Alerta de validación compacta -->
        <v-alert
          v-if="totalDesglose > currentRowTotal"
          type="error"
          class="mb-3"
          density="compact"
          icon="mdi-alert-circle-outline"
        >
          <strong>Exceso de presupuesto:</strong>
          {{ formatCurrency(totalDesglose) }} > {{ formatCurrency(currentRowTotal) }}
        </v-alert>

        <!-- Resumen presupuestario compacto -->
        <v-row class="mb-3" dense>
          <v-col cols="12" md="3">
            <div class="d-flex align-center pa-2 bg-grey-lighten-4 rounded">
              <v-icon color="primary" size="small" class="mr-2">mdi-cash</v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Total</div>
                <div class="text-body-2 font-weight-medium text-primary">
                  {{ formatCurrency(currentRowTotal) }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <div class="d-flex align-center pa-2 bg-grey-lighten-4 rounded">
              <v-icon color="green" size="small" class="mr-2">mdi-chart-pie</v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Desglosado</div>
                <div class="text-body-2 font-weight-medium text-green-darken-2">
                  {{ formatCurrency(totalDesglose) }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <div class="d-flex align-center pa-2 bg-grey-lighten-4 rounded">
              <v-icon :color="saldoDisponible < 0 ? 'error' : 'success'" size="small" class="mr-2">
                {{ saldoDisponible < 0 ? 'mdi-alert' : 'mdi-check-circle' }}
              </v-icon>
              <div>
                <div class="text-caption text-medium-emphasis">Saldo</div>
                <div
                  :class="[
                    'text-body-2 font-weight-medium',
                    saldoDisponible < 0 ? 'text-error' : 'text-success',
                  ]"
                >
                  {{ formatCurrency(saldoDisponible) }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <div class="pa-2 bg-grey-lighten-4 rounded">
              <div class="d-flex align-center mb-1">
                <v-icon
                  :color="porcentajeDesglose > 100 ? 'error' : 'primary'"
                  size="small"
                  class="mr-2"
                >
                  mdi-progress-clock
                </v-icon>
                <span class="text-caption text-medium-emphasis">Utilizado</span>
              </div>
              <v-progress-linear
                :value="porcentajeDesglose"
                height="8"
                :color="porcentajeDesglose > 100 ? 'error' : 'primary'"
                rounded
              >
                <template v-slot:default="{ value }">
                  <strong class="text-caption">{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <!-- Agregar fuentes -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-medium bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Agregar Fuentes de Financiamiento
          </v-card-title>
          <v-card-text>
            <!-- Selector de fuentes financieras -->
            <v-row>
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="nuevaFuenteSeleccionada"
                  :items="fuentesFinancierasFiltradas"
                  label="Seleccionar fuente financiera existente"
                  item-title="financiera"
                  item-value="id"
                  return-object
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  color="primary"
                  block
                  :disabled="!nuevaFuenteSeleccionada"
                  @click="agregarFuenteExistente"
                  prepend-icon="mdi-check"
                  variant="flat"
                  size="large"
                >
                  Agregar
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-4">o</v-divider>

            <!-- Agregar fuente manual -->
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="nuevaFuenteManual.nombre"
                  label="Nombre de nueva fuente"
                  clearable
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-form-textbox"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model.number="nuevaFuenteManual.monto"
                  type="number"
                  label="Monto"
                  min="0"
                  :max="saldoDisponible"
                  clearable
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-currency-usd"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="secondary"
                  block
                  :disabled="!nuevaFuenteManual.nombre || !nuevaFuenteManual.monto"
                  @click="agregarFuenteManual"
                  prepend-icon="mdi-plus"
                  variant="flat"
                  size="large"
                  class="h-100"
                >
                  Crear
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Tabla de desglose -->
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-medium bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-table</v-icon>
            Desglose de Fuentes
          </v-card-title>
          <v-table density="comfortable" class="elevation-1">
            <thead>
              <tr class="bg-grey-lighten-3">
                <th class="font-weight-medium text-left">Fuente de Financiamiento</th>
                <th class="font-weight-medium text-right">Monto</th>
                <th class="font-weight-medium text-right">%</th>
                <th class="font-weight-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentBreakdown" :key="index" class="border-bottom">
                <td class="text-left">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2" :color="item.esExistente ? 'primary' : 'secondary'">
                      {{ item.esExistente ? 'mdi-database' : 'mdi-pencil' }}
                    </v-icon>
                    {{ item.nombre }}
                  </div>
                </td>
                <td class="text-right">
                  <v-text-field
                    v-model.number="item.monto"
                    type="number"
                    density="compact"
                    variant="underlined"
                    hide-details
                    :min="0"
                    :max="currentRowTotal"
                    @update:model-value="actualizarMonto(index)"
                    class="mt-2"
                  />
                </td>
                <td class="text-right">
                  <span class="text-caption text-medium-emphasis">
                    {{ calcularPorcentaje(item.monto) }}%
                  </span>
                </td>
                <td class="text-center">
                  <v-btn
                    icon
                    size="small"
                    color="error"
                    variant="text"
                    @click="eliminarFuente(index)"
                    title="Eliminar fuente"
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="bg-grey-lighten-4 font-weight-bold">
                <td class="text-left">Total General</td>
                <td class="text-right text-primary">{{ formatCurrency(totalDesglose) }}</td>
                <td class="text-right text-primary">{{ porcentajeDesglose.toFixed(2) }}%</td>
                <td class="text-center"></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn
          @click="closeDialog"
          variant="outlined"
          color="grey-darken-2"
          prepend-icon="mdi-close"
          size="large"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveBreakdown"
          :disabled="totalDesglose > currentRowTotal || totalDesglose === 0"
          variant="flat"
          prepend-icon="mdi-content-save"
          size="large"
        >
          Guardar Desglose
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  presupuestoTotal: {
    type: [Number, String],
    default: 0,
  },
  desgloseInicial: {
    type: Array,
    default: () => [],
  },
  procedenciaFondos: {
    type: Array,
    default: () => [],
    validator: (value) => {
      //Validar que sea un array de numeros
      return Array.isArray(value) && value.every((item) => typeof item === 'number')
    },
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'guardarDesglose'])

// Data
const dialog = ref(false)
const currentBreakdown = ref([])
const nuevaFuenteSeleccionada = ref(null)
const nuevaFuenteManual = ref({
  nombre: '',
  monto: 0,
})

// Inicializar composable
const {
  opcionesEntidadFinanciera: fuentesFinancierasDisponibles,
  loading,
  error,
  fetchOptions,
} = useProcedenciaFondos()

// Computed
const currentRowTotal = computed(() => {
  const total = Number(props.presupuestoTotal) || 0
  return isNaN(total) ? 0 : total
})

//Computed para filtrar fuentes por procedencia
const fuentesFinancierasFiltradas = computed(() => {
  //si no hay procedencia de fondos(props)
  if (!props.procedenciaFondos || props.procedenciaFondos.length === 0) {
    return fuentesFinancierasDisponibles
  }

  //Filtrar solo las fuentes cuyo id este en el array de procedencia de fondos
  return fuentesFinancierasDisponibles.value.filter((fuente) => {
    return props.procedenciaFondos.includes(fuente.id)
  })
})

const totalDesglose = computed(() => {
  return currentBreakdown.value.reduce((sum, item) => {
    const monto = Number(item.monto) || 0
    return sum + (isNaN(monto) ? 0 : monto)
  }, 0)
})

const saldoDisponible = computed(() => {
  return currentRowTotal.value - totalDesglose.value
})

const porcentajeDesglose = computed(() => {
  if (currentRowTotal.value === 0) return 0
  return (totalDesglose.value / currentRowTotal.value) * 100
})

// Computed para verificar si una fuente ya existe
const fuenteYaExiste = computed(() => {
  return (nombre) => {
    return currentBreakdown.value.some((item) => item.nombre.toLowerCase() === nombre.toLowerCase())
  }
})

// Methods
const formatCurrency = (value) => {
  const numValue = Number(value) || 0
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(numValue)
}

const calcularPorcentaje = (monto) => {
  if (currentRowTotal.value === 0) return 0
  const numMonto = Number(monto) || 0
  return ((numMonto / currentRowTotal.value) * 100).toFixed(2)
}

const agregarFuenteExistente = () => {
  if (nuevaFuenteSeleccionada.value) {
    const nombreFuente = nuevaFuenteSeleccionada.value.financiera

    // Verificar si la fuente ya existe
    if (fuenteYaExiste.value(nombreFuente)) {
      alert(`La fuente "${nombreFuente}" ya ha sido agregada al desglose.`)
      nuevaFuenteSeleccionada.value = null
      return
    }

    currentBreakdown.value.push({
      id: nuevaFuenteSeleccionada.value.id,
      nombre: nombreFuente,
      monto: 0,
      esExistente: true,
    })
    nuevaFuenteSeleccionada.value = null
  }
}

const agregarFuenteManual = () => {
  if (nuevaFuenteManual.value.nombre && nuevaFuenteManual.value.monto > 0) {
    const nombreFuente = nuevaFuenteManual.value.nombre

    // Verificar si la fuente ya existe
    if (fuenteYaExiste.value(nombreFuente)) {
      alert(`La fuente "${nombreFuente}" ya ha sido agregada al desglose.`)
      return
    }

    const monto = Math.min(nuevaFuenteManual.value.monto, saldoDisponible.value)
    currentBreakdown.value.push({
      id: Date.now(),
      nombre: nombreFuente,
      monto: monto,
      esExistente: false,
    })
    nuevaFuenteManual.value = { nombre: '', monto: 0 }
  }
}

const eliminarFuente = (index) => {
  currentBreakdown.value.splice(index, 1)
}

const actualizarMonto = (index) => {
  const item = currentBreakdown.value[index]
  const currentMonto = Number(item.monto) || 0
  const maxPermitido = currentRowTotal.value - (totalDesglose.value - currentMonto) + currentMonto

  if (item.monto > maxPermitido) {
    item.monto = maxPermitido
  }

  if (item.monto < 0) {
    item.monto = 0
  }
}

const saveBreakdown = () => {
  if (totalDesglose.value <= currentRowTotal.value && totalDesglose.value > 0) {
    // Crear una copia profunda para evitar problemas de referencia
    const desgloseParaGuardar = JSON.parse(JSON.stringify(currentBreakdown.value))
    emit('guardarDesglose', desgloseParaGuardar)
    closeDialog()
  }
}

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

const resetForm = () => {
  // Limpiar y resetear el formulario correctamente
  currentBreakdown.value = []

  if (Array.isArray(props.desgloseInicial) && props.desgloseInicial.length > 0) {
    // Procesar el desglose inicial para asegurar la estructura correcta
    props.desgloseInicial.forEach((item) => {
      if (item && (item.nombre || item.financiera)) {
        currentBreakdown.value.push({
          id: item.id || Date.now() + Math.random(),
          nombre: item.nombre || item.financiera,
          monto: Number(item.monto) || 0,
          esExistente: item.esExistente !== undefined ? item.esExistente : true,
        })
      }
    })
  }

  nuevaFuenteSeleccionada.value = null
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
    if (val) {
      // Usar nextTick para asegurar que el DOM esté listo
      nextTick(() => {
        resetForm()
      })
    }
  },
  { immediate: true },
)

watch(dialog, (val) => {
  if (!val) {
    closeDialog()
  }
})

watch(
  () => props.desgloseInicial,
  (newVal) => {
    if (dialog.value && Array.isArray(newVal)) {
      resetForm()
    }
  },
  { deep: true },
)

// Carga inicial
onMounted(async () => {
  await carga()
})

const carga = async () => {
  loading.value = true
  try {
    await fetchOptions()
  } catch (err) {
    error.value = err
    console.error('Componente presupuesto, error carga de opciones', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-table {
  border-radius: 8px;
  overflow: hidden;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.h-100 {
  height: 100%;
}

.text-error {
  color: #f44336;
}

.text-success {
  color: #4caf50;
}

.text-primary {
  color: #1976d2;
}

:deep(.v-text-field .v-input__control) {
  min-height: 40px;
}

:deep(.v-table .v-input__control) {
  min-height: 40px;
}

/* Estilos para la sección compacta */
.compact-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.compact-item {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f5f5f5;
}
</style>
