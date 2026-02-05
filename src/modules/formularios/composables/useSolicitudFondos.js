//Composable para Solicitudes de Fondos
import { ref } from 'vue'
import { solicitudDeFondosServico } from '../services/solicitudFondosService'

export function useSolucitudFondos() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  //Estados
  const solucitudFondos = ref(null)
  const listaSolicitudesFondosActividad = ref(null)
  const lsitaSolicitudesFondosTarea = ref(null)

  //Listar Sol de Fondos de una Actividad
  async function obtenerListaSolFondosPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta = await solicitudDeFondosServico.solFondosPorIdActividad(idactividad)
      listaSolicitudesFondosActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Listar Sol de fondos de una Tarea
  async function obtenerListaSolFondosPorIdTarea(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await solicitudDeFondosServico.solFondosPorIdtarea(idactividad, idtarea)
      lsitaSolicitudesFondosTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    solucitudFondos,
    listaSolicitudesFondosActividad,
    lsitaSolicitudesFondosTarea,
    //func
    obtenerListaSolFondosPorIdActividad,
    obtenerListaSolFondosPorIdTarea,
  }
}
