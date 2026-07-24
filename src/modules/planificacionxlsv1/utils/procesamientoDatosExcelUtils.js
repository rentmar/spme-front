/**
 * Utilidades de procesamiento de datos para Planificación Excel
 * Extracción, filtrado y agrupación de datos del proyecto
 */

/**
 * Procesa la respuesta completa del endpoint y extrae todos los datos
 * Retorna un objeto con proyecto, actividades, tareas y metadata
 *
 * @param {object} respuesta - Respuesta completa del endpoint
 * @returns {object} { proyecto, actividades, tareas, metadata }
 */
export const procesarRespuestaProyecto = (respuesta) => {
  if (!respuesta?.success) {
    throw new Error('Respuesta inválida del servidor')
  }

  const { data, metadata } = respuesta

  // Extraer proyecto sin actividades
  const { actividades: acts, ...proyectoData } = data

  // Extraer tareas planas con referencia a la actividad padre
  const tareasPlanificacion = extraerTareas(acts || [])

  return {
    proyecto: proyectoData,
    actividades: acts || [],
    tareas: tareasPlanificacion,
    metadata: metadata || null,
  }
}

/**
 * Extrae los datos del proyecto sin actividades
 * @param {object} respuesta - Respuesta completa del endpoint
 * @returns {object|null} Datos del proyecto
 */
export const extraerDatosProyecto = (respuesta) => {
  if (respuesta?.success && respuesta?.data) {
    const { actividades, ...proyectoData } = respuesta.data
    return proyectoData
  }
  return null
}

/**
 * Extrae las actividades de la respuesta
 * @param {object} respuesta - Respuesta completa del endpoint
 * @returns {array} Lista de actividades
 */
export const extraerActividades = (respuesta) => {
  return respuesta?.success ? respuesta.data?.actividades || [] : []
}

/**
 * Extrae los metadatos de la respuesta
 * @param {object} respuesta - Respuesta completa del endpoint
 * @returns {object|null} Metadatos
 */
export const extraerMetadata = (respuesta) => {
  return respuesta?.success ? respuesta.metadata || null : null
}

/**
 * Extrae todas las tareas de una lista de actividades
 * Convierte estructura anidada en lista plana
 * Agrega referencia a la actividad padre
 *
 * @param {array} actividades - Lista de actividades
 * @returns {array} Lista plana de tareas
 */
export const extraerTareas = (actividades) => {
  const todasLasTareas = []

  if (!actividades?.length) return todasLasTareas

  actividades.forEach((actividad) => {
    if (actividad.tareas?.length) {
      actividad.tareas.forEach((tarea) => {
        todasLasTareas.push({
          ...tarea,
          actividad_id: actividad.id,
          actividad_codigo: actividad.codigo,
          actividad_nombre: actividad.nombreCorto,
          actividad_estado: actividad.estado,
        })
      })
    }
  })

  return todasLasTareas
}

// ── FILTRADO ──

/**
 * Filtra actividades activas
 * @param {array} actividades - Lista de actividades
 * @returns {array} Actividades activas
 */
export const filtrarActividadesActivas = (actividades) => {
  return actividades.filter((a) => !a.estaInactiva)
}

/**
 * Filtra actividades inactivas
 * @param {array} actividades - Lista de actividades
 * @returns {array} Actividades inactivas
 */
export const filtrarActividadesInactivas = (actividades) => {
  return actividades.filter((a) => a.estaInactiva)
}

/**
 * Filtra actividades con tareas
 * @param {array} actividades - Lista de actividades
 * @returns {array} Actividades con tareas
 */
export const filtrarActividadesConTareas = (actividades) => {
  return actividades.filter((a) => a.tareas?.length > 0)
}

/**
 * Filtra actividades sin tareas
 * @param {array} actividades - Lista de actividades
 * @returns {array} Actividades sin tareas
 */
export const filtrarActividadesSinTareas = (actividades) => {
  return actividades.filter((a) => !a.tareas?.length)
}

/**
 * Filtra tareas por estado
 * @param {array} tareas - Lista de tareas
 * @param {string} estado - Estado a filtrar (PEN, EPROG, COMPL)
 * @returns {array} Tareas filtradas
 */
export const filtrarTareasPorEstado = (tareas, estado) => {
  return tareas.filter((t) => t.estado === estado)
}

/**
 * Obtiene las tareas de una actividad específica
 * @param {array} tareas - Lista plana de tareas
 * @param {number} actividadId - ID de la actividad
 * @returns {array} Tareas de la actividad
 */
export const obtenerTareasPorActividadId = (tareas, actividadId) => {
  return tareas.filter((t) => t.actividad_id === actividadId)
}

// ── AGRUPACIÓN ──

/**
 * Agrupa tareas por actividad
 * @param {array} tareas - Lista plana de tareas
 * @returns {object} { [actividad_id]: [tareas] }
 */
export const agruparTareasPorActividad = (tareas) => {
  return tareas.reduce((acc, tarea) => {
    const key = tarea.actividad_id
    if (!acc[key]) acc[key] = []
    acc[key].push(tarea)
    return acc
  }, {})
}
