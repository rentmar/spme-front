//Composable para los informes de actividad/tareas
import { informeActividadPrinServicio } from '../services/informeActividadPrinService'
import { ref } from 'vue'

export function useInformeActividadPrincipal() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const actividadDetallesInforme = ref(null)

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

  return {
    //Estado
    loading,
    error,
    actividadDetallesInforme, //Actividad con tareas e informes
    //Func
    obtenerDetallesActividadPorID,
  }
}
