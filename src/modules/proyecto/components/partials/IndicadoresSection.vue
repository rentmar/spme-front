<template>
  <div>
    <h3 class="text-h6 mb-3 d-flex align-center">
      <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
      Indicadores
    </h3>

    <v-alert
      v-if="!indicadores || indicadores.length === 0"
      type="info"
      variant="tonal"
      class="mb-4"
    >
      No hay indicadores asociados
    </v-alert>

    <v-card v-for="(indicador, idx) in indicadores" :key="idx" class="mb-3" variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-chip :color="getTipoColor(indicador.tipo)" size="small" class="mr-2">
          {{ indicador.codigo }}
        </v-chip>
        <span class="text-subtitle-1">{{ indicador.redaccion }}</span>
      </v-card-title>

      <v-card-text>
        <div class="mb-3">
          <v-chip size="small" class="mr-2">
            <v-icon icon="mdi-account-group" left size="small"></v-icon>
            {{ indicador.target_poblacion }}
          </v-chip>
          <v-chip size="small">
            <v-icon icon="mdi-source-repository" left size="small"></v-icon>
            {{ indicador.fuente_verificacion }}
          </v-chip>
        </div>

        <v-table density="compact">
          <thead>
            <tr>
              <th>Línea Base</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ indicador.baseline || '-' }}</td>
              <td>{{ indicador.target_q1 || '-' }}</td>
              <td>{{ indicador.target_q2 || '-' }}</td>
              <td>{{ indicador.target_q3 || '-' }}</td>
              <td>{{ indicador.target_q4 || '-' }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
defineProps({
  indicadores: {
    type: Array,
    default: () => [],
  },
})

const getTipoColor = (tipo) => {
  return tipo === 'SMART' ? 'green' : 'blue'
}
</script>
