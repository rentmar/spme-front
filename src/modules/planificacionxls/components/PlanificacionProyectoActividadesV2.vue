<template>
  <div v-if="selectedRowData">
    <!-- <TrazadorActividad
      :tabla-data-disponible="tablaDataDisponible"
      :actividad-id="selectedRowData.id"
    ></TrazadorActividad> -->
    <!-- <ActividadRelacionEstructura></ActividadRelacionEstructura> -->
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
                  <SeleccionEstructuraActividad
                    :proyecto-data="props.proyectoEstructura"
                    @crear-actividad="crearActividadPlan"
                  ></SeleccionEstructuraActividad>

                  <!--Editor grafico de actividades-->
                  <!-- <div style="width: 100%; height: 600px">
                    <EditorEstructuraMainActividades></EditorEstructuraMainActividades>
                  </div> -->
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- <v-tooltip text="Agregar nueva actividad Variante" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="abrirNuevaActividadVariante"
              >
                <v-icon size="18">mdi-plus-outline</v-icon>
                <v-icon size="18">mdi-clipboard-text-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip> -->

          <v-dialog v-model="mostrarModalActividadVariante" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="cerrarNuevaActividadVariante"></v-btn>

                <v-toolbar-title>Agregar Nueva Actividad/Proceso </v-toolbar-title>

                <v-toolbar-items>
                  <!-- <v-btn text="Guardar" variant="text"></v-btn> -->
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-card-text>
                  <div style="width: 100%; height: 1000px">
                    <DiagramaPlanificacion :idproyecto="1"></DiagramaPlanificacion>
                  </div>
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
            <DialogTarea
              v-model="mostrarDialogo"
              :actividad="selectedRowData"
              :tarea="tareaSeleccionada"
              @guardar="crearNuevaTarea"
              @cancelar="cerrarDialogo"
            ></DialogTarea>

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

            <v-tooltip text="Relacion con el PEI" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#107C10"
                  variant="flat"
                  size="small"
                  class="excel-button pei-button"
                  @click="abrirModalPei"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-chart-tree</v-icon>
                  </template>
                  PEI
                </v-btn>
              </template>
            </v-tooltip>

            <!-- <v-tooltip text="Seleccion de indicadores" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
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
                </v-btn>
              </template>
            </v-tooltip> -->

            <!----Componente Presupuesto-->
            <ComponentPresupuesto
              v-model="mostrarPresupuesto"
              :presupuesto-total="selectedRowData.presupuesto"
              :desglose-inicial="selectedRowData.procedencia_fondos"
              @guardarDesglose="guardarDesglosePresupuesto"
            ></ComponentPresupuesto>
          </div>
          <!--Relacion de la actividad-->
          <!-- <v-dialog v-model="modalEstructura" transition="dialog-bottom-transition" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="modalEstructura = false"></v-btn>
                <v-toolbar-title
                  >Trazado de la Actividad: {{ selectedRowData.codigo }} -
                  {{ selectedRowData.nombreCorto }}</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text>
                <SeleccionEstructuraProyecto
                  :actividad-id="selectedRowData.id"
                  :ruta-trazado-inicial="selectedRowData.rutaTrazadoIndicadores"
                  @actualizar-ruta-trazado="actualizarRutaTrazado"
                >
                </SeleccionEstructuraProyecto>
              </v-card-text>
            </v-card>
          </v-dialog> -->
          <!--Estructura Pei-->
          <v-dialog v-model="modalPei" transition="dialog-bottom-transition" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="modalPei = false"></v-btn>
                <v-toolbar-title
                  >Estructura PEI: {{ selectedRowData.codigo }} -
                  {{ selectedRowData.nombreCorto }}</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text style="height: calc(100vh - 64px); padding: 0">
                <SeleccionEstructuraPei
                  :objetivo-inicial="objetivoInicialId"
                  :indicador-inicial="indicadorInicialId"
                  :factores-criticos-iniciales="selectedRowData.factoresCriticos"
                  @guardar="manejarSeleccionPei"
                  @cerrar="modalPei = false"
                ></SeleccionEstructuraPei>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <!-- Toolbar de actividades dinámicas -->
        <!-- <v-toolbar flat density="comfortable" class="activity-toolbar">
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
        </v-toolbar> -->

        <HotTable
          v-if="inicializado"
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="1500"
          :contextMenu="contextMenuConfig"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :afterSelection="handleSelection"
          :licenseKey="'non-commercial-and-evaluation'"
          :hiddenColumns="hiddenColumnsConfig"
        ></HotTable>
      </div>

      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible">
        <ListaTareasActividad
          v-if="selectedRowData"
          :actividad="selectedRowData"
        ></ListaTareasActividad>
      </div>
    </div>
  </div>
  <!-- Modal de Confirmación Sencillo -->
  <v-dialog v-model="confirmacionModal" max-width="500px">
    <v-card>
      <v-card-title class="headline">
        <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
        Confirmar Guardado - Planificacion
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
        <div>
          <v-select
            :items="SELECT_OPTIONS.razon_cambio"
            item-value="valor"
            item-title="etiqueta"
            variant="outlined"
            label="Tipo de Modificacion"
          ></v-select>
          <v-text-field
            label="Modificado por"
            variant="outlined"
            v-model="datosGuardado.usuario"
            readonly
          ></v-text-field>
          <v-textarea
            label="Razon de la modificacion"
            variant="outlined"
            v-model="datosGuardado.razon"
          ></v-textarea>
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
  {{ tableData }}
  <br /><br /><br />
  OP1:{{ tieneCambiosSinGuardar }} <br /><br /><br />
  OP2: {{ tieneCambiosSinGuardar2 }}
</template>

<script setup>
//Hottable
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
//Vue
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
//Composables
import { useActividad } from '../../proyecto/composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { usePlanificacion } from '../composables/usePlanificacion'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
//Precargas
import ComponentPresupuesto from './parciales/ComponentPresupuesto.vue'
//Estructuras
import SeleccionEstructuraPei from './parciales/SeleccionEstructuraPei.vue'
import SeleccionEstructuraActividad from './parciales/SeleccionEstructuraActividad.vue'
import DiagramaPlanificacion from './DiagramaJerarquiaPlanificacion.vue'
//Actividades Test
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { usePlanificacionStore } from '../store/usePlanificacionStore'
import { storeToRefs } from 'pinia'
//Encabezados
import SeleccionEstructuraProyecto from './parciales/SeleccionEstructuraProyecto.vue'
import ActividadRelacionEstructura from './parciales/ActividadRelacionEstructura.vue'
import DialogTarea from '@/modules/actividades/components/DialogTarea.vue'
import ListaTareasActividad from './parciales/ListaTareasActividad.vue'
//Utilitarios
import { useSnackbar } from '@/composables/useSnackbar'
import { parse, format, isValid, isBefore } from 'date-fns'
import { useUserStore } from '@/stores/user'
import { getActivityIcon } from '../utils/actividadIconColors'
//Revisar el formatDate , la fecha no concuerda
import { formatCurrency, formatDate } from '../utils/formattersPlan'

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

//ID del proyecto
const route = useRoute()
const idproyecto = route.params.id

//Stores
//const proyectoStore = useProyectoStore() //Store del proyecto - eliminar
//const { nodes, edges } = storeToRefs(proyectoStore) //Extraer los nodos y edges - eliminar
const storePlanificacion = usePlanificacionStore() //Store para la planificacion
const storeProyecto = useProyectoStore //Store del proyecto
const userStore = useUserStore() //Store del Usuario

//Composables
const { successMsg, errorMsg, infoMsg } = useSnackbar()
const { crearUnaTarea } = useTareaSubactividad()

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
    await crearUnaTarea(payload)
    mostrarDialogo.value = false
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

//AGREGAR PEI
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
        factoresCriticos: datosPei.factoresCriticos,
      }

      // Forzar actualización de Handsontable
      if (hotTable.value?.hotInstance) {
        hotTable.value.hotInstance.render()
      }

      successMsg('Estructura PEI actualizada correctamente', 'success')
    }
  }

  modalPei.value = false
}

//GUARDAR PLANIFICACION
const guardarPlanificacion = () => {
  successMsg('Guardar la planificacion')
}

//Modal de confirmacion
const confirmacionModal = ref(false) //Variable de compatibilidad legacy
const mostrarModalActividadVariante = ref(false) //Variable de compatibilidad legacy
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

//username para carga
const usernameDropdown = ref([])
usernameDropdown.value = storePlanificacion.usernamesParaDropdown

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
  { data: 'factoresCriticos', title: 'Factores criticos', readOnly: true },
  {
    //Relacion al PEI Indicadores
    data: 'rutaTrazadoIndicadores',
    title: 'Ruta e indicadores',
    readOnly: true,
  },
  {
    //Relacion a al estructura del proyecto
    data: 'estructuraProcedencia',
    title: 'Estruc, Procedencia',
    readOnly: true,
  },
])

/************************* Handle Interfaz Excel  *******************************/
const selectedRowData = ref(null) //Fila seleccionada
//Manejador e cambios
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
//Manejador de seleccion
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

const exportarExcel = async () => {}

/********************* CARGA DE DATOS ******************************/
const isLoading = ref(false) //Bandera de carga
const err = ref(null) //Error

const cargar = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      storePlanificacion.obtenerListaUsuarios(),
      storePlanificacion.listaTiposDeActividad(),
      storePlanificacion.listaActividadesProyecto(idproyecto),
    ])
    //Comprobador: Solo cargar tableData <=> hay actividades disponibles
    console.log('ACTIVIDADES: ', storePlanificacion.listaActividades)
    console.log('Numero de Act: ', storePlanificacion.listaActividades.length)
    if (storePlanificacion.tableData && storePlanificacion.tableData.length > 0) {
      storePlanificacion.inicializarDatosOriginales(storePlanificacion.tableData)
      tableData.value = storePlanificacion.tableData
      successMsg(storePlanificacion.tableData.length + ' Actividades Cargadas')
    }

    //Inicializar componente
    inicializado.value = true
  } catch (e) {
    console.error('Error al cargar:', e)
    err.value = e
    errorMsg('Error al cargar actividades', 'error')
  } finally {
    isLoading.value = false
  }
}

//Hook
onMounted(() => {
  cargar()
})
/*****************************************************************************************/
/************************* FUNCIONES AUXILIARES ******************************************/
/*****************************************************************************************/

// Función para verificar fechas dd/MM/YY
const verificarFechas = (rowIndex) => {
  //Fila seleccionada
  const fila = tableData.value[rowIndex]
  //Si no hay fila seleccionada, se anula la ejecucion
  if (!fila) return

  // console.log('Fila Seleccionada')
  // console.log(fila)

  const convertirFechaMMDDYYYY = (fechaString) => {
    if (!fechaString) return null
    try {
      // Si ya es un objeto Date válido, retornarlo directamente
      if (fechaString instanceof Date && isValid(fechaString)) {
        return fechaString
      }
      // Si es string, parsear con date-fns
      if (typeof fechaString === 'string') {
        // Intentar parsear como MM/DD/YYYY
        const fechaParseada = parse(fechaString, 'dd/MM/yyyy', new Date())

        if (isValid(fechaParseada)) {
          return fechaParseada
        }

        // Si falla, intentar con formato ISO o nativo
        const fechaNativa = new Date(fechaString)
        return isValid(fechaNativa) ? fechaNativa : null
      }
      return null
    } catch (error) {
      console.error('Error al convertir la fecha: ', error)
    }
  }

  const inicio = convertirFechaMMDDYYYY(fila.fecha_inicio)
  const cierre = convertirFechaMMDDYYYY(fila.fecha_cierre)
  // console.log('FECHAS')
  // console.log('Inicio: ', inicio)
  // console.log('Cierre: ', cierre)

  // Verificar que ambas fechas sean válidas y que inicio sea antes de cierre
  const fechasValidas = isValid(inicio) && isValid(cierre)
  const inicioAntesDeCierre = fechasValidas && isBefore(inicio, cierre)

  if (fila.fecha_inicio && fila.fecha_cierre && fechasValidas && inicioAntesDeCierre) {
    // console.log('✅ Fechas válidas - Actividad cambia a PLANIFICADA')
    fila.gradoEjecucion = 'PLANIFICADA'
    successMsg('Actividad planificada')

    // Actualizar en la tabla visualmente
    if (hotTable.value?.hotInstance) {
      setTimeout(() => {
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'gradoEjecucion', 'PLANIFICADA')
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'estado', 'PLAN')
        hotTable.value.hotInstance.render()
      }, 50)
    }
  } else {
    // console.log('❌ Fechas inválidas - Actividad no cambia de grado de ejecucion')
    // Mostrar razón específica del error
    if (!fechasValidas) {
      // console.log('❌ Razón: Fechas no válidas')
      if (!isValid(inicio)) console.log('  - Fecha inicio inválida:', fila.fecha_inicio)
      if (!isValid(cierre)) console.log('  - Fecha cierre inválida:', fila.fecha_cierre)
    } else if (!inicioAntesDeCierre) {
      // console.log('❌ Razón: Fecha inicio debe ser anterior a fecha cierre')
      // console.log('  - Inicio:', format(inicio, 'MM/dd/yyyy'))
      // console.log('  - Cierre:', format(cierre, 'MM/dd/yyyy'))
      errorMsg('La Fecha de cierre es anterior a la de inicio')
    }
    fila.gradoEjecucion = ''
    fila.fecha_cierre = null

    // Actualizar en la tabla visualmente
    if (hotTable.value?.hotInstance) {
      setTimeout(() => {
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'gradoEjecucion', '')
        hotTable.value.hotInstance.render()
      }, 50)
    }
  }
}

// Función para verificar fechas YYYY-MM-dd
const verificarFechasNativas = (rowIndex) => {
  // Fila seleccionada
  const fila = tableData.value[rowIndex]
  // Si no hay fila seleccionada, se anula la ejecucion
  if (!fila) return

  const convertirFechaYYYYMMDD = (fechaString) => {
    if (!fechaString) return null
    try {
      // Si ya es un objeto Date válido, retornarlo directamente
      if (fechaString instanceof Date && isValid(fechaString)) {
        return fechaString
      }
      // Si es string, parsear con date-fns
      if (typeof fechaString === 'string') {
        // Primero intentar parsear como YYYY-MM-DD (formato de tu API)
        const fechaParseadaISO = parse(fechaString, 'yyyy-MM-dd', new Date())
        if (isValid(fechaParseadaISO)) {
          return fechaParseadaISO
        }

        // Si falla, intentar con formato dd/MM/yyyy (por si el usuario escribe manualmente)
        const fechaParseadaLocal = parse(fechaString, 'dd/MM/yyyy', new Date())
        if (isValid(fechaParseadaLocal)) {
          return fechaParseadaLocal
        }

        // Si falla, intentar con formato nativo
        const fechaNativa = new Date(fechaString)
        return isValid(fechaNativa) ? fechaNativa : null
      }
      return null
    } catch (error) {
      console.error('Error al convertir la fecha: ', error)
      return null
    }
  }

  const inicio = convertirFechaYYYYMMDD(fila.fecha_inicio)
  const cierre = convertirFechaYYYYMMDD(fila.fecha_cierre)

  console.log('FECHAS PROCESADAS:', {
    inicioOriginal: fila.fecha_inicio,
    inicioConvertido: inicio ? format(inicio, 'yyyy-MM-dd') : null,
    cierreOriginal: fila.fecha_cierre,
    cierreConvertido: cierre ? format(cierre, 'yyyy-MM-dd') : null,
  })

  // Verificar que ambas fechas sean válidas y que inicio sea antes de cierre
  const fechasValidas = isValid(inicio) && isValid(cierre)
  const inicioAntesDeCierre = fechasValidas && isBefore(inicio, cierre)

  if (fila.fecha_inicio && fila.fecha_cierre && fechasValidas && inicioAntesDeCierre) {
    console.log('✅ Fechas válidas - Actividad cambia a PLANIFICADA')
    fila.gradoEjecucion = 'PLANIFICADA'
    successMsg('Actividad planificada')

    // Actualizar en la tabla visualmente
    if (hotTable.value?.hotInstance) {
      setTimeout(() => {
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'gradoEjecucion', 'PLANIFICADA')
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'estado', 'PLAN')

        // Formatear fechas a YYYY-MM-DD para consistencia
        if (inicio) {
          hotTable.value.hotInstance.setDataAtRowProp(
            rowIndex,
            'fecha_inicio',
            format(inicio, 'yyyy-MM-dd'),
          )
        }
        if (cierre) {
          hotTable.value.hotInstance.setDataAtRowProp(
            rowIndex,
            'fecha_cierre',
            format(cierre, 'yyyy-MM-dd'),
          )
        }

        hotTable.value.hotInstance.render()
      }, 50)
    }
  } else {
    console.log('❌ Fechas inválidas - Actividad no cambia de grado de ejecucion')
    // Mostrar razón específica del error
    if (!fechasValidas) {
      console.log('❌ Razón: Fechas no válidas')
      if (!isValid(inicio)) console.log('  - Fecha inicio inválida:', fila.fecha_inicio)
      if (!isValid(cierre)) console.log('  - Fecha cierre inválida:', fila.fecha_cierre)

      // Mostrar error al usuario
      errorMsg('Formato de fecha inválido. Use YYYY-MM-DD (ej: 2025-12-01)')
    } else if (!inicioAntesDeCierre) {
      console.log('❌ Razón: Fecha inicio debe ser anterior a fecha cierre')
      console.log('  - Inicio:', inicio ? format(inicio, 'yyyy-MM-dd') : 'inválida')
      console.log('  - Cierre:', cierre ? format(cierre, 'yyyy-MM-dd') : 'inválida')
      errorMsg('La fecha de cierre debe ser posterior a la de inicio')
    }

    // Solo limpiar gradoEjecucion, NO limpiar las fechas
    fila.gradoEjecucion = ''

    // Actualizar en la tabla visualmente
    if (hotTable.value?.hotInstance) {
      setTimeout(() => {
        hotTable.value.hotInstance.setDataAtRowProp(rowIndex, 'gradoEjecucion', '')
        hotTable.value.hotInstance.render()
      }, 50)
    }
  }
}
/************************ MENU CONTEXTUAL *******************************/
const contextMenuConfig = computed(() => {
  const menuItems = ['---------']

  // Agregar nuestras opciones personalizadas con íconos
  const customItems = [
    {
      key: 'subactividad',
      name: '📋 Agregar Subactividad',
      callback: () => {
        const selected = hotTable.value?.hotInstance?.getSelected()
        if (selected && selected.length > 0) {
          const startRow = selected[0][0]
          //mostrarModalAgregarTareaDesdeMenu(startRow)
          mostrarModalAgregarTarea()
        }
      },
      disabled: () => !selectedRowData.value,
      hidden: () => !selectedRowData.value, // Alternativa: ocultar en lugar de deshabilitar
    },
    {
      key: 'presupuesto',
      name: '💰 Ajustar Presupuesto',
      callback: () => {
        if (selectedRowData.value) {
          mostrarModalPresupuesto()
        }
      },
      disabled: () => !selectedRowData.value,
    },
    {
      key: 'pei',
      name: '📊 Relación PEI',
      callback: () => {
        if (selectedRowData.value) {
          abrirModalPei()
        }
      },
      disabled: () => !selectedRowData.value,
    },
  ]

  // Agregar separador después de nuestras opciones
  const finalItems = [
    ...menuItems,
    ...customItems,
    '---------',
    {
      key: 'exportar_excel',
      name: '📤 Exportar a Excel',
      callback: () => exportarExcel(),
    },
    {
      key: 'guardar_cambios',
      name: () =>
        tieneCambiosSinGuardar.value ? '💾 Guardar Cambios' : '💾 Guardar (sin cambios)',
      callback: () => guardarPlanificacion(),
      disabled: () => false, // Siempre visible, pero podría deshabilitarse si no hay cambios
    },
  ]

  return finalItems
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
