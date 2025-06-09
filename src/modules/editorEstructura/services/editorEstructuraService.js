import api from '@/services/axios'

export const diagramaEstructuraCrud = {
  /* Obtener todos los proyectos */
  obtenerAll: async () => {
    try {
      const respuesta = await api.get('/diagramas/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error obtener todos los proyectos  ')
      throw error
    }
  },
  /* Diagrama por id */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/diagramas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error, instancia gestora con ID: ' + id, error)
      throw error
    }
  },
  /* Crear diagrama */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/diagramas/', data)
      return respuesta
    } catch (error) {
      console.log('Axios, no se creo la nueva instancia gestora', error)
      throw error
    }
  },
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/diagramas/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar el diagrama con ID: ' + id, error)
      throw error
    }
  },
}
