import api from '@/services/axios'

export const procedenciaFondosServicio = {
  /* Fetch procedencia fondos */
  all: async () => {
    try {
      const respuesta = await api.get('/procedencia-fondos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch procedencia de fondos error', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/procedencia-fondos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch procedencia de fondos id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/procedencia-fondos/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear procedencia fondos ', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/procedencia-fondos/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar procedencia de fondos ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/procedencia-fondos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar procedencia de fondos ' + id, error)
      throw error
    }
  },
}
