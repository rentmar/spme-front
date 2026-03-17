//Composable para los validadores de los formularios
import { ref } from 'vue'
import { validadoresServicio } from '../services/validadoresService'

export function useValidadores() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  /******************************** Validadores **************************************************/
  //Lista de validadores y el usuario redactor
  async function listarValidadores() {
    loading.value = true
    try {
      const respuesta = await validadoresServicio.listaValidadores()
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /*********************** VALIDADORES Informe Actividad Principal****************************************************/

  //Extrae el estado de validaciones de un informe de actividad principal
  async function estadoValidacionInformeActividadPrincipal(idinforme) {
    loading.value = true
    try {
      const respuesta = await validadoresServicio.estadoValidacionInformeActividad(idinforme)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Listar mis validacions
  async function obtenerMisValidaciones() {
    loading.value = true
    try {
      const respuesta = await validadoresServicio.listarMisValidaciones()
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Listar mis validaciones pendientes
  async function obtenerMisValidacionesPendientes() {
    loading.value = true
    try {
      const respuesta = await validadoresServicio.listarMisValidacionesPendientes()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //estado
    loading,
    error,
    //func validadores
    listarValidadores,
    obtenerMisValidaciones,
    obtenerMisValidacionesPendientes,
    //Func Informe actividad principal
    estadoValidacionInformeActividadPrincipal,
  }
}
