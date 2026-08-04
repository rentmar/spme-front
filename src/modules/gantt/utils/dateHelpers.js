/**
 * Formatea una fecha al formato local español
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada o 'N/A'
 */
export function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Calcula la fecha de fin basada en inicio y duración
 * @param {Object} task - Objeto tarea con start_date y duration
 * @returns {string} Fecha de fin en formato ISO o 'N/A'
 */
export function getEndDate(task) {
  if (!task) return 'N/A'
  const start = new Date(task.start_date)
  start.setDate(start.getDate() + (task.duration || 0))
  return start.toISOString().split('T')[0]
}

/**
 * Obtiene la fecha de hoy formateada para mostrar
 * @returns {string} Fecha actual formateada
 */
export function getTodayFormatted() {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Crea una marca para el día de hoy en el Gantt
 * @returns {Object} Objeto tarea para la marca de hoy
 */
export function createTodayMarker() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  return {
    text: '📅 Hoy',
    start_date: todayStr,
    duration: 1,
    type: 'task',
    parent: 0,
    color: '#E53935',
    readonly: true,
  }
}
