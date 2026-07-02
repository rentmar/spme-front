//Servicios para la validacion de Sol de Viajes
//Actividad y Tarea(subactividad)
import { apiValid } from '@/services/axios'

export const validadoresSolViajesServicio = {
  /**************************** Validadores Solicitud de viajes (Actividad/Subactividad) *******************/
  /* Asignar validadores a una sol de viajes
   * @param {number} idSolViajes - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSolViajes: async (idSolViajes, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        'solicitud-viajes/' + idSolViajes + '/asignar-validadores/',
        {
          validador_ids: iDsValidadores,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al asignar validadores', error)
      throw new error()
    }
  },
  /* Aprobar una Sol de viajes, sin generar emails y mensajeria interna
   * @param {number} idSolViajes - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSinMensajesSolViajes: async (idSolViajes, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        'solicitud-viajes/' + idSolViajes + '/asignar-validadores-sin-notificacion/',
        {
          validador_ids: iDsValidadores,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al asignar validadores', error)
      throw error
    }
  },
  /**
   * Aprobar una solicitud de viajes
   * @param {number} idSolViajes - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  aprobarSolViajes: async (idSolViajes, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post('solicitud-viajes/' + idSolViajes + '/votar/', {
        validacion_id: idValidacion,
        estado: 'APROBADO',
        comentarios: comentarios || 'Solicitud aprobada',
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al aprobar la sol de viajes id: ' + idSolViajes)
      throw error
    }
  },
  /**
   * Rechazar una solicitud de viajes
   * @param {number} idSolViajes - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  rechazarSolViajes: async (idSolViajes, idValidacion, coment) => {
    try {
      const respuesta = await apiValid.post('/solicitud-viajes/' + idSolViajes + '/votar/', {
        validacion_id: idValidacion,
        estado: 'RECHAZADO',
        comentarios: coment,
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al rechazar la sol de viajes id: ' + idSolViajes)
      throw error
    }
  },
  /**
   * Estado de la validacion de la Sol de Viajes
   * @param {number} idSolViajes - ID de la solicitud
   */
  estadoValidacionSolViajes: async (idSolViajes) => {
    try {
      const respuesta = await apiValid.get(
        'solicitud-viajes/' + idSolViajes + '/estado-validacion/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al obtener el estado de validacion de la sol viajes: ' + idSolViajes,
        error,
      )
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Viajes
   * @param {number} idSolViajes - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  resetValidacionSolViajes: async (idSolViajes, version) => {
    try {
      const respuesta = await apiValid.post(
        'solicitud-viajes/' + idSolViajes + '/resetear-validaciones/',
        {
          nueva_version: version,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al resetear la validacion', error)
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Viajes
   * @param {number} idSolViajes - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  historialValidacionSolViajes: async (idSolViajes) => {
    try {
      const respuesta = await apiValid.get('/solicitud-viajes/' + idSolViajes + '/historial/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener historial de ls sol fondos: ' + idSolViajes, error)
      throw error
    }
  },
  /**
   * Obtener las validaciones pendientes de un usuario
   */
  misValidacionesPendientesSolViajes: async () => {
    try {
      const respuesta = await apiValid.get('/solicitud-viajes/mis-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener las validaciones pendientes', error)
      throw error
    }
  },
}
