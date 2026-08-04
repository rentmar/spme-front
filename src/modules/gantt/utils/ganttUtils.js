import { VIEW_SCALES } from './constants'
// import { prepareTasksForGantt, createTodayMarker } from './taskHelpers'
import { createTodayMarker } from './dateHelpers'
import { prepareTasksForGantt } from './taskHelpers'
import { ganttLocaleES } from './ganttLocale'

/**
 * Inicializa la configuración base del Gantt
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 */
export function initializeGanttConfig(ganttInstance) {
  ganttInstance.config.date_format = '%d/%m/%Y'
  ganttInstance.config.scales = VIEW_SCALES.year
  ganttInstance.config.readonly = true

  //Aplicar localizacion en español
  ganttInstance.i18n.setLocale(ganttLocaleES)

  // Templates para estilos de filas
  ganttInstance.templates.grid_row_class = function (start, end, task) {
    if (task.type === 'project') return 'row-project'
    if (task.parent >= 100000 && task.parent < 200000) return 'row-actividad'
    if (task.parent >= 200000) return 'row-tarea'
    return ''
  }
}

/**
 * Cambia la escala de tiempo del Gantt
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 * @param {string} view - Tipo de vista (day, week, month, year, lustro)
 */
export function changeGanttScale(ganttInstance, view) {
  const scales = VIEW_SCALES[view] || VIEW_SCALES.year
  ganttInstance.config.scales = scales
  ganttInstance.render()
}

/**
 * Carga datos en el Gantt con marcadores
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 * @param {Array} tasks - Lista de tareas
 * @param {Object} colorMap - Mapa de estados a colores
 */
export function loadGanttData(ganttInstance, tasks, colorMap) {
  const preparedTasks = prepareTasksForGantt(tasks, colorMap)
  const todayMarker = createTodayMarker()

  const data = [{ id: 998, ...todayMarker }, ...preparedTasks, { id: 999, ...todayMarker }]

  ganttInstance.clearAll()
  ganttInstance.parse({ data })
}

/**
 * Configura los eventos del Gantt
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 * @param {Function} onTaskClick - Callback para click en tarea
 */
export function setupGanttEvents(ganttInstance, onTaskClick) {
  ganttInstance.attachEvent('onTaskClick', (id, e) => {
    const task = ganttInstance.getTask(id)
    const target = e.target || e.srcElement

    // Ignorar clicks en elementos del árbol
    if (
      target.closest('.gantt_tree_icon,.gantt_folder,.gantt_file,.gantt_tree_content,.gantt_row')
    ) {
      return true
    }

    // Ignorar marcadores de hoy
    if (task.id === 998 || task.id === 999) return true

    // Solo responder a clicks en la barra de tarea
    if (target.closest('.gantt_task_content,.gantt_task')) {
      onTaskClick(task)
      return false
    }

    return true
  })
}

/**
 * Expande todos los proyectos en el Gantt
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 */
export function expandAllProjects(ganttInstance) {
  ganttInstance.eachTask((task) => {
    if (task.parent === 0) ganttInstance.open(task.id)
  })
}

/**
 * Colapsa todos los proyectos en el Gantt
 * @param {Object} ganttInstance - Instancia de dhtmlxGantt
 */
export function collapseAllProjects(ganttInstance) {
  ganttInstance.eachTask((task) => {
    if (task.parent === 0) ganttInstance.close(task.id)
  })
}
