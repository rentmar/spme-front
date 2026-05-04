<template>
  <div class="procedencia-cell">
    <div v-if="!tieneDatos" class="sin-datos">NO DEFINIDOS</div>

    <div v-else>
      <details class="fondos-details">
        <summary class="fondos-summary">
          <span>{{ nombresFondos }}</span>
          <span class="badge">{{ data.length }}</span>
        </summary>
        <div class="fondos-list">
          <div v-for="fondo in data" :key="fondo.id" class="fondo-item">
            <span>- {{ fondo.nombre }}</span>
            <span class="fondo-monto">{{ formatMonto(fondo.monto) }}</span>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const tieneDatos = computed(() => props.data.length > 0)

const nombresFondos = computed(() => {
  return props.data.map((f) => f.nombre).join(', ')
})

const formatMonto = (monto) => {
  return (parseFloat(monto) || 0).toLocaleString('es-BO')
}
</script>

<style scoped>
.procedencia-cell {
  font-size: 11px;
  width: 100%;
}

.sin-datos {
  background: #fff3e0;
  color: #e65100;
  font-weight: bold;
  text-align: center;
  padding: 8px;
}

.fondos-summary {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  background: #e8f5e9;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #2e7d32;
  list-style: none;
}

.fondos-summary::-webkit-details-marker {
  display: none;
}

.badge {
  background: #4caf50;
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
}

.fondos-list {
  padding: 4px 8px;
}

.fondo-item {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.fondo-monto {
  color: #2e7d32;
  font-weight: bold;
}
</style>
