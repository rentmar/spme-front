//Composable para Validacion de las Solicitudes de Fondos
import { ref } from 'vue'
import { validadoresSolFondosServicio } from '../services/validadoresSolFondosService'

export function useValidadoresSolFondos() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  /* Asignar validadores a una sol de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadores(idSolFondos, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.asignarValidadoresSolFondos(
        idSolFondos,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /* Asignar una solicitud de fondos, sin generar emails y mensajeria interna
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadoresSolo(idSolFondos, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.asignarValidadoresSinMensajesSolFondos(
        idSolFondos,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Aprobar una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  async function aprobarSolicitudFondos(idSolFondos, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.aprobarSolFondos(
        idSolFondos,
        idValidacion,
        comentarios,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Rechazar una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  async function rechazarSolicitudFondos(idSolFondos, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.rechazarSolFondos(
        idSolFondos,
        idValidacion,
        comentarios,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Estado de la validacion de la Sol de Fondos
   * @param {number} idSolFondos - ID de la solicitud
   */
  async function estadoSolicitudFondos(idSolFondos) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.estadoValidacionSolFondos(idSolFondos)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Resetear la Validacion de una Sol de Fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  async function resetearSolicitudFondos(idSolFondos, version) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.resetValidacionSolFondos(
        idSolFondos,
        version,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /* Obtener las validaciones pendientes de un usuario
   */
  async function obtenerMisValidacionesPendientes() {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.misValidacionesPendientesSolFondos()
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Listar revisores de una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   */
  async function listarRevisores(idSolFondos) {
    loading.value = true
    error.value = null
    try {
      const respuesta = await validadoresSolFondosServicio.listarRevisores(idSolFondos)
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar revisores de una solicitud de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {object} payload - Payload con cambios (array) y motivo
   */
  async function actualizarRevisores(idSolFondos, payload) {
    loading.value = true
    error.value = null
    try {
      const respuesta = await validadoresSolFondosServicio.actualizaRevisores(idSolFondos, payload)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados de carga
    loading,
    error,
    //func
    asignarValidadores,
    asignarValidadoresSolo,
    obtenerMisValidacionesPendientes,
    aprobarSolicitudFondos,
    rechazarSolicitudFondos,
    resetearSolicitudFondos,
    estadoSolicitudFondos,
    listarRevisores,
    actualizarRevisores,
  }
}
