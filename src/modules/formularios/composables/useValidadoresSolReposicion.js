//composable para la validacion de sol de viajes
import { ref } from 'vue'
import { validadoresSolReposicionServicio } from '../services/validadoresSolReposicionService'

export function useValidadoresSolReposicion() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  async function asignarValidadores(idSolReposicion, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolReposicionServicio.asignarValidadoresSolReposicion(
        idSolReposicion,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function asignarValidadoresSolo(idSolReposicion, iDsValidadores) {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolReposicionServicio.asignarValidadoresSinMensajesSolReposicion(
          idSolReposicion,
          iDsValidadores,
        )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function aprobarSolReposicion(idSolReposicion, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolReposicionServicio.aprobarSolReposicion(
        idSolReposicion,
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

  async function rechazarSolReposicion(idSolReposicion, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolReposicionServicio.rechazarSolReposicion(
        idSolReposicion,
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

  async function estadoSolReposicion(idSolReposicion) {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolReposicionServicio.estadoValidacionSolReposicion(idSolReposicion)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function resetearSolReposicion(idSolReposicion, version) {
    loading.value = true
    try {
      const respuesta = await validadoresSolReposicionServicio.resetValidacionSolReposicion(
        idSolReposicion,
        version,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function obtenerMisValidacionesPendientesSolReposicion() {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolReposicionServicio.misValidacionesPendientesSolReposicion()
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
    aprobarSolReposicion,
    rechazarSolReposicion,
    estadoSolReposicion,
    resetearSolReposicion,
    obtenerMisValidacionesPendientesSolReposicion,
  }
}
