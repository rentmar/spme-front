//Servicios para la validacion de las solicitudes de fondos
//Actividad y tarea(subactividad)
import { apiValid } from '@/services/axios'

export const validadoresSolFondosServicio = {
  /**************************** Validadores Solicitud de Fondos (Actividad/Subactividad) *******************/
  /* Asignar validadores a una sol de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSolFondos: async (idSolFondos, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-fondos/' + idSolFondos + '/asignar-validadores/',
        {
          validador_ids: iDsValidadores,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al asignar validadores', error)
      throw new Error(error)
    }
  },
  /* Aprobar una solicitud de fondos, sin generar emails y mensajeria interna
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  asignarValidadoresSinMensajesSolFondos: async (idSolFondos, iDsValidadores) => {
    try {
      const respuesta = await apiValid.post(
        '/solicitud-fondos/' + idSolFondos + '/asignar-validadores/',
        {
          validador_ids: iDsValidadores,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al asignar validadores', error)
      throw new Error(error)
    }
  },
  /**
   * Aprobar una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  aprobarSolFondos: async (idSolFondos, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post('/solicitud-fondos/' + idSolFondos + '/votar/', {
        validacion_id: idValidacion,
        estado: 'APROBADO',
        comentarios: comentarios || 'Solicitud aprobada',
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al aprobar la sol de fondos id: ' + idSolFondos)
      throw new Error(error)
    }
  },
  /**
   * Rechazar una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  rechazarSolFondos: async (idSolFondos, idValidacion, comentarios) => {
    try {
      const respuesta = await apiValid.post('/solicitud-fondos/' + idSolFondos + '/votar/', {
        validacion_id: idValidacion,
        estado: 'RECHAZADO',
        comentarios: comentarios,
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al rechazar la sol de fondos id: ' + idSolFondos)
      throw new Error(error)
    }
  },
  /**
   * Estado de la validacion de la Sol de Fondos
   * @param {number} idSolFondos - ID de la solicitud
   */
  estadoValidacionSolFondos: async (idSolFondos) => {
    try {
      const respuesta = await apiValid.get(
        '/solicitud-fondos/' + idSolFondos + '/estado-validacion/',
      )
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al obtener el estado de validacion de la sol fondos: ' + idSolFondos,
        error,
      )
      throw new Error(error)
    }
  },
  /**
   * Resetear la Validacion de una Sol de Fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  resetValidacionSolFondos: async (idSolFondos, version) => {
    try {
      const respuesta = await apiValid.post('/solicitud-fondos/24/resetear-validaciones/', {
        nueva_version: version,
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al resetear la validacion', error)
      throw new Error(error)
    }
  },
  /**
   * Resetear la Validacion de una Sol de Fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  historialValidacionSolFondos: async (idSolFondos) => {
    try {
      const respuesta = await apiValid.get('/solicitud-fondos/' + idSolFondos + '/historial/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener historial de ls sol fondos: ' + idSolFondos, error)
      throw new Error(error)
    }
  },
  /**
   * Obtener las validaciones pendientes de un usuario
   */
  misValidacionesPendientesSolFondos: async () => {
    try {
      const respuesta = await apiValid.get('/solicitud-fondos/mis-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener las validaciones pendientes', error)
      throw new Error(error)
    }
  },
}
