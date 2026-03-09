//Composable para:
//- Informe de Actividad
//- Informe de Tareas
import { informeActividadPrinServicio } from '../services/informeActividadPrinService'
import { ref } from 'vue'

export function useInformeActividadPrincipal() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const actividadDetallesInforme = ref(null)
  const informeActividadPrincipal = ref(null) //Informe de Actividad principal
  const informeTareaPrincipal = ref(null) //Informe de Tarea principal

  /********************************** Informe de Actividad Principal ******************************************************/
  //Obtener las tareas de una actividad(usando su id), mas sus respectivos informes
  async function obtenerDetallesActividadPorID(idactividadprin) {
    loading.value = true
    try {
      const respuesta = await informeActividadPrinServicio.infActividadPrinDetalles(idactividadprin)
      actividadDetallesInforme.value = respuesta
      return respuesta
    } catch (err) {
      console.error('error al obtener detalles de la activida: ' + idactividadprin, err)
    } finally {
      loading.value = false
    }
  }

  //Crear un informe de Actividad principal
  async function crearInformeActividadPrincipal(datosInformePrincipal) {
    loading.value = true
    try {
      const respuesta =
        await informeActividadPrinServicio.crearInformeActividadPrincipal(datosInformePrincipal)
      informeActividadPrincipal.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al crear el informe de actividad principal', err)
    } finally {
      loading.value = false
    }
  }

  /*********************************Informe de Tarea Principal ********************************/
  //Crear un informe de Tarea Principal
  async function crearInformeTareaPrincipal(datosInformePrincipal) {
    loading.value = true
    try {
      const respuesta =
        await informeActividadPrinServicio.crearInformeTareaPrincipal(datosInformePrincipal)
      informeTareaPrincipal.value = respuesta
    } catch (err) {
      console.error('Error al crear el informe de tarea principal', err)
    } finally {
      loading.value = false
    }
  }

  return {
    //Estado
    loading,
    error,
    actividadDetallesInforme, //Actividad con tareas e informes
    informeActividadPrincipal,
    informeTareaPrincipal,
    //Func Informe Actividad
    obtenerDetallesActividadPorID,
    crearInformeActividadPrincipal,
    //Func Informe Tarea
    crearInformeTareaPrincipal,
  }
}
