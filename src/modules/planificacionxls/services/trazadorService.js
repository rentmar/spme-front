import api from '@/services/axios'

export const trazadorServicios = {
  /* Trazador de actividades con indicador */
  trazadorActividadIndicador: async (id) => {
    try {
      const respuesta = await api.get('/actividad/' + id + '/ruta-con-indicadores/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: actividad-indicador error al trazar la ruta de la actividad id: ' + id,
        error,
      )
      throw error
    }
  },
  /* Trazador de actividad */
  trazadorActividad: async (id) => {
    try {
      const respuesta = await api.get('actividades/' + 83 + '/ruta-proyecto/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: actividad error al trazar la ruta de la actividad id: ' + id, error)
      throw error
    }
  },
  /* Trazador de todas las rutas */
  trazadorAllActividadIndicador: async (id) => {
    try {
      const respuesta = await api.get('actividad/' + id + '/all-rutas-con-indicadores/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: actividad-indicador error al trazar todas las rutas de la actividad id: ' + id,
        error,
      )
      throw error
    }
  },
}
