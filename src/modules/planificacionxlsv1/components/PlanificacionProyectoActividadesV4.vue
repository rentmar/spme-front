<!-- PlanificacionProyectoActividadesV4.vue -->
<template>
  <div class="excel-app">
    <ExcelToolbar
      :selected-row-data="selectedRowData"
      @add-row="addRow"
      @open-aside="openAside"
      @ejecutar-accion="ejecutarAccion"
    />
    <ExcelFormulaBar :selected-cell="selectedCell" :selected-value="selectedValue" />
    <div class="excel-body">
      <ExcelGrid
        ref="gridRef"
        v-model:grid-tab="gridTab"
        :data="data"
        :columns="columns"
        :grid-height="gridHeight"
        :actividad-seleccionada="actividadSeleccionada"
        :tareas-filtradas="tareasFiltradas"
        :tareas-columns="tareasColumns"
        :context-menu-config="contextMenuConfig"
        :dropdown-menu-config="dropdownMenuConfig"
        @change="onChange"
        @select="onSelect"
      />
      <ExcelAside
        v-if="showAside"
        :mode="asideMode"
        :selected-row-data="selectedRowData"
        :data="data"
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
      :data-length="data.length"
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
import ExcelToolbar from './ExcelToolbar.vue'
import ExcelFormulaBar from './ExcelFormulaBar.vue'
import ExcelGrid from './ExcelGrid.vue'
import ExcelAside from './ExcelAside.vue'
import ExcelStatusBar from './ExcelStatusBar.vue'
import { useExcelData } from '../composables/useExcelData.js'
import { useExcelMenus } from '../composables/useExcelMenus.js'

registerAllModules()

// 1. REFS
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

// 2. COMPOSABLES
const {
  data,
  columns,
  tareasDummy,
  tareasGridData,
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
} = useExcelData()

const verTareasDeActividad = () => {
  if (selectedRowData.value) {
    actividadSeleccionada.value = selectedRowData.value
    gridTab.value = 'tareas'
  }
}

const { contextMenuConfig, ejecutarAccion } = useExcelMenus({
  data,
  selectedRowData,
  showAside,
  asideMode,
  addRow,
  verTareasDeActividad,
})

// 3. COMPUTED
const tareasFiltradas = computed(() => {
  if (!actividadSeleccionada.value) return []
  return tareasGridData.value.filter((t) =>
    t.actividad.startsWith(actividadSeleccionada.value.codigo),
  )
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

// 4. FUNCIONES
const onSelect = (startRow, startCol) => {
  if (startRow >= 0 && startRow < data.value.length) {
    selectedRowData.value = data.value[startRow]
    const col = columns.value[startCol]
    if (col) {
      selectedCell.value = col.data + (startRow + 1)
      selectedValue.value = data.value[startRow][col.data] || ''
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

// Altura de grilla
onMounted(() => {
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
