<!-- DetalleGastosSolicitud.vue -->
<template>
  <div class="form-section mb-6">
    <h3 class="text-h6 mb-4 primary--text">
      <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
      Detalle de Gastos Solicitados
    </h3>

    <v-alert type="info" variant="tonal" class="mb-4">
      <template v-slot:prepend>
        <v-icon color="info">mdi-information</v-icon>
      </template>
      Agregue todos los gastos asociados a la actividad. Especifique partida, descripción y monto.
    </v-alert>

    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="addGasto">
        Agregar Item
      </v-btn>

      <div class="d-flex align-center gap-2">
        <v-chip
          class="text-subtitle-1"
          :color="excedePresupuesto ? 'error' : 'primary'"
          variant="outlined"
        >
          Monto Total: Bs. {{ totalMontoSolicitado.toLocaleString() }}
        </v-chip>

        <v-chip color="success" variant="outlined" size="small">
          Disponible: Bs. {{ presupuestoDisponible.toLocaleString() }}
        </v-chip>

        <v-chip v-if="excedePresupuesto" color="error" variant="flat" size="small">
          <v-icon start size="16">mdi-alert-circle</v-icon>
          Excede: Bs. {{ montoExcedido.toLocaleString() }}
        </v-chip>
      </div>
    </div>

    <v-table class="elevation-1 rounded-lg mb-4 users-table">
      <thead>
        <tr>
          <th class="text-subtitle-2 font-weight-bold">Partida</th>
          <th class="text-subtitle-2 font-weight-bold">Fuente</th>
          <th class="text-subtitle-2 font-weight-bold">Descripción</th>
          <th class="text-subtitle-2 font-weight-bold">Monto (Bs.)</th>
          <th class="text-subtitle-2 font-weight-bold text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(gasto, index) in gastos" :key="index">
          <td class="narrow-column">
            <v-text-field
              v-model="gasto.partida"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="blue-lighten-5"
              placeholder="1.1.1"
              class="compact-field"
            ></v-text-field>
          </td>
          <td class="narrow-column">
            <v-text-field
              v-model="gasto.fuente"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="blue-lighten-5"
              placeholder="Financiador"
            ></v-text-field>
          </td>
          <td class="wide-column">
            <v-text-field
              v-model="gasto.descripcion_gasto"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="blue-lighten-5"
              placeholder="Descripción del gasto"
            ></v-text-field>
          </td>
          <td class="narrow-column">
            <v-text-field
              v-model.number="gasto.monto"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              bg-color="blue-lighten-5"
              placeholder="0.00"
              min="0"
              class="compact-field"
            ></v-text-field>
          </td>
          <td class="text-center action-column">
            <v-btn
              icon
              color="error"
              size="small"
              variant="text"
              @click="removeGasto(index)"
              :disabled="gastos.length <= 1"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useActividadPresupuesto } from '@/modules/formularios/store/useActividadPresupuestoStore'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [{ partida: '', fuente: '', descripcion_gasto: '', monto: 0 }],
  },
})

const emit = defineEmits(['update:modelValue'])

const store = useActividadPresupuesto()

// ✅ Usar una ref local sincronizada
const gastos = ref([...props.modelValue])

// Sincronizar con el padre
import { watch } from 'vue'
watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(gastos.value)) {
      gastos.value = [...val]
    }
  },
  { deep: true },
)

watch(
  gastos,
  (val) => {
    emit('update:modelValue', [...val])
  },
  { deep: true },
)

const presupuestoDisponible = computed(() => store.presupuestoDisponible || 0)

const totalMontoSolicitado = computed(() => {
  return gastos.value.reduce((total, g) => total + Number(g.monto || 0), 0)
})

const excedePresupuesto = computed(() => totalMontoSolicitado.value > presupuestoDisponible.value)

const montoExcedido = computed(() => {
  if (!excedePresupuesto.value) return 0
  return totalMontoSolicitado.value - presupuestoDisponible.value
})

const porcentajeUsado = computed(() => {
  if (presupuestoDisponible.value === 0) return 0
  return Math.min((totalMontoSolicitado.value / presupuestoDisponible.value) * 100, 100)
})

function addGasto() {
  gastos.value.push({ partida: '', fuente: '', descripcion_gasto: '', monto: 0 })
}

function removeGasto(index) {
  if (gastos.value.length <= 1) return
  gastos.value.splice(index, 1)
}

defineExpose({
  totalMontoSolicitado,
  excedePresupuesto,
  montoExcedido,
})
</script>

<style scoped>
.narrow-column {
  width: 15%;
}
.wide-column {
  width: 50%;
}
.action-column {
  width: 15%;
}
.compact-field {
  font-size: 14px;
  max-width: 100px;
}
.gap-2 {
  gap: 8px;
}
</style>
