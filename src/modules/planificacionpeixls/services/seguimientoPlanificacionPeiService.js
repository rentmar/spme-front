import { apiPlan } from '@/services/axios'

export const seguimientoPlanificacionPeiServicios = {
  /* Fetch todas las planificaciones */
  all: async () => {
    try {
      const respuesta = await apiPlan.get('/planificacion-pei-crud/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Planificacion Por id */
  porId: async (idplanificacionpei) => {
    try {
      const respuesta = await apiPlan.get('/planificacion-pei-crud/' + idplanificacionpei + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch  id ' + idplanificacionpei, error)
      throw error
    }
  },
  /*crear planificacion */
  crear: async (dataPlanificacionPei) => {
    try {
      const respuesta = await apiPlan.post('/planificacion-pei-crud/', dataPlanificacionPei)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear ', error)
      throw error
    }
  },
  /*actualizar planificacion */
  update: async (idplanificacionpei, dataPlanificacionPei) => {
    try {
      const respuesta = await apiPlan.put(
        '/planificacion-pei-crud/' + idplanificacionpei + '/',
        dataPlanificacionPei,
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  id ' + idplanificacionpei, error)
      throw error
    }
  },
  /*eliminar planificacion */
  delete: async (idplanificacionpei) => {
    try {
      const respuesta = await apiPlan.del('/planificacion-pei-crud/' + idplanificacionpei + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar  plan con  id' + idplanificacionpei, error)
      throw error
    }
  },
  /************************** Otras Funciones **************************************/
  /* Listar todo el seguimiento de planificacion  */
  listaPlanificacionSeguimientoPorPei: async (idpei) => {
    try {
      const respuesta = await apiPlan.get('/planificaciones/seguimiento-pei/' + idpei + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar el historial de la planificacion', err)
    }
  },
  /* Guardar planificacion */
  guardarPlanificacionPeiBulk: async (dataPlanificacionPei) => {
    try {
      const respuesta = await apiPlan.post(
        '/planificacion-pei/procesar-bulk/',
        dataPlanificacionPei,
      )
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al registrar la planificacion', err)
    }
  },
}
