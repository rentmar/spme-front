//composable para la validacion de sol de viajes
import { ref } from 'vue'
import { validadoresSolViajesServicio } from '../services/validadoresSolViajesService'

export function useValidadoresSolViajes() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  async function asignarValidadores(idSolViajes, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.asignarValidadoresSolViajes(
        idSolViajes,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function asignarValidadoresSolo(idSolViajes, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.asignarValidadoresSinMensajesSolViajes(
        idSolViajes,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function aprobarSolicitudViajes(idSolViajes, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.aprobarSolViajes(
        idSolViajes,
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

  async function rechazarSolicitudViajes(idSolViajes, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.rechazarSolViajes(
        idSolViajes,
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

  async function estadoSolicitudViajes(idSolViajes) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.estadoValidacionSolViajes(idSolViajes)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function resetearSolicitudViajes(idSolViajes, version) {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.resetValidacionSolViajes(
        idSolViajes,
        version,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function obtenerMisValidacionesPendientesSolViajes() {
    loading.value = true
    try {
      const respuesta = await validadoresSolViajesServicio.misValidacionesPendientesSolViajes()
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
    //Func
    asignarValidadores,
    asignarValidadoresSolo,
    aprobarSolicitudViajes,
    rechazarSolicitudViajes,
    estadoSolicitudViajes,
    resetearSolicitudViajes,
    obtenerMisValidacionesPendientesSolViajes,
  }
}
