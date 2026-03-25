import { apiUsuarios } from '@/services/axios'
import { apiAxs } from '@/services/axios'
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
  obtenerTokens: async (credenciales) => {
    try {
      const respuesta = await api.post('/token/', credenciales)
      return respuesta.data
    } catch (error) {
      console.log('Axios: error al obtener tokens de autenticacion', error)
      throw error
    }
  },
  obtenerPermisosUsuario: async (tokenAcceso) => {
    try {
      const permisosData = await apiAxs.get('/permisos/usuario/', {
        headers: {
          Authorization: `Bearer ${tokenAcceso}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('Axios: permisos usuario', permisosData)
      return permisosData.data
    } catch (err) {
      console.error('Axios: error cargando informacion del usuario', err)
      throw err
    }
  },
  /* Obtener la lista de usuarios, sin superusuario */
  obtenerListaUsuario: async () => {
    try {
      const respuesta = await api.get('/usuarios/public/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar la lista de usuarios', err)
    }
  },
  /* Listado de Usuarios */
  listaDeUsuariosCompleta: async () => {
    try {
      const respuesta = await api.get('/usuarios-crud/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar la lista de usuarios completa', err)
    }
  },
  obtenerUsuarioPorId: async (idusuario) => {
    try {
      const respuesta = await api.get('/usuarios-crud/' + idusuario + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar el usuario con ID: ' + idusuario, err)
    }
  },
}
