// utils/accessControl.js
import { useUserStore } from '@/stores/user'

/**
 * SISTEMA DE CONTROL DE ACCESO POR ROLES Y ESTADOS
 *
 * Uso principal:
 *   import { puedeEditar } from '../utils/accessControl'
 *   puedeEditar('actividad', 'presupuesto', 'EJEC')  // → true (ahora permitido)
 *
 * Extensibilidad:
 *   - Agregar nuevo rol: añadir entrada en reglasActividad/reglasTarea
 *   - Agregar nuevo estado: añadir entrada en reglasEstadoActividad/reglasEstadoTarea
 *
 *  Las capas de acceso se calculan con AND
 *
 *
 * /

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
 * | Columna             | admin | dir-admin | coordinador | contable | tecnico |
 * |---------------------|:-----:|:---------:|:-----------:|:--------:|:-------:|
 * | codigo              |   ❌  |    ✅     |     ❌      |    ❌    |   ❌    |
 * | titulo              |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | descripcion         |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | presupuesto         |   ❌  |    ✅     |     ❌      |    ✅    |   ❌    |
 * | estado              |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | fecha_creacion      |   ❌  |    ✅     |     ❌      |    ❌    |   ❌    |
 * | fecha_limite        |   ❌  |    ✅     |     ✅      |    ❌    |   ✅    |
 * | presupuestoDesglose |   ❌  |    ✅     |     ❌      |    ✅    |   ❌    |
 *
 * ═══════════════════════════════════════════════════════════════════════
 * RESTRICCIONES POR ESTADO - ACTIVIDADES (ACTUALIZADO)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * | Estado   | Columnas permitidas                                |
 * |----------|-----------------------------------------------------|
 * | FIN      | Ninguna                                             |
 * | EJEC     | presupuesto, totalEjecutado, riesgos, supuestos     |
 * | REP      | presupuesto, totalEjecutado, riesgos, supuestos     |
 * | RETR     | presupuesto, totalEjecutado, fecha_cierre,          |
 * |          | riesgos, supuestos                                  |
 * | REPROG   | presupuesto, totalEjecutado, fecha_cierre,          |
 * |          | riesgos, supuestos                                  |
 * | PLAN     | presupuesto, totalEjecutado, fecha_cierre,          |
 * |          | fecha_inicio, riesgos, supuestos                    |
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
      'presupuesto',
      'supuestos',
      'riesgos',
      'totalEjecutado',
      'nombreCorto',
      'tipo_actividad',
      'saldo',
      'fecha_inicio',
      'fecha_cierre',
    ],
    bloqueadas: ['codigo', 'responsable', 'procedencia_fondos', 'estado'],
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
    bloqueadas: ['presupuesto', 'codigo', 'fecha_creacion', 'presupuestoDesglose'],
  },
  contable: {
    permitidas: ['presupuesto', 'presupuestoDesglose'],
    bloqueadas: ['codigo', 'titulo', 'descripcion', 'estado', 'fecha_creacion', 'fecha_limite'],
  },
  tecnico: {
    permitidas: ['fecha_creacion', 'fecha_limite', 'titulo', 'descripcion', 'estado'],
    bloqueadas: ['presupuesto', 'codigo', 'presupuestoDesglose'],
  },
}

// ═══════════════════════════════════════════════════════════
// REGLAS POR ESTADO - ACTIVIDADES (ACTUALIZADO)
// ═══════════════════════════════════════════════════════════
const reglasEstadoActividad = {
  FIN: {
    todasBloqueadas: true,
  },
  REP: {
    permitidas: ['presupuesto', 'totalEjecutado', 'riesgos', 'supuestos'],
  },
  EJEC: {
    permitidas: ['presupuesto', 'totalEjecutado', 'riesgos', 'supuestos'],
  },
  RETR: {
    permitidas: ['presupuesto', 'totalEjecutado', 'fecha_cierre', 'riesgos', 'supuestos'],
  },
  REPROG: {
    permitidas: ['presupuesto', 'totalEjecutado', 'fecha_cierre', 'riesgos', 'supuestos'],
  },
  PLAN: {
    permitidas: [
      'presupuesto',
      'totalEjecutado',
      'fecha_cierre',
      'fecha_inicio',
      'riesgos',
      'supuestos',
      'tipo_actividad',
    ],
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
  PEN: {
    todas: true,
  },
}

// ═══════════════════════════════════════════════════════════
// FUNCIONES DE ACCESO
// ═══════════════════════════════════════════════════════════

/**
 * Verifica si el usuario puede editar una columna según su ROL.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre del campo (data) en la grilla
 * @returns {boolean} - true si el ROL permite editar esa columna
 *
 * @example
 *   puedeEditarColumna('actividad', 'presupuesto')  // admin → true, tecnico → false
 *   puedeEditarColumna('tarea', 'titulo')           // coordinador → true, contable → false
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
 * Verifica si se puede editar según el ESTADO del registro.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre del campo
 * @param {string} estado - Código del estado actual del registro
 * @returns {boolean} - true si el ESTADO permite editar esa columna
 *
 * @example
 *   puedeEditarSegunEstado('actividad', 'presupuesto', 'FIN')    // false
 *   puedeEditarSegunEstado('actividad', 'presupuesto', 'EJEC')   // true (actualizado)
 *   puedeEditarSegunEstado('tarea', 'titulo', 'COMPL')           // false
 *   puedeEditarSegunEstado('tarea', 'estado', 'EPROG')           // true
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
 * FUNCIÓN PRINCIPAL: Verifica ambos permisos (ROL + ESTADO) en una sola llamada.
 * Debe usarse en los handlers de cambio de la grilla.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre del campo
 * @param {string} estado - Código del estado del registro
 * @returns {boolean} - true si AMBAS condiciones (ROL y ESTADO) permiten editar
 *
 * @example
 *   puedeEditar('actividad', 'presupuesto', 'EJEC')
 *   // admin + EJEC → true (rol permite, estado ahora permite presupuesto)
 *   // tecnico + EJEC → false (rol no permite presupuesto)
 *   // contable + EJEC → true (rol permite presupuesto, estado ahora lo permite)
 *   // admin + FIN → false (estado bloquea todo)
 */
export function puedeEditar(tipoGrilla, columna, estado) {
  if (!puedeEditarColumna(tipoGrilla, columna)) return false
  if (!puedeEditarSegunEstado(tipoGrilla, columna, estado)) return false
  return true
}

/**
 * Obtiene las columnas permitidas para el rol actual.
 * Útil para configurar readOnly en la definición de columnas de la grilla.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @returns {string[]} - Array vacío = TODAS las columnas son permitidas
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
 * Obtiene los estados de actividad definidos en el sistema.
 * @returns {Array<{codigo: string, nombre: string}>}
 */
export function getEstadosActividad() {
  return ESTADOS_ACTIVIDAD
}

/**
 * Obtiene el nombre legible de un estado de actividad a partir de su código.
 * @param {string} codigo - Código del estado (ej: 'EJEC')
 * @returns {string} - Nombre legible (ej: 'En Ejecucion')
 */
export function getNombreEstadoActividad(codigo) {
  const estado = ESTADOS_ACTIVIDAD.find((e) => e.codigo === codigo)
  return estado ? estado.nombre : codigo
}
