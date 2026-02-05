//Composable para Solicitud de Reposicion
import { ref } from 'vue'
import { solicitudReposicionServicio } from '../services/solicitudReposicionService'

export function useSolicitudReposicion() {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  const listaSolReposicionActividad = ref(null)
  const listaSolReposicionTarea = ref(null)

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

  return {
    loading,
    error,
    listaSolReposicionActividad,
    listaSolReposicionTarea,
    obtenerListaSolReposicionPorIdActividad,
    obtenerListaSolReposicionPorIdTarea,
  }
}
