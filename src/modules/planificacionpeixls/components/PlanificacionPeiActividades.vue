<template>
  <div class="hot-wrapper" v-if="!isLoading">
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
          <v-tooltip
            :text="tieneCambiosSinGuardar ? 'Guardar cambios' : 'No hay cambios para guardar'"
            location="bottom"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="guardarPlanificacion"
                :disabled="!tieneCambiosSinGuardar || guardando"
              >
                <v-icon size="18" :color="tieneCambiosSinGuardar ? 'primary' : 'disabled'"
                  >mdi-content-save</v-icon
                >
                <div v-if="tieneCambiosSinGuardar" class="changes-dot"></div>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Reprogramar-->
          <!-- <v-tooltip text="Reprogramar" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="reprogramarPlanificacion"
              >
                <v-icon size="18">mdi-wrench-clock</v-icon>
              </v-btn>
            </template>
          </v-tooltip> -->
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
            <v-card class="d-flex flex-column">
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
                    :pei-data="storePlanificacion.estructuraPeiSeleccionado"
                    @crear-actividad="crearActividadPlan"
                  ></SeleccionEstructuraActividadPei>

                  <!--Editor grafico de actividades-->
                  <!-- <div style="width: 100%; height: 600px">
                    <EditorEstructuraMainActividades></EditorEstructuraMainActividades>
                  </div> -->
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <!--Exportar a Excel-->
          <v-tooltip text="Exportar a Excel" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="exportarExcel">
                <v-icon size="18">mdi-microsoft-excel</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
        <!-- Toolbar de información - Estilo Excel -->
        <v-toolbar
          flat
          density="compact"
          class="details-toolbar excel-style-toolbar"
          v-if="selectedRowData"
        >
          <!-- Información en línea -->
          <div class="info-container excel-info-container horizontal-layout">
            <!-- Información de la actividad -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#0078D4" size="16" class="mr-1"
                >mdi-checkbox-marked-circle-outline</v-icon
              >
              <span class="info-text excel-info-text">
                <strong class="excel-label">Actividad:</strong>
                <span class="excel-value">{{ selectedRowData.nombreCorto }}</span>
                <span class="excel-code">({{ selectedRowData.codigo }})</span>
              </span>
            </div>
            <!-- Información de presupuesto -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#107C10" size="16" class="mr-1">mdi-currency-usd</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Presupuesto:</strong>
                <span class="excel-value budget-value">{{
                  formatCurrency(selectedRowData.presupuesto)
                }}</span>
              </span>
            </div>
            <!-- Información de fecha de inicio -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#E81123" size="16" class="mr-1">mdi-calendar-clock</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Inicio:</strong>
                <span class="excel-value">{{ formatDate(selectedRowData.fecha_inicio) }}</span>
              </span>
            </div>
            <!-- Información de fecha de cierre -->
            <div
              class="info-section excel-info-section horizontal-item"
              v-if="selectedRowData.fecha_cierre"
            >
              <v-icon color="#FF8C00" size="16" class="mr-1">mdi-calendar-end</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Cierre:</strong>
                <span class="excel-value">{{ formatDate(selectedRowData.fecha_cierre) }}</span>
              </span>
            </div>
          </div>
          <v-spacer></v-spacer>
          <!-- Botonera compacta estilo Excel -->
          <div class="estructura-buttons excel-button-group horizontal-buttons">
            <v-tooltip text="Agregar subactividad" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#0078D4"
                  variant="flat"
                  size="small"
                  class="excel-button budget-button"
                  @click="mostrarModalAgregarTarea"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-plus-outline </v-icon>
                  </template>
                  Subactividad
                </v-btn>
              </template>
            </v-tooltip>
            <!-- <DialogTareaPei
              v-model="mostrarDialogo"
              :actividad="selectedRowData"
              :tarea="tareaSeleccionada"
              @guardar="crearNuevaTarea"
              @cancelar="cerrarDialogo"
            ></DialogTareaPei> -->
            <DialogTareaPei v-model="mostrarDialogo"></DialogTareaPei>

            <v-tooltip text="Ajustar Presupuesto de la Actividad" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#0078D4"
                  variant="flat"
                  size="small"
                  class="excel-button budget-button"
                  @click="mostrarModalPresupuesto"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-cash-multiple</v-icon>
                  </template>
                  Presupuesto
                </v-btn>
              </template>
            </v-tooltip>
            <!----Componente Presupuesto-->
            <ComponentPresupuesto
              v-model="mostrarPresupuesto"
              :presupuesto-total="selectedRowData.presupuesto"
              :desglose-inicial="selectedRowData.procedencia_fondos"
              @guardarDesglose="guardarDesglosePresupuesto"
            ></ComponentPresupuesto>
          </div>
        </v-toolbar>
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
      <div class="side-panel" v-if="sidePanelVisible">
        <ListaTareasActividadPei
          v-if="selectedRowData"
          :actividad="selectedRowData"
        ></ListaTareasActividadPei>
      </div>
    </div>
  </div>
  {{ tableData }}
</template>

<script setup>
//Hottable
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
//Vue
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
//Selectores
import SeleccionEstructuraActividadPei from './parciales/SeleccionEstructuraActividadPei.vue'
import DialogTareaPei from './parciales/DialogTareaPei.vue'
import ComponentPresupuesto from '@/modules/planificacionxls/components/parciales/ComponentPresupuesto.vue'
import ListaTareasActividadPei from './parciales/ListaTareasActividadPei.vue'
//Composables
import { useSnackbar } from '@/composables/useSnackbar'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
//Stores
import { usePlanificacionPeiStore } from '../store/usePlanificacionPeiStore'
//Utilitarios y librerias
import { formatCurrency, formatDate } from '@/modules/planificacionxls/utils/formattersPlan'
import { parse } from 'date-fns'

// Props del componente
const props = defineProps({
  pei: {
    type: Object,
    required: true,
  },
  peiEstructura: {
    type: Object,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: true,
  },
})

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

//ID del proyecto
const route = useRoute()
const idpei = route.params.id

//Store
const storePlanificacion = usePlanificacionPeiStore()

//Composables
const { successMsg, errorMsg, infoMsg } = useSnackbar()
const { crearUnaTareaPei } = useTareaSubactividad()
/************************* CONTROL DE LA INTERFAZ *******************************/
//Agregar nueva actividad
const mostrarModalActividad = ref(false)
const abrirNuevaActividad = () => {
  mostrarModalActividad.value = true
}
const cerrarNuevaActividad = () => {
  mostrarModalActividad.value = false
}

//Rutina para Agregar Nueva Actividad a la grilla
const crearActividadPlan = (actividad) => {
  console.log('Estructura procedencia: ', actividad)
  cargar()
  cerrarNuevaActividad()
}

//AGREGAR Nueva Tarea
const mostrarDialogo = ref(false)
const tareaSeleccionada = ref(null)
const mostrarModalAgregarTarea = () => {
  mostrarDialogo.value = true
}

const cerrarDialogo = () => {
  mostrarDialogo.value = false
}
const crearNuevaTarea = async (payload) => {
  try {
    console.log('Crear la tarea:', payload)
    //await crearUnaTareaPei(payload)
    cerrarDialogo()
    successMsg('Subactividad Creada')
  } catch (err) {
    console.error(err)
    errorMsg('Error al crear la SubActividad')
  }
}

//AGREGAR PROCEDENCIA DE FONDOS - DESGLOSE
const mostrarPresupuesto = ref(false)
const mostrarModalPresupuesto = () => {
  mostrarPresupuesto.value = true
}
//Agregar el desglose del presupuesto a la grilla
const guardarDesglosePresupuesto = (nuevoDesglose) => {
  if (selectedRowData.value) {
    const rowIndex = tableData.value.findIndex((row) => row.id === selectedRowData.value.id)

    if (rowIndex !== -1) {
      // Crear una nueva copia del array para mantener la reactividad
      const updatedTableData = [...tableData.value]

      // Actualizar solo el campo procedencia_fondos de la fila específica
      updatedTableData[rowIndex] = {
        ...updatedTableData[rowIndex],
        procedencia_fondos: Array.isArray(nuevoDesglose) ? [...nuevoDesglose] : nuevoDesglose,
      }

      // Asignar el nuevo array reactivo
      tableData.value = updatedTableData

      // Forzar actualización de Handsontable
      if (hotTable.value?.hotInstance) {
        // Actualizar la celda específica
        hotTable.value.hotInstance.setDataAtCell(rowIndex, 10, nuevoDesglose)

        // Forzar re-renderizado completo
        hotTable.value.hotInstance.render()
        hotTable.value.hotInstance.deselectCell()

        console.log('procedencia_fondos actualizado para fila:', rowIndex)
      }
    }
  }

  mostrarPresupuesto.value = false
  // mostrarMensaje('Desglose de presupuesto guardado correctamente', 'success')
  successMsg('Desglose de presupuesto guardado correctamente')
}

//GUARDAR PLANIFICACION
const guardarPlanificacion = () => {
  successMsg('Guardar la planificacion')
}

/************************* CONTROL DE CAMBIOS ***********************************/
const tieneCambiosSinGuardar = computed(() => storePlanificacion.tieneCambiosSinGuardar)
const tieneCambiosSinGuardar2 = storePlanificacion.hayCambiosPendientes
const guardando = ref(false) // Bandera de guardado

/************************* PANEL EXCEL ******************************************/
const hotTable = ref(null)
const tableData = ref([]) //Datos de la tabla
const inicializado = ref(false) //Bandera de inicializacion
const headers = ref(true)
//Esconder columnas
const hiddenColumnsConfig = computed(() => {
  return {
    columns: [], // Columnas 1, 3 y 7
  }
})

//Configuracion de columnas
const columns = ref([
  { data: 'id', title: 'Id', type: 'numeric', width: 50, readOnly: true },
  { data: 'codigo', title: 'Código', width: 100 },
  { data: 'nombreCorto', title: 'Nombre', width: 100 },
  {
    data: 'tipo',
    title: 'Tipo de Actividad',
    type: 'dropdown',
    width: 250,
    source: function (query, process) {
      const tipos = storePlanificacion.listaTiposAct
      console.log('Columan: ', tipos)
      const siglas = tipos ? tipos.map((t) => t.sigla + ' - ' + t.tipo_actividad) : []
      process(siglas)
    },
  },
  {
    data: 'responsable',
    title: 'Responsable',
    type: 'dropdown',
    width: 110,
    source: function (query, process) {
      // Asegúrate de que el store tenga los usuarios cargados
      const usernames = storePlanificacion.listaUsuariosCompleta
        .filter((user) => user.is_active !== false)
        .map((user) => user.username)
        .filter((username) => username)
        .sort()

      if (query) {
        const filtered = usernames.filter((username) =>
          username.toLowerCase().includes(query.toLowerCase()),
        )
        process(filtered)
      } else {
        process(usernames)
      }
    },
  },
  {
    data: 'fecha_inicio',
    title: 'Inicio',
    type: 'date',
    width: 100,
    dateFormat: 'YYYY-MM-DD',
  },
  {
    data: 'fecha_cierre',
    title: 'Cierre',
    type: 'date',
    width: 100,
    dateFormat: 'YYYY-MM-DD',
  },
  { data: 'supuestos', title: 'Supuestos', width: 100 },
  { data: 'riesgos', title: 'Riesgos', width: 100 },
  {
    data: 'presupuesto',
    title: 'Presupuesto',
    width: 100,
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  { data: 'procedencia_fondos', title: 'Proc. Fondos' },
  {
    data: 'presupuestoGlobal',
    title: 'Presupuesto Global',
    type: 'numeric',
    width: 110,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'totalReportado',
    title: 'Total Reportado',
    type: 'numeric',
    readOnly: true,
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'totalEjecutado',
    title: 'Total Ejecutado',
    type: 'numeric',
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'saldo',
    title: 'Saldo',
    type: 'numeric',
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'estado',
    type: 'text',
    title: 'ESTADO',
    width: 120,
    readOnly: true,
  },
  {
    data: 'gradoEjecucion',
    type: 'dropdown',
    title: 'Grado Ejecucion',
    readOnly: true,
    width: 120,
    source: [
      'PLANIFICADA',
      'RETRASO',
      'REPROGRAMACION',
      'EN EJECUCION',
      'EN REPORTE',
      'FINALIZADO',
    ],
  },
])

/************************* Handle Interfaz Excel  *******************************/
const selectedRowData = ref(null) //Fila seleccionada
const handleChange = (changes, source) => {
  //Ignorar cambios de la carga inicial
  if (source === 'loadData') return

  //console.log('Cambios detectados: ', changes)
  //console.log('Fuente: ', source)
  //Solo procesar si hay cambios reales
  if (changes && changes.length > 0) {
    storePlanificacion.setTieneCambiosSinGuardar(true)
    changes.forEach(([row, prop, oldValue, newValue]) => {
      //Verificar si se modifica fecha de inicio y cierre
      if (prop === 'fecha_inicio' || prop === 'fecha_cierre') {
        infoMsg('Fechas modificadas')
      }
      //Calcula el saldo cuando cambia el presupuesto o el total reportado
      if (prop === 'presupuesto' || prop === 'totalReportado') {
        setTimeout(() => {
          console.log('calcular')
        }, 50)
      }
    })
  }
}
const handleSelection = (startRow, startCol, endRow, endCol, selectionLayer) => {
  if (startRow === endRow) {
    const rowData = hotTable.value.hotInstance.getDataAtRow(startRow)
    const rowObject = {}
    columns.value.forEach((col, index) => {
      if (col.data) {
        rowObject[col.data] = rowData[index]
      }
    })
    selectedRowData.value = rowObject
    //mostrarTareasPopup.value = true
  } else {
    selectedRowData.value = null
  }
}

/************************* SIDE PANEL *******************************************/
const sidePanelVisible = ref(false)
const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}
/************************** Exportar  *********************************************/

const exportarExcel = async () => {
  alert('Exportar a excel')
}

/**********************************CARGA DE DATOS************************************************/
const isLoading = ref(false) //Bandera de carga
const err = ref(null)

const cargar = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      storePlanificacion.obtenerListaUsuarios(),
      storePlanificacion.listaTiposDeActividad(),
      storePlanificacion.listaActividadesPei(idpei),
    ])

    //Comprobador: cargar el tableData <=> hay actividades disponibles
    console.log('ACTIVIDADES PEI: ', storePlanificacion.tableData)
    console.log('Numero de ACT: ', storePlanificacion.tableData.length)
    console.log(storePlanificacion.listaTiposAct)
    if (storePlanificacion.tableData && storePlanificacion.tableData.length) {
      tableData.value = storePlanificacion.tableData
      storePlanificacion.inicializarDatosOriginales(storePlanificacion.tableData)
      successMsg(storePlanificacion.tableData.length + ' Actividades Cargadas')
    }
    inicializado.value = true
  } catch (e) {
    console.error('Error al cargar la informacion', e)
    err.value = e
  } finally {
    isLoading.value = false
  }
}
//Hook
onMounted(() => {
  cargar()
})
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
.icon-container {
  position: relative;
  display: inline-flex;
}

.changes-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ff4757;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 rgba(255, 71, 87, 0.4);
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 4px rgba(255, 71, 87, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}

.toolbar-btn.v-btn--disabled .changes-dot {
  background-color: #ccc;
  animation: none;
}
</style>
