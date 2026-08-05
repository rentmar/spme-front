<template>
  <v-card elevation="2">
    <v-card-title class="bg-primary text-white py-3">
      <v-icon left class="mr-2">mdi-chart-box</v-icon> Estadísticas
    </v-card-title>
    <v-list density="comfortable" class="py-0">
      <v-list-item>
        <template v-slot:prepend><v-icon color="primary">mdi-calendar-check</v-icon></template>
        <v-list-item-title>Total actividades</v-list-item-title>
        <v-list-item-subtitle class="text-right font-weight-bold">{{ total }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item v-for="e in estados" :key="e.texto">
        <template v-slot:prepend
          ><v-icon :color="e.color">{{ e.icono }}</v-icon></template
        >
        <v-list-item-title>{{ e.texto }}</v-list-item-title>
        <v-list-item-subtitle class="text-right">{{ e.conteo }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <template v-slot:prepend><v-icon color="primary">mdi-cash-multiple</v-icon></template>
        <v-list-item-title>Presupuesto Total</v-list-item-title>
        <v-list-item-subtitle class="text-right font-weight-bold">{{
          formatCurrency(presupuesto)
        }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend
          ><v-icon color="deep-purple">mdi-file-document-edit</v-icon></template
        >
        <v-list-item-title>Solicitudes Pendientes</v-list-item-title>
        <v-list-item-subtitle class="text-right">{{ solicitudesPendientes }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend><v-icon color="success">mdi-check-all</v-icon></template>
        <v-list-item-title>Validaciones Pendientes</v-list-item-title>
        <v-list-item-subtitle class="text-right">{{ validacionesPendientes }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  total: { type: Number, default: 0 },
  estados: { type: Array, default: () => [] },
  presupuesto: { type: Number, default: 0 },
  solicitudesPendientes: { type: Number, default: 0 },
  validacionesPendientes: { type: Number, default: 0 },
})

function formatCurrency(v) {
  const n = Number(v)
  return !isNaN(n) ? `Bs. ${n.toFixed(2)}` : 'N/A'
}
</script>
