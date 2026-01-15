//composables useSeguimientoPlanificacionPei
import { ref } from 'vue'
import { seguimientoPlanificacionPeiServicios } from '../services/seguimientoPlanificacionPeiService'

export function useSeguimientoPlanificacionPei() {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  const listaSeguimientoPlanificacionPei = ref([])

  //Cargar la lista de seguimiento de la planificacion PEI
  async function obtenerListaSeguimientoPlanificacionPei(idpei) {
    loading.value = true
    try {
      const respuesta =
        await seguimientoPlanificacionPeiServicios.listaPlanificacionSeguimientoPorPei(idpei)
      listaSeguimientoPlanificacionPei.value = respuesta
      return respuesta
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  //guardar la planificacion
  async function actualizarPlanificacionPei(planificacionData) {
    loading.value = true
    try {
      const respuesta =
        await seguimientoPlanificacionPeiServicios.guardarPlanificacionPeiBulk(planificacionData)
      return respuesta
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    listaSeguimientoPlanificacionPei,
    //func
    obtenerListaSeguimientoPlanificacionPei,
    actualizarPlanificacionPei,
  }
}
