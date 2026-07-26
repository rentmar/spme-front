// composables/useExcelData.js
//Maneja la informacion de las grillas
import { ref, computed } from 'vue'
// import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore'
import { useSeguimientoCambios } from './useSeguimientoCambios'
//renders
import { tablaRenders } from '../utils'
import { puedeEditar } from '../utils'
export function useExcelData() {
  //inicia el store
  //const store = usePlanificacionExcelStore()
  //Inicia el composable
  const seguimiento = useSeguimientoCambios()

  //Estados de las grillas
  const tablaDataActividades = ref([])
  const tablaDataTareas = ref([])

  //Datos de prueba - tareas
  const tareasDummy = ref([
    { nombre: 'Preparar material audiovisual', presupuesto: 3000, estado: 'Completado' },
    { nombre: 'Grabar sesiones de capacitación', presupuesto: 5000, estado: 'En progreso' },
    { nombre: 'Editar video final', presupuesto: 7000, estado: 'Pendiente' },
  ])

  //Definicion de las columnas para la grilla de tareas
  const tareasColumns = ref([
    { data: 'id', title: '#', type: 'numeric', width: 40 },
    { data: 'codigo', title: 'Código', width: 90 },
    { data: 'titulo', title: 'Titulo', width: 180 },
    { data: 'descripcion', title: 'Descripcion', width: 220 },
    {
      data: 'fecha_creacion',
      title: 'Fecha Inicio',
      type: 'date',
      width: 100,
      dateFormat: 'YYYY-MM-DD',
    },
    {
      data: 'fecha_limite',
      title: 'Fecha Cierre',
      type: 'date',
      width: 100,
      dateFormat: 'YYYY-MM-DD',
    },
    {
      data: 'presupuesto',
      title: 'Presupuesto',
      type: 'numeric',
      width: 110,
      numericFormat: { pattern: '0,0.00' },
    },
    { data: 'presupuestoDesglose', title: 'Desglose Presupuesto', width: 250 },
    { data: 'estado', title: 'Estado', width: 100 },
    { data: 'actividad', title: 'Actividad', width: 220 },
  ])

  //Datos de prueba para las fuentes de financiamiento
  const fuentesDummy = [
    { nombre: 'TGN', monto: 150000, color: '#1a73e8' },
    { nombre: 'IDH', monto: 95000, color: '#0d904f' },
    { nombre: 'Propios', monto: 63000, color: '#e65100' },
    { nombre: 'MISEREOR', monto: 42000, color: '#5c2d91' },
  ]

  //Definicion de las columnas de la grilla actividades
  const columns = ref([
    { data: 'id', title: 'ID', type: 'numeric', readOnly: true, width: 40 },
    {
      data: 'codigo',
      title: 'Código',
      width: 90,
      renderer: tablaRenders.celdaSuccess,
    },
    { data: 'nombreCorto', title: 'Nombre', width: 180 },
    { data: 'tipo_actividad', title: 'Tipo', width: 120 },
    { data: 'responsable', title: 'Responsable', width: 110 },
    { data: 'fecha_inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
    { data: 'fecha_cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
    { data: 'supuestos', title: 'Supuestos', width: 100 },
    { data: 'riesgos', title: 'Riesgos', width: 100 },
    {
      data: 'presupuesto',
      title: 'Presupuesto',
      type: 'numeric',
      width: 110,
      numericFormat: { pattern: '0,0.00' },
    },
    { data: 'procedencia_fondos', title: 'Proc. Fondos', width: 250 },
    {
      data: 'presupuestoGlobal',
      title: 'Presupuesto Global',
      type: 'numeric',
      width: 150,
      numericFormat: {
        pattern: '0,0.00',
      },
    },
    {
      data: 'totalReportado',
      title: 'Total Reportado',
      type: 'numeric',
      readOnly: true,
      width: 150,
      numericFormat: {
        pattern: '0,0.00',
      },
    },
    {
      data: 'totalEjecutado',
      title: 'Total Ejecutado',
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
    {
      data: 'estado',
      type: 'text',
      title: 'ESTADO',
      width: 150,
      readOnly: true,
    },
    {
      data: 'gradoEjecucion',
      type: 'dropdown',
      title: 'Grado Ejecucion',
      readOnly: true,
      width: 150,
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
    {
      data: 'factoresCriticos',
      title: 'Factores criticos',
      readOnly: true,
      width: 150,
    },
  ])

  //Calculo del total planificado
  const totalPlan = computed(() =>
    tablaDataActividades.value.reduce((s, r) => s + (+r.presupuesto || 0), 0),
  )

  //Calculo del total ejecutado
  const totalEjec = computed(() =>
    tablaDataActividades.value.reduce((s, r) => s + (+r.totalEjecutado || 0), 0),
  )

  //Calculo del saldo
  const saldo = computed(() => totalPlan.value - totalEjec.value)

  //POrcentaje de ejecucion
  const pct = computed(() =>
    totalPlan.value ? +((totalEjec.value / totalPlan.value) * 100).toFixed(1) : 0,
  )

  //Formateo de la moneda
  const fmt = (n) => (+(n || 0)).toLocaleString('es-BO', { minimumFractionDigits: 2 })

  //Defincion del color de los estados
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

  //Agregar nueva fila - se registra
  const addRow = () => {
    const arr = tablaDataActividades.value
    const newId = arr.length > 0 ? Math.max(...arr.map((r) => r.id)) + 1 : 1
    const nuevaFila = {
      id: newId,
      codigo: '',
      nombreCorto: '',
      tipo: '',
      responsable: '',
      fecha_inicio: '',
      fecha_cierre: '',
      presupuesto: 0,
      totalEjecutado: 0,
      saldo: 0,
      estado: 'PLAN',
    }
    arr.push(nuevaFila)

    //Registro del cambio
    seguimiento.registrarCambio({
      tipo: 'actividad',
      accion: 'agregar',
      fila_id: newId,
      columna: 'todo',
      valor_anterior: null,
      valor_nuevo: JSON.stringify(nuevaFila),
      actividad_codigo: '',
      actividad_id: newId,
    })
  }

  //Funcion registro de cambio - Grilla Actividades
  const onChange = (changes, source) => {
    if (source === 'loadData') return
    if (!changes) return

    changes.forEach(([row, prop, oldVal, newVal]) => {
      if (row >= tablaDataActividades.value.length) return
      if (String(oldVal) === String(newVal)) return

      const val = prop === 'presupuesto' || prop === 'totalEjecutado' ? +newVal || 0 : newVal

      tablaDataActividades.value[row][prop] = val

      if (prop === 'presupuesto' || prop === 'totalEjecutado') {
        tablaDataActividades.value[row].saldo =
          (+tablaDataActividades.value[row].presupuesto || 0) -
          (+tablaDataActividades.value[row].totalEjecutado || 0)
      }

      if (seguimiento.esColumnaRastreable('actividad', prop)) {
        seguimiento.registrarCambio({
          tipo: 'actividad',
          accion: 'editar',
          fila_id: tablaDataActividades.value[row].id,
          columna: prop,
          valor_anterior: oldVal,
          valor_nuevo: val,
          actividad_codigo: tablaDataActividades.value[row].codigo,
          actividad_id: tablaDataActividades.value[row].id,
        })
      }
    })
  }

  //Funcion registro de cambio - Grilla Tareas
  const onChangeTareas = (changes, source) => {
    if (source === 'loadData') return
    if (!changes) return

    changes.forEach(([row, prop, oldVal, newVal]) => {
      if (row >= tablaDataTareas.value.length) return
      if (String(oldVal) === String(newVal)) return

      const val = prop === 'presupuesto' ? +newVal || 0 : newVal
      tablaDataTareas.value[row][prop] = val

      if (seguimiento.esColumnaRastreable('tarea', prop)) {
        seguimiento.registrarCambio({
          tipo: 'tarea',
          accion: 'editar',
          fila_id: tablaDataTareas.value[row].id,
          columna: prop,
          valor_anterior: oldVal,
          valor_nuevo: val,
          actividad_codigo: tablaDataTareas.value[row].actividad_codigo || '',
          actividad_id: tablaDataTareas.value[row].actividad || null,
          tarea_codigo: tablaDataTareas.value[row].codigo || '',
        })
      }
    })
  }

  return {
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
    fmt,
    estadoColor,
    addRow,
    onChange,
    onChangeTareas,
    seguimiento,
  }
}
// // ========== composables/useExcelData.js ==========
// import { ref, computed } from 'vue'

// export function useExcelData() {
//   const init = [
//     {
//       id: 1,
//       codigo: 'ACT001',
//       nombre: 'Seminario Video',
//       tipo: 'Capacitacion',
//       resp: 'jperez',
//       inicio: '2026-01-15',
//       cierre: '2026-06-30',
//       presupuesto: 15000,
//       ejecutado: 8500,
//       saldo: 6500,
//       estado: 'EJEC',
//       area: 'Educación',
//       fuente: 'TGN',
//       prioridad: 'Alta',
//       observaciones: 'En curso',
//     },
//     {
//       id: 2,
//       codigo: 'ACT002',
//       nombre: 'Reunion Asociados',
//       tipo: 'Articulacion',
//       resp: 'mlopez',
//       inicio: '2026-02-01',
//       cierre: '2026-04-15',
//       presupuesto: 20000,
//       ejecutado: 12000,
//       saldo: 8000,
//       estado: 'EJEC',
//       area: 'Social',
//       fuente: 'IDH',
//       prioridad: 'Media',
//       observaciones: '',
//     },
//     {
//       id: 3,
//       codigo: 'ACT003',
//       nombre: 'Captacion Org',
//       tipo: 'Operativa',
//       resp: 'cruiz',
//       inicio: '2026-03-01',
//       cierre: '2026-12-31',
//       presupuesto: 25000,
//       ejecutado: 0,
//       saldo: 25000,
//       estado: 'PLAN',
//       area: 'Desarrollo',
//       fuente: 'Propios',
//       prioridad: 'Alta',
//       observaciones: 'Pendiente',
//     },
//     {
//       id: 4,
//       codigo: 'ACT004',
//       nombre: 'Seminario Actualizacion',
//       tipo: 'Capacitacion',
//       resp: 'atorres',
//       inicio: '2026-01-01',
//       cierre: '2026-03-30',
//       presupuesto: 10000,
//       ejecutado: 10000,
//       saldo: 0,
//       estado: 'FIN',
//       area: 'Educación',
//       fuente: 'TGN',
//       prioridad: 'Baja',
//       observaciones: 'Completado',
//     },
//   ]

//   const data = ref(init.map((r) => ({ ...r })))

//   const tareasDummy = ref([
//     { nombre: 'Preparar material audiovisual', presupuesto: 3000, estado: 'Completado' },
//     { nombre: 'Grabar sesiones de capacitación', presupuesto: 5000, estado: 'En progreso' },
//     { nombre: 'Editar video final', presupuesto: 7000, estado: 'Pendiente' },
//   ])

//   const tareasGridData = ref([
//     {
//       id: 1,
//       codigo: 'TAR-001',
//       actividad: 'ACT001 - Seminario Video',
//       nombre: 'Preparar material',
//       inicio: '2026-01-15',
//       cierre: '2026-01-30',
//       presupuesto: 3000,
//       estado: 'Completado',
//     },
//     {
//       id: 2,
//       codigo: 'TAR-002',
//       actividad: 'ACT001 - Seminario Video',
//       nombre: 'Grabar sesiones',
//       inicio: '2026-02-01',
//       cierre: '2026-03-15',
//       presupuesto: 5000,
//       estado: 'En progreso',
//     },
//     {
//       id: 3,
//       codigo: 'TAR-003',
//       actividad: 'ACT001 - Seminario Video',
//       nombre: 'Editar video',
//       inicio: '2026-03-16',
//       cierre: '2026-04-30',
//       presupuesto: 7000,
//       estado: 'Pendiente',
//     },
//   ])

//   const tareasColumns = ref([
//     { data: 'id', title: '#', type: 'numeric', width: 40 },
//     { data: 'codigo', title: 'Código', width: 90 },
//     { data: 'actividad', title: 'Actividad', width: 220 },
//     { data: 'nombre', title: 'Tarea', width: 180 },
//     { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
//     { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
//     {
//       data: 'presupuesto',
//       title: 'Presupuesto',
//       type: 'numeric',
//       width: 110,
//       numericFormat: { pattern: '0,0.00' },
//     },
//     { data: 'estado', title: 'Estado', width: 100 },
//   ])

//   const fuentesDummy = [
//     { nombre: 'TGN', monto: 150000, color: '#1a73e8' },
//     { nombre: 'IDH', monto: 95000, color: '#0d904f' },
//     { nombre: 'Propios', monto: 63000, color: '#e65100' },
//     { nombre: 'MISEREOR', monto: 42000, color: '#5c2d91' },
//   ]

//   const columns = ref([
//     { data: 'id', title: '#', type: 'numeric', width: 40 },
//     { data: 'codigo', title: 'Código', width: 90 },
//     { data: 'nombre', title: 'Nombre', width: 180 },
//     { data: 'tipo', title: 'Tipo', width: 120 },
//     { data: 'area', title: 'Área', width: 110 },
//     { data: 'resp', title: 'Resp.', width: 80 },
//     { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
//     { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
//     {
//       data: 'presupuesto',
//       title: 'Presupuesto',
//       type: 'numeric',
//       width: 110,
//       numericFormat: { pattern: '0,0.00' },
//     },
//     {
//       data: 'ejecutado',
//       title: 'Ejecutado',
//       type: 'numeric',
//       width: 110,
//       numericFormat: { pattern: '0,0.00' },
//     },
//     {
//       data: 'saldo',
//       title: 'Saldo',
//       type: 'numeric',
//       width: 110,
//       numericFormat: { pattern: '0,0.00' },
//     },
//     { data: 'fuente', title: 'Fuente', width: 90 },
//     { data: 'prioridad', title: 'Prioridad', width: 80 },
//     { data: 'estado', title: 'Estado', width: 70 },
//     { data: 'observaciones', title: 'Observaciones', width: 180 },
//   ])

//   const totalPlan = computed(() => data.value.reduce((s, r) => s + (+r.presupuesto || 0), 0))
//   const totalEjec = computed(() => data.value.reduce((s, r) => s + (+r.ejecutado || 0), 0))
//   const saldo = computed(() => totalPlan.value - totalEjec.value)
//   const pct = computed(() =>
//     totalPlan.value ? +((totalEjec.value / totalPlan.value) * 100).toFixed(1) : 0,
//   )
//   const fmt = (n) => (+n).toLocaleString('es-BO', { minimumFractionDigits: 2 })
//   const estadoColor = (e) =>
//     ({
//       EJEC: 'info',
//       PLAN: 'warning',
//       FIN: 'success',
//       DES: 'error',
//       Completado: 'success',
//       'En progreso': 'info',
//       Pendiente: 'warning',
//       APROBADO: 'success',
//       PENDIENTE: 'warning',
//       RECHAZADO: 'error',
//     })[e] || 'default'

//   const addRow = () => {
//     const newId = data.value.length > 0 ? Math.max(...data.value.map((r) => r.id)) + 1 : 1
//     data.value.push({
//       id: newId,
//       codigo: '',
//       nombre: '',
//       tipo: '',
//       area: '',
//       resp: '',
//       inicio: '',
//       cierre: '',
//       presupuesto: 0,
//       ejecutado: 0,
//       saldo: 0,
//       fuente: '',
//       prioridad: 'Media',
//       estado: 'PLAN',
//       observaciones: '',
//     })
//   }

//   const onChange = (changes, source) => {
//     if (source === 'loadData') return
//     changes.forEach(([row, prop, , val]) => {
//       if (row < data.value.length) {
//         data.value[row][prop] = prop === 'presupuesto' || prop === 'ejecutado' ? +val || 0 : val
//         if (prop === 'presupuesto' || prop === 'ejecutado')
//           data.value[row].saldo =
//             (+data.value[row].presupuesto || 0) - (+data.value[row].ejecutado || 0)
//       }
//     })
//   }

//   const onSelect = (startRow, startCol) => {
//     // se maneja en el padre
//   }

//   return {
//     data,
//     columns,
//     tareasDummy,
//     tareasGridData,
//     tareasColumns,
//     fuentesDummy,
//     totalPlan,
//     totalEjec,
//     saldo,
//     pct,
//     fmt,
//     estadoColor,
//     addRow,
//     onChange,
//     onSelect,
//   }
// }
