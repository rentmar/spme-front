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
  /* Historial de planificaciones por ID de proyecto */
  planificacionPorIdProyecto: async (idproyecto) => {
    try {
      const respuesta = await apiPlan.get('/planificaciones/proyecto/' + idproyecto + '/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: error al extraer el historial de seguimiento del proyecto con id: ' + idproyecto,
        error,
      )
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
  /* Cambio de planificacion por id de planificacion */
  cambiosPlanIdPlan: async (idplan) => {
    try {
      const respuesta = await apiPlan.get('/planificaciones/' + idplan + '/cambios/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Actualizar Planificacion de proyectos */
  guardarPlanificacionProyectoBulk: async (data) => {
    try {
      const respuesta = await apiPlan.post('/planificacion/procesar-bulk/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
}
