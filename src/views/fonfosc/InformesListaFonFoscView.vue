<template>
  <div>
    <h1>Informes - Lista de informes de los fonfosc</h1>

    <!-- Estado de carga -->
    <div v-if="loading">Cargando...</div>

    <!-- Error -->
    <div v-else-if="error" style="color: red">Error: {{ error }}</div>

    <!-- Datos -->
    <div v-else>
      <p><strong>Total registros:</strong> {{ count }}</p>

      <table v-if="entradas.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Tipo Dato</th>
            <th>Valor</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in entradas" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.fecha_registro }}</td>
            <td>{{ item.tipo_dato }}</td>
            <td>
              <span v-if="item.tipo_dato === 'A-Z'">{{ item.valor_literal }}</span>
              <span v-else-if="item.tipo_dato === '1-9'">{{ item.valor_numerico }}</span>
              <span v-else-if="item.tipo_dato === '%'">{{ item.valor_porcentual }}%</span>
            </td>
            <td>{{ item.observaciones }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else>No hay registros para este indicador</p>
    </div>
  </div>
</template>

<script setup>
import { useBitacoraOG } from '@/modules/reportes/composables/useBitacoraOG'
import { onMounted } from 'vue'

const { entradas, loading, error, count, fetchPorIndicador } = useBitacoraOG()

onMounted(() => {
  fetchPorIndicador(147)
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background: #f5f5f5;
}
</style>
