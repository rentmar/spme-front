<template>
  <div class="presupuesto-container">
    <!-- Header del componente -->
    <div class="presupuesto-header">
      <v-icon color="#1F4E78" class="mr-2">mdi-calculator</v-icon>
      <h3 class="header-title">CALCULADORA DE PRESUPUESTO</h3>
      <v-chip color="#E3F2FD" text-color="#1F4E78" small class="ml-2">
        Presupuesto total: {{ formatCurrency(presupuestoTotal) }}
      </v-chip>
    </div>

    <!-- Fuentes de financiamiento desde API -->
    <div class="fuentes-section">
      <div class="section-header">
        <v-icon color="#2E7D32" class="mr-2">mdi-bank</v-icon>
        <h4 class="section-title">FUENTES REGISTRADAS</h4>
        <v-chip color="#E8F5E9" text-color="#2E7D32" x-small class="ml-2">
          {{ fuentesAPI.length }} disponibles
        </v-chip>
      </div>

      <div class="fuentes-grid">
        <v-card
          v-for="fuente in fuentesAPI"
          :key="fuente.id"
          class="fuente-card"
          variant="outlined"
          @click="seleccionarFuenteAPI(fuente)"
        >
          <v-card-text class="pa-3">
            <div class="fuente-content">
              <v-icon
                :color="fuenteSeleccionadaAPI?.id === fuente.id ? '#2E7D32' : '#666'"
                class="mr-2"
              >
                {{
                  fuenteSeleccionadaAPI?.id === fuente.id
                    ? 'mdi-check-circle'
                    : 'mdi-circle-outline'
                }}
              </v-icon>
              <div class="fuente-info">
                <div class="fuente-nombre">{{ fuente.nombre }}</div>
                <div class="fuente-tipo">{{ fuente.tipo }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Controles para fuente API seleccionada -->
      <div v-if="fuenteSeleccionadaAPI" class="controles-fuente">
        <v-text-field
          v-model.number="montoFuenteAPI"
          type="number"
          label="Monto a asignar"
          variant="outlined"
          density="compact"
          :max="saldoDisponible"
          :min="0"
          prefix="$"
          class="monto-input"
        />
        <v-btn
          color="#1976D2"
          variant="flat"
          @click="agregarFuenteAPI"
          :disabled="!montoFuenteAPI || montoFuenteAPI <= 0 || montoFuenteAPI > saldoDisponible"
          class="ml-2"
        >
          <v-icon left>mdi-plus</v-icon>
          Agregar
        </v-btn>
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <!-- Fuente manual -->
    <div class="fuente-manual-section">
      <div class="section-header">
        <v-icon color="#FF9800" class="mr-2">mdi-pencil</v-icon>
        <h4 class="section-title">AGREGAR FUENTE MANUAL</h4>
      </div>

      <div class="manual-controls">
        <v-text-field
          v-model="nuevaFuenteManual.nombre"
          label="Nombre de la fuente"
          variant="outlined"
          density="compact"
          placeholder="Ej: Recursos propios, Donación, etc."
          class="nombre-input"
        />

        <v-text-field
          v-model.number="nuevaFuenteManual.monto"
          type="number"
          label="Monto"
          variant="outlined"
          density="compact"
          :max="saldoDisponible"
          :min="0"
          prefix="$"
          class="monto-input"
        />

        <v-btn
          color="#FF9800"
          variant="flat"
          @click="agregarFuenteManual"
          :disabled="
            !nuevaFuenteManual.nombre ||
            !nuevaFuenteManual.monto ||
            nuevaFuenteManual.monto <= 0 ||
            nuevaFuenteManual.monto > saldoDisponible
          "
          class="ml-2"
        >
          <v-icon left>mdi-plus</v-icon>
          Agregar Manual
        </v-btn>
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <!-- Tabla de desglose presupuestario -->
    <div class="tabla-presupuesto">
      <div class="table-header">
        <v-icon color="#1F4E78" class="mr-2">mdi-table</v-icon>
        <h4 class="table-title">DESGLOSE DE PRESUPUESTO</h4>
        <v-chip
          :color="saldoDisponible >= 0 ? 'green-lighten-4' : 'red-lighten-4'"
          small
          class="ml-2"
        >
          Saldo: {{ formatCurrency(saldoDisponible) }}
        </v-chip>
      </div>

      <v-table density="compact" class="presupuesto-table">
        <thead>
          <tr>
            <th>Fuente de Financiamiento</th>
            <th class="text-right">Monto Asignado</th>
            <th class="text-right">% del Total</th>
            <th class="text-center">Tipo</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in desglosePresupuesto" :key="index">
            <td>
              <div class="fuente-info">
                <v-icon small :color="item.manual ? '#FF9800' : '#2E7D32'" class="mr-2">
                  {{ item.manual ? 'mdi-pencil' : 'mdi-bank' }}
                </v-icon>
                {{ item.nombre }}
              </div>
            </td>
            <td class="text-right">
              <v-text-field
                v-model.number="item.monto"
                type="number"
                variant="underlined"
                density="compact"
                hide-details
                single-line
                :min="0"
                :max="presupuestoTotal"
                @update:modelValue="actualizarMonto(index)"
                class="monto-cell"
              />
            </td>
            <td class="text-right percentage-cell">{{ calcularPorcentaje(item.monto) }}%</td>
            <td class="text-center">
              <v-chip :color="item.manual ? 'orange' : 'green'" small variant="flat">
                {{ item.manual ? 'Manual' : 'Registrada' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn
                icon
                size="x-small"
                color="error"
                variant="text"
                @click="eliminarFuente(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>

          <!-- Fila de totales -->
          <tr class="total-row">
            <td><strong>TOTAL ASIGNADO</strong></td>
            <td class="text-right">
              <strong>{{ formatCurrency(totalDesglose) }}</strong>
            </td>
            <td class="text-right">
              <strong>{{ porcentajeTotal }}%</strong>
            </td>
            <td colspan="2"></td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <!-- Resumen y alertas -->
    <div class="resumen-section">
      <v-alert
        :type="saldoDisponible < 0 ? 'error' : saldoDisponible === 0 ? 'success' : 'info'"
        density="compact"
      >
        <div class="resumen-content">
          <v-icon class="mr-2">
            {{
              saldoDisponible < 0
                ? 'mdi-alert'
                : saldoDisponible === 0
                  ? 'mdi-check-circle'
                  : 'mdi-information'
            }}
          </v-icon>
          <span>
            Saldo disponible:
            <strong
              :class="{
                'text-error': saldoDisponible < 0,
                'text-success': saldoDisponible === 0,
                'text-info': saldoDisponible > 0,
              }"
            >
              {{ formatCurrency(saldoDisponible) }}
            </strong>
          </span>
          <span v-if="saldoDisponible < 0" class="ml-2">- ¡Presupuesto excedido!</span>
          <span v-else-if="saldoDisponible === 0" class="ml-2"
            >- Presupuesto completamente asignado</span
          >
          <span v-else class="ml-2">- Disponible para asignar</span>
        </div>
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  presupuestoTotal: {
    type: Number,
    default: 0,
    required: true,
  },
  procedenciaActual: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['presupuesto-actualizado'])

// Datos dummy para fuentes de API
const fuentesAPI = ref([
  { id: 1, nombre: 'Fondos Propios', tipo: 'Recursos internos' },
  { id: 2, nombre: 'Gobierno Central', tipo: 'Transferencia pública' },
  { id: 3, nombre: 'Cooperación Internacional', tipo: 'Donación externa' },
  { id: 4, nombre: 'Donaciones Privadas', tipo: 'Donación privada' },
  { id: 5, nombre: 'Préstamos Bancarios', tipo: 'Financiamiento externo' },
  { id: 6, nombre: 'Ingresos por Proyectos', tipo: 'Autogenerado' },
  { id: 7, nombre: 'Municipalidad', tipo: 'Gobierno local' },
  { id: 8, nombre: 'ONG Internacional', tipo: 'Cooperación' },
])

// Variables reactivas
const fuenteSeleccionadaAPI = ref(null)
const montoFuenteAPI = ref(0)
const nuevaFuenteManual = ref({ nombre: '', monto: 0 })
const desglosePresupuesto = ref([...props.procedenciaActual])

// Computed properties
const totalDesglose = computed(() => {
  return desglosePresupuesto.value.reduce((sum, item) => sum + (Number(item.monto) || 0), 0)
})

const saldoDisponible = computed(() => {
  return props.presupuestoTotal - totalDesglose.value
})

const porcentajeTotal = computed(() => {
  return props.presupuestoTotal > 0
    ? ((totalDesglose.value / props.presupuestoTotal) * 100).toFixed(2)
    : 0
})

// Métodos
const seleccionarFuenteAPI = (fuente) => {
  fuenteSeleccionadaAPI.value = fuente
  montoFuenteAPI.value = 0
}

const agregarFuenteAPI = () => {
  if (fuenteSeleccionadaAPI.value && montoFuenteAPI.value > 0) {
    // Verificar si ya existe esta fuente
    const existe = desglosePresupuesto.value.find(
      (item) => item.id === fuenteSeleccionadaAPI.value.id && !item.manual,
    )

    if (existe) {
      // Si existe, sumar al monto existente
      existe.monto += Number(montoFuenteAPI.value)
    } else {
      // Si no existe, agregar nueva
      desglosePresupuesto.value.push({
        id: fuenteSeleccionadaAPI.value.id,
        nombre: fuenteSeleccionadaAPI.value.nombre,
        monto: Number(montoFuenteAPI.value),
        manual: false,
        tipo: fuenteSeleccionadaAPI.value.tipo,
      })
    }

    resetearFormularioAPI()
    emitUpdate()
  }
}

const agregarFuenteManual = () => {
  if (nuevaFuenteManual.value.nombre && nuevaFuenteManual.value.monto > 0) {
    desglosePresupuesto.value.push({
      id: Date.now(), // ID único
      nombre: nuevaFuenteManual.value.nombre,
      monto: Number(nuevaFuenteManual.value.monto),
      manual: true,
      tipo: 'Manual',
    })

    resetearFormularioManual()
    emitUpdate()
  }
}

const eliminarFuente = (index) => {
  desglosePresupuesto.value.splice(index, 1)
  emitUpdate()
}

const actualizarMonto = (index) => {
  if (desglosePresupuesto.value[index].monto < 0) {
    desglosePresupuesto.value[index].monto = 0
  }
  emitUpdate()
}

const calcularPorcentaje = (monto) => {
  return props.presupuestoTotal > 0
    ? ((Number(monto) / props.presupuestoTotal) * 100).toFixed(2)
    : 0
}

const resetearFormularioAPI = () => {
  montoFuenteAPI.value = 0
}

const resetearFormularioManual = () => {
  nuevaFuenteManual.value = { nombre: '', monto: 0 }
}

const emitUpdate = () => {
  emit('presupuesto-actualizado', {
    presupuesto_total: props.presupuestoTotal,
    procedencia_fondos: [...desglosePresupuesto.value],
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value || 0)
}

// Inicializar con datos actuales
onMounted(() => {
  if (props.procedenciaActual.length === 0) {
    desglosePresupuesto.value = []
  }
})
</script>

<style scoped>
.presupuesto-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.presupuesto-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e3f2fd;
}

.header-title {
  color: #1f4e78;
  font-weight: 600;
  margin: 0;
}

.fuentes-section,
.fuente-manual-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  color: #424242;
  font-weight: 600;
  margin: 0;
  font-size: 1rem;
}

.fuentes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.fuente-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.fuente-card:hover {
  border-color: #1976d2;
  transform: translateY(-2px);
}

.fuente-content {
  display: flex;
  align-items: center;
}

.fuente-info {
  flex: 1;
}

.fuente-nombre {
  font-weight: 500;
  color: #424242;
}

.fuente-tipo {
  font-size: 0.8rem;
  color: #757575;
}

.controles-fuente,
.manual-controls {
  display: flex;
  align-items: end;
  gap: 12px;
  flex-wrap: wrap;
}

.monto-input,
.nombre-input {
  flex: 1;
  min-width: 150px;
}

.table-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  color: #1f4e78;
  font-weight: 600;
  margin: 0;
}

.presupuesto-table {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.presupuesto-table th {
  background: #f5f5f5 !important;
  color: #1f4e78 !important;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.presupuesto-table td {
  border-bottom: 1px solid #e0e0e0;
}

.monto-cell {
  max-width: 120px;
}

.percentage-cell {
  color: #666;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.total-row {
  background: #e8f5e8 !important;
  font-weight: 600;
}

.total-row td {
  border-top: 2px solid #4caf50;
  border-bottom: none;
}

.resumen-section {
  margin-top: 20px;
}

.resumen-content {
  display: flex;
  align-items: center;
}

.text-error {
  color: #d32f2f;
}

.text-success {
  color: #2e7d32;
}

.text-info {
  color: #1976d2;
}

/* Responsividad */
@media (max-width: 768px) {
  .fuentes-grid {
    grid-template-columns: 1fr;
  }

  .controles-fuente,
  .manual-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .monto-input,
  .nombre-input {
    min-width: auto;
  }
}
</style>
