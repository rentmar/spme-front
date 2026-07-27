<!-- PlanificacionProyectoActividadesV4.vue -->
<template>
  <div class="excel-app">
    <ExcelToolbar
      :grid-tab="gridTab"
      :selected-row-data="selectedRowData"
      @add-row="addRow"
      @add-tarea="addTareaHandler"
      @open-aside="openAside"
      @ejecutar-accion="ejecutarAccion"
      @guardar="guardar"
    />
    <ExcelFormulaBar
      :selected-cell="selectedCell"
      :selected-value="selectedValue"
      :column-title="columnTitle"
    />
    <div class="excel-body">
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
      <!--PROPS REALES
     TAREAS:
        actividad type Object
        presupuesto-actividad type Number, String


     -->
      <ExcelAside
        v-if="showAside && selectedRowData"
        :mode="asideMode"
        :actividad="selectedRowData"
        :presupuesto-actividad="selectedRowData.presupuesto"
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
    </div>
    <ExcelStatusBar
      :data-length="tablaDataActividades.length"
      :total-plan="totalPlan"
      :total-ejec="totalEjec"
      :saldo="saldo"
      :pct="pct"
    />
  </div>
  <!--Desglose del presupuesto-->
  <DialogoDesglosePresupuestoActividad
    v-model="dialogoDesglose"
    :presupuesto-total="datosPresupuesto.presupuesto"
    :desglose-inicial="datosPresupuesto.procedencia_fondos"
    :info-actividad="datosPresupuesto.info"
    :procedencia-fondos="store.procedenciaFondosIds"
    @guardarDesglose="guardarDesglosePresupuesto"
  ></DialogoDesglosePresupuestoActividad>
  <!--Dialogo para el envio de informacion-->
  <DialogoConfirmacionEnvio
    v-model="showDialogoEnvio"
    :loading-save="loadingSave"
    @guardar="confirmarEnvio"
  ></DialogoConfirmacionEnvio>
  <!--Para debug-->
  <DebugDialog :tablaDataActividades="tablaDataActividades" :tablaDataTareas="tablaDataTareas" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, provide } from 'vue'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
import { registerLanguageDictionary, esMX } from 'handsontable/i18n'
//Componetes
import ExcelToolbar from './ExcelToolbar.vue'
import ExcelFormulaBar from './ExcelFormulaBar.vue'
import ExcelGrid from './ExcelGrid.vue'
import ExcelAside from './ExcelAside.vue'
import ExcelStatusBar from './ExcelStatusBar.vue'
import DialogoDesglosePresupuestoActividad from './Dialogs/DialogoDesglosePresupuestoActividad.vue'
import DialogoConfirmacionEnvio from './Dialogs/DialogoConfirmacionEnvio.vue'
//composables
import { useExcelData } from '../composables/useExcelData.js'
import { useExcelMenus } from '../composables/useExcelMenus.js'
import { useSnackbar } from '@/composables/useSnackbar.js'
//store
import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore.js'
import { useUserStore } from '@/stores/user.js'
//debug
import DebugDialog from './Dialogs/DebugDialog.vue'

registerAllModules()
registerLanguageDictionary(esMX)

//iniciar el store
const store = usePlanificacionExcelStore()
const userStore = useUserStore()
// REFS
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

//Ref para el dialogo de envio
const showDialogoEnvio = ref(false)

//estado del desglose de presupuesto:
const dialogoDesglose = ref(false)
const datosPresupuesto = ref({
  presupuesto: 0,
  procedencia_fondos: [],
})

//Estados para el formula menu
const columnTitle = ref('')

// COMPOSABLES
const { successMsg, errorMsg, infoMsg } = useSnackbar()
const {
  tablaDataActividades,
  tablaDataTareas,
  //data,
  columns,
  tareasDummy,
  //tareasGridData,
  tareasColumns,
  fuentesDummy,
  totalPlan,
  totalEjec,
  saldo,
  pct,
  //fmt,
  //estadoColor,
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

//Solo para debug:
// Después de useExcelData()
provide('tablaDataActividades', tablaDataActividades)
provide('tablaDataTareas', tablaDataTareas)

///Rutina para mostrar tareas

// const verTareasDeActividad = () => {
//   if (selectedRowData.value) {
//     actividadSeleccionada.value = selectedRowData.value

//     gridTab.value = 'tareas'
//   }
// }

// const verTareasDeActividad = () => {
//   if (selectedRowData.value) {
//     actividadSeleccionada.value = selectedRowData.value
//     gridTab.value = 'tareas'

//     setTimeout(() => {
//       const hot = gridRef.value?.tareasTable?.hotInstance
//       if (hot) {
//         hot.loadData(tareasFiltradas.value)
//       }
//     }, 200)
//   }
// }

//Agregar Tarea
const addTareaHandler = () => {
  addTarea(actividadSeleccionada.value?.id, () => {
    gridRef.value?.recargarTareas(tareasFiltradas.value)
  })
}

// verTareasDeActividad con confirmación
const verTareasDeActividad = async () => {
  if (selectedRowData.value) {
    const puedeCambiar = await seguimiento.confirmarCambioActividad()
    if (!puedeCambiar) return

    actividadSeleccionada.value = selectedRowData.value
    gridTab.value = 'tareas'

    setTimeout(() => {
      gridRef.value?.recargarTareas(tareasFiltradas.value)
    }, 200)
  }
}

const guardarDesglosePresupuesto = (nuevoDesglose) => {
  if (!datosPresupuesto.value?.id) return

  const index = tablaDataActividades.value.findIndex((a) => a.id === datosPresupuesto.value.id)
  if (index === -1) return

  // Actualizar la fila en la grilla
  tablaDataActividades.value[index].procedencia_fondos = nuevoDesglose

  // Forzar actualización visual de Handsontable
  if (gridRef.value?.hotTableRef?.hotInstance) {
    gridRef.value.hotTableRef.hotInstance.setDataAtRowProp(
      index,
      'procedencia_fondos',
      nuevoDesglose,
    )
    gridRef.value.hotTableRef.hotInstance.render()
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
// Función guardar
const guardar = async () => {
  if (!store.tieneCambiosSinGuardar) {
    infoMsg('No hay cambios para guardar')
    return
  }
  showDialogoEnvio.value = true
}
//Confirmar envio
const confirmarEnvio = async (motivo) => {
  loadingSave.value = true
  console.log('MOTIVO: ', motivo)
  try {
    const actividadesConDatos = tablaDataActividades.value.filter(
      (a) => a.nombreCorto || a.codigo || a.id,
    )
    const tareasConDatos = tablaDataTareas.value.filter((t) => t.titulo || t.codigo || t.id)
    const respuesta = await store.guardarCambios(motivo, actividadesConDatos, tareasConDatos)
    console.log('RESPUESTA: ', respuesta)
    successMsg('Informacion almacenada')
  } catch (error) {
    loadingSave.value = false
    console.error('Error al enviar la informacion', error)
    errorMsg('Error al guardar')
  } finally {
    showDialogoEnvio.value = false
    loadingSave.value = false
  }
}

// COMPUTED
const tareasFiltradas = computed(() => {
  if (!actividadSeleccionada.value || !tablaDataTareas.value.length) return []

  const filtradas = tablaDataTareas.value.filter(
    (t) => t.actividad === actividadSeleccionada.value.id,
  )

  // Agregar 3 filas vacías al final
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

// FUNCIONES
const onSelect = (startRow, startCol) => {
  if (startRow >= 0 && startRow < tablaDataActividades.value.length) {
    const row = tablaDataActividades.value[startRow]
    selectedRowData.value = row

    console.log('Fila seleccionada: ', selectedRowData)

    // Si el tab de tareas está abierto, actualizar automáticamente
    // if (gridTab.value === 'tareas') {
    //   actividadSeleccionada.value = row
    //   nextTick(() => {
    //     gridRef.value?.recargarTareas(tareasFiltradas.value)
    //   })
    // }

    const col = columns.value[startCol]
    if (col) {
      selectedCell.value = col.data + (startRow + 1)
      selectedValue.value = row[col.data] || ''
      columnTitle.value = col.title || col.data
    }
  }
}
// const onSelect = (startRow, startCol) => {
//   if (startRow >= 0 && startRow < tablaDataActividades.value.length) {
//     selectedRowData.value = tablaDataActividades.value[startRow]
//     const col = columns.value[startCol]
//     if (col) {
//       selectedCell.value = col.data + (startRow + 1)
//       selectedValue.value = tablaDataActividades.value[startRow][col.data] || ''
//     }
//   }
// }

const openAside = (mode) => {
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
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
    filter_by_value: {
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
    filter_action_bar: {
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(r.to.col)
      },
    },
  },
}

onMounted(async () => {
  // Cargar lista de usuarios si no está cargada
  if (!userStore.listaUsuarios || userStore.listaUsuarios.length === 0) {
    await userStore.cargarListaUsuarios()
  }
  //tablaDataActividades.value = store.actividades
  tablaDataActividades.value = store.actividades.map((a) => {
    const presupuesto = +a.presupuesto || 0
    const totalEjecutado = +a.totalEjecutado || 0

    return {
      ...a,
      tipo_actividad: tipoActividadNombrePorId(a.tipo_actividad_id),
      saldo: presupuesto - totalEjecutado, // ← Calcular al cargar
      esNueva: false,
    }
  })
  tablaDataTareas.value = store.tareas

  agregarFilasVacias()

  console.log('tablaDataActividades:', tablaDataActividades.value)
  console.log('tablaDataTareas:', tablaDataTareas.value)

  window.addEventListener('abrir-desglose', (e) => {
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

    console.log('DATOS PRESS: ', datosPresupuesto)

    dialogoDesglose.value = true
  })
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
</style>
