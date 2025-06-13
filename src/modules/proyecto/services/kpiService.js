import api from '@/services/axios'

export const kpiServicios = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await api.get('/kpi/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch kpis', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/kpi/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch kpi id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/kpi/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al al crear kpi', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/kpi/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar kpi id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  del: async (id) => {
    try {
      const respuesta = await api.del('/kpi/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar kpi id' + id, error)
      throw error
    }
  },
}
