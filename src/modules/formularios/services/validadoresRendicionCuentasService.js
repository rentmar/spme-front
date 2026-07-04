//Servicios para la validacion de rendicion de cuentas
//Actividad y Tarea(subactividad)
import { apiValid } from '@/services/axios'

export const validadoresRendicionCuentasServicio = {
  /**************************** Validadores Rendicion de Cuentas (Actividad/Subactividad) *******************/
  /* Asignar validadores a rendicion de cuentas
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresRendCuentas: async (idRendCuentas, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/rendicion-cuentas/' + idRendCuentas + '/asignar-validadores/',
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
  /* Aprobar una Rendicion de cuentas, sin generar emails y mensajeria interna
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSinMensajesRendCuentas: async (idRendCuentas, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/rendicion-cuentas/' + idRendCuentas + '/asignar-validadores-sin-notificacion/',
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
   * Aprobar una Rendicion de Cuentas
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  aprobarRendCuentas: async (idRendCuentas, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post('/rendicion-cuentas/' + idRendCuentas + '/votar/', {
        validacion_id: idValidacion,
        estado: 'APROBADO',
        comentarios: comentarios || 'Solicitud aprobada',
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al aprobar rendicion de cuentas id: ' + idRendCuentas)
      throw error
    }
  },
  /**
   * Rechazar una solicitud de viajes
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  rechazarRendCuentas: async (idRendCuentas, idValidacion, coment) => {
    try {
      const respuesta = await apiValid.post('/rendicion-cuentas/' + idRendCuentas + '/votar/', {
        validacion_id: idValidacion,
        estado: 'RECHAZADO',
        comentarios: coment,
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al rechazar rendicion de cuentas id: ' + idRendCuentas)
      throw error
    }
  },
  /**
   * Estado de la validacion de la Sol de pago directo
   * @param {number} idRendCuentas - ID de la solicitud
   */
  estadoValidacionRendCuentas: async (idRendCuentas) => {
    try {
      const respuesta = await apiValid.get(
        '/rendicion-cuentas/' + idRendCuentas + '/estado-validacion/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al obtener el estado de validacion de la rendicion de cuentas: ' +
          idRendCuentas,
        error,
      )
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Pago directo
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  resetValidacionRendCuentas: async (idRendCuentas, version) => {
    try {
      const respuesta = await apiValid.post(
        '/rendicion-cuentas/' + idRendCuentas + '/resetear-validaciones/',
        {
          nueva_version: version,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al resetear la validacion rendicion cuentas', error)
      throw error
    }
  },
  /**
   * Resetear la Validacion de una Sol de Viajes
   * @param {number} idRendCuentas - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  historialValidacionRendCuentas: async (idRendCuentas) => {
    try {
      const respuesta = await apiValid.get('/rendicion-cuentas/' + idRendCuentas + '/historial/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener historial de la sol fondos: ' + idRendCuentas, error)
      throw error
    }
  },
  /**
   * Obtener las validaciones pendientes de un usuario
   */
  misValidacionesPendientesRendCuentas: async () => {
    try {
      const respuesta = await apiValid.get('/rendicion-cuentas/mis-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener las validaciones pendientes', error)
      throw error
    }
  },
}
