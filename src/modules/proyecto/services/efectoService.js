import api from '@/services/axios'

export const efectoServicios = {
  /* Fetch  */
  all: async () => {
    try {
      const respuesta = await api.get('/efectos-proyecto/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch efectos ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/efectos-proyecto/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch efecto  id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/efectos-proyecto/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear efecto', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/efectos-proyecto/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar efecto id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/efectos-proyecto/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar efecto  id' + id, error)
      throw error
    }
  },
}
