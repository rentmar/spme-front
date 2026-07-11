//Servicios para la validacion de Sol de pago directo
//Actividad y Tarea(subactividad)
import { apiValid } from '@/services/axios'

export const validadoresSolReposicionServicio = {
  /**************************** Validadores Solicitud de pago directo (Actividad/Subactividad) *******************/
  /* Asignar validadores a una sol pago directo
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSolReposicion: async (idSolReposicion, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-reembolso/' + idSolReposicion + '/asignar-validadores/',
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
  /* Aprobar una Sol de pago directo, sin generar emails y mensajeria interna
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSinMensajesSolReposicion: async (idSolReposicion, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        'solicitud-reembolso/' + idSolReposicion + '/asignar-validadores-sin-notificacion/',
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
   * Aprobar una solicitud de pago directo
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  aprobarSolReposicion: async (idSolReposicion, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post('/solicitud-reembolso/' + idSolReposicion + '/votar/', {
        validacion_id: idValidacion,
        estado: 'APROBADO',
        comentarios: comentarios || 'Solicitud aprobada',
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al aprobar la sol de pago directo id: ' + idSolReposicion)
      throw error
    }
  },
  /**
   * Rechazar una solicitud de viajes
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  rechazarSolReposicion: async (idSolReposicion, idValidacion, coment) => {
    try {
      const respuesta = await apiValid.post('/solicitud-reembolso/' + idSolReposicion + '/votar/', {
        validacion_id: idValidacion,
        estado: 'RECHAZADO',
        comentarios: coment,
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al rechazar la sol de pago directo id: ' + idSolReposicion)
      throw error
    }
  },
  /**
   * Estado de la validacion de la Sol de pago directo
   * @param {number} idSolReposicion - ID de la solicitud
   */
  estadoValidacionSolReposicion: async (idSolReposicion) => {
    try {
      const respuesta = await apiValid.get(
        '/solicitud-reembolso/' + idSolReposicion + '/estado-validacion/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al obtener el estado de validacion de la sol pago directo: ' +
          idSolReposicion,
        error,
      )
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Pago directo
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  resetValidacionSolReposicion: async (idSolReposicion, version) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-reembolso/' + idSolReposicion + '/resetear-validaciones/',
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
   * @param {number} idSolReposicion - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  historialValidacionSolReposicion: async (idSolReposicion) => {
    try {
      const respuesta = await apiValid.get(
        '/solicitud-reembolso/' + idSolReposicion + '/historial/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener historial de ls sol fondos: ' + idSolReposicion, error)
      throw error
    }
  },
  /**
   * Obtener las validaciones pendientes de un usuario
   */
  misValidacionesPendientesSolReposicion: async () => {
    try {
      const respuesta = await apiValid.get('/solicitud-reembolso/mis-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener las validaciones pendientes', error)
      throw error
    }
  },
}
