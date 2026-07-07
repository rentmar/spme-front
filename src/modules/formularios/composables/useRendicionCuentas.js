//Composable para la Rendicion de Cuentas
import { ref } from 'vue'
import { rendicionCuentasServicio } from '../services/rendicionCuentasService'

export function useRendicionCuentas() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listaRendicionCuentasActividad = ref(null)
  const listaRendicionCuentasTarea = ref(null)
  const listaRendicionCuentasActividadPei = ref(null)
  const listaRendicionCuentasTareaPei = ref(null)
  const rendicionCuentas = ref(null)

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

  //Listar Rendicion de cuentas de una Actividad
  async function obtenerListaRendicionCuentasPorIdActividadPei(idactividad) {
    loading.value = true
    try {
      const respuesta =
        await rendicionCuentasServicio.solRendicionCuentasPorIdActividadPei(idactividad)
      listaRendicionCuentasActividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Listar Rendicion Cuentas de una Tarea
  async function obtenerListaRendicionCuentasPorIdTareaPei(idactividad, idtarea) {
    loading.value = true
    try {
      const respuesta = await rendicionCuentasServicio.solRendicionCuentasPorIdTareaPei(
        idactividad,
        idtarea,
      )
      listaRendicionCuentasTareaPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Rendicion de cuentas mas Solicitudes relacionadas
  async function obtenerRendicionCuentasMasSolicitudes(idRendicionCuentas) {
    loading.value = true
    try {
      const respuesta =
        await rendicionCuentasServicio.solRendicionCuentasMasSolicitudes(idRendicionCuentas)
      rendicionCuentas.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener rendicion de cuentas por ID
  async function obtenerRendicionCuentasPorId(idRendicionCuentas) {
    loading.value = true
    try {
      const respuesta = await rendicionCuentasServicio.solRendicionCuentasPorId(idRendicionCuentas)
      rendicionCuentas.value = respuesta
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
    listaRendicionCuentasActividadPei,
    listaRendicionCuentasTareaPei,
    rendicionCuentas,
    obtenerListaRendicionCuentasPorIdActividad,
    obtenerListaRendicionCuentasPorIdTarea,
    obtenerListaRendicionCuentasPorIdActividadPei,
    obtenerListaRendicionCuentasPorIdTareaPei,
    obtenerRendicionCuentasMasSolicitudes,
    obtenerRendicionCuentasPorId,
  }
}
