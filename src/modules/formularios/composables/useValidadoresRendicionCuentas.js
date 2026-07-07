//Composable para Validacion de las Solicitudes de Fondos
import { ref } from 'vue'
import { validadoresRendicionCuentasServicio } from '../services/validadoresRendicionCuentasService'

export function useValidadoresRendCuentas() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  /* Asignar validadores a una sol de fondos
   * @param {number} idRenCuentas - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadores(idRenCuentas, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresRendicionCuentasServicio.asignarValidadoresRendCuentas(
        idRenCuentas,
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
   * @param {number} idRenCuentas - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadoresSolo(idRenCuentas, iDsValidadores) {
    loading.value = true
    try {
      const respuesta =
        await validadoresRendicionCuentasServicio.asignarValidadoresSinMensajesRendCuentas(
          idRenCuentas,
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
   * @param {number} idRenCuentas - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios (opcional)
   */
  async function aprobarRendicionCuentas(idRenCuentas, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresRendicionCuentasServicio.aprobarRendCuentas(
        idRenCuentas,
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
   * @param {number} idRenCuentas - ID de la solicitud
   * @param {number} idValidacion - ID de la validación
   * @param {string} comentarios - Comentarios
   */
  async function rechazarRendicionCuentas(idRenCuentas, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresRendicionCuentasServicio.rechazarRendCuentas(
        idRenCuentas,
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
   * @param {number} idRenCuentas - ID de la solicitud
   */
  async function estadoRendicionCuentas(idRenCuentas) {
    loading.value = true
    try {
      const respuesta =
        await validadoresRendicionCuentasServicio.estadoValidacionRendCuentas(idRenCuentas)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Resetear la Validacion de una Sol de Fondos
   * @param {number} idRenCuentas - ID de la solicitud
   * @param {number} version - Version de la validacion
   */
  async function resetearRendicionCuentas(idRenCuentas, version) {
    loading.value = true
    try {
      const respuesta = await validadoresRendicionCuentasServicio.resetValidacionRendCuentas(
        idRenCuentas,
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
      const respuesta =
        await validadoresRendicionCuentasServicio.misValidacionesPendientesRendCuentas()
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
    aprobarRendicionCuentas,
    rechazarRendicionCuentas,
    resetearRendicionCuentas,
    estadoRendicionCuentas,
  }
}
