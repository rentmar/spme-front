// src/modules/listaActividadesSolicitudes/utils/filtroProyectos.js

/**
 * Filtra una lista de actividades dejando solo aquellas cuyo proyecto está habilitado.
 *
 * @param {Array} lista - Array de objetos actividad. Cada actividad debe tener la propiedad
 *   `proyecto` con un `id` (ej: `actividad.proyecto.id`).
 * @param {number[]} listaIdsProyectosHabilitados - Array de IDs de proyectos habilitados.
 * @returns {Array} - Nuevo array con las actividades cuyos proyectos están en la lista de habilitados.
 */
export function filtrarPorProyectosHabilitados(lista, listaIdsProyectosHabilitados) {
  // Aseguramos que sea un array, incluso si recibimos undefined/null
  const proyectosHabilitadosIds = listaIdsProyectosHabilitados || []

  return lista.filter((actividad) => {
    // Extraemos el id del proyecto de la actividad
    const proyectoId = actividad.proyecto?.id

    // Verificamos si el id del proyecto está en la lista de habilitados
    const estaHabilitado = proyectosHabilitadosIds.includes(proyectoId)

    // Log para depuración cuando una actividad es excluida
    if (!estaHabilitado) {
      // console.log(`❌ Actividad ${actividad.id} excluida - Proyecto ${proyectoId} no habilitado`)
    }

    // Retornamos true solo si el proyecto está habilitado
    return estaHabilitado
  })
}
