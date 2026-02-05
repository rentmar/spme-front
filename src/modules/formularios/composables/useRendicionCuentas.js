//Composable para la Rendicion de Cuentas
import { ref } from 'vue'
import { rendicionCuentasServicio } from '../services/rendicionCuentasService'

export function useRendicionCuentas() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listaRendicionCuentasActividad = ref(null)
  const listaRendicionCuentasTarea = ref(null)

  //Listar Rendicion de cuentas de una Actividad
  async function obtenerListaRendicionCuentasPorIdActividad(idactividad) {
    loading.value = true
    try {
      const respuesta =
        await rendicionCuentasServicio.solRendicionCuentasPorIdActividad(idactividad)
      listaRendicionCuentasActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Listar Rendicion Cuentas de una Tarea
  async function obtenerListaRendicionCuentasPorIdTarea(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await rendicionCuentasServicio.solRendicionCuentasPorIdTarea(
        idactividad,
        idtarea,
      )
      listaRendicionCuentasTarea.value = respuesta
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
    listaRendicionCuentasActividad,
    listaRendicionCuentasTarea,
    obtenerListaRendicionCuentasPorIdActividad,
    obtenerListaRendicionCuentasPorIdTarea,
  }
}
