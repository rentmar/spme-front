import { apiPlan } from '@/services/axios'

export const segPlanService = {
  /* Lista de planificaciones */
  planificacionLista: async () => {
    try {
      const respuesta = await apiPlan.get('/planificacion-proyecto-respaldo/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Planificacion por ID de planificacion */
  planificacionPorId: async (idplanificacion) => {
    try {
      const respuesta = await apiPlan.get(
        '/planificacion-proyecto-respaldo/' + idplanificacion + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Lista los Cambios en la planificacion */
  cambioPlanLista: async () => {
    try {
      const respuesta = await apiPlan.get('/cambio-planificacion-proyecto-respaldo/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Cambio de PLanificacion por idcambioplan */
  cambioPlanPorId: async (idCamPlan) => {
    try {
      const respuesta = await apiPlan.get(
        '/cambio-planificacion-proyecto-respaldo/' + idCamPlan + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /*  */
}
