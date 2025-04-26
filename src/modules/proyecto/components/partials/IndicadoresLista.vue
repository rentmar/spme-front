<template>
  <div>
    <!-- Tarjeta para cada indicador -->
    <v-card v-for="(indicador, idx) in indicadores" :key="idx" variant="outlined" class="mb-3">
      <!-- Encabezado con código y descripción -->
      <v-card-title class="d-flex align-center">
        <v-chip :color="getTipoColor(indicador.tipo)" size="small" class="mr-3">
          {{ indicador.codigo }}
        </v-chip>
        <span class="text-subtitle-1">{{ indicador.redaccion }}</span>
      </v-card-title>

      <v-card-text>
        <!-- Chips con información adicional -->
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

        <!-- Tabla con los valores del indicador -->
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
// Props: indicadores - array de indicadores a mostrar
defineProps({
  indicadores: {
    type: Array,
    default: () => [],
  },
})

// Función para obtener el color según el tipo de indicador
const getTipoColor = (tipo) => {
  return tipo === 'SMART' ? 'green' : 'blue'
}
</script>
