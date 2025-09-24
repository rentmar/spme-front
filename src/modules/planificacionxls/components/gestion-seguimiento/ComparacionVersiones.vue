<template>
  <div class="comparacion-versiones">
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="bg-primary text-white">
            Versión Actual (V{{ versionActual.version }})
          </v-card-title>
          <v-card-text>
            <div class="resumen-version">
              <p><strong>Actividades:</strong> {{ versionActual.rows_data.length }}</p>
              <p>
                <strong>Presupuesto:</strong> {{ calcularPresupuesto(versionActual.rows_data) }}
              </p>
              <p><strong>Fecha:</strong> {{ formatFecha(versionActual.creado) }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="bg-warning text-white">
            Versión a Comparar (V{{ versionComparar.version }})
          </v-card-title>
          <v-card-text>
            <div class="resumen-version">
              <p><strong>Actividades:</strong> {{ versionComparar.rows_data.length }}</p>
              <p>
                <strong>Presupuesto:</strong> {{ calcularPresupuesto(versionComparar.rows_data) }}
              </p>
              <p><strong>Fecha:</strong> {{ formatFecha(versionComparar.creado) }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>Diferencias Detectadas</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="diferencia in diferencias" :key="diferencia.tipo">
            <v-list-item-title>{{ diferencia.descripcion }}</v-list-item-title>
            <v-list-item-subtitle>{{ diferencia.detalles }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card-actions class="mt-4">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('cerrar')">Cerrar</v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  versionActual: {
    type: Object,
    required: true,
  },
  versionComparar: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['cerrar'])

const diferencias = computed(() => {
  const difs = []
  const actual = props.versionActual.rows_data
  const comparar = props.versionComparar.rows_data

  // Diferencias en cantidad de actividades
  if (actual.length !== comparar.length) {
    difs.push({
      tipo: 'cantidad',
      descripcion: 'Diferencia en cantidad de actividades',
      detalles: `Actual: ${actual.length} | Comparar: ${comparar.length}`,
    })
  }

  // Aquí se pueden agregar más comparaciones...

  return difs
})

const calcularPresupuesto = (actividades) => {
  const total = actividades.reduce((sum, act) => sum + (act.presupuesto || 0), 0)
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(total)
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.resumen-version {
  padding: 10px;
}
</style>
