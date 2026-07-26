<!-- DialogoDesglosePresupuestoActividad.vue -->
<template>
  <v-dialog v-model="dialog" max-width="1000" persistent scrollable>
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
        <!-- Información de la actividad -->
        <v-card variant="outlined" class="mb-4" v-if="infoActividad">
          <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-information-outline</v-icon>
            Información de la Actividad
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis">Código</div>
                <div class="text-body-2 font-weight-bold">{{ infoActividad.codigo || '-' }}</div>
              </v-col>
              <v-col cols="8">
                <div class="text-caption text-medium-emphasis">Nombre</div>
                <div class="text-body-2 font-weight-bold">
                  {{ infoActividad.nombreCorto || '-' }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis">Estado</div>
                <v-chip size="x-small" :color="estadoColor(infoActividad.estado)">
                  {{ infoActividad.gradoEjecucion || infoActividad.estado }}
                </v-chip>
              </v-col>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis">Presupuesto Total</div>
                <div class="text-body-2 font-weight-bold">
                  {{ formatCurrency(currentRowTotal) }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis">Responsable</div>
                <div class="text-body-2">{{ infoActividad.responsable || '-' }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Alerta de validación -->
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

        <v-divider class="my-3"></v-divider>

        <!-- Agregar fuentes -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Agregar Fuentes de Financiamiento
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <v-autocomplete
                  v-model="fuentesSeleccionadas"
                  :items="fuentesFinancierasFiltradas"
                  label="Seleccionar fuentes financieras"
                  item-title="financiera"
                  item-value="id"
                  return-object
                  multiple
                  chips
                  closable-chips
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  :loading="loading"
                />
              </v-col>
              <v-col cols="4">
                <v-btn
                  color="primary"
                  block
                  :disabled="!fuentesSeleccionadas || fuentesSeleccionadas.length === 0"
                  @click="agregarFuentesExistentes"
                  prepend-icon="mdi-check"
                >
                  Agregar ({{ fuentesSeleccionadas?.length || 0 }})
                </v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-4">o</v-divider>

            <v-row>
              <v-col cols="5">
                <v-text-field
                  v-model="nuevaFuenteManual.nombre"
                  label="Nombre de nueva fuente"
                  clearable
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model.number="nuevaFuenteManual.monto"
                  type="number"
                  label="Monto"
                  min="0"
                  clearable
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="secondary"
                  block
                  :disabled="!nuevaFuenteManual.nombre || !nuevaFuenteManual.monto"
                  @click="agregarFuenteManual"
                  prepend-icon="mdi-plus"
                >
                  Crear
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Tabla de desglose -->
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-table</v-icon>
            Desglose de Fuentes
          </v-card-title>

          <!-- Barra de resumen reactiva -->
          <div class="px-4 pt-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center gap-4">
                <div class="text-center px-3">
                  <div class="text-caption text-medium-emphasis">Presupuesto</div>
                  <div class="text-body-2 font-weight-bold text-primary">
                    {{ formatCurrency(currentRowTotal) }}
                  </div>
                </div>
                <v-divider vertical length="32"></v-divider>
                <div class="text-center px-3">
                  <div class="text-caption text-medium-emphasis">Desglosado</div>
                  <div
                    class="text-body-2 font-weight-bold"
                    :class="totalDesglose > currentRowTotal ? 'text-error' : 'text-success'"
                  >
                    {{ formatCurrency(totalDesglose) }}
                  </div>
                </div>
                <v-divider vertical length="32"></v-divider>
                <div class="text-center px-3">
                  <div class="text-caption text-medium-emphasis">Saldo</div>
                  <div
                    class="text-body-2 font-weight-bold"
                    :class="saldoDisponible < 0 ? 'text-error' : 'text-success'"
                  >
                    {{ formatCurrency(saldoDisponible) }}
                  </div>
                </div>
              </div>
              <v-chip
                size="x-small"
                :color="saldoDisponible < 0 ? 'error' : 'primary'"
                variant="flat"
              >
                {{ porcentajeDesglose.toFixed(0) }}% utilizado
              </v-chip>
            </div>

            <!-- Barra de progreso -->
            <v-progress-linear
              :model-value="porcentajeDesglose"
              :color="
                porcentajeDesglose > 100 ? 'error' : porcentajeDesglose > 80 ? 'warning' : 'primary'
              "
              height="6"
              rounded
              class="mb-3"
            />
          </div>

          <v-divider></v-divider>

          <v-table density="comfortable">
            <thead>
              <tr class="bg-grey-lighten-3">
                <th class="text-left">Fuente</th>
                <th class="text-right">Monto</th>
                <th class="text-right">%</th>
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentBreakdown" :key="index">
                <td>
                  <v-icon small class="mr-1" :color="item.esExistente ? 'primary' : 'secondary'">
                    {{ item.esExistente ? 'mdi-database' : 'mdi-pencil' }}
                  </v-icon>
                  {{ item.nombre }}
                </td>
                <td class="text-right">
                  <v-text-field
                    v-model.number="item.monto"
                    type="number"
                    density="compact"
                    variant="underlined"
                    hide-details
                    :min="0"
                    class="mt-2"
                  />
                </td>
                <td class="text-right text-caption">{{ calcularPorcentaje(item.monto) }}%</td>
                <td class="text-center">
                  <v-btn
                    icon
                    size="small"
                    color="error"
                    variant="text"
                    @click="eliminarFuente(index)"
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="bg-grey-lighten-4 font-weight-bold">
                <td>Total</td>
                <td class="text-right">{{ formatCurrency(totalDesglose) }}</td>
                <td class="text-right">{{ porcentajeDesglose.toFixed(2) }}%</td>
                <td></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog" variant="outlined" prepend-icon="mdi-close">Cancelar</v-btn>
        <v-btn
          color="primary"
          @click="saveBreakdown"
          :disabled="totalDesglose > currentRowTotal || totalDesglose === 0"
          variant="flat"
          prepend-icon="mdi-content-save"
        >
          Guardar Desglose
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de presupuesto cero -->
  <v-dialog v-model="dialogoCero" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4">
        <v-icon color="warning" class="mr-2">mdi-alert-outline</v-icon>
        Sin Presupuesto
      </v-card-title>
      <v-card-text>
        La actividad no tiene presupuesto asignado. No se puede realizar el desglose.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cerrarTodo">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  presupuestoTotal: { type: [Number, String], default: 0 },
  desgloseInicial: { type: Array, default: () => [] },
  procedenciaFondos: { type: Array, default: () => [] },
  infoActividad: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'guardarDesglose'])

const dialog = ref(false)
const dialogoCero = ref(false)
const currentBreakdown = ref([])
const fuentesSeleccionadas = ref([])
const nuevaFuenteManual = ref({ nombre: '', monto: 0 })

const {
  opcionesEntidadFinanciera: fuentesFinancierasDisponibles,
  loading,
  fetchOptions,
} = useProcedenciaFondos()

const currentRowTotal = computed(() => Number(props.presupuestoTotal) || 0)

const fuentesFinancierasFiltradas = computed(() => {
  const fuentes = fuentesFinancierasDisponibles?.value || fuentesFinancierasDisponibles || []
  if (!props.procedenciaFondos?.length) return fuentes
  return fuentes.filter((f) => props.procedenciaFondos.includes(f.id))
})

const totalDesglose = computed(() =>
  currentBreakdown.value.reduce((sum, item) => sum + (Number(item.monto) || 0), 0),
)

const saldoDisponible = computed(() => currentRowTotal.value - totalDesglose.value)

const porcentajeDesglose = computed(() =>
  currentRowTotal.value === 0 ? 0 : (totalDesglose.value / currentRowTotal.value) * 100,
)

const fuenteYaExiste = (nombre) =>
  currentBreakdown.value.some((item) => item.nombre.toLowerCase() === nombre.toLowerCase())

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0)

const calcularPorcentaje = (monto) =>
  currentRowTotal.value === 0
    ? 0
    : (((Number(monto) || 0) / currentRowTotal.value) * 100).toFixed(2)

const estadoColor = (e) =>
  ({
    CRD: 'grey',
    PLAN: 'warning',
    EJEC: 'info',
    REP: 'primary',
    RETR: 'error',
    REPROG: 'orange',
    FIN: 'success',
  })[e] || 'default'

const agregarFuentesExistentes = () => {
  if (!fuentesSeleccionadas.value?.length) return

  fuentesSeleccionadas.value.forEach((fuente) => {
    const nombre = fuente.financiera
    if (!fuenteYaExiste(nombre)) {
      currentBreakdown.value.push({
        id: fuente.id,
        nombre,
        monto: 0,
        esExistente: true,
      })
    }
  })

  fuentesSeleccionadas.value = []
}

const agregarFuenteManual = () => {
  const { nombre, monto } = nuevaFuenteManual.value
  if (!nombre || !monto) return
  if (fuenteYaExiste(nombre)) {
    alert(`La fuente "${nombre}" ya existe en el desglose.`)
    return
  }
  currentBreakdown.value.push({
    id: Date.now(),
    nombre,
    monto: Math.min(monto, saldoDisponible.value),
    esExistente: false,
  })
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

const eliminarFuente = (index) => currentBreakdown.value.splice(index, 1)

const saveBreakdown = () => {
  if (totalDesglose.value > 0 && totalDesglose.value <= currentRowTotal.value) {
    emit('guardarDesglose', JSON.parse(JSON.stringify(currentBreakdown.value)))
    closeDialog()
  }
}

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

const cerrarTodo = () => {
  dialogoCero.value = false
  closeDialog()
}

const resetForm = () => {
  currentBreakdown.value = (props.desgloseInicial || []).map((item) => ({
    id: item.id || Date.now(),
    nombre: item.nombre || item.financiera || '',
    monto: Number(item.monto) || 0,
    esExistente: item.esExistente !== false,
  }))
  fuentesSeleccionadas.value = []
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (currentRowTotal.value === 0) {
        dialogoCero.value = true
        return
      }
      dialog.value = true
      nextTick(() => resetForm())
    } else {
      dialog.value = false
    }
  },
)

watch(dialog, (val) => {
  if (!val) closeDialog()
})

onMounted(async () => {
  try {
    await fetchOptions()
  } catch (err) {
    console.error('Error cargando fuentes:', err)
  }
})
</script>
