//Composable para Solicitud de Reposicion
import { ref } from 'vue'
import { solicitudReposicionServicio } from '../services/solicitudReposicionService'

export function useSolicitudReposicion() {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  const listaSolReposicionActividad = ref(null)
  const listaSolReposicionTarea = ref(null)
  const listaSolReposicionActividadPei = ref(null)
  const listaSolReposicionTareaPei = ref(null)

  //Obtener lista de solicitud de viaje por id de actividad
  async function obtenerListaSolReposicionPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta = await solicitudReposicionServicio.solReposicionPorIdActividad(idactividad)
      listaSolReposicionActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude viaje por id de tarea
  async function obtenerListaSolReposicionPorIdTarea(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudReposicionServicio.solReposicionPorIdTarea(
        idactividad,
        idtarea,
      )
      listaSolReposicionTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitud de viaje por id de actividad
  async function obtenerListaSolReposicionPorIdActividadPei(idactividad) {
    loading.value = true
    try {
      const respuesta =
        await solicitudReposicionServicio.solReposicionPorIdActividadPei(idactividad)
      listaSolReposicionActividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude viaje por id de tarea
  async function obtenerListaSolReposicionPorIdTareaPei(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudReposicionServicio.solReposicionPorIdTareaPei(
        idactividad,
        idtarea,
      )
      listaSolReposicionTareaPei.value = respuesta
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
    listaSolReposicionActividad,
    listaSolReposicionTarea,
    listaSolReposicionActividadPei,
    listaSolReposicionTareaPei,
    obtenerListaSolReposicionPorIdActividad,
    obtenerListaSolReposicionPorIdTarea,
    obtenerListaSolReposicionPorIdActividadPei,
    obtenerListaSolReposicionPorIdTareaPei,
  }
}
