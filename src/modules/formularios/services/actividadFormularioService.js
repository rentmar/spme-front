import api from '@/services/axios'

export const actividadFormularioServicio = {
  /* Informacion de la actividad por id */
  actividadInformacion: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividades-formularios/' + idactividad + '/detalle/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener la informacion de la actividad ', error)
      throw error
    }
  },
}
