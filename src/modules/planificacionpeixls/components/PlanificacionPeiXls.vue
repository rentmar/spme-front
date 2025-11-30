<template>
  <div class="hotWraper">
    <div class="content-wrapper">
      <!-- Panel Izquierdo - Tabla Excel -->
      <div class="excel-panel">
        <HotTable
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="400"
          :hiddenColumns="hiddenColumnsConfig"
          :contextMenu="contextMenuOptions"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :licenseKey="'non-commercial-and-evaluation'"
        >
        </HotTable>
      </div>
      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible"></div>
    </div>
  </div>
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import { ref } from 'vue'

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

/******************** Controles de la Tabla *******************************/
//Informacion inicial de la tabla
const tableData = ref([])

// Rótulos para columnas
const headers = ref([
  //Objetivo PEI
  'Objetivo PEI',
  //Indicador PEI
  'Indicadores PEI',
  //Objetivo General del Proyecto
  'Objetivo General',
  //Indicador OG
  'Indicador OG',
  //Resultado OG
  'Resultado OG',
  //Indicador Resultado OG
  'Indicador Resultado OG',
  //Objetivo Especifico
  'Objetivo Especifico',
  //Indicador OE
  'Indicador OE',
  //Producto OE
  'Producto OE',
  //Indicador Producto OE
  //'Indicador Producto OE',
  //Resultado OE
  'Resultado OE',
  //Indicador Resultado OE
  'Indicador Resultado OE',
  //Area Programa
  'Programa/Area',
  //Responsable
  'Responsable',
  //Actividad nueva
  'Actividad Nueva',
  //Proceso Actividad
  'Proceso',
  //Actividad
  'Actividad Estructura',
  'Actividad - CODIGO',
  'Actividad',
  'Proceso de la Actividad',
  //Tipoo de actividad
  'Tipo actividad',
  //Fecha inicio
  'Fecha Inicio',
  //Fecha cierre
  'Fecha Cierre',
  //Supuestos Riesgos
  'Supuestos Riesgos',
  //Presupuesto Programa
  'Presupuesto Programa',
  //Presupuesto Global
  'Presupuesto Global',
  //Total Reportado
  'Total Reportado',
  'Total Ejecutado',
  'Saldo',
  'Grado de ejecucion',
  'Medios de verificacion',
])

//Definicion de las columnas
// Configuración de columnas personalizadas
const columns = ref([])

/***************** Controles del Panel derecho ************************/
const sidePanelVisible = ref(false)
</script>

<style scoped>
.hot-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hot-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.excel-toolbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: 4px 8px;
}

.excel-btn {
  min-width: 36px !important;
  height: 36px !important;
  margin: 0 2px !important;
  background-color: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

.excel-btn:hover {
  background-color: #f0f0f0 !important;
}

.excel-btn:active {
  background-color: #e0e0e0 !important;
}

/* Estilos para el panel de informacion */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #f5f5f5;
}

.content-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 150px); /* Ajusta según necesidades */
}

.excel-panel {
  flex: 3; /* Ocupa 3 partes del espacio disponible */
  min-width: 0; /* Necesario para que flex-shrink funcione correctamente */
  display: flex;
  flex-direction: column;
}

.side-panel {
  flex: 1; /* Ocupa 1 parte del espacio disponible */
  min-width: 300px; /* Ancho mínimo */
  max-width: 400px; /* Ancho máximo */
}

.panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  background-color: #1976d2;
  color: white;
  padding: 12px 16px;
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #1976d2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}
/* Estilos tabs */
/* Estilos para las pestañas */
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para la tabla de presupuesto */
.budget-table {
  width: 100%;
  margin-top: 12px;
}

.budget-table th,
.budget-table td {
  padding: 8px 12px;
}

.budget-table thead {
  background-color: #f5f5f5;
}

.text-right {
  text-align: right;
}

.text-error {
  color: #ff5252;
}

/* Estilos para el gráfico circular */
.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Estilos para la lista de actividades */
.v-list {
  background: transparent;
}

/* Ajustes generales para el contenido de las pestañas */
.v-window-item {
  padding: 8px 0;
  height: 100%;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #1976d2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.handsontable .htDimmed {
  background-color: #f5f5f5;
  color: #999;
}
</style>
