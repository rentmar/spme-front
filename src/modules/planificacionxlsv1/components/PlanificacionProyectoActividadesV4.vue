<!-- PlanificacionProyectoActividadesV4.vue -->
<template>
  <div class="excel-app">
    <!-- Toolbar y FormulaBar: solo si hay actividades reales -->
    <template v-if="hayActividadesReales">
      <ExcelToolbar
        :grid-tab="gridTab"
        :selected-row-data="selectedRowData"
        @add-row="addRow"
        @add-tarea="addTareaHandler"
        @open-aside="openAside"
        @ejecutar-accion="ejecutarAccion"
        @guardar="guardar"
      />

      <!-- FormulaBar colapsable -->
      <v-expand-transition>
        <ExcelFormulaBar
          v-if="showFormulaBar"
          :selected-cell="selectedCell"
          :selected-value="selectedValue"
          :column-title="columnTitle"
        />
      </v-expand-transition>

      <!-- Toggle para contraer/expandir FormulaBar -->
      <div class="formula-toggle" @click="showFormulaBar = !showFormulaBar">
        <v-icon size="14" class="mr-1">
          {{ showFormulaBar ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <span class="text-caption"
          >{{ showFormulaBar ? 'Ocultar' : 'Mostrar' }} barra de fórmulas</span
        >
      </div>
    </template>

    <div class="excel-body">
      <!-- Estado vacío -->
      <div v-if="!hayActividadesReales" class="estado-vacio-actividades">
        <div class="vacio-content">
          <v-icon size="72" color="primary" class="mb-4">mdi-clipboard-text-outline</v-icon>
          <h2 class="text-h5 font-weight-bold mb-3">Sin actividades registradas</h2>
          <p class="text-body-1 text-medium-emphasis mb-2">
            Comience agregando la primera actividad para empezar a planificar
          </p>
          <p class="text-body-2 text-medium-emphasis mb-6">
            el presupuesto del proyecto {{ store.proyecto?.codigo || '' }}
          </p>
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="addRow"
            class="px-8"
          >
            Agregar Primera Actividad
          </v-btn>
        </div>
      </div>

      <!-- Contenido normal -->
      <template v-else>
        <ExcelGrid
          v-if="tablaDataActividades.length > 0"
          ref="gridRef"
          v-model:grid-tab="gridTab"
          :data="tablaDataActividades"
          :columns="columns"
          :grid-height="gridHeight"
          :actividad-seleccionada="actividadSeleccionada"
          :tareas-filtradas="tareasFiltradas"
          :tareas-columns="tareasColumns"
          :context-menu-config="contextMenuConfig"
          :dropdown-menu-config="dropdownMenuConfig"
          @change="onChange"
          @select="onSelect"
          :on-change-tareas="onChangeTareas"
          :context-menu-config-tareas="contextMenuConfigTareas"
        />
      </template>
    </div>

    <ExcelStatusBar
      v-if="hayActividadesReales"
      :data-length="tablaDataActividades.length"
      :total-plan="totalPlan"
      :total-ejec="totalEjec"
      :saldo="saldo"
      :pct="pct"
    />
  </div>

  <!-- Aside flotante -->
  <v-dialog
    v-model="showAside"
    max-width="1200"
    scrollable
    persistent
    @keydown.esc="showAside = false"
  >
    <v-card height="95vh" class="aside-flotante-card">
      <ExcelAside
        v-if="showAside"
        :mode="asideMode"
        :actividad="selectedRowData"
        :presupuesto-actividad="selectedRowData?.presupuesto"
        :procedencia-fondos="store.procedenciaFondos || []"
        :selected-row-data="selectedRowData"
        :data="tablaDataActividades"
        :tareas-dummy="tareasDummy"
        :total-plan="totalPlan"
        :total-ejec="totalEjec"
        :saldo="saldo"
        :pct="pct"
        :fuentes-dummy="fuentesDummy"
        :arbol-explorador="arbolExplorador"
        :explorador-abiertos="exploradorAbiertos"
        @close="showAside = false"
        @select-from-aside="selectFromAside"
        @update:explorador-abiertos="exploradorAbiertos = $event"
      />
    </v-card>
  </v-dialog>

  <!-- Diálogo: sin fila seleccionada -->
  <v-dialog v-model="dialogoSinFila" max-width="400" persistent>
    <v-card>
      <v-card-text class="pa-6 text-center">
        <v-icon size="48" color="warning" class="mb-3">mdi-cursor-default-click</v-icon>
        <p class="text-body-1 font-weight-medium">Seleccione una actividad</p>
        <p class="text-body-2 text-medium-emphasis">
          Debe seleccionar una fila en la grilla antes de abrir esta sección.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="dialogoSinFila = false">Entendido</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Desglose del presupuesto -->
  <DialogoDesglosePresupuestoActividad
    v-model="dialogoDesglose"
    :presupuesto-total="datosPresupuesto.presupuesto"
    :desglose-inicial="datosPresupuesto.procedencia_fondos"
    :info-actividad="datosPresupuesto.info"
    :procedencia-fondos="store.procedenciaFondosIds"
    @guardarDesglose="guardarDesglosePresupuesto"
  />

  <!-- Diálogo para el envío de información -->
  <DialogoConfirmacionEnvio
    v-model="showDialogoEnvio"
    :loading-save="loadingSave"
    @guardar="confirmarEnvio"
  />
  <!--Dialogo para la asignacion de la estructura-->
  <AsignacionNodoIndicador
    v-model="dialogoAsignacion"
    :actividad-data="selectedRowData"
    @guardar="actualizarEstructuraProcedencia"
  />

  <!-- Debug -->
  <!-- <DebugDialog :tablaDataActividades="tablaDataActividades" :tablaDataTareas="tablaDataTareas" /> -->
</template>

<script setup>
import { ref, computed, onMounted, nextTick, provide, onUnmounted } from 'vue'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
import { registerLanguageDictionary, esMX } from 'handsontable/i18n'
import ExcelToolbar from './ExcelToolbar.vue'
import ExcelFormulaBar from './ExcelFormulaBar.vue'
import ExcelGrid from './ExcelGrid.vue'
import ExcelAside from './ExcelAside.vue'
import ExcelStatusBar from './ExcelStatusBar.vue'
import DialogoDesglosePresupuestoActividad from './Dialogs/DialogoDesglosePresupuestoActividad.vue'
import DialogoConfirmacionEnvio from './Dialogs/DialogoConfirmacionEnvio.vue'
import AsignacionNodoIndicador from './Dialogs/AsignacionNodoIndicador.vue'
import { useExcelData } from '../composables/useExcelData.js'
import { useExcelMenus } from '../composables/useExcelMenus.js'
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useSeguimientoCambios } from '../composables/useSeguimientoCambios.js'
import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore.js'
import { useUserStore } from '@/stores/user.js'
import DebugDialog from './Dialogs/DebugDialog.vue'

registerAllModules()
registerLanguageDictionary(esMX)

const store = usePlanificacionExcelStore()
const userStore = useUserStore()

const selectedRowData = ref(null)
const actividadSeleccionada = ref(null)
const showAside = ref(false)
const asideMode = ref('tareas')
const gridTab = ref('actividades')
const exploradorAbiertos = ref(['tareas-group', 'solicitudes-group'])
const gridRef = ref(null)
const gridHeight = ref(400)
const selectedCell = ref('A1')
const selectedValue = ref('')
const showFormulaBar = ref(true)
const showDialogoEnvio = ref(false)
const dialogoDesglose = ref(false)
const dialogoSinFila = ref(false)
const datosPresupuesto = ref({ presupuesto: 0, procedencia_fondos: [] })
const columnTitle = ref('')

const hayActividadesReales = computed(() =>
  tablaDataActividades.value.some((a) => a.id !== null && a.id !== undefined),
)

const { registrarCambio } = useSeguimientoCambios()
const { successMsg, errorMsg, infoMsg, warningMsg } = useSnackbar()
const {
  tablaDataActividades,
  tablaDataTareas,
  columns,
  tareasDummy,
  tareasColumns,
  fuentesDummy,
  totalPlan,
  totalEjec,
  saldo,
  pct,
  addRow,
  addTarea,
  onChange,
  onChangeTareas,
  seguimiento,
  agregarFilasVacias,
  deleteRow,
  deleteTarea,
  disableRow,
  disableTarea,
  tipoActividadNombrePorId,
} = useExcelData()

provide('tablaDataActividades', tablaDataActividades)
provide('tablaDataTareas', tablaDataTareas)

/************************ Dialogo Asignacion Estructura **************************************/
const dialogoAsignacion = ref(false)
const filaEditando = ref(null)

const abrirAsignacionEstructura = (event) => {
  const { row, data } = event.detail
  const filaCompleta = tablaDataActividades.value[row]
  if (!filaCompleta) return

  filaEditando.value = row
  selectedRowData.value = filaCompleta
  dialogoAsignacion.value = true
}

const actualizarEstructuraProcedencia = (nuevoDato) => {
  if (filaEditando.value !== null) {
    const valorAnterior = tablaDataActividades.value[filaEditando.value].estructuraProcedencia

    tablaDataActividades.value[filaEditando.value].estructuraProcedencia = nuevoDato

    if (gridRef.value?.hotTableRef?.hotInstance) {
      gridRef.value.hotTableRef.hotInstance.setDataAtRowProp(
        filaEditando.value,
        'estructuraProcedencia',
        nuevoDato,
      )
      gridRef.value.hotTableRef.hotInstance.render()
    }

    seguimiento.registrarCambio({
      tipo: 'actividad',
      accion: 'editar',
      fila_id: tablaDataActividades.value[filaEditando.value].id,
      columna: 'estructuraProcedencia',
      valor_anterior: valorAnterior ? JSON.stringify(valorAnterior) : null,
      valor_nuevo: JSON.stringify(nuevoDato),
      actividad_codigo: tablaDataActividades.value[filaEditando.value].codigo,
      actividad_id: tablaDataActividades.value[filaEditando.value].id,
    })

    filaEditando.value = null
  }
}
/************************ Fin Dialogo Asignacion Estructura **************************************/

const addTareaHandler = () => {
  addTarea(actividadSeleccionada.value?.id, () =>
    gridRef.value?.recargarTareas(tareasFiltradas.value),
  )
}

const verTareasDeActividad = async () => {
  if (!selectedRowData.value) return
  const puedeCambiar = await seguimiento.confirmarCambioActividad()
  if (!puedeCambiar) return
  actividadSeleccionada.value = selectedRowData.value
  gridTab.value = 'tareas'
  setTimeout(() => gridRef.value?.recargarTareas(tareasFiltradas.value), 200)
}

const guardarDesglosePresupuesto = async (nuevoDesglose) => {
  if (!datosPresupuesto.value?.id) return
  const index = tablaDataActividades.value.findIndex((a) => a.id === datosPresupuesto.value.id)
  if (index === -1) return
  const valorAnterior = JSON.stringify(tablaDataActividades.value[index].procedencia_fondos)
  const valorNuevo = JSON.stringify(nuevoDesglose)
  if (valorAnterior !== valorNuevo) {
    tablaDataActividades.value[index].procedencia_fondos = nuevoDesglose
    if (gridRef.value?.hotTableRef?.hotInstance) {
      gridRef.value.hotTableRef.hotInstance.setDataAtRowProp(
        index,
        'procedencia_fondos',
        nuevoDesglose,
      )
      gridRef.value.hotTableRef.hotInstance.render()
    }
    registrarCambio({
      tipo: 'actividad',
      accion: 'editar',
      fila_id: datosPresupuesto.value?.id,
      columna: 'procedencia_fondos',
      valor_anterior: valorAnterior,
      valor_nuevo: valorNuevo,
      actividad_codigo: datosPresupuesto.value?.id,
      actividad_id: datosPresupuesto.value?.id,
    })
  }
}

const { contextMenuConfig, contextMenuConfigTareas, ejecutarAccion } = useExcelMenus({
  data: tablaDataActividades,
  selectedRowData,
  showAside,
  asideMode,
  addRow,
  addTarea: () => addTarea(actividadSeleccionada.value?.id),
  verTareasDeActividad,
  deleteRow,
  deleteTarea,
  disableRow,
  disableTarea,
})

const loadingSave = ref(false)
const guardar = async () => {
  if (!store.tieneCambiosSinGuardar) {
    infoMsg('No hay cambios para guardar')
    return
  }
  showDialogoEnvio.value = true
}

const confirmarEnvio = async (motivo) => {
  loadingSave.value = true
  try {
    const actividadesConDatos = tablaDataActividades.value.filter(
      (a) => a.nombreCorto || a.codigo || a.id,
    )
    const tareasConDatos = tablaDataTareas.value.filter((t) => t.titulo || t.codigo || t.id)
    await store.guardarCambios(motivo, actividadesConDatos, tareasConDatos)
    showDialogoEnvio.value = false
    loadingSave.value = false
    successMsg('Informacion almacenada')
    await new Promise((resolve) => setTimeout(resolve, 1500))
    window.location.reload()
  } catch (error) {
    loadingSave.value = false
    errorMsg('Error al guardar')
  }
}

const tareasFiltradas = computed(() => {
  if (!actividadSeleccionada.value || !tablaDataTareas.value.length) return []
  const filtradas = tablaDataTareas.value.filter(
    (t) => t.actividad === actividadSeleccionada.value.id,
  )
  const vacias = Array.from({ length: 5 }, () => ({
    id: null,
    codigo: '',
    titulo: '',
    descripcion: '',
    fecha_creacion: '',
    fecha_limite: '',
    presupuesto: '',
    presupuestoDesglose: '',
    estado: '',
    actividad: '',
    esNueva: false,
  }))
  return [...filtradas, ...vacias]
})

const arbolExplorador = computed(() => {
  if (!selectedRowData.value) return []
  return [
    {
      id: 'tareas-group',
      title: 'Tareas',
      icon: 'mdi-folder-outline',
      color: 'secondary',
      children: tareasDummy.value.map((t, i) => ({
        id: `tarea-${i}`,
        title: t.nombre,
        icon: 'mdi-file-document-outline',
        color: 'secondary',
        estado: t.estado,
      })),
    },
    {
      id: 'solicitudes-group',
      title: 'Solicitudes',
      icon: 'mdi-folder-outline',
      color: 'info',
      children: [
        {
          id: 'sol-1',
          title: 'SF-001 Fondos',
          icon: 'mdi-cash-multiple',
          color: 'info',
          estado: 'APROBADO',
        },
        {
          id: 'sol-2',
          title: 'SV-001 Viaje',
          icon: 'mdi-airplane',
          color: 'info',
          estado: 'PENDIENTE',
        },
        {
          id: 'sol-3',
          title: 'SR-001 Reposición',
          icon: 'mdi-recycle',
          color: 'info',
          estado: 'RECHAZADO',
        },
      ],
    },
    {
      id: 'rendiciones-group',
      title: 'Rendiciones',
      icon: 'mdi-folder-outline',
      color: 'success',
      children: [
        {
          id: 'rend-1',
          title: 'RC-001 Rendición',
          icon: 'mdi-clipboard-check-outline',
          color: 'success',
          estado: 'PENDIENTE',
        },
      ],
    },
  ]
})

const onSelect = (startRow, startCol) => {
  if (startRow >= 0 && startRow < tablaDataActividades.value.length) {
    const row = tablaDataActividades.value[startRow]
    selectedRowData.value = row
    const col = columns.value[startCol]
    if (col) {
      if (col.data === 'presupuesto' && (row.estado === 'CRD' || row.esNueva)) {
        warningMsg(
          `No se puede modificar el presupuesto porque la actividad ${row.estado === 'CRD' ? 'estado CRD' : 'no ha sido guardada'}.`,
        )
        return
      }
      selectedCell.value = col.data + (startRow + 1)
      selectedValue.value = row[col.data] || ''
      columnTitle.value = col.title || col.data
    }
  }
}

const openAside = (mode) => {
  if (mode === 'arbol') {
    asideMode.value = mode
    showAside.value = true
    return
  }
  if (!selectedRowData.value) {
    dialogoSinFila.value = true
    return
  }
  asideMode.value = mode
  showAside.value = true
}

const selectFromAside = (act) => {
  selectedRowData.value = act
  asideMode.value = 'tareas'
}

const dropdownMenuConfig = {
  items: {
    filter_by_condition: {
      hidden() {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
    filter_by_value: {
      hidden() {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
    filter_action_bar: {
      hidden() {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
  },
}

const manejarDesglose = (e) => {
  const { row, data } = e.detail
  const fila = tablaDataActividades.value[row]
  if (!fila) return
  datosPresupuesto.value = {
    id: fila.id,
    presupuesto: fila.presupuesto || 0,
    procedencia_fondos: data || [],
    info: {
      codigo: fila.codigo,
      nombreCorto: fila.nombreCorto,
      estado: fila.estado,
      gradoEjecucion: fila.gradoEjecucion,
      responsable: fila.responsable,
    },
  }
  dialogoDesglose.value = true
}

onMounted(async () => {
  if (!userStore.listaUsuarios?.length) await userStore.cargarListaUsuarios()
  tablaDataActividades.value = store.actividades.map((a) => {
    const p = +a.presupuesto || 0
    const e = +a.totalEjecutado || 0
    return {
      ...a,
      tipo_actividad: tipoActividadNombrePorId(a.tipo_actividad_id),
      saldo: p - e,
      esNueva: false,
    }
  })
  tablaDataActividades.value.sort((a, b) => a.id - b.id)
  tablaDataTareas.value = store.tareas
  agregarFilasVacias()

  window.addEventListener('abrir-desglose', manejarDesglose)
  window.addEventListener('abrir-asignacion-estructura', abrirAsignacionEstructura)

  nextTick(() => {
    const el = gridRef.value?.$el || gridRef.value
    if (el) {
      gridHeight.value = el.clientHeight
      new ResizeObserver(() => {
        gridHeight.value = el.clientHeight
      }).observe(el)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('abrir-desglose', manejarDesglose)
  window.removeEventListener('abrir-asignacion-estructura', abrirAsignacionEstructura)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.excel-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  color: #202124;
  background: #f1f3f4;
}
.excel-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}
.formula-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  background: #f1f3f4;
  border-top: 1px solid #dadce0;
  cursor: pointer;
  color: #5f6368;
  user-select: none;
  transition: background 0.15s;
}
.formula-toggle:hover {
  background: #e8eaed;
}
.aside-flotante-card {
  display: flex;
  flex-direction: column;
}
.estado-vacio-actividades {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}
.vacio-content {
  text-align: center;
  max-width: 480px;
  padding: 48px 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
</style>
