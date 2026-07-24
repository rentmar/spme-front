<!-- PlanificacionProyectoActividadesV3.vue -->
<template>
  <div class="excel-app">
    <!-- TOOLBAR -->
    <header class="excel-header">
      <div class="header-left">
        <button class="btn">Archivo</button>
        <button class="btn">Editar</button>
        <button class="btn">Ver</button>
        <span class="sep"></span>
        <button class="btn primary" @click="addRow">+ Nueva Actividad</button>
      </div>
      <div class="header-right">
        <button class="btn">💾 Guardar</button>
        <button class="btn">📤 Exportar</button>
      </div>
    </header>

    <!-- BARRA DE FÓRMULAS -->
    <div class="formula-bar">
      <span class="cell-ref">{{ selectedCell || 'A1' }}</span>
      <span class="cell-value">{{ selectedValue || 'Seleccione una celda' }}</span>
    </div>

    <!-- GRILLA -->
    <main class="grid-area" ref="gridRef">
      <HotTable
        ref="hotTable"
        :data="data"
        :columns="columns"
        :colHeaders="true"
        :rowHeaders="true"
        :height="gridHeight"
        :width="'100%'"
        :licenseKey="'non-commercial-and-evaluation'"
        :rowHeights="30"
        :filters="true"
        :afterChange="onChange"
        :afterSelection="onSelect"
      />
    </main>

    <!-- PIE -->
    <footer class="status-bar">
      <span>{{ data.length }} actividades</span>
      <span class="sep">|</span>
      <span
        >Planif: <b>Bs. {{ fmt(totalPlan) }}</b></span
      >
      <span class="sep">|</span>
      <span
        >Ejec: <b class="c-green">Bs. {{ fmt(totalEjec) }}</b></span
      >
      <span class="sep">|</span>
      <span
        >Saldo: <b :class="saldo < 0 ? 'c-red' : 'c-green'">Bs. {{ fmt(saldo) }}</b></span
      >
      <span class="sep">|</span>
      <div class="mini-progress">
        <div class="mini-fill" :style="{ width: pct + '%' }"></div>
      </div>
      <span
        ><b>{{ pct }}%</b></span
      >
      <span style="flex: 1"></span>
      <span>100%</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
registerAllModules()

const init = [
  {
    id: 1,
    codigo: 'ACT001',
    nombre: 'Seminario Video',
    tipo: 'Capacitacion',
    resp: 'jperez',
    inicio: '2026-01-15',
    cierre: '2026-06-30',
    presupuesto: 15000,
    ejecutado: 8500,
    saldo: 6500,
    estado: 'EJEC',
    prog: '80%',
    area: 'Educación',
    fuente: 'TGN',
    prioridad: 'Alta',
    observaciones: 'En curso',
  },
  {
    id: 2,
    codigo: 'ACT002',
    nombre: 'Reunion Asociados',
    tipo: 'Articulacion',
    resp: 'mlopez',
    inicio: '2026-02-01',
    cierre: '2026-04-15',
    presupuesto: 20000,
    ejecutado: 12000,
    saldo: 8000,
    estado: 'EJEC',
    prog: '60%',
    area: 'Social',
    fuente: 'IDH',
    prioridad: 'Media',
    observaciones: '',
  },
  {
    id: 3,
    codigo: 'ACT003',
    nombre: 'Captacion Org',
    tipo: 'Operativa',
    resp: 'cruiz',
    inicio: '2026-03-01',
    cierre: '2026-12-31',
    presupuesto: 25000,
    ejecutado: 0,
    saldo: 25000,
    estado: 'PLAN',
    prog: '0%',
    area: 'Desarrollo',
    fuente: 'Propios',
    prioridad: 'Alta',
    observaciones: 'Pendiente',
  },
  {
    id: 4,
    codigo: 'ACT004',
    nombre: 'Seminario Actualizacion',
    tipo: 'Capacitacion',
    resp: 'atorres',
    inicio: '2026-01-01',
    cierre: '2026-03-30',
    presupuesto: 10000,
    ejecutado: 10000,
    saldo: 0,
    estado: 'FIN',
    prog: '100%',
    area: 'Educación',
    fuente: 'TGN',
    prioridad: 'Baja',
    observaciones: 'Completado',
  },
  {
    id: 5,
    codigo: 'ACT005',
    nombre: 'Taller Liderazgo',
    tipo: 'Capacitacion',
    resp: 'jperez',
    inicio: '2026-04-01',
    cierre: '2026-05-30',
    presupuesto: 12000,
    ejecutado: 3000,
    saldo: 9000,
    estado: 'EJEC',
    prog: '25%',
    area: 'Liderazgo',
    fuente: 'MISEREOR',
    prioridad: 'Alta',
    observaciones: '',
  },
  {
    id: 6,
    codigo: 'ACT006',
    nombre: 'Feria Comunitaria',
    tipo: 'Articulacion',
    resp: 'mlopez',
    inicio: '2026-05-01',
    cierre: '2026-06-15',
    presupuesto: 8000,
    ejecutado: 0,
    saldo: 8000,
    estado: 'PLAN',
    prog: '0%',
    area: 'Social',
    fuente: 'Propios',
    prioridad: 'Media',
    observaciones: '',
  },
  {
    id: 7,
    codigo: 'ACT007',
    nombre: 'Consultoria Externa',
    tipo: 'Operativa',
    resp: 'cruiz',
    inicio: '2026-02-15',
    cierre: '2026-08-30',
    presupuesto: 35000,
    ejecutado: 20000,
    saldo: 15000,
    estado: 'EJEC',
    prog: '57%',
    area: 'Desarrollo',
    fuente: 'IDH',
    prioridad: 'Alta',
    observaciones: 'En evaluación',
  },
  {
    id: 8,
    codigo: 'ACT008',
    nombre: 'Informe Final',
    tipo: 'Operativa',
    resp: 'atorres',
    inicio: '2026-06-01',
    cierre: '2026-07-15',
    presupuesto: 5000,
    ejecutado: 0,
    saldo: 5000,
    estado: 'PLAN',
    prog: '0%',
    area: 'Administración',
    fuente: 'TGN',
    prioridad: 'Media',
    observaciones: '',
  },
  {
    id: 9,
    codigo: 'ACT009',
    nombre: 'Capacitacion Docente',
    tipo: 'Capacitacion',
    resp: 'jperez',
    inicio: '2026-03-15',
    cierre: '2026-09-30',
    presupuesto: 18000,
    ejecutado: 9000,
    saldo: 9000,
    estado: 'EJEC',
    prog: '50%',
    area: 'Educación',
    fuente: 'MISEREOR',
    prioridad: 'Alta',
    observaciones: '2 módulos completados',
  },
  {
    id: 10,
    codigo: 'ACT010',
    nombre: 'Evento Cierre',
    tipo: 'Articulacion',
    resp: 'mlopez',
    inicio: '2026-10-01',
    cierre: '2026-11-15',
    presupuesto: 15000,
    ejecutado: 0,
    saldo: 15000,
    estado: 'PLAN',
    prog: '0%',
    area: 'Social',
    fuente: 'Propios',
    prioridad: 'Baja',
    observaciones: '',
  },
  {
    id: 11,
    codigo: 'ACT011',
    nombre: 'Monitoreo Proyectos',
    tipo: 'Operativa',
    resp: 'cruiz',
    inicio: '2026-01-01',
    cierre: '2026-12-31',
    presupuesto: 22000,
    ejecutado: 11000,
    saldo: 11000,
    estado: 'EJEC',
    prog: '50%',
    area: 'Desarrollo',
    fuente: 'TGN',
    prioridad: 'Alta',
    observaciones: 'Trimestral',
  },
  {
    id: 12,
    codigo: 'ACT012',
    nombre: 'Auditoria Externa',
    tipo: 'Operativa',
    resp: 'atorres',
    inicio: '2026-09-01',
    cierre: '2026-10-30',
    presupuesto: 30000,
    ejecutado: 0,
    saldo: 30000,
    estado: 'PLAN',
    prog: '0%',
    area: 'Administración',
    fuente: 'IDH',
    prioridad: 'Alta',
    observaciones: 'Por contratar',
  },
]

const data = ref(init.map((r) => ({ ...r })))
const selectedCell = ref('A1')
const selectedValue = ref('')
const hotTable = ref(null)
const gridRef = ref(null)
const gridHeight = ref(400)

const columns = ref([
  { data: 'id', title: '#', type: 'numeric', width: 40 },
  { data: 'codigo', title: 'Código', width: 90 },
  { data: 'nombre', title: 'Nombre', width: 180 },
  { data: 'tipo', title: 'Tipo', width: 120 },
  { data: 'area', title: 'Área', width: 110 },
  { data: 'resp', title: 'Resp.', width: 80 },
  { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  {
    data: 'presupuesto',
    title: 'Presupuesto',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  {
    data: 'ejecutado',
    title: 'Ejecutado',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  {
    data: 'saldo',
    title: 'Saldo',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  { data: 'fuente', title: 'Fuente', width: 90 },
  { data: 'prog', title: 'Prog.', width: 60 },
  { data: 'prioridad', title: 'Prioridad', width: 80 },
  { data: 'estado', title: 'Estado', width: 70 },
  { data: 'observaciones', title: 'Observaciones', width: 180 },
])

const totalPlan = computed(() => data.value.reduce((s, r) => s + (+r.presupuesto || 0), 0))
const totalEjec = computed(() => data.value.reduce((s, r) => s + (+r.ejecutado || 0), 0))
const saldo = computed(() => totalPlan.value - totalEjec.value)
const pct = computed(() =>
  totalPlan.value ? +((totalEjec.value / totalPlan.value) * 100).toFixed(1) : 0,
)
const fmt = (n) => (+n).toLocaleString('es-BO', { minimumFractionDigits: 2 })

const calcularAltura = () => {
  nextTick(() => {
    if (gridRef.value) {
      gridHeight.value = gridRef.value.clientHeight
    }
  })
}

let resizeObserver = null

onMounted(() => {
  calcularAltura()
  resizeObserver = new ResizeObserver(calcularAltura)
  if (gridRef.value) resizeObserver.observe(gridRef.value)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

const onChange = (changes, source) => {
  if (source === 'loadData') return
  changes.forEach(([row, prop, , val]) => {
    if (row < data.value.length) {
      data.value[row][prop] = prop === 'presupuesto' || prop === 'ejecutado' ? +val || 0 : val
      if (prop === 'presupuesto' || prop === 'ejecutado')
        data.value[row].saldo =
          (+data.value[row].presupuesto || 0) - (+data.value[row].ejecutado || 0)
    }
  })
}

const onSelect = (startRow, startCol) => {
  const h = hotTable.value?.hotInstance
  if (h) {
    selectedCell.value = h.getColHeader(startCol) + (startRow + 1)
    selectedValue.value = h.getDataAtCell(startRow, startCol)
  }
}

const addRow = () => {
  const newId = data.value.length > 0 ? Math.max(...data.value.map((r) => r.id)) + 1 : 1
  data.value.push({
    id: newId,
    codigo: '',
    nombre: '',
    tipo: '',
    area: '',
    resp: '',
    inicio: '',
    cierre: '',
    presupuesto: 0,
    ejecutado: 0,
    saldo: 0,
    fuente: '',
    prog: '0%',
    prioridad: 'Media',
    estado: 'PLAN',
    observaciones: '',
  })
}
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

.excel-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 38px;
  padding: 0 10px;
  background: #f1f3f4;
  border-bottom: 1px solid #c4c7c9;
}

.formula-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  background: #fff;
  border-bottom: 1px solid #c4c7c9;
}

.grid-area {
  flex: 1;
  overflow: hidden;
  background: #fff;
  min-height: 0;
}

.status-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  background: #f1f3f4;
  border-top: 1px solid #c4c7c9;
  font-size: 11px;
  color: #5f6368;
  gap: 8px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 2px;
}
.btn {
  padding: 5px 12px;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #444;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #d3d6da;
}
.btn.primary {
  color: #1a73e8;
  font-weight: 600;
}
.sep {
  width: 1px;
  height: 18px;
  background: #c4c7c9;
  margin: 0 6px;
}

.cell-ref {
  width: 65px;
  text-align: center;
  font-weight: 700;
  font-size: 11px;
  color: #5f6368;
  border-right: 1px solid #c4c7c9;
}
.cell-value {
  flex: 1;
  padding: 0 10px;
  font-size: 12px;
}

.mini-progress {
  width: 50px;
  height: 6px;
  background: #dadce0;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}
.mini-fill {
  height: 100%;
  background: #1a73e8;
  border-radius: 3px;
  transition: width 0.3s;
}
.c-green {
  color: #0d904f;
}
.c-red {
  color: #d93025;
}
b {
  font-weight: 600;
}
</style>
