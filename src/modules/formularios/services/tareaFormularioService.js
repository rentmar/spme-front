import api from '@/services/axios'

export const tareaFormularioServicio = {
  /* Informacion de la actividad por id */
  tareaInformacion: async (idtarea) => {
    try {
      const respuesta = await api.get('/tareas-actividad/' + idtarea + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener la informacion de la tarea ', error)
      throw error
    }
  },
}
