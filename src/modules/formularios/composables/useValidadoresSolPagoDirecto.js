//composable para la validacion de sol de viajes
import { ref } from 'vue'
import { validadoresSolPagoDirectoServicio } from '../services/validadoresSolPagoDirectoService'

export function useValidadoresSolPagoDirecto() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  async function asignarValidadores(idSolPagoDirecto, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolPagoDirectoServicio.asignarValidadoresSolPagoDirecto(
        idSolPagoDirecto,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function asignarValidadoresSolo(idSolPagoDirecto, iDsValidadores) {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolPagoDirectoServicio.asignarValidadoresSinMensajesSolPagoDirecto(
          idSolPagoDirecto,
          iDsValidadores,
        )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function aprobarSolicitudPagoDirecto(idSolPagoDirecto, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolPagoDirectoServicio.aprobarSolPagoDirecto(
        idSolPagoDirecto,
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

  async function rechazarSolicitudPagoDirecto(idSolPagoDirecto, idValidacion, comentarios) {
    loading.value = true
    try {
      const respuesta = await validadoresSolPagoDirectoServicio.rechazarSolPagoDirecto(
        idSolPagoDirecto,
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

  async function estadoSolicitudPagoDirecto(idSolPagoDirecto) {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolPagoDirectoServicio.estadoValidacionSolPagoDirecto(idSolPagoDirecto)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function resetearSolicitudPagoDirecto(idSolPagoDirecto, version) {
    loading.value = true
    try {
      const respuesta = await validadoresSolPagoDirectoServicio.resetValidacionSolPagoDirecto(
        idSolPagoDirecto,
        version,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function obtenerMisValidacionesPendientesSolPagoDirecto() {
    loading.value = true
    try {
      const respuesta =
        await validadoresSolPagoDirectoServicio.misValidacionesPendientesSolPagoDirecto()
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
    aprobarSolicitudPagoDirecto,
    rechazarSolicitudPagoDirecto,
    estadoSolicitudPagoDirecto,
    resetearSolicitudPagoDirecto,
    obtenerMisValidacionesPendientesSolPagoDirecto,
  }
}
