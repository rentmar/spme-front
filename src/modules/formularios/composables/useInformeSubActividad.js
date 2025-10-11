//Composable para los informes de subactividad
//Completo y reducido
import { formulariosServico } from '../services/formularioService'
import { ref } from 'vue'

export function useInformeSubActividad() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  //Variables
  const informeSubActividadMin = ref()
  const informeSubActividadMinLista = ref([])
  const informeSubActividadMinRespuesta = ref()

  //Crear un informe de Subactividad Minimo
  async function crearInformeSubactividadMinimo(informeSubActividadData) {
    loading.value = true
    try {
      const respuesta =
        await formulariosServico.informeSubactividadMinimoCrear(informeSubActividadData)
      informeSubActividadMinRespuesta.value = respuesta
    } catch (err) {
      error.value = err
      console.error('No es posible crear el informe de subactividad', err)
    } finally {
      loading.value = false
    }
  }
  //Listar los informes de subactividad
  async function listaInformeSubactividadMinimo() {
    loading.value = true
    try {
      const respuesta = await formulariosServico.informeSubactividadMinimoListar()
      informeSubActividadMinLista.value = respuesta
    } catch (err) {
      error.value = err
      console.error('No es posible obtener la lista informe de subactividad', err)
    } finally {
      loading.value = false
    }
  }

  //Obtener un informe por si id
  async function obtenerInformeSubactividadPorId(idinfsubac) {
    loading.value = true
    try {
      const respuesta = await formulariosServico.informeSubactividadMinimoPorId(idinfsubac)
      informeSubActividadMin.value = respuesta
    } catch (err) {
      error.value = err
      console.error('No es posible obtener el informe de subactividad con id: ' + idinfsubac, err)
    } finally {
      loading.value = false
    }
  }
  return {
    //Estados
    loading,
    error,
    informeSubActividadMin,
    informeSubActividadMinLista,
    informeSubActividadMinRespuesta,
    //Func
    crearInformeSubactividadMinimo, //Crea un informe de subactividad minimo
    listaInformeSubactividadMinimo, //Lista todos los informes de subactividad minimos
    obtenerInformeSubactividadPorId,
  }
}
