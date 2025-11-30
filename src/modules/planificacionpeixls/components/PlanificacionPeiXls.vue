<template>
  <div class="hot-wrapper">
    <div class="content-wrapper">
      <!-- Panel Izquierdo - Tabla Excel -->
      <div class="excel-panel">
        <!-- Toolbar principal -->
        <v-toolbar flat density="comfortable" class="excel-toolbar">
          <!-- Panel de informacion -->
          <v-tooltip text="Mostrar/Esconder Panel de informacion" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="toogleSidePanel">
                <v-icon size="18">mdi-view-agenda</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Guardar-->
          <v-tooltip text="Guardar Planificacion" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="guardarPlanificacion"
              >
                <v-icon size="18">mdi-content-save</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Nueva Actividad-->
          <v-tooltip text="Agregar nueva actividad" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="abrirNuevaActividad">
                <v-icon size="18">mdi-plus-outline</v-icon>
                <v-icon size="18">mdi-clipboard-text-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-dialog v-model="mostrarModalActividad" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="cerrarNuevaActividad"></v-btn>

                <v-toolbar-title>Agregar Nueva Actividad/Proceso </v-toolbar-title>

                <v-toolbar-items>
                  <!-- <v-btn text="Guardar" variant="text"></v-btn> -->
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-card-text>
                  <SeleccionEstructuraActividadPei
                    :pei-data="storePeiPlanificacion.estructuraPeiSeleccionado"
                  ></SeleccionEstructuraActividadPei>
                  <!-- <SeleccionEstructuraActividad
                    :proyecto-data="props.proyectoEstructura"
                    @crear-actividad="crearActividadPlan"
                  ></SeleccionEstructuraActividad> -->
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <!-- Toolbar de información - Estilo Excel -->
        <v-toolbar
          flat
          density="compact"
          class="details-toolbar excel-style-toolbar"
          v-if="selectedRowData"
        ></v-toolbar>
        <!-- Toolbar de actividades dinámicas -->
        <v-toolbar flat density="comfortable" class="activity-toolbar"> </v-toolbar>
        <!--Tabla del planificador-->
        <HotTable
          v-if="inicializado"
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="1500"
          :contextMenu="true"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :afterSelection="handleSelection"
          :licenseKey="'non-commercial-and-evaluation'"
          :hiddenColumns="hiddenColumnsConfig"
        ></HotTable>
      </div>
      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible"></div>
    </div>
  </div>
</template>

<script setup>
//Tabla
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { ref, computed } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
//Selectores
import SeleccionEstructuraActividadPei from './parciales/SeleccionEstructuraActividadPei.vue'
//Stores
import { usePlanificacionPeiStore } from '../store/usePlanificacionPeiStore'

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

//Composables
const { warningMsg } = useSnackbar()

//Iniciar el store
const storePeiPlanificacion = usePlanificacionPeiStore()

/************ VARIABLES Y ESTADOS DE LA TABLA EXCEL **********************/
const tableData = ref([])
const inicializado = ref(true)
//headers
const headers = ref(true)
//Columnas
const columns = ref([])
//Manejo de cambios
const handleChange = () => {}

//Esconder columnas
const hiddenColumnsConfig = computed(() => {
  return {
    columns: [], // Columnas 1, 3 y 7
    //columns: [10, 21, 20, 16, 11, 13], // Columnas 1, 3 y 7
  }
})
/****************** Handle Selection ***********/
//Manejar seleccion
const selectedRowData = ref(null)
const handleSelection = () => {}

/******************* CONTROLES DE LA INTERFAZ EXCEL ********************/
//Procedimiento guardar
const confirmacionModal = ref(false)
const guardando = ref(false)

const guardarPlanificacion = async () => {
  if (tableData.value.length === 0) {
    warningMsg('No hay actividades para guardar', 3000)
    return
  }
  confirmacionModal.value = true
}

//Agregar nueva actividad
const mostrarModalActividad = ref(false)
const abrirNuevaActividad = () => {
  mostrarModalActividad.value = true
}
const cerrarNuevaActividad = () => {
  mostrarModalActividad.value = false
}

/****************** CONTROLES DEL PANEL IZQUIERDO ************************/
const sidePanelVisible = ref(false)
const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}
</script>

<style scoped>
.flow-container {
  width: 100%;
  height: 1000px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

/* Also ensure the vue-flow element itself gets dimensions */
.vue-flow {
  width: 100%;
  height: 100%;
}

/* Estilos (mantener igual) */
.hot-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 150px);
  min-height: 1000px;
}

.content-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 150px);
  min-height: 700;
}

.excel-panel {
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 300%;
}

.side-panel {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
}

/********* toolbar de actividad *********/
/* Toolbar estilo Excel */
.excel-style-toolbar {
  background: linear-gradient(to bottom, #f3f3f3 0%, #e6e6e6 100%) !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 3px !important;
  padding: 4px 8px !important;
  min-height: 36px !important;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

/* Contenedor de información horizontal */
.excel-info-container.horizontal-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 2px 0;
}

.horizontal-item {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  min-height: 28px;
  flex-shrink: 0;
  white-space: nowrap;
}

.info-text.excel-info-text {
  font-size: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
}

.excel-label {
  color: #605e5c;
  font-weight: 600;
}

.excel-value {
  color: #323130;
  font-weight: 400;
}

.excel-code {
  color: #0078d4;
  font-weight: 600;
}

.budget-value {
  color: #107c10;
  font-weight: 600;
}

/* Grupo de botones horizontal */
.horizontal-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.excel-button {
  min-width: auto !important;
  height: 28px !important;
  padding: 0 12px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

.excel-button:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-1px);
}

.excel-button :deep(.v-btn__content) {
  gap: 4px !important;
}

.excel-button :deep(.v-icon) {
  margin-right: 4px !important;
  margin-left: -2px !important;
}

/* Colores específicos para cada botón */
.budget-button {
  background: linear-gradient(to bottom, #0078d4 0%, #106ebe 100%) !important;
  color: white !important;
}

.budget-button:hover {
  background: linear-gradient(to bottom, #106ebe 0%, #005a9e 100%) !important;
}

.pei-button {
  background: linear-gradient(to bottom, #107c10 0%, #0e6c0e 100%) !important;
  color: white !important;
}

.pei-button:hover {
  background: linear-gradient(to bottom, #0e6c0e 0%, #0d5c0d 100%) !important;
}

.structure-button {
  background: linear-gradient(to bottom, #505a64 0%, #3b444b 100%) !important;
  color: white !important;
}

.structure-button:hover {
  background: linear-gradient(to bottom, #3b444b 0%, #2c3439 100%) !important;
}

/* Ajustes responsivos */
@media (max-width: 1200px) {
  .excel-info-container.horizontal-layout {
    gap: 8px;
  }

  .horizontal-item {
    padding: 4px 8px;
  }

  .info-text.excel-info-text {
    font-size: 11px;
  }
}

@media (max-width: 900px) {
  .excel-info-container.horizontal-layout {
    gap: 6px;
  }

  .horizontal-item {
    padding: 3px 6px;
  }

  .excel-button {
    padding: 0 8px !important;
    font-size: 10px !important;
  }
}

/* Scroll horizontal para pantallas muy pequeñas */
.excel-info-container.horizontal-layout {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f0f0f0;
}

.excel-info-container.horizontal-layout::-webkit-scrollbar {
  height: 4px;
}

.excel-info-container.horizontal-layout::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.excel-info-container.horizontal-layout::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

/* Efectos de focus para accesibilidad */
.excel-button:focus-visible {
  outline: 2px solid #0078d4;
  outline-offset: 1px;
}

/* Mejor alineación vertical */
.excel-style-toolbar {
  align-items: center;
}

.horizontal-item {
  align-items: center;
}
</style>
