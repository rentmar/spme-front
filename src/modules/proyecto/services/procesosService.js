import api from '@/services/axios'

export const procesosServicios = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await api.get('/procesos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch procesos ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/procesos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch proceso por id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/procesos/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error crear procesos ', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/procesos/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar procesos id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.del('/procesos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar proceoso con id' + id, error)
      throw error
    }
  },
}
