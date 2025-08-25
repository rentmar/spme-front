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
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="cerrarNuevaActividad"></v-btn>

                <v-toolbar-title>Agregar Nueva Actividad/Proceso </v-toolbar-title>

                <v-toolbar-items>
                  <!-- <v-btn text="Guardar" variant="text"></v-btn> -->
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-card-text style="height: calc(100vh - 64px); padding: 0">
                  <div style="width: 100%; height: 600px">
                    <EditorEstructuraMainActividades></EditorEstructuraMainActividades>
                  </div>
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!--Eliminar fila-->
          <!-- <v-tooltip text="Eliminar fila seleccionada" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="eliminarFila">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip> -->
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
            <!-- Botón Presupuesto -->
            <v-btn
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

            <!-- Botón PEI -->
            <v-btn
              color="#107C10"
              variant="flat"
              size="small"
              class="excel-button pei-button"
              @click="abrirModalPei"
            >
              <template v-slot:prepend>
                <v-icon size="16">mdi-chart-tree</v-icon>
              </template>
              Relacion con el PEI
            </v-btn>

            <!-- Botón Estructura (solo para nuevas actividades) -->
            <!-- <v-btn
              v-if="selectedRowData.id === 0"
              color="#505A64"
              variant="flat"
              size="small"
              class="excel-button structure-button"
              @click="abrirModalEstructura"
            >
              <template v-slot:prepend>
                <v-icon size="16">mdi-sitemap</v-icon>
              </template>
              Estructura
            </v-btn> -->

            <!----Componente Presupuesto-->
            <ComponentPresupuesto
              v-model="mostrarPresupuesto"
              :presupuesto-total="selectedRowData.presupuesto"
              :desglose-inicial="selectedRowData.procedencia_fondos"
              @guardarDesglose="guardarDesglosePresupuesto"
            ></ComponentPresupuesto>
          </div>
          <!--Estructura Pei-->
          <v-dialog v-model="modalPei" transition="dialog-bottom-transition" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="modalPei = false"></v-btn>
                <v-toolbar-title>Estructura PEI</v-toolbar-title>
              </v-toolbar>
              <v-card-text style="height: calc(100vh - 64px); padding: 0">
                <SeleccionEstructuraPei
                  :objetivo-inicial="objetivoInicialId"
                  :indicador-inicial="indicadorInicialId"
                  @guardar="manejarSeleccionPei"
                  @cerrar="modalPei = false"
                ></SeleccionEstructuraPei>
              </v-card-text>
            </v-card>
          </v-dialog>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import TrazadorActividad from './parciales/TrazadorActividad.vue'
//Composables
import { useActividad } from '../../proyecto/composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { usePlanificacion } from '../composables/usePlanificacion'
//Precargas
import { SELECT_OPTIONS } from '@/utility/selectOptions'
import ComponentPresupuesto from './parciales/ComponentPresupuesto.vue'
//Estructuras
import SeleccionEstructuraPei from './parciales/SeleccionEstructuraPei.vue'
//import SeleccionEstructuraProyecto from './parciales/SeleccionEstructuraProyecto.vue'
import EditorEstructuraMainActividades from '@/modules/editorEstructuraPlanificacion/components/EditorEstructuraMainActividades.vue'
//Actividades Test
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'

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

//Stores
const proyectoStore = useProyectoStore()
const { nodes, edges } = storeToRefs(proyectoStore)

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

/******************** PEI ******************************************/
const modalPei = ref(false)
const objetivoInicialId = ref(null)
const indicadorInicialId = ref(null)
const abrirModalPei = () => {
  // Cargar IDs actuales de la fila seleccionada
  if (selectedRowData.value) {
    objetivoInicialId.value = selectedRowData.value.objetivo_pei
    indicadorInicialId.value = selectedRowData.value.indicador_pei
  }
  modalPei.value = true
}
// Manejar la selección de PEI
const manejarSeleccionPei = (datosPei) => {
  if (selectedRowData.value) {
    const rowIndex = tableData.value.findIndex((row) => row.id === selectedRowData.value.id)

    if (rowIndex !== -1) {
      // Actualizar la fila con los datos de PEI
      tableData.value[rowIndex] = {
        ...tableData.value[rowIndex],
        objetivo_pei: datosPei.objetivo_pei,
        indicador_pei: datosPei.indicador_pei,
      }

      // Forzar actualización de Handsontable
      if (hotTable.value?.hotInstance) {
        hotTable.value.hotInstance.render()
      }

      mostrarMensaje('Estructura PEI actualizada correctamente', 'success')
    }
  }

  modalPei.value = false
}
/********************* Estructura ********************************/
const modalEstructura = ref(false)
const abrirModalEstructura = () => {
  modalEstructura.value = true
}

const mostrarModalActividad = ref(false)
const abrirNuevaActividad = () => {
  mostrarModalActividad.value = true
}
const cerrarNuevaActividad = () => {
  mostrarModalActividad.value = false
}
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
  mostrarMensaje('Desglose de presupuesto guardado correctamente', 'success')
}
/***************************************************************/
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
  // guardando.value = true
  // try {
  //   // Crear copia simple de los datos sin reactividad
  //   const datosSimples = JSON.parse(JSON.stringify(tableData.value))

  //   // Preparar la estructura que espera el backend
  //   const datosEnvio = {
  //     table_config: obtenerConfiguracionTabla(),
  //     rows_data: datosSimples,
  //     razon_cambio: 'Actualización de planificación',
  //     usuario: 'admin',
  //   }

  //   // Guardar en el backend
  //   await guardarActividadesBulk(idproyecto, datosEnvio)

  //   // Mostrar mensaje de éxito
  //   mostrarMensaje('Planificación guardada exitosamente', 'success')

  //   // REFRESCAR LOS DATOS después de guardar
  //   await refrescarDatos()
  // } catch (error) {
  //   console.error('Error:', error)
  //   mostrarMensaje('Error al guardar: ' + error.message, 'error')
  // } finally {
  //   guardando.value = false
  //   confirmacionModal.value = false
  // }

  guardando.value = true
  try {
    // Crear copia simple de los datos sin reactividad
    const datosSimples = JSON.parse(JSON.stringify(tableData.value))

    // Obtener datos anteriores (simplificado para pruebas)
    //const datosAnteriores = await obtenerDatosAnterioresSimple(idproyecto)

    // Determinar tipo de cambio básico
    //const tipoCambio = datosAnteriores ? 'actualizacion' : 'creacion'

    // Preparar la estructura que espera el backend (VERSIÓN SIMPLIFICADA)
    const datosEnvio = {
      table_config: obtenerConfiguracionTabla(),
      rows_data: datosSimples,
      razon_cambio: 'Actualización de planificación',
      usuario: 'admin',

      // DATOS MÍNIMOS para CambioPlanificacion
      cambio_planificacion: {
        tipo_cambio: 'creacion',
        datos_anteriores: null, // Puede ser null
        datos_nuevos: {
          actividades: datosSimples,
          total_actividades: datosSimples.length,
        },
        descripcion: 'Planificación guardada desde interfaz, razon de cambio',
        realizado_por: 'admin',
      },
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
  // tableData.value.push({
  //   id: 0,
  //   responsable: '',
  //   proyecto: idproyecto,
  //   codigo: 'ACT-',
  //   nombreCorto: 'Actividad',
  //   descripcion: 'Describir',
  //   supuestos: '',
  //   riesgos: '',
  //   objetivo_de_actividad: '',
  //   descripcion_evaluacion: '',
  //   descripcion_tipo_actividad: null,
  //   tipo: 'NODEF',
  //   fecha_programada: null,
  //   fecha_inicio: null,
  //   fecha_cierre: null,
  //   presupuesto: 0,
  //   presupuestoGlobal: 0,
  //   totalReportado: 0,
  //   totalEjecutado: 0,
  //   saldo: 0,
  //   gradoEjecucion: null,
  //   procedencia_fondos: null,
  //   estado: 'CRD',
  //   proceso: null,
  //   resultado_og: null,
  //   resultado_oe: null,
  //   producto_oe: null,
  //   objetivo_pei: null,
  //   indicador_pei: null,
  // })
  // mostrarMensaje('Nueva actividad agregada', 'info')

  modalEstructura.value = true
  mostrarMensaje('Actividad')
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

//Esconder columnas
const hiddenColumnsConfig = computed(() => {
  return {
    columns: [10], // Columnas 1, 3 y 7
  }
})

//Username para carga
const usernameDropdown = ref([])
usernameDropdown.value = usuarios.value.map((item) => item.username)

// Configuración de columnas
const columns = ref([
  { data: 'id', title: 'Id', type: 'numeric', width: 50, readOnly: true },
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
  { data: 'procedencia_fondos' },
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
  //   objetivo_pei: null,
  //   indicador_pei: null,
  {
    data: 'objetivo_pei',
    title: 'Objetivo PEI',
    type: 'numeric',
    readOnly: true,
  },
  {
    data: 'indicador_pei',
    title: 'Indicador PEI',
    type: 'numeric',
    readOnly: true,
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
.flow-container {
  width: 100%;
  height: 600px;
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
  min-height: 600px;
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
  height: 100%;
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
