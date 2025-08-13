import api from '@/services/axios'

export const actividadServicios = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await api.get('/actividades/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividades ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/actividades/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividad  id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/actividades/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear actividad', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/actividades/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar actividad id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/actividades/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar actividad  id' + id, error)
      throw error
    }
  },
}
