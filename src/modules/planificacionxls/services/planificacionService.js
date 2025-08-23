import { apiPlan, api } from '@/services/axios'

export const planificacionServicios = {
  /* Fetch planes */
  all: async () => {
    try {
      const respuesta = await apiPlan.get('/planes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch ', error)
      throw error
    }
  },
  /* Planes Por id */
  porId: async (id) => {
    try {
      const respuesta = await apiPlan.get('/planes/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch  id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await apiPlan.post('/planes/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear ', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await apiPlan.put('/planes/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await apiPlan.del('/planes/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar  plan con  id' + id, error)
      throw error
    }
  },
  /* planes por proyecto id */
  planIdProyecto: async (id) => {
    try {
      const respuesta = await apiPlan.get('/planes/?proyecto_id=' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch planes por id de proyecto ' + id, error)
      throw error
    }
  },
  /* ultimo plan */
  planProyecto: async (id) => {
    try {
      const respuesta = await apiPlan.get('/proyectos/' + id + '/planificacion/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch plan por id de proyecto ' + id, error)
      throw error
    }
  },
  /* Conteo de planificador */
  contarPlanificacionesPorIdProyecto: async (id) => {
    try {
      const respuesta = await api.get('/planificaciones/contar/?proyecto_id=' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios:  ' + id, error)
      throw error
    }
  },
  /********************* CONTEOS PARA CONFIGURACION DE COLUMNAS *******************************/
  getIndicadoresOgCount: async (proyectoId) => {
    const respuesta = await api.get('/proyectos/' + proyectoId + '/indicadores-og/count/')
    return respuesta.data.count || 0
  },
  getResultadoOgCount: async (proyectoId) => {
    const respuesta = await api.get('/proyectos/' + proyectoId + '/resultados-og/count/')
    return respuesta.data.count || 0
  },
  getColumnasCount: async (proyectoId) => {
    try {
      const respuesta = await api.get('/proyectos/' + proyectoId + '/column-stats/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fallo al extraer conteos', error)
      throw error
    }
  },
  /********************* FIN DE CONTEOS PARA CONFIGURACION DE COLUMNAS *************************/
}
