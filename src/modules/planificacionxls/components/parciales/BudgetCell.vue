<template>
  <div class="budget-cell" @click.stop="openModal">
    <!-- Mostrar siempre el total -->
    <div class="budget-total">
      {{ formatCurrency(totalBudget) }}
    </div>

    <!-- Modal para el desglose -->
    <v-dialog v-model="modalOpen" max-width="600">
      <v-card>
        <v-card-title class="headline"> Desglose de Presupuesto </v-card-title>

        <v-card-text>
          <div class="breakdown-container">
            <div class="breakdown-header">
              <span class="source-column">Fuente de Financiamiento</span>
              <span class="amount-column">Monto</span>
              <span class="percentage-column">%</span>
            </div>

            <div v-for="(item, index) in breakdownData" :key="index" class="breakdown-row">
              <span class="source-column">{{ getFundingSourceName(item.source) }}</span>
              <span class="amount-column">{{ formatCurrency(item.amount) }}</span>
              <span class="percentage-column">{{ calculatePercentage(item.amount) }}%</span>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="breakdown-total">
              <span class="source-column">Total</span>
              <span class="amount-column">{{ formatCurrency(totalBudget) }}</span>
              <span class="percentage-column">100%</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="modalOpen = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  // Presupuesto total
  totalBudget: {
    type: Number,
    default: 0,
  },
  // Datos de procedencia de fondos
  fundingSources: {
    type: Array,
    default: () => [],
  },
  // Datos del desglose del presupuesto
  budgetData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:budgetData'])

const modalOpen = ref(false)
const breakdownData = ref([])

// Mapeo de códigos de fuente a nombres legibles
const fundingSourceNames = {
  FP: 'Fondo Propio',
  FIN1: 'Financiador 1',
  FIN2: 'Financiador 2',
  FIN3: 'Financiador 3',
  // Agregar más según sea necesario
}

onMounted(() => {
  // Inicializar datos de desglose si no existen
  if (Object.keys(props.budgetData).length === 0 && props.fundingSources.length > 0) {
    const initialData = {}
    props.fundingSources.forEach((source) => {
      initialData[source] = 0
    })
    emit('update:budgetData', initialData)
  }

  // Preparar datos para mostrar en el desglose
  updateBreakdownData()
})

// Abrir el modal
const openModal = () => {
  updateBreakdownData()
  modalOpen.value = true
}

// Convertir el objeto de datos de presupuesto a un array para mostrar
const updateBreakdownData = () => {
  breakdownData.value = Object.entries(props.budgetData).map(([source, amount]) => ({
    source,
    amount,
  }))
}

// Calcular porcentaje de cada fuente
const calculatePercentage = (amount) => {
  if (props.totalBudget === 0) return 0
  return ((amount / props.totalBudget) * 100).toFixed(2)
}

// Obtener nombre legible de la fuente de financiamiento
const getFundingSourceName = (code) => {
  return fundingSourceNames[code] || code
}

// Formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}
</script>

<style scoped>
.budget-cell {
  width: 100%;
  height: 100%;
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
}

.budget-total {
  text-align: right;
  font-weight: 500;
}

.breakdown-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown-header,
.breakdown-row,
.breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breakdown-header {
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.source-column {
  flex: 2;
  text-align: left;
}

.amount-column {
  flex: 1;
  text-align: right;
  padding: 0 12px;
}

.percentage-column {
  flex: 0.5;
  text-align: right;
}

.breakdown-total {
  font-weight: 500;
  padding-top: 8px;
  border-top: 1px solid #eee;
}
</style>
