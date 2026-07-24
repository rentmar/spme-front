// ========== composables/useExcelData.js ==========
import { ref, computed } from 'vue'

export function useExcelData() {
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
      area: 'Educación',
      fuente: 'TGN',
      prioridad: 'Baja',
      observaciones: 'Completado',
    },
  ]

  const data = ref(init.map((r) => ({ ...r })))

  const tareasDummy = ref([
    { nombre: 'Preparar material audiovisual', presupuesto: 3000, estado: 'Completado' },
    { nombre: 'Grabar sesiones de capacitación', presupuesto: 5000, estado: 'En progreso' },
    { nombre: 'Editar video final', presupuesto: 7000, estado: 'Pendiente' },
  ])

  const tareasGridData = ref([
    {
      id: 1,
      codigo: 'TAR-001',
      actividad: 'ACT001 - Seminario Video',
      nombre: 'Preparar material',
      inicio: '2026-01-15',
      cierre: '2026-01-30',
      presupuesto: 3000,
      estado: 'Completado',
    },
    {
      id: 2,
      codigo: 'TAR-002',
      actividad: 'ACT001 - Seminario Video',
      nombre: 'Grabar sesiones',
      inicio: '2026-02-01',
      cierre: '2026-03-15',
      presupuesto: 5000,
      estado: 'En progreso',
    },
    {
      id: 3,
      codigo: 'TAR-003',
      actividad: 'ACT001 - Seminario Video',
      nombre: 'Editar video',
      inicio: '2026-03-16',
      cierre: '2026-04-30',
      presupuesto: 7000,
      estado: 'Pendiente',
    },
  ])

  const tareasColumns = ref([
    { data: 'id', title: '#', type: 'numeric', width: 40 },
    { data: 'codigo', title: 'Código', width: 90 },
    { data: 'actividad', title: 'Actividad', width: 220 },
    { data: 'nombre', title: 'Tarea', width: 180 },
    { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
    { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
    {
      data: 'presupuesto',
      title: 'Presupuesto',
      type: 'numeric',
      width: 110,
      numericFormat: { pattern: '0,0.00' },
    },
    { data: 'estado', title: 'Estado', width: 100 },
  ])

  const fuentesDummy = [
    { nombre: 'TGN', monto: 150000, color: '#1a73e8' },
    { nombre: 'IDH', monto: 95000, color: '#0d904f' },
    { nombre: 'Propios', monto: 63000, color: '#e65100' },
    { nombre: 'MISEREOR', monto: 42000, color: '#5c2d91' },
  ]

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
  const estadoColor = (e) =>
    ({
      EJEC: 'info',
      PLAN: 'warning',
      FIN: 'success',
      DES: 'error',
      Completado: 'success',
      'En progreso': 'info',
      Pendiente: 'warning',
      APROBADO: 'success',
      PENDIENTE: 'warning',
      RECHAZADO: 'error',
    })[e] || 'default'

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
      prioridad: 'Media',
      estado: 'PLAN',
      observaciones: '',
    })
  }

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
    // se maneja en el padre
  }

  return {
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
    onSelect,
  }
}
