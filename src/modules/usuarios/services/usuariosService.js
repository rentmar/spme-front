import { apiUsuarios } from '@/services/axios'

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
}
