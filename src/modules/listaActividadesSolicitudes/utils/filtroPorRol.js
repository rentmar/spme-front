// src/modules/listaActividadesSolicitudes/utils/filtroPorRol.js

/**
 * Filtra actividades según el rol y permisos del usuario.
 * - Admin y dir-administrativo: ven todas las actividades.
 * - Otros roles: ven solo actividades donde son responsables o tienen acceso al proyecto.
 *
 * @param {Array} lista - Array de actividades ya filtradas por proyecto habilitado.
 * @param {Object} userData - Datos del usuario desde userStore.userData.
 * @param {string} rol - Rol del usuario ('admin', 'dir-administrativo', etc.).
 * @param {number[]} proyectosAccesiblesIds - IDs de proyectos a los que el usuario tiene acceso.
 * @returns {Array} - Actividades filtradas según permisos.
 */

export function filtrarPorRol(lista, userData, rol, proyectosAccesiblesIds) {
  const esAdmin = rol === 'admin' || rol === 'dir-administrativo'
  const proyectosIds = proyectosAccesiblesIds || []

  // console.log('ROL: ', rol)
  // console.log('ACCEDE A LOS PROYECTOS: ', proyectosIds)
  // console.log('Usuario informacion: ', userData)

  if (esAdmin) {
    return lista
  }

  const actividadesUnicas = new Map()

  lista.forEach((actividad) => {
    // Verificar si es responsable
    const esResponsable = actividad.responsable?.id === userData?.user?.id

    // Verificar acceso por proyecto
    const proyectoId = actividad.proyecto?.id
    const tieneAccesoProyecto = proyectoId && proyectosIds.includes(proyectoId)

    // Incluir si cumple alguno de los criterios
    if (esResponsable || tieneAccesoProyecto) {
      actividadesUnicas.set(actividad.id, actividad)
    }
  })

  // console.log('Actividades filtradas: ', actividadesUnicas)

  // console.log('Total encontradas (responsable + proyecto):', actividadesUnicas.size)
  return Array.from(actividadesUnicas.values())
}
