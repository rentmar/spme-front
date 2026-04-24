//Composable para vincular solicitudes al Informe de actividad/tarea
import { ref } from 'vue'
import { vinculacionInformeActividadServicio } from '../services/vinculacionInformeActividadService'

export function useVinculacionesInformeActividad() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  //Estados
  const listaSolViajesVinculadasInformeActividad = ref(null)
  const listaSolViajesDisponibles = ref(null)
  const listaSolViajeDisponiblesTarea = ref([])

  //Solicitudes de viaje vinculadas al Informe de Actividad
  async function obtenerSolsViajePorInformeActividad(idInformeActividad) {
    loading.value = true
    try {
      const respuesta =
        await vinculacionInformeActividadServicio.solViajesVinculadasInformesActividad(
          idInformeActividad,
        )
      listaSolViajesVinculadasInformeActividad.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al obtener sol de fondos vinculadas al Informe Actividad', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Solicitudes de viaje disponebles por id de actividad
  async function obtenerSolViajesDisponiblesPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta =
        await vinculacionInformeActividadServicio.solViajeDisponiblesPorIdActividad(idactividad)

      listaSolViajesDisponibles.value = respuesta
      return respuesta
    } catch (err) {
      console.error(
        'Error al obtener las sol de viajes disponibles de la actividad ' + idactividad,
        err,
      )
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Solicitudes de viaje disponibles por id de Tarea y actividad
  async function obtenerSolViajesDisponiblesPorIdTarea(idActividad, idTarea) {
    loading.value = true
    try {
      const respuesta = await vinculacionInformeActividadServicio.solViajeDisponiblePorIdTarea(
        idActividad,
        idTarea,
      )
      listaSolViajeDisponiblesTarea.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al obtener las sol de viajes disponibles de la tarea', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados generales
    loading,
    error,
    //Estados
    listaSolViajesVinculadasInformeActividad,
    listaSolViajesDisponibles,
    listaSolViajeDisponiblesTarea,
    //Func
    obtenerSolsViajePorInformeActividad,
    obtenerSolViajesDisponiblesPorIdActividad,
    obtenerSolViajesDisponiblesPorIdTarea,
  }
}
