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

  return {
    //estado
    loading,
    error,
    //func validadores
    listarValidadores,
    //Func Informe actividad principal
    estadoValidacionInformeActividadPrincipal,
  }
}
