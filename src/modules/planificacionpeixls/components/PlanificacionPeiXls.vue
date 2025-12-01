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
                    @crear-actividad="onActividadCreada"
                  ></SeleccionEstructuraActividadPei>
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
            <v-spacer></v-spacer>
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
                  Subactividad PEI
                </v-btn>
              </template>
            </v-tooltip>
            <DialogTareaPei
              v-model="mostrarDialogoSubactividad"
              :actividad="selectedRowData"
              :tarea="tareaSeleccionada"
              @guardar="crearNuevaTarea"
              @cancelar="cerrarDialogo"
            ></DialogTareaPei>
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
</template>

<script setup>
//Tabla
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { ref, computed, onMounted, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
//Selectores
import SeleccionEstructuraActividadPei from './parciales/SeleccionEstructuraActividadPei.vue'
import DialogTareaPei from './parciales/DialogTareaPei.vue'
import ComponentPresupuesto from '@/modules/planificacionxls/components/parciales/ComponentPresupuesto.vue'
import ListaTareasActividadPei from './parciales/ListaTareasActividadPei.vue'
//Stores
import { usePlanificacionPeiStore } from '../store/usePlanificacionPeiStore'
import { usePlanificacionStore } from '@/modules/planificacionxls/store/usePlanificacionStore'
import { peiServicios } from '@/modules/pei/services/peiService'
// Registros
registerAllModules()
registerLanguageDictionary(esMX)

//Props para recibir el ID del PEI
const props = defineProps({
  peiId: {
    type: [Number, String],
    required: true,
    validator: (value) => {
      const num = Number(value)
      return !isNaN(num) && num > 0
    },
  },
})

// Convertir a número internamente
const peiIdNumerico = computed(() => Number(props.peiId))
//Composables
const { warningMsg, successMsg, infoMsg, errorMsg } = useSnackbar()

//Iniciar el store
const storePeiPlanificacion = usePlanificacionPeiStore()
const storePlanificacion = usePlanificacionStore()

/************ VARIABLES Y ESTADOS DE LA TABLA EXCEL **********************/
const tableData = ref([])
const inicializado = ref(false)
const hotTable = ref(null)

//headers
const headers = ref(true)

// Datos para los dropdowns
const listaUsuarios = computed(() => {
  return (
    storePlanificacion.listaUsuariosCompleta
      ?.filter((user) => user.is_active !== false)
      .map((user) => user.username)
      .filter((username) => username)
      .sort() || []
  )
})

const listaTipos = computed(() => {
  return (
    storePlanificacion.listaTiposAct
      ?.map((t) => t.sigla + ' - ' + t.tipo_actividad)
      .filter((item) => item) || []
  )
})

//Columnas
const columns = computed(() => [
  { data: 'id', title: 'ID', type: 'numeric', width: 50, readOnly: true },
  { data: 'codigo', title: 'Código', width: 120 },
  { data: 'nombreCorto', title: 'Nombre Corto', width: 200 },
  { data: 'descripcion', title: 'Descripción', width: 300 },
  { data: 'supuestos', title: 'Supuestos', width: 300 },
  { data: 'riesgos', title: 'Riesgos', width: 300 },
  { data: 'estado', title: 'Estado', width: 100 },
  {
    data: 'tipo',
    title: 'Tipo de Actividad',
    type: 'dropdown',
    width: 250,
    source: listaTipos.value, // Usar el computed directamente
  },
  { data: 'fecha_inicio', title: 'Fecha Inicio', width: 110, type: 'date' },
  { data: 'fecha_cierre', title: 'Fecha Cierre', width: 110, type: 'date' },
  { data: 'procedencia_fondos', title: 'Procedencia Fondos', width: 110 },
  { data: 'presupuesto', title: 'Presupuesto', width: 120, type: 'numeric' },
  {
    data: 'responsable', // Cambiar a username para el dropdown
    title: 'Responsable',
    type: 'dropdown',
    width: 150,
    source: listaUsuarios.value, // Usar el computed directamente
  },
  {
    data: 'gradoEjecucion',
    title: 'Grado de Ejecucion',
    type: 'dropdown',
    width: 150,
    source: [
      'CRD-Creada',
      'PLAN-Planificada',
      'RETR-Retraso',
      'REPROG-Reprogramacion',
      'EJEC-En Ejecucion',
      'REP-En Reporte',
      'FIN-Finalizado',
    ],
  },
])

//Manejo de cambios
const handleChange = (changes, source) => {
  if (source === 'edit') {
    changes.forEach(([row, prop, oldValue, newValue]) => {
      console.log(`Cambio en fila ${row}, columna ${prop}: ${oldValue} -> ${newValue}`)

      // Si cambia el responsable (username), actualizar el ID correspondiente
      if (prop === 'responsable_username' && newValue !== oldValue) {
        const usuario = storePlanificacion.listaUsuariosCompleta?.find(
          (user) => user.username === newValue,
        )
        if (usuario) {
          tableData.value[row].responsable_id = usuario.id
          console.log(`Responsable actualizado: ID ${usuario.id}, Username: ${newValue}`)
        }
      }
    })
  }
}

//Esconder columnas
const hiddenColumnsConfig = computed(() => {
  return {
    columns: [10],
  }
})

/****************** Handle Selection ***********/
//Manejar seleccion
const selectedRowData = ref(null)
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
  } else {
    selectedRowData.value = null
  }
}

/******************* CONTROLES DE LA INTERFAZ EXCEL ********************/
//Procedimiento guardar
const confirmacionModal = ref(false)
const guardando = ref(false)

const guardarPlanificacion = async () => {
  if (tableData.value.length === 0) {
    warningMsg('No hay actividades para guardar', 3000)
    return
  }
  try {
    await peiServicios.guardarActividadesPeiBulk(tableData.value)
    successMsg('Planificación guardada exitosamente', 3000)
  } catch (err) {
    console.error('No se actualizo la planificacion', err)
  }

  // Preparar datos para guardar
  // const actividadesActualizadas = tableData.value.map((actividad) => {
  //   const usuario = storePlanificacion.listaUsuariosCompleta?.find(
  //     (user) => user.username === actividad.responsable_username,
  //   )

  //   return {
  //     id: actividad.id,
  //     codigo: actividad.codigo,
  //     nombreCorto: actividad.nombreCorto,
  //     descripcion: actividad.descripcion,
  //     supuestos: actividad.supuestos,
  //     riesgos: actividad.riesgos,
  //     estado: actividad.estado,
  //     tipo_actividad: actividad.tipo,
  //     fecha_inicio: actividad.fecha_inicio,
  //     fecha_cierre: actividad.fecha_cierre,
  //     presupuesto: actividad.presupuesto,
  //     responsable_id: usuario?.id || null,
  //     gradoEjecucion: actividad.gradoEjecucion,
  //   }
  // })

  // console.log('Actividades a guardar:', actividadesActualizadas)
  // confirmacionModal.value = true
  // successMsg('Planificación guardada exitosamente', 3000)
}

//Agregar nueva actividad
const mostrarModalActividad = ref(false)
const abrirNuevaActividad = () => {
  mostrarModalActividad.value = true
}
const cerrarNuevaActividad = () => {
  mostrarModalActividad.value = false
}

// Cuando se crea una nueva actividad desde el componente hijo
const onActividadCreada = (nuevaActividad) => {
  // Agregar la nueva actividad a la tabla
  const actividadFormateada = formatearActividadParaTabla(nuevaActividad)
  tableData.value.push(actividadFormateada)
  mostrarModalActividad.value = false
  successMsg('Actividad agregada a la planificación', 3000)
}

//Exportar a Excel
const exportarExcel = () => {
  // Implementar exportación a Excel
  successMsg('Exportando a Excel...', 3000)
}

/****************** CONTROLES DEL PANEL IZQUIERDO ************************/
const sidePanelVisible = ref(false)
const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}

/***************** UTILIDADES **********************************/
const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(parseFloat(value))
}

const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  return new Date(dateString).toLocaleDateString('es-BO')
}

// Función para obtener el username por ID
const obtenerUsernamePorId = (id) => {
  if (!id) return 'No asignado'
  const usuario = storePlanificacion.listaUsuariosCompleta?.find((user) => user.id === id)
  return usuario?.username || 'No asignado'
}

/***************** FUNCIONES PARA FORMATEAR DATOS ***********************/
const formatearActividadParaTabla = (actividad) => {
  // Obtener el username del responsable
  const responsableUsername = obtenerUsernamePorId(actividad.responsable?.id)

  return {
    id: actividad.id,
    codigo: actividad.codigo || '',
    nombreCorto: actividad.nombreCorto || '',
    descripcion: actividad.descripcion || '',
    supuestos: actividad.supuestos || '',
    riesgos: actividad.riesgos || '',
    estado: actividad.estado || 'PLAN',
    tipo: actividad.tipo?.tipo_actividad || actividad.tipo?.sigla || 'No definido',
    fecha_inicio: actividad.fecha_inicio || '',
    fecha_cierre: actividad.fecha_cierre || '',
    procedencia_fondos: actividad.procedencia_fondos || '',
    presupuesto: actividad.presupuesto || '0.00',
    responsable: responsableUsername || null,
    gradoEjecucion: actividad.gradoEjecucion || '',
  }
}

const cargarActividadesEnTabla = () => {
  if (
    storePeiPlanificacion.actividadesPeiSeleccionado &&
    storePeiPlanificacion.actividadesPeiSeleccionado.length > 0
  ) {
    tableData.value = storePeiPlanificacion.actividadesPeiSeleccionado.map((actividad) =>
      formatearActividadParaTabla(actividad),
    )
    successMsg(`${tableData.value.length} actividades cargadas`, 3000)
  } else {
    tableData.value = []
    warningMsg('No hay actividades para mostrar', 3000)
  }
}

/***************** Cargar informacion **********************************/
//Hook
onMounted(() => {
  cargar()
})

// Watch para detectar cuando los datos del dropdown están disponibles
watch(
  () => [storePlanificacion.listaUsuariosCompleta, storePlanificacion.listaTiposAct],
  ([usuarios, tipos]) => {
    if ((usuarios?.length > 0 || tipos?.length > 0) && !inicializado.value) {
      console.log('Datos de dropdown disponibles, actualizando columnas...')
      // Forzar actualización de las columnas
      if (hotTable.value?.hotInstance) {
        setTimeout(() => {
          hotTable.value.hotInstance.updateSettings({
            columns: columns.value,
          })
        }, 100)
      }
    }
  },
  { deep: true },
)

//Carga de datos
const isLoading = ref(true)
const error = ref(null)

const cargar = async () => {
  isLoading.value = true
  try {
    // Cargar datos en paralelo
    await Promise.all([
      storePeiPlanificacion.obtenerPeiPorId(peiIdNumerico.value),
      storePlanificacion.obtenerListaUsuarios(),
      storePlanificacion.listaTiposDeActividad(),
    ])

    // Verificar que los datos se cargaron correctamente
    if (storePeiPlanificacion.actividadesPeiSeleccionado?.length > 0) {
      cargarActividadesEnTabla()
    } else {
      tableData.value = []
      warningMsg('No hay actividades para este PEI', 3000)
    }

    // Activar la tabla solo cuando todos los datos estén listos
    if (
      storePlanificacion.listaUsuariosCompleta?.length > 0 &&
      storePlanificacion.listaTiposAct?.length > 0
    ) {
      inicializado.value = true
    }
  } catch (err) {
    console.error('No se pudo cargar la información:', err)
    error.value = err
    warningMsg('Error al cargar los datos: ' + err.message, 5000)
  } finally {
    isLoading.value = false
    // Asegurarse de que la tabla se muestre incluso si hay errores
    setTimeout(() => {
      inicializado.value = true
    }, 500)
  }
}

/******************** Nueva activiad ****************************/
const mostrarModalAgregarTarea = () => {
  mostrarDialogoSubactividad.value = true
}

const cerrarDialogo = () => {
  mostrarDialogoSubactividad.value = false
}

const crearNuevaTarea = async (payload) => {
  try {
    //await crearUnaTarea(payload)
    await peiServicios.crearTareaPei(payload)
    console.log('SUBACTIVIDAD: ', payload)
    mostrarDialogoSubactividad.value = false
    infoMsg('Subactividad creada')
  } catch (error) {
    console.error(error)
    errorMsg('No se creo la subactividad')
  }
}

const mostrarDialogoSubactividad = ref(false)
const tareaSeleccionada = ref(null)
/******************** Presupuesto *******************************/
const mostrarPresupuesto = ref(false)
const mostrarModalPresupuesto = () => {
  mostrarPresupuesto.value = true
}

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
  successMsg('Desglose de presupuesto guardado correctamente', 3000)
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
