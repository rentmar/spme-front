//Composable useUsuario
import { ref } from 'vue'
import { usuarioServicios } from '../services/usuariosService'
//Estados
const loading = ref(false)
const error = ref(null)
const usuarios = ref([])
const usuario = ref(null)
const tokens = ref(null)
const permisosUsuario = ref(null)
const listaUsuariosMensajes = ref()
const listaDeUsuarioCompleta = ref([])

export function useUsuario() {
  //Datos de usuario por nick
  async function informacionUsuarioPorNick(usuarioNick) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.usuarioDatosPorNick(usuarioNick)
      usuario.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener todos los usuarios
  async function obtenerUsuarios() {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.all()
      usuarios.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener todas las nicks de usuario
  async function obtenerUsuariosNicks() {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.allnicks()
      usuarios.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener los tokens, mediante credenciales
  async function obtenerTokens(credenciales) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.obtenerTokens(credenciales)
      tokens.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener los permisos de usuario
  async function obtenerPermisos(tokenAcceso) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.obtenerPermisosUsuario(tokenAcceso)
      permisosUsuario.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error cargando la informacion del usuario', err)
    }
  }

  //Obtener la lista de usuarios para mensajeria
  async function obtenerListaUsuarios() {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.obtenerListaUsuario()
      listaUsuariosMensajes.value = respuesta
      return respuesta
    } catch (error) {
      console.error('Error cargando la lista de usuarios', error)
    }
  }

  //Obtener la lista de usuarios completa
  async function obtenerListaUsuariosCompleta() {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.listaDeUsuariosCompleta()
      console.log('respuest comp', respuesta)
      listaDeUsuarioCompleta.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al cargar la lista de Usuarios completa', err)
    } finally {
      loading.value = false
    }
  }

  //Obtener el usuario por su id
  async function obtenerUsuarioPorId(idusuario) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.obtenerUsuarioPorId(idusuario)
      usuario.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al cargar el usuario', err)
    } finally {
      loading.value = false
    }
  }

  //Obtener el id de un usuario

  //Fecth usuarios

  //Carga de usuario por id

  return {
    loading, //ref
    error, //ref
    usuarios, //ref lista de kpis
    usuario, //ref un kpi por id
    tokens,
    permisosUsuario,
    listaUsuariosMensajes,
    listaDeUsuarioCompleta,
    informacionUsuarioPorNick, //func
    obtenerUsuarios, //fund
    obtenerUsuariosNicks, //func
    obtenerTokens,
    obtenerPermisos,
    obtenerListaUsuarios,
    obtenerListaUsuariosCompleta,
    obtenerUsuarioPorId,
  }
}
