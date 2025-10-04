import api from '@/services/axios'

export const tareasServicios = {
  /* Fetch todas las tareas */
  all: async () => {
    try {
      const respuesta = await api.get('/tareas-actividad/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch tareas ', error)
      throw error
    }
  },

  /* Fetch tareas por id de actividad */
  porActividad: async (actividadId) => {
    try {
      const respuesta = await api.get(`/tareas-actividad/?actividad=${actividadId}`)
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch tareas por actividad id ' + actividadId, error)
      throw error
    }
  },

  /* Fetch tarea por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/tareas-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch tarea id ' + id, error)
      throw error
    }
  },

  /* Crear tarea */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/tareas-actividad/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear tarea', error)
      throw error
    }
  },

  /* Actualizar tarea */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/tareas-actividad/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar tarea id ' + id, error)
      throw error
    }
  },

  /* Eliminar tarea */
  del: async (id) => {
    try {
      const respuesta = await api.delete('/tareas-actividad/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar tarea id ' + id, error)
      throw error
    }
  },

  /* Crear tarea para una actividad específica */
  crearParaActividad: async (actividadId, data) => {
    try {
      const tareaData = {
        ...data,
        actividad: actividadId,
      }
      const respuesta = await api.post('/tareas-actividad/', tareaData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear tarea para actividad ' + actividadId, error)
      throw error
    }
  },

  /* Actualizar múltiples tareas en lote */
  actualizarLote: async (tareas) => {
    try {
      const respuesta = await api.put('/tareas-actividad/lote/', { tareas })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar tareas en lote', error)
      throw error
    }
  },
}
