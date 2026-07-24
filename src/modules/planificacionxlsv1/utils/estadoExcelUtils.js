/**
 * Utilidades de estados para Planificación Excel
 * Clases CSS y textos descriptivos para proyectos, actividades y tareas
 */

// ── PROYECTO ──

/**
 * Retorna la clase CSS según el estado del proyecto
 * @param {string} estado - Código de estado
 * @returns {string} Clase CSS
 */
export const obtenerClaseEstadoProyecto = (estado) => {
  const clases = {
    ES: 'badge-gray',
    EP: 'badge-blue',
    PL: 'badge-green',
  }
  return clases[estado] || 'badge-blue'
}

/**
 * Obtiene el texto descriptivo del estado del proyecto
 * @param {string} estado - Código de estado
 * @returns {string} Descripción
 */
export const obtenerTextoEstadoProyecto = (estado) => {
  const textos = {
    ES: 'Estructuración',
    EP: 'En Planificación',
    PL: 'Planificado',
  }
  return textos[estado] || estado
}

// ── ACTIVIDAD ──

/**
 * Retorna la clase CSS según el estado de una actividad
 * @param {string} estado - Código de estado
 * @returns {string} Clase CSS
 */
export const obtenerClaseEstadoActividad = (estado) => {
  const clases = {
    CRD: 'estado-creada',
    PLAN: 'estado-planificada',
    RETR: 'estado-retraso',
    REPROG: 'estado-reprogramacion',
    EJEC: 'estado-ejecucion',
    REP: 'estado-reporte',
    FIN: 'estado-finalizado',
  }
  return clases[estado] || ''
}

/**
 * Obtiene el texto descriptivo del estado de una actividad
 * @param {string} estado - Código de estado
 * @returns {string} Descripción
 */
export const obtenerTextoEstadoActividad = (estado) => {
  const textos = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
  }
  return textos[estado] || estado
}

// ── TAREA ──

/**
 * Retorna la clase CSS según el estado de una tarea
 * @param {string} estado - Código de estado
 * @returns {string} Clase CSS
 */
export const obtenerClaseEstadoTarea = (estado) => {
  const clases = {
    PEN: 'tarea-pendiente',
    EPROG: 'tarea-progreso',
    COMPL: 'tarea-completada',
  }
  return clases[estado] || ''
}

/**
 * Obtiene el texto descriptivo del estado de una tarea
 * @param {string} estado - Código de estado
 * @returns {string} Descripción
 */
export const obtenerTextoEstadoTarea = (estado) => {
  const textos = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return textos[estado] || estado
}
