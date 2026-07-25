// utils/accessControl.js
import { useUserStore } from '@/stores/user'

/**
 * SISTEMA DE CONTROL DE ACCESO POR ROLES Y ESTADOS
 *
 * Uso:
 *   import { puedeEditar } from '../utils'
 *   puedeEditar('actividad', 'presupuesto', 'EJEC')  // → false/true
 *
 * Extensibilidad:
 *   Agregar nuevo rol al objeto reglasActividad/reglasTarea
 *   Agregar nuevo estado a reglasEstadoActividad/reglasEstadoTarea
 */

/*
 * ═══════════════════════════════════════════════════════════════════════
 * TABLA DE PERMISOS - GRILLA DE ACTIVIDADES
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Leyenda: ✅ = Puede editar | ❌ = No puede editar
 *
 * | Columna             | admin | dir-admin | coordinador | contable | tecnico |
 * |---------------------|:-----:|:---------:|:-----------:|:--------:|:-------:|
 * | codigo              |   ✅  |    ✅     |     ❌      |    ❌    |   ❌    |
 * | nombreCorto         |   ✅  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | tipo_actividad      |   ✅  |    ✅     |     ✅      |    ✅    |   ✅    |
 * | responsable         |   ✅  |    ✅     |     ✅      |    ❌    |   ❌    |
 * | fecha_inicio        |   ✅  |    ✅     |     ✅      |    ❌    |   ❌    |
 * | fecha_cierre        |   ✅  |    ✅     |     ✅      |    ❌    |   ❌    |
 * | supuestos           |   ✅  |    ✅     |     ✅      |    ✅    |   ✅    |
 * | riesgos             |   ✅  |    ✅     |     ✅      |    ✅    |   ✅    |
 * | presupuesto         |   ✅  |    ✅     |     ❌      |    ✅    |   ❌    |
 * | totalEjecutado      |   ✅  |    ✅     |     ✅      |    ✅    |   ✅    |
 * | procedencia_fondos  |   ✅  |    ✅     |     ❌      |    ✅    |   ❌    |
 * | saldo               |   ✅  |    ✅     |     ✅      |    ✅    |   ✅    |
 * | estado              |   ✅  |    ✅     |     ✅      |    ❌    |   ❌    |
 *
 * ═══════════════════════════════════════════════════════════════════════
 * TABLA DE PERMISOS - GRILLA DE TAREAS
 * ═══════════════════════════════════════════════════════════════════════
 *
 * | Columna         | admin | dir-admin | coordinador | contable | tecnico |
 * |-----------------|:-----:|:---------:|:-----------:|:--------:|:-------:|
 * | codigo          |   ❌  |    ✅     |     ❌      |    ❌    |   ❌    |
 * | titulo          |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | descripcion     |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | presupuesto     |   ❌  |    ✅     |     ❌      |    ✅    |   ❌    |
 * | estado          |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | fecha_ejecucion |   ❌  |    ✅     |     ❌      |    ❌    |   ✅    |
 * | fecha_limite    |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 *
 * ═══════════════════════════════════════════════════════════════════════
 * RESTRICCIONES POR ESTADO - ACTIVIDADES
 * ═══════════════════════════════════════════════════════════════════════
 *
 * | Estado   | Columnas permitidas                                |
 * |----------|-----------------------------------------------------|
 * | FIN      | Ninguna                                             |
 * | EJEC     | totalEjecutado, riesgos, supuestos                  |
 * | REP      | totalEjecutado, riesgos, supuestos                  |
 * | RETR     | totalEjecutado, fecha_cierre, riesgos, supuestos    |
 * | REPROG   | totalEjecutado, fecha_cierre, riesgos, supuestos    |
 * | PLAN     | totalEjecutado, fecha_cierre, fecha_inicio,         |
 * |          | riesgos, supuestos                                  |
 * | CRD      | Todas                                               |
 *
 * ═══════════════════════════════════════════════════════════════════════
 * RESTRICCIONES POR ESTADO - TAREAS
 * ═══════════════════════════════════════════════════════════════════════
 *
 * | Estado | Columnas permitidas    |
 * |--------|------------------------|
 * | COMPL  | Ninguna                |
 * | EPROG  | estado, fecha_limite   |
 * | PEN    | Todas                  |
 */

// ═══════════════════════════════════════════════════════════
// ESTADOS DE ACTIVIDAD
// ═══════════════════════════════════════════════════════════
const ESTADOS_ACTIVIDAD = [
  { codigo: 'CRD', nombre: 'Creada' },
  { codigo: 'PLAN', nombre: 'Planificada' },
  { codigo: 'RETR', nombre: 'Retraso' },
  { codigo: 'REPROG', nombre: 'Reprogramacion' },
  { codigo: 'EJEC', nombre: 'En Ejecucion' },
  { codigo: 'REP', nombre: 'En Reporte' },
  { codigo: 'FIN', nombre: 'Finalizado' },
]

// ═══════════════════════════════════════════════════════════
// REGLAS POR ROL - GRILLA DE ACTIVIDADES
// ═══════════════════════════════════════════════════════════
const reglasActividad = {
  admin: {
    todas: true,
  },
  'dir-administrativo': {
    todas: true,
  },
  coordinador: {
    permitidas: [
      'fecha_inicio',
      'fecha_cierre',
      'responsable',
      'supuestos',
      'riesgos',
      'totalEjecutado',
      'nombreCorto',
      'tipo_actividad',
      'saldo',
      'estado',
    ],
    bloqueadas: ['presupuesto', 'codigo', 'procedencia_fondos'],
  },
  contable: {
    permitidas: [
      'presupuesto',
      'totalEjecutado',
      'procedencia_fondos',
      'supuestos',
      'riesgos',
      'tipo_actividad',
      'saldo',
    ],
    bloqueadas: ['codigo', 'nombreCorto', 'responsable', 'fecha_inicio', 'fecha_cierre', 'estado'],
  },
  tecnico: {
    permitidas: [
      'supuestos',
      'riesgos',
      'totalEjecutado',
      'nombreCorto',
      'tipo_actividad',
      'saldo',
    ],
    bloqueadas: [
      'presupuesto',
      'codigo',
      'fecha_inicio',
      'fecha_cierre',
      'responsable',
      'procedencia_fondos',
      'estado',
    ],
  },
}

// ═══════════════════════════════════════════════════════════
// REGLAS POR ROL - GRILLA DE TAREAS
// ═══════════════════════════════════════════════════════════
const reglasTarea = {
  admin: {
    todasBloqueadas: true,
  },
  'dir-administrativo': {
    todas: true,
  },
  coordinador: {
    permitidas: ['titulo', 'descripcion', 'estado', 'fecha_limite'],
    bloqueadas: ['presupuesto', 'codigo', 'fecha_ejecucion'],
  },
  contable: {
    permitidas: ['presupuesto'],
    bloqueadas: ['codigo', 'titulo', 'descripcion', 'estado', 'fecha_ejecucion', 'fecha_limite'],
  },
  tecnico: {
    permitidas: ['fecha_ejecucion', 'fecha_limite', 'titulo', 'descripcion', 'estado'],
    bloqueadas: ['presupuesto', 'codigo'],
  },
}

// ═══════════════════════════════════════════════════════════
// REGLAS POR ESTADO - ACTIVIDADES
// ═══════════════════════════════════════════════════════════
const reglasEstadoActividad = {
  FIN: {
    todasBloqueadas: true,
  },
  REP: {
    permitidas: ['totalEjecutado', 'riesgos', 'supuestos'],
  },
  EJEC: {
    permitidas: ['totalEjecutado', 'riesgos', 'supuestos'],
  },
  RETR: {
    permitidas: ['totalEjecutado', 'fecha_cierre', 'riesgos', 'supuestos'],
  },
  REPROG: {
    permitidas: ['totalEjecutado', 'fecha_cierre', 'riesgos', 'supuestos'],
  },
  PLAN: {
    permitidas: ['totalEjecutado', 'fecha_cierre', 'fecha_inicio', 'riesgos', 'supuestos'],
  },
  CRD: {
    todas: true,
  },
}

// ═══════════════════════════════════════════════════════════
// REGLAS POR ESTADO - TAREAS
// ═══════════════════════════════════════════════════════════
const reglasEstadoTarea = {
  COMPL: {
    todasBloqueadas: true,
  },
  EPROG: {
    permitidas: ['estado', 'fecha_limite'],
  },
}

// ═══════════════════════════════════════════════════════════
// FUNCIONES DE ACCESO
// ═══════════════════════════════════════════════════════════

/**
 * Verifica si el usuario puede editar una columna según su rol
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna (data)
 * @returns {boolean}
 */
export function puedeEditarColumna(tipoGrilla, columna) {
  const userStore = useUserStore()
  const rol = userStore.rol || 'tecnico'
  const reglas = tipoGrilla === 'actividad' ? reglasActividad : reglasTarea
  const regla = reglas[rol]

  if (!regla) return false
  if (regla.todas) return true
  if (regla.todasBloqueadas) return false
  if (regla.bloqueadas?.includes(columna)) return false
  if (regla.permitidas?.includes(columna)) return true

  return false
}

/**
 * Verifica si se puede editar según el estado del registro
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna
 * @param {string} estado - Estado actual
 * @returns {boolean}
 */
export function puedeEditarSegunEstado(tipoGrilla, columna, estado) {
  const reglas = tipoGrilla === 'actividad' ? reglasEstadoActividad : reglasEstadoTarea
  const regla = reglas[estado]

  if (!regla) return true
  if (regla.todas) return true
  if (regla.todasBloqueadas) return false
  if (regla.permitidas?.includes(columna)) return true

  return false
}

/**
 * Verifica ambos permisos: ROL + ESTADO en una sola llamada
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna
 * @param {string} estado - Estado del registro
 * @returns {boolean}
 */
export function puedeEditar(tipoGrilla, columna, estado) {
  if (!puedeEditarColumna(tipoGrilla, columna)) return false
  if (!puedeEditarSegunEstado(tipoGrilla, columna, estado)) return false
  return true
}

/**
 * Obtiene las columnas permitidas para el rol actual
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @returns {string[]} - Array vacío = todas permitidas
 */
export function columnasPermitidas(tipoGrilla) {
  const userStore = useUserStore()
  const rol = userStore.rol || 'tecnico'
  const reglas = tipoGrilla === 'actividad' ? reglasActividad : reglasTarea
  const regla = reglas[rol]

  if (!regla || regla.todasBloqueadas) return []
  if (regla.todas) return []
  return regla.permitidas || []
}

/**
 * Obtiene los estados de actividad
 * @returns {Array<{codigo: string, nombre: string}>}
 */
export function getEstadosActividad() {
  return ESTADOS_ACTIVIDAD
}

/**
 * Obtiene el nombre legible de un estado de actividad
 * @param {string} codigo - Código del estado
 * @returns {string}
 */
export function getNombreEstadoActividad(codigo) {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.codigo === codigo)
  return estado ? estado.nombre : codigo
}
