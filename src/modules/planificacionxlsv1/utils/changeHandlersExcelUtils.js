// utils/changeHandlersExcelUtils.js
import { useSnackbar } from '@/composables/useSnackbar'

const snackbar = useSnackbar()

/**
 * SISTEMA DE HANDLERS DE CAMBIO POR TIPO DE GRILLA
 *
 * Los handlers se ejecutan DESPUÉS de validar el acceso y aplicar el valor,
 * pero ANTES de registrar el cambio en el sistema de seguimiento.
 *
 * Responsabilidades:
 *   - Recalcular campos derivados (saldo, gradoEjecucion)
 *   - Validar reglas de negocio (fechas)
 *   - Notificar/registrar cambios de estado
 *   - Actualizar campos dependientes
 *
 * Si un handler retorna false, el cambio se revierte y no se registra.
 *
 * Uso:
 *   import { ejecutarHandlers } from '@/utils'
 *   ejecutarHandlers('actividad', 'presupuesto', row, oldVal, newVal, tableData)
 */

// ═══════════════════════════════════════════════════════════
// HANDLERS - GRILLA DE ACTIVIDADES
// ═══════════════════════════════════════════════════════════

/**
 * Recalcula el saldo de una actividad.
 * Fórmula: saldo = presupuesto - totalEjecutado
 * Se dispara al cambiar presupuesto, totalEjecutado o totalReportado.
 */
function recalcularSaldoActividad(row, oldVal, newVal, tableData) {
  const actividad = tableData.value[row]
  const presupuesto = +actividad.presupuesto || 0
  const totalEjecutado = +actividad.totalEjecutado || 0
  actividad.saldo = presupuesto - totalEjecutado
}

/**
 * Actualiza presupuestoGlobal cuando cambia presupuesto.
 * Si la actividad no tiene presupuestoGlobal definido (null/undefined),
 * hereda automáticamente el valor de presupuesto.
 */
function actualizarPresupuestoGlobal(row, oldVal, newVal, tableData) {
  const actividad = tableData.value[row]
  if (actividad.presupuestoGlobal === undefined || actividad.presupuestoGlobal === null) {
    actividad.presupuestoGlobal = +newVal || 0
  }
}

/**
 * Actualiza el grado de ejecución (literal legible) basado en el código de estado.
 *
 * Mapeo de códigos a literales:
 *   CRD, PLAN → 'PLANIFICADA'
 *   RETR      → 'RETRASO'
 *   REPROG    → 'REPROGRAMACION'
 *   EJEC      → 'EN EJECUCION'
 *   REP       → 'EN REPORTE'
 *   FIN       → 'FINALIZADO'
 */
function actualizarGradoEjecucionDesdeEstado(row, oldVal, newVal, tableData) {
  const gradoMap = {
    CRD: 'PLANIFICADA',
    PLAN: 'PLANIFICADA',
    RETR: 'RETRASO',
    REPROG: 'REPROGRAMACION',
    EJEC: 'EN EJECUCION',
    REP: 'EN REPORTE',
    FIN: 'FINALIZADO',
  }
  tableData.value[row].gradoEjecucion = gradoMap[newVal] || newVal
}

/**
 * Valida que fecha_cierre no sea menor a fecha_inicio.
 * Si la validación falla, REVIERTE el cambio y emite warning en consola.
 *
 * @returns {boolean} - false si la validación falla
 */
function validarFechasActividad(row, oldVal, newVal, tableData) {
  const actividad = tableData.value[row]
  if (actividad.fecha_inicio && actividad.fecha_cierre) {
    if (new Date(actividad.fecha_cierre) < new Date(actividad.fecha_inicio)) {
      console.warn(`Actividad #${actividad.id}: fecha_cierre no puede ser menor a fecha_inicio`)
      actividad.fecha_cierre = oldVal
      return false
    }
  }
  return true
}

function validarPresupuestoActividad(row, oldVal, newVal, tableData, store) {
  const presupuestoProyecto = +store.presupuestoProyecto || 0
  if (presupuestoProyecto === 0) return

  const totalActividades = tableData.value
    .filter((_, i) => i !== row)
    .filter((r) => r.id !== null && r.id !== undefined) // excluir placeholder
    .reduce((s, r) => s + (+r.presupuesto || 0), 0)

  if (totalActividades + (+newVal || 0) > presupuestoProyecto) {
    snackbar.errorMsg(
      `Presupuesto excedido: Bs ${totalActividades + +newVal} de Bs ${presupuestoProyecto}`,
    )
    tableData.value[row].presupuesto = oldVal
    return false
  }
}

//Valida el presupuesto de la actividad, no debe ser mayor que el presupuesto del proyecto
function validarPresupuestoTarea(row, oldVal, newVal, tableData, store) {
  const tarea = tableData.value[row]
  const actividad = store.actividades?.find((a) => a.id === tarea.actividad)
  const presupuestoActividad = +actividad?.presupuesto || 0
  if (presupuestoActividad === 0) return

  const totalTareas = tableData.value
    .filter((_, i) => i !== row)
    .filter((t) => t.actividad === tarea.actividad)
    .reduce((s, t) => s + (+t.presupuesto || 0), 0)

  if (totalTareas + (+newVal || 0) > presupuestoActividad) {
    snackbar.error(`Presupuesto de tareas excede el de la actividad: Bs ${presupuestoActividad}`)
    tableData.value[row].presupuesto = oldVal
    return false
  }
}

/**
 * Actualiza el ID del tipo de actividad cuando cambia el texto del tipo.
 * Busca en el store el tipo correspondiente por nombre y asigna su ID.
 */
function actualizarTipoActividadId(row, oldVal, newVal, tableData, store) {
  const tipo = store.tiposActividad?.find((t) => `${t.sigla}-${t.tipo_actividad}` === newVal)
  if (tipo) {
    tableData.value[row].tipo_actividad_id = tipo.id
  }
}
// function actualizarTipoActividadId(row, oldVal, newVal, tableData, store) {
//   if (store && store.tiposActividad) {
//     const tipo = store.tiposActividad.find((t) => t.nombre === newVal)
//     if (tipo) {
//       tableData.value[row].tipo_actividad_id = tipo.id
//     }
//   }
// }

/**
 * Actualiza el estado de la actividad según fechas.
 * Reglas:
 *   - CRD + ambas fechas → PLAN
 *   - PLAN + modificar fechas → permitido con warning de justificativo
 *   - PLAN + fecha_inicio > hoy → RETR (auto)
 *   - PLAN + fecha_cierre < hoy → RETR (auto)
 *   - RETR + modificar fechas → REPROG
 */
function actualizarEstadoPorFechas(row, oldVal, newVal, tableData) {
  const actividad = tableData.value[row]
  const { fecha_inicio, fecha_cierre, estado } = actividad
  const hoy = new Date().toISOString().split('T')[0]

  if (!fecha_inicio && !fecha_cierre) return

  // CRD → PLAN (con confirmación)
  if (estado === 'CRD' && fecha_inicio && fecha_cierre) {
    const confirmado = confirm(
      `¿Fijar actividad en PLANIFICACIÓN?\n\n` +
        `Al planificar, ciertos campos quedarán bloqueados:\n` +
        `- Solo podrá editar: presupuesto, totalEjecutado, fechas, riesgos y supuestos.\n\n` +
        `¿Desea continuar?`,
    )
    if (!confirmado) return

    actividad.estado = 'PLAN'
    actividad.gradoEjecucion = 'PLANIFICADA'
    snackbar.success('Actividad planificada correctamente')
    return
  }

  // PLAN → permitir cambio con advertencia
  if (estado === 'PLAN') {
    snackbar.warning('Cambio de fechas registrado. Debe añadir un justificativo.', 5000)
    return
  }

  // RETR → REPROG
  if (estado === 'RETR' && fecha_inicio && fecha_cierre) {
    actividad.estado = 'REPROG'
    actividad.gradoEjecucion = 'REPROGRAMACION'
    snackbar.info('Actividad reprogramada', 3000)
    return
  }

  // Auto: fecha_inicio futura → RETR
  if (fecha_inicio && fecha_inicio > hoy && estado === 'PLAN') {
    actividad.estado = 'RETR'
    actividad.gradoEjecucion = 'RETRASO'
    snackbar.error('Actividad en RETRASO: fecha de inicio superior a la fecha actual', 5000)
    return
  }

  // Auto: fecha_cierre vencida → RETR
  if (fecha_cierre && fecha_cierre < hoy && estado === 'PLAN') {
    actividad.estado = 'RETR'
    actividad.gradoEjecucion = 'RETRASO'
    snackbar.error('Actividad en RETRASO: fecha de cierre vencida', 5000)
  }
}
// Mapa de handlers para ACTIVIDADES
const actividadHandlers = {
  presupuesto: [validarPresupuestoActividad, recalcularSaldoActividad, actualizarPresupuestoGlobal],
  totalEjecutado: [recalcularSaldoActividad],
  totalReportado: [recalcularSaldoActividad],
  estado: [actualizarGradoEjecucionDesdeEstado],
  fecha_cierre: [actualizarEstadoPorFechas, validarFechasActividad],
  fecha_inicio: [actualizarEstadoPorFechas, validarFechasActividad],
  tipo_actividad: [actualizarTipoActividadId],
}

// ═══════════════════════════════════════════════════════════
// HANDLERS - GRILLA DE TAREAS
// ═══════════════════════════════════════════════════════════

/**
 * Notifica el cambio de estado de una tarea.
 * Registra en consola y, si el store tiene el método notificarCambioEstado,
 * delega la notificación al store.
 *
 * Estados posibles (según modelo TareaActividad):
 *   PEN   → Pendiente
 *   EPROG → En Progreso
 *   COMPL → Completada
 */
function notificarCambioEstadoTarea(row, oldVal, newVal, tableData, store) {
  const tarea = tableData.value[row]
  console.log(`Tarea "${tarea.titulo}" cambió de "${oldVal}" a "${newVal}"`)

  if (store && store.notificarCambioEstado) {
    store.notificarCambioEstado('tarea', tarea.id, oldVal, newVal)
  }
}

/**
 * Valida que fecha_limite no sea menor a fecha_creacion.
 * Si la validación falla, REVIERTE el cambio a oldVal.
 *
 * @returns {boolean} - false si la validación falla
 */
function validarFechaLimite(row, oldVal, newVal, tableData) {
  const tarea = tableData.value[row]
  if (newVal && tarea.fecha_creacion) {
    if (new Date(newVal) < new Date(tarea.fecha_creacion)) {
      console.warn(`Tarea #${tarea.id}: fecha_limite no puede ser menor a fecha_creacion`)
      tableData.value[row].fecha_limite = oldVal
      return false
    }
  }
  return true
}

/**
 * Ajusta fecha_limite automáticamente si fecha_creacion la supera.
 */
function ajustarFechaLimitePorCreacion(row, oldVal, newVal, tableData) {
  const tarea = tableData.value[row]
  if (tarea.fecha_limite && new Date(newVal) > new Date(tarea.fecha_limite)) {
    tarea.fecha_limite = newVal
  }
}

// Mapa de handlers para TAREAS
const tareaHandlers = {
  estado: [notificarCambioEstadoTarea],
  fecha_limite: [validarFechaLimite],
  fecha_creacion: [ajustarFechaLimitePorCreacion],
}

// ═══════════════════════════════════════════════════════════
// HANDLERS COMUNES (AMBAS GRILLAS)
// ═══════════════════════════════════════════════════════════

const commonHandlers = {
  // Reservado para handlers que aplican a ambas grillas
  // Actualmente vacío
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL DE EJECUCIÓN
// ═══════════════════════════════════════════════════════════

/**
 * Ejecuta todos los handlers correspondientes a una columna modificada.
 * Los handlers se ejecutan en secuencia. Si alguno retorna false,
 * se detiene la cadena y se retorna false.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna modificada
 * @param {number} row - Índice de la fila en tableData
 * @param {*} oldVal - Valor anterior al cambio
 * @param {*} newVal - Valor nuevo después del cambio
 * @param {Ref} tableData - Referencia reactiva a los datos de la tabla
 * @param {Object} [store=null] - Store de planificación (opcional)
 * @returns {boolean} - true si todos los handlers se ejecutaron correctamente
 *
 * @example
 *   import { ejecutarHandlers } from '@/utils'
 *   const ok = ejecutarHandlers('actividad', 'presupuesto', 0, 1000, 2000, tablaDataActividades)
 *   if (!ok) {
 *     // El cambio fue revertido por un handler de validación
 *   }
 */
export function ejecutarHandlers(
  tipoGrilla,
  columna,
  row,
  oldVal,
  newVal,
  tableData,
  store = null,
) {
  // 1. Seleccionar el mapa de handlers según tipo de grilla
  const handlers =
    tipoGrilla === 'actividad'
      ? { ...commonHandlers, ...actividadHandlers }
      : { ...commonHandlers, ...tareaHandlers }

  // 2. Obtener los handlers para esta columna
  const handlersColumna = handlers[columna]

  // 3. Si no hay handlers registrados, retornar true
  if (!handlersColumna || handlersColumna.length === 0) {
    return true
  }

  // 4. Ejecutar cada handler en secuencia
  for (const handler of handlersColumna) {
    try {
      const resultado = handler(row, oldVal, newVal, tableData, store)
      if (resultado === false) {
        return false
      }
    } catch (error) {
      console.error(`Error en handler "${handler.name}" para columna "${columna}":`, error)
      return false
    }
  }

  return true
}

/**
 * Verifica si una columna tiene handlers registrados.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna
 * @returns {boolean}
 */
export function tieneHandlers(tipoGrilla, columna) {
  const handlers =
    tipoGrilla === 'actividad'
      ? { ...commonHandlers, ...actividadHandlers }
      : { ...commonHandlers, ...tareaHandlers }

  return columna in handlers
}

/**
 * Obtiene la lista de columnas que tienen handlers registrados.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @returns {string[]}
 */
export function columnasConHandlers(tipoGrilla) {
  const handlers =
    tipoGrilla === 'actividad'
      ? { ...commonHandlers, ...actividadHandlers }
      : { ...commonHandlers, ...tareaHandlers }

  return Object.keys(handlers)
}

/**
 * Registra un nuevo handler para una columna específica.
 * Útil para extender el sistema sin modificar el archivo original.
 *
 * @param {string} tipoGrilla - 'actividad' | 'tarea'
 * @param {string} columna - Nombre de la columna
 * @param {Function} handler - Función handler a registrar
 *
 * @example
 *   import { registrarHandler } from '@/utils'
 *   registrarHandler('actividad', 'presupuesto', miCustomHandler)
 */
export function registrarHandler(tipoGrilla, columna, handler) {
  const handlers = tipoGrilla === 'actividad' ? actividadHandlers : tareaHandlers

  if (!handlers[columna]) {
    handlers[columna] = []
  }

  handlers[columna].push(handler)
}
