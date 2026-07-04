//Servicios para la validacion de Sol de pago directo
//Actividad y Tarea(subactividad)
import { apiValid } from '@/services/axios'

export const validadoresSolPagoDirectoServicio = {
  /**************************** Validadores Solicitud de pago directo (Actividad/Subactividad) *******************/
  /* Asignar validadores a una sol pago directo
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSolPagoDirecto: async (idSolPagoDirecto, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/asignar-validadores/',
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
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSinMensajesSolPagoDirecto: async (idSolPagoDirecto, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/asignar-validadores-sin-notificacion/',
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
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  aprobarSolPagoDirecto: async (idSolPagoDirecto, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/votar/',
        {
          validacion_id: idValidacion,
          estado: 'APROBADO',
          comentarios: comentarios || 'Solicitud aprobada',
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al aprobar la sol de pago directo id: ' + idSolPagoDirecto)
      throw error
    }
  },
  /**
   * Rechazar una solicitud de viajes
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  rechazarSolPagoDirecto: async (idSolPagoDirecto, idValidacion, coment) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/votar/',
        {
          validacion_id: idValidacion,
          estado: 'RECHAZADO',
          comentarios: coment,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al rechazar la sol de pago directo id: ' + idSolPagoDirecto)
      throw error
    }
  },
  /**
   * Estado de la validacion de la Sol de pago directo
   * @param {number} idSolPagoDirecto - ID de la solicitud
   */
  estadoValidacionSolPagoDirecto: async (idSolPagoDirecto) => {
    try {
      const respuesta = await apiValid.get(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/estado-validacion/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al obtener el estado de validacion de la sol pago directo: ' +
          idSolPagoDirecto,
        error,
      )
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Pago directo
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  resetValidacionSolPagoDirecto: async (idSolPagoDirecto, version) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/resetear-validaciones/',
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
   * @param {number} idSolPagoDirecto - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  historialValidacionSolPagoDirecto: async (idSolPagoDirecto) => {
    try {
      const respuesta = await apiValid.get(
        '/solicitud-pago-directo/' + idSolPagoDirecto + '/historial/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: error al obtener historial de ls sol fondos: ' + idSolPagoDirecto,
        error,
      )
      throw error
    }
  },
  /**
   * Obtener las validaciones pendientes de un usuario
   */
  misValidacionesPendientesSolPagoDirecto: async () => {
    try {
      const respuesta = await apiValid.get('/solicitud-pago-directo/mis-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener las validaciones pendientes', error)
      throw error
    }
  },
}
