<template>
  <!-- Encabezado del PEI como tarjeta -->
  <v-card variant="outlined" elevation="1" class="mb-4 pei-header-card">
    <v-card-title class="project-header">
      <div class="d-flex align-center w-100">
        <v-icon icon="mdi-file-chart" size="x-large" class="mr-3" color="primary"></v-icon>
        <div class="project-title-container">
          <h2 class="text-h5 font-weight-bold project-title text-wrap">
            {{ pei.titulo || 'PEI SIN TÍTULO' }}
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis project-subtitle">
            Plan Estratégico Institucional
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          prepend-icon="mdi-progress-check"
          :color="pei.esta_vigente ? 'success' : 'error'"
          size="small"
          class="status-chip"
        >
          {{ pei.esta_vigente ? 'Vigente' : 'No vigente' }}
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="project-content">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha inicio:</strong> {{ formatDate(pei.fecha_inicio) }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-end" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha fin:</strong> {{ formatDate(pei.fecha_fin) }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-clock" class="mr-2" size="small"></v-icon>
            <span
              ><strong>Período:</strong>
              {{ calcularPeriodo(pei.fecha_inicio, pei.fecha_fin) }} años</span
            >
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-update" class="mr-2" size="small"></v-icon>
            <span><strong>Actualizado:</strong> {{ formatDate(pei.modificado_el) }}</span>
          </div>
        </v-col>
      </v-row>
      <!--
      <div class="mt-3">
        <v-textarea
          variant="plain"
          :model-value="pei.descripcion"
          readonly
          auto-grow
          rows="2"
          class="descripcion-text"
        ></v-textarea>
      </div> -->
    </v-card-text>
  </v-card>
</template>

<script setup>
import { formatDate } from '@/utility/formatters'
import { calcularPeriodo } from '@/utility/formatters'

defineProps({
  pei: { type: Object, required: true },
  activarDetalles: { type: Boolean, default: false },
  activarEditar: { type: Boolean, default: false },
})
</script>

<style scoped>
.pei-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* Estilos para la tarjeta de encabezado */
.pei-header-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.pei-header-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.project-header {
  padding: 16px;
  background-color: #f5f5f5;
}

.project-title-container {
  min-width: 0;
  margin-right: 12px;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.project-subtitle {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

.status-chip {
  min-width: 100px;
  padding: 0 10px;
  font-weight: 500;
  height: 28px;
  font-size: 0.8125rem;
  letter-spacing: 0.5px;
  margin-left: 8px;
  flex-shrink: 0;
}

.project-content {
  padding: 16px;
}

.descripcion-text {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.8);
}

/* Estilos para la tarjeta de marco lógico */
.marco-logico-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.marco-logico-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.marco-logico-toolbar {
  background-color: #1976d2 !important;
}

/* Estilos para la tabla del marco lógico */
.marco-logico-table {
  border-collapse: separate;
  border-spacing: 0 8px;
  width: 100%;
}

.marco-logico-table thead th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 12px 16px;
}

.marco-logico-table tbody tr {
  background-color: white;
  transition: box-shadow 0.2s ease;
}

.marco-logico-table tbody tr:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.marco-logico-row td {
  padding: 12px 16px;
  vertical-align: top;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* Estilos específicos para cada columna */
.objetivo-estrategico-cell {
  width: 25%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.objetivos-especificos-cell {
  width: 25%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.indicadores-cell {
  width: 25%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.metas-cell {
  width: 25%;
}

/* Contenedores para cada tipo de elemento */
.objetivos-container,
.indicadores-container,
.metas-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Estilos para cada elemento */
.objetivo-especifico,
.indicador,
.meta {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.objetivo-especifico:hover,
.indicador:hover,
.meta:hover {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Botones */
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}

/* Responsivo */
@media (max-width: 960px) {
  .pei-container {
    padding: 16px 12px;
  }

  .marco-logico-table {
    display: block;
    overflow-x: auto;
  }

  .marco-logico-row td {
    min-width: 200px;
  }
}
</style>
