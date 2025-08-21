<template>
  <div>
    <TrazadorActividad></TrazadorActividad>
  </div>
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
          <!--Reprogramar-->
          <v-tooltip text="Reprogramar" location="bottom">
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
          </v-tooltip>
          <!--Nueva Actividad-->
          <v-tooltip text="Agregar nueva actividad" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="agregarNuevaActividad"
              >
                <v-icon size="18">mdi-plus-outline</v-icon>
                <v-icon size="18">mdi-clipboard-text-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Eliminar fila-->
          <v-tooltip text="Eliminar fila seleccionada" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="eliminarFila">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
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

        <!--Toolbar de informacion-->
        <v-toolbar flat density="comfortable" class="details-toolbar" v-if="selectedRowData">
          <div class="info-container">
            <div class="info-section">
              <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
              <span class="info-text">
                <strong>Actividad:</strong> {{ selectedRowData.nombreCorto }} ({{
                  selectedRowData.codigo
                }})
              </span>
            </div>

            <div class="info-section">
              <span class="info-text">
                <strong>Presupuesto:</strong> {{ formatCurrency(selectedRowData.presupuesto) }}
              </span>
            </div>

            <div class="info-section">
              <span class="info-text">
                <strong>Inicio:</strong> {{ formatDate(selectedRowData.fecha_inicio) }}
              </span>
            </div>
          </div>

          <v-spacer></v-spacer>

          <v-card flat class="timeline-card">
            <v-card-title class="pa-2 timeline-title">Detalle de Avance</v-card-title>
            <v-card-text class="pa-2 timeline-content">
              <v-timeline side="end" density="comfortable" class="py-0 custom-timeline">
                <v-timeline-item
                  v-for="(item, index) in timelineData"
                  :key="index"
                  :dot-color="item.color"
                  size="default"
                >
                  <div class="d-flex flex-column timeline-item-content">
                    <span class="timeline-date">{{ item.date }}</span>
                    <div class="timeline-description">{{ item.description }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-toolbar>
        <!-- Toolbar de actividades dinámicas -->
        <v-toolbar flat density="comfortable" class="activity-toolbar" v-if="!loadinActividades">
          <span class="toolbar-label">Actividades disponibles:</span>
          <div class="activity-buttons-container">
            <v-tooltip
              v-for="actividad in actividadesDisponibles"
              :key="actividad.codigo"
              :text="actividad.nombreCorto"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  class="activity-btn"
                  @click="cargarActividadEnTabla(actividad)"
                >
                  <v-icon left size="18">{{ getActivityIcon(actividad.tipo) }}</v-icon>
                  {{ actividad.codigo }}
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-toolbar>

        <HotTable
          v-if="inicializado"
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="400"
          :contextMenu="true"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :afterSelection="handleSelection"
          :licenseKey="'non-commercial-and-evaluation'"
        ></HotTable>
      </div>

      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible"></div>
    </div>
  </div>
  <!-- Modal de Confirmación Sencillo -->
  <v-dialog v-model="confirmacionModal" max-width="500px">
    <v-card>
      <v-card-title class="headline">
        <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
        Confirmar Guardado
      </v-card-title>

      <v-card-text>
        <p>¿Estás seguro de que deseas guardar la planificación?</p>

        <div class="mt-4 summary-info">
          <p><strong>Resumen:</strong></p>
          <ul>
            <li>
              Total de actividades: <strong>{{ tableData.length }}</strong>
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="confirmacionModal = false"> Cancelar </v-btn>
        <v-btn color="primary" variant="flat" @click="confirmarGuardado" :loading="guardando">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar para mostrar mensajes -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import TrazadorActividad from './parciales/TrazadorActividad.vue'
//Composables
import { useActividad } from '../../proyecto/composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { usePlanificacion } from '../composables/usePlanificacion'
//Precargas
import { SELECT_OPTIONS } from '@/utility/selectOptions'

// Props del componente
const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
  proyectoEstructura: {
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

const route = useRoute()
const idproyecto = route.params.id

// Composables
const {
  actividades: actividadesDisponibles,
  mensaje,
  cargarActividadesPorIdProyecto,
  guardarActividadesBulk,
  loading: loadinActividades,
} = useActividad()
const { usuarios } = useUsuario()
const { contadorPlan, contarPlanPorIdProyecto } = usePlanificacion()

// Snackbar para mensajes
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

/********** CONTROLES DE LA INTERFAZ EXCEL **************/
const hotTable = ref(null)
const sidePanelVisible = ref(false)
const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}

// Funciones de los botones
const confirmacionModal = ref(false)
const guardando = ref(false)

const guardarPlanificacion = async () => {
  if (tableData.value.length === 0) {
    mostrarMensaje('No hay actividades para guardar', 'warning')
    return
  }
  confirmacionModal.value = true
}

const obtenerConfiguracionTabla = () => {
  return {
    columns: columns.value.map((col) => ({
      data: col.data,
      title: col.title || col.data,
      type: col.type || 'text',
      width: col.width || 100,
    })),
    exportado_el: new Date().toISOString(),
    version_ui: '1.0',
  }
}

// Método para confirmar el guardado - ACTUALIZADO
const confirmarGuardado = async () => {
  guardando.value = true
  try {
    // Crear copia simple de los datos sin reactividad
    const datosSimples = JSON.parse(JSON.stringify(tableData.value))

    // Preparar la estructura que espera el backend
    const datosEnvio = {
      table_config: obtenerConfiguracionTabla(),
      rows_data: datosSimples,
      razon_cambio: 'Actualización de planificación',
    }

    // Guardar en el backend
    await guardarActividadesBulk(idproyecto, datosEnvio)

    // Mostrar mensaje de éxito
    mostrarMensaje('Planificación guardada exitosamente', 'success')

    // REFRESCAR LOS DATOS después de guardar
    await refrescarDatos()
  } catch (error) {
    console.error('Error:', error)
    mostrarMensaje('Error al guardar: ' + error.message, 'error')
  } finally {
    guardando.value = false
    confirmacionModal.value = false
  }
}

// Función para refrescar los datos después de guardar
const refrescarDatos = async () => {
  try {
    isLoading.value = true
    // Recargar actividades desde el backend
    await cargarActividadesPorIdProyecto(idproyecto)

    // Actualizar tableData con las actividades disponibles
    if (actividadesDisponibles.value && actividadesDisponibles.value.length > 0) {
      tableData.value = [...actividadesDisponibles.value]
      // Limpiar actividades disponibles
      actividadesDisponibles.value = []
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error('Error al refrescar datos:', error)
    mostrarMensaje('Error al refrescar los datos', 'error')
  } finally {
    isLoading.value = false
  }
}

// Función para mostrar mensajes
const mostrarMensaje = (mensaje, color = 'success') => {
  snackbar.value = {
    show: true,
    message: mensaje,
    color: color,
  }
}

const reprogramarPlanificacion = async () => {
  mostrarMensaje('Funcionalidad de reprogramación en desarrollo', 'info')
}

const agregarNuevaActividad = () => {
  tableData.value.push({
    id: 0,
    responsable: '',
    proyecto: idproyecto,
    codigo: 'ACT-',
    nombreCorto: 'Actividad',
    descripcion: 'Describir',
    supuestos: '',
    riesgos: '',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    descripcion_tipo_actividad: null,
    tipo: 'NODEF',
    fecha_programada: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: 0,
    presupuestoGlobal: null,
    totalReportado: null,
    totalEjecutado: null,
    saldo: null,
    gradoEjecucion: null,
    procedencia_fondos: null,
    estado: 'CRD',
    proceso: null,
    resultado_og: null,
    resultado_oe: null,
    producto_oe: null,
    objetivo_pei: null,
    indicador_pei: null,
  })
  mostrarMensaje('Nueva actividad agregada', 'info')
}

const eliminarFila = async () => {
  // Implementar lógica de eliminación si es necesario
  mostrarMensaje('Funcionalidad de eliminación en desarrollo', 'info')
}

const exportarExcel = async () => {
  mostrarMensaje('Funcionalidad de exportación en desarrollo', 'info')
}

const getActivityIcon = (tipos) => {
  const iconMap = {
    ACAP: 'mdi-school-outline',
    PRIN: 'mdi-microscope',
    AOP: 'mdi-cog-outline',
    CSNS: 'mdi-megaphone',
    PDES: 'mdi-home-city',
    AINC: 'mdi-bullhorn',
    AART: 'mdi-handshake',
  }
  for (const tipo of tipos) {
    if (iconMap[tipo]) return iconMap[tipo]
  }
  return 'mdi-clipboard-text-outline'
}

//Precargas
const tipoActividad = SELECT_OPTIONS.tipo_actividad

/*********** VARIABLES Y ESTADOS DE LA TABLA EXCEL ********************************/
const tableData = ref([])
const actividadesEnTabla = ref([])
const inicializado = ref(true)

//Username para carga
const usernameDropdown = ref([])
usernameDropdown.value = usuarios.value.map((item) => item.username)

// Configuración de columnas
const columns = ref([
  { data: 'id', title: 'Id', type: 'numeric', width: 50 },
  { data: 'codigo', title: 'Código', width: 100 },
  { data: 'nombreCorto', title: 'Nombre', width: 100 },
  {
    data: 'tipo',
    title: 'Tipo de Actividad',
    type: 'dropdown',
    width: 110,
    source: tipoActividad,
  },
  {
    data: 'responsable',
    title: 'Responsable',
    type: 'dropdown',
    width: 110,
    source: ['admin', 'oscar'],
  },
  {
    data: 'fecha_inicio',
    title: 'Inicio',
    type: 'date',
    width: 100,
  },
  {
    data: 'fecha_cierre',
    title: 'Cierre',
    type: 'date',
    width: 100,
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
  {
    data: 'presupuestoGlobal',
    title: 'Presupuesto Global',
    type: 'numeric',
    width: 110,
  },
  {
    data: 'totalReportado',
    title: 'Total Reportado',
    type: 'numeric',
    width: 100,
  },
  {
    data: 'totalEjecutado',
    title: 'Total Ejecutado',
    type: 'numeric',
    width: 100,
  },
  {
    data: 'saldo',
    title: 'Saldo',
    type: 'numeric',
    width: 100,
  },
  {
    data: 'gradoEjecucion',
    type: 'dropdown',
    title: 'Grado Ejecucion',
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
  {
    data: 'medioVerificacion',
    title: 'Medio de Verificacion',
    type: 'text',
    width: 200,
    renderer: function (instance, td, row, col, prop, value, cellProperties) {
      td.innerHTML = ''
      const button = document.createElement('button')
      button.className = 'btn-celda'
      button.textContent = 'Acción'
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        accionBoton(row)
      })
      td.appendChild(button)
      return td
    },
    editor: false,
  },
])

const headers = ref(true)

const cargarActividadEnTabla = (actividad) => {
  tableData.value.push(actividad)
  const index = actividadesDisponibles.value.findIndex((a) => a.codigo === actividad.codigo)
  if (index !== -1) {
    actividadesDisponibles.value.splice(index, 1)
  }
}

const eliminarFilaContextMenu = (rowIndex) => {
  if (rowIndex >= 0 && rowIndex < tableData.value.length) {
    const fila = tableData.value[rowIndex]
    if (fila._origen === 'boton') {
      actividadesDisponibles.value.push(fila._actividadOriginal)
    }
    tableData.value.splice(rowIndex, 1)
    if (hotTable.value?.hotInstance) {
      hotTable.value.hotInstance.alter('remove_row', rowIndex, 1)
    }
  }
}

const accionBoton = (row) => {
  mostrarMensaje('Funcionalidad de medios de verificación', 'info')
}

// Carga de datos
const isLoading = ref(true)
const err = ref(null)

const cargar = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      cargarActividadesPorIdProyecto(idproyecto),
      contarPlanPorIdProyecto(idproyecto),
    ])

    // COMPROBADOR: Solo cargar tableData si hay actividades disponibles
    if (actividadesDisponibles.value && actividadesDisponibles.value.length > 0) {
      tableData.value = [...actividadesDisponibles.value]
      actividadesDisponibles.value = []
    }
  } catch (e) {
    console.error('Error al cargar:', e)
    err.value = e
    mostrarMensaje('Error al cargar actividades', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  cargar()
})

/*************** Manejo de cambios *************************/
const handleChange = (changes, source) => {
  // Lógica de cambios si es necesaria
}

const selectedRowData = ref(null)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
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
  } else {
    selectedRowData.value = null
  }
}

/************** Menu contextual ******************/
const contextMenuOptions = ref({
  items: {
    row_remove: {
      name: 'Eliminar fila',
      callback: function (key, selection) {
        eliminarFilaContextMenu(selection.start.row)
      },
    },
  },
})
</script>

<style scoped>
/* Estilos (mantener igual) */
.hot-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 150px);
}

.excel-panel {
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.side-panel {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
}

/* ... (mantener el resto de estilos igual) ... */
</style>
