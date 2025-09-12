import apiProg from '@/services/axios'

export const programasServicios = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await apiProg.get('/programas/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch  ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await apiProg('/programas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch   id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await apiProg.post('/programas/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear ', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await apiProg.put('/programas/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar actividad id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await apiProg.delete('/programas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar actividad  id' + id, error)
      throw error
    }
  },
}
