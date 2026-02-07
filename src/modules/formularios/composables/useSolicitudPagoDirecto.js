import { ref } from 'vue'
import { solicitudPagoDirectoServicio } from '../services/solicitudPagoDirecto'

export function useSolicitudPagoDirecto() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listaSolPagoDirectoActividad = ref(null)
  const listaSolPagoDirectoTarea = ref(null)
  const listaSolPagoDirectoActividadPei = ref(null)
  const listaSolPagoDirectoTareaPei = ref(null)

  //lista de sol de pago directo por id actividad
  async function obtenerListaSolPagoDirectoPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta = await solicitudPagoDirectoServicio.solPagoDirectoPorIdActividad(idactividad)
      listaSolPagoDirectoActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude de pago directo por id de tarea
  async function obtenerListaSolPagoDirectoPorIdTarea(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudPagoDirectoServicio.solPagoDirectoPorIdTarea(
        idactividad,
        idtarea,
      )
      listaSolPagoDirectoTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //lista de sol de pago directo por id actividad
  async function obtenerListaSolPagoDirectoPorIdActividadPei(idactividad) {
    loading.value = true
    try {
      const respuesta =
        await solicitudPagoDirectoServicio.solPagoDirectoPorIdActividadPei(idactividad)
      listaSolPagoDirectoActividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude de pago directo por id de tarea
  async function obtenerListaSolPagoDirectoPorIdTareaPei(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudPagoDirectoServicio.solPagoDirectoPorIdTareaPei(
        idactividad,
        idtarea,
      )
      listaSolPagoDirectoTareaPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    listaSolPagoDirectoActividad,
    listaSolPagoDirectoTarea,
    listaSolPagoDirectoActividadPei,
    listaSolPagoDirectoTareaPei,
    obtenerListaSolPagoDirectoPorIdActividad,
    obtenerListaSolPagoDirectoPorIdTarea,
    obtenerListaSolPagoDirectoPorIdActividadPei,
    obtenerListaSolPagoDirectoPorIdTareaPei,
  }
}
