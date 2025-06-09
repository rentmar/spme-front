import api from '@/services/axios'

export const instanciaGestoraServicio = {
  /* Todas las instancias gestoras */
  obtenerTodo: async () => {
    try {
      const respuesta = await api.get('/instancia-gestora/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error, lista de Instancias Gestoras', error)
      throw error
    }
  },
  /* Instancia gestora por ID */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/instancia-gestora/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error, instancia gestora con ID: ' + id, error)
      throw error
    }
  },
  /* Crear Instancia gestora */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/instancia-gestora/', data)
      return respuesta
    } catch (error) {
      console.log('Axios, no se creo la nueva instancia gestora', error)
      throw error
    }
  },
  /* Update Instancia gestora */
  actualizar: async (id, data) => {
    try {
      const respuesta = await api.put('/instancia-gestora/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar la instacion gestora con ID: ' + id, error)
      throw error
    }
  },
  /* Eliminar Instancia gestora */
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/instancia-gestora/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar la instacia gestora con ID: ' + id, error)
      throw error
    }
  },
}
