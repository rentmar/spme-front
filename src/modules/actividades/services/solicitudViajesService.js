import api from '@/services/axios'

export const solicitudViajeServicios = {
  /* Fetch */
  all: async () => {
    try {
      const respuesta = await api.get('/solicitud-viaje/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch solicitudes de viaje ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/solicitud-viaje/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch  sol de viaje id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/solicitud-viaje/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear sol de viaje', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/solicitud-viaje/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar sol de viaje id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/solicitud-viaje/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar la sol de viaje con id' + id, error)
      throw error
    }
  },
}
