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
  /* Usuario por ID */
  usuarioPorId: async (id) => {
    try {
      const respuesta = await api.get('/usr/usuario/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error datos del usuario: ' + id, error)
      throw error
    }
  },
  usuariosTodos: async () => {
    try {
      const respuesta = await api.get('/usr/usuarios/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error datos del usuario: ', error)
      throw error
    }
  },
  regUsuario: async (usrData) => {
    try {
      const respuesta = await api.post('/usr/registrar/', usrData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al registrar el usuario ', error)
      throw error
    }
  },
}
