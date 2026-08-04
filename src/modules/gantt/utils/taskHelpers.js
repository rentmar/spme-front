/**
 * Obtiene todos los ancestros de una tarea
 * @param {number} taskId - ID de la tarea
 * @param {Array} tasks - Lista completa de tareas
 * @returns {Array} Lista de tareas ancestro
 */
export function getAncestors(taskId, tasks) {
  const ancestors = []
  let current = tasks.find((t) => t.id === taskId)
  while (current && current.parent !== 0) {
    const parent = tasks.find((t) => t.id === current.parent)
    if (parent) {
      ancestors.push(parent)
      current = parent
    } else break
  }
  return ancestors
}

/**
 * Obtiene el nombre del padre de una tarea
 * @param {number} parentId - ID del padre
 * @param {Array} tasks - Lista completa de tareas
 * @returns {string} Nombre del padre o 'N/A'
 */
export function getParentName(parentId, tasks) {
  return tasks.find((t) => t.id === parentId)?.text || 'N/A'
}

/**
 * Obtiene las subtareas de una tarea
 * @param {number} taskId - ID de la tarea padre
 * @param {Array} tasks - Lista completa de tareas
 * @returns {Array} Lista de subtareas
 */
export function getChildren(taskId, tasks) {
  return tasks.filter((t) => t.parent === taskId)
}

/**
 * Filtra tareas por query de búsqueda incluyendo ancestros
 * @param {string} query - Texto de búsqueda
 * @param {Array} tasks - Lista completa de tareas
 * @returns {Array} Tareas filtradas
 */
export function filterTasks(query, tasks) {
  const searchTerm = query.trim().toLowerCase()
  if (!searchTerm) return tasks

  const matched = tasks.filter((task) => task.text.toLowerCase().includes(searchTerm))
  const parentIds = new Set()
  matched.forEach((task) => getAncestors(task.id, tasks).forEach((a) => parentIds.add(a.id)))
  const idsToShow = new Set()
  matched.forEach((t) => idsToShow.add(t.id))
  parentIds.forEach((id) => idsToShow.add(id))
  return tasks.filter((task) => idsToShow.has(task.id))
}

/**
 * Prepara las tareas para el Gantt (colores, duración, progreso)
 * @param {Array} tasks - Lista de tareas
 * @param {Object} colorMap - Mapa de estados a colores
 * @returns {Array} Tareas preparadas
 */
export function prepareTasksForGantt(tasks, colorMap) {
  return tasks.map((t) => ({
    ...t,
    color: colorMap[t.estado] || '#BDBDBD',
    duration: t.duration || 1,
    progress: t.progress || 0,
    open: t.open !== undefined ? t.open : true,
  }))
}
