//composable para Solicitudes de Viaje
import { ref } from 'vue'
import { solicitudViajeServicio } from '../services/solicitudViajeService'

export function useSolicitudViaje() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listaSolicitudViajeActividad = ref(null)
  const listaSolicitudViajeTarea = ref(null)
  const listaSolicitudViajeActividadPei = ref(null)
  const listaSolicitudViajeTareaPei = ref(null)

  //Obtener lista de solicitud de viaje por id de actividad
  async function obtenerListaSolViajesPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicio.solViajePorIdActividad(idactividad)
      listaSolicitudViajeActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude viaje por id de tarea
  async function obtenerListaSolViajesPorIdTarea(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicio.solViajePorIdTarea(idactividad, idtarea)
      listaSolicitudViajeTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitud de viaje por id de actividad
  async function obtenerListaSolViajesPorIdActividadPei(idactividadpei) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicio.solViajePorIdActividadPei(idactividadpei)
      listaSolicitudViajeActividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener lista de solicitude viaje por id de tarea
  async function obtenerListaSolViajesPorIdTareaPei(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicio.solViajePorIdTareaPei(idactividad, idtarea)
      listaSolicitudViajeTareaPei.value = respuesta
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
    listaSolicitudViajeActividad,
    listaSolicitudViajeTarea,
    listaSolicitudViajeActividadPei,
    listaSolicitudViajeTareaPei,
    //func
    obtenerListaSolViajesPorIdActividad,
    obtenerListaSolViajesPorIdTarea,
    obtenerListaSolViajesPorIdActividadPei,
    obtenerListaSolViajesPorIdTareaPei,
  }
}
