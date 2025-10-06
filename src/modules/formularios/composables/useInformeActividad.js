//Composable para los informes de Actividad
//Completo y reducido
import { formulariosServico } from '../services/formularioService'
import { ref } from 'vue'
export function useInformeActividad() {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Variables
  const informeActividadMin = ref() //Un informe de actividad
  const informeActividadMinLista = ref([]) //Lista de informes de actividad
  const informeActividadMinRespuesta = ref() //Respuesta de la creacion del informe de actividad

  //Obtener todos los informes minimos de actividad por id de Actividad

  //Crear un informe de actividad minimo
  async function crearInformeActividadMin(informeActividadData) {
    loading.value = true
    try {
      const respuesta = await formulariosServico.crearInformeActividadMinimo(informeActividadData)
      informeActividadData.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      console.error('No se pudo crear el informde de actividad', err)
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    informeActividadMin,
    informeActividadMinLista,
    informeActividadMinRespuesta,
    //fun
    crearInformeActividadMin, //crea el informe de actividad y devuelve los datos del informe
    //obtenerInformesActividad, //Lista los informes de una actividad
  }
}
