
import api from '@/services/axios'

export const tareasServicios = {
  /* Fetch kpis */
  all: async () => {
    try {
      const respuesta = await api.get('/tareas-actividad/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch tareas ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/tareas-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch a tareas id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/tareas-actividad/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear tarea', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/tareas-actividad/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar tarea id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/tareas-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar tarea  id' + id, error)
      throw error
    }
  },
}

