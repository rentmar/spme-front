import api from '@/services/axios'

export const tipoActividadServicio = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await api.get('/tipo-actividad/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch  ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/tipo-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch    id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/tipo-actividad/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear ', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/tipo-actividad/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/tipo-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar   id' + id, error)
      throw error
    }
  },
}
