<!-- PlanificacionProyectoActividadesV4.vue -->
<template>
  <div class="excel-app">
    <ExcelToolbar
      :selected-row-data="selectedRowData"
      @add-row="addRow"
      @open-aside="openAside"
      @ejecutar-accion="ejecutarAccion"
      @guardar="guardar"
    />
    <ExcelFormulaBar :selected-cell="selectedCell" :selected-value="selectedValue" />
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
      />
      <ExcelAside
        v-if="showAside"
        :mode="asideMode"
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
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
import { registerLanguageDictionary, esMX } from 'handsontable/i18n'
//Componetes
import ExcelToolbar from './ExcelToolbar.vue'
import ExcelFormulaBar from './ExcelFormulaBar.vue'
import ExcelGrid from './ExcelGrid.vue'
import ExcelAside from './ExcelAside.vue'
import ExcelStatusBar from './ExcelStatusBar.vue'
//composables
import { useExcelData } from '../composables/useExcelData.js'
import { useExcelMenus } from '../composables/useExcelMenus.js'
//store
import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore.js'

registerAllModules()
registerLanguageDictionary(esMX)

//iniciar el store
const store = usePlanificacionExcelStore()

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

// COMPOSABLES
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
  fmt,
  estadoColor,
  addRow,
  onChange,
  onChangeTareas,
  seguimiento,
} = useExcelData()

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

const { contextMenuConfig, ejecutarAccion } = useExcelMenus({
  data: tablaDataActividades,
  selectedRowData,
  showAside,
  asideMode,
  addRow,
  verTareasDeActividad,
})

// Función guardar
const guardar = async () => {
  try {
    await seguimiento.guardarCambios()
  } catch (e) {
    console.error('Error al guardar:', e)
  }
}

// COMPUTED
const tareasFiltradas = computed(() => {
  if (!actividadSeleccionada.value || !tablaDataTareas.value.length) return []
  return tablaDataTareas.value.filter((t) => t.actividad === actividadSeleccionada.value.id)
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
    selectedRowData.value = tablaDataActividades.value[startRow]
    const col = columns.value[startCol]
    if (col) {
      selectedCell.value = col.data + (startRow + 1)
      selectedValue.value = tablaDataActividades.value[startRow][col.data] || ''
    }
  }
}

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

onMounted(() => {
  tablaDataActividades.value = store.actividades
  tablaDataTareas.value = store.tareas

  console.log('tablaDataActividades:', tablaDataActividades.value)
  console.log('tablaDataTareas:', tablaDataTareas.value)
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
