import { apiUsuarios } from '@/services/axios'
import api from '@/services/axios'

export const usuarioServicios = {
  usuarioDatosPorNick: async (usuarioNick) => {
    try {
      const respuesta = await apiUsuarios.post('/obtenerUsuario/', usuarioNick)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error datos del usuario: ' + usuarioNick, error)
      throw error
    }
  },
  all: async () => {
    try {
      const respuesta = await api.get('/usr/usuarios/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al fetch usuaurios', error)
    }
  },
  allnicks: async () => {
    try {
      const respuesta = await api.get('/usuariosnick/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: error fecths nicks', error)
    }
  },
}
