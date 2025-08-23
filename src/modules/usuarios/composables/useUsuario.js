//Composable useUsuario
import { ref } from 'vue'
import { usuarioServicios } from '../services/usuariosService'
//Estados
const loading = ref(false)
const error = ref(null)
const usuarios = ref([])
const usuario = ref(null)

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

<<<<<<< HEAD
  //Datos de usuario por id
  async function usuarioPorIdentificador(id) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.usuarioPorId(id)
      usuario.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Lista de usuarios
  async function listaUsuarios() {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.usuariosTodos()
      usuarios.value = respuesta
      return respuesta

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


  async function crearUsuario(datosUsuario) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.regUsuario(datosUsuario)
      usuarios.value = respuesta
      return respuesta

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


  //Fecth usuarios

  //Carga de usuario por id


  return {
    loading, //ref
    error, //ref
    usuarios, //ref lista de kpis
    usuario, //ref un kpi por id
    informacionUsuarioPorNick, //func

    usuarioPorIdentificador, //func
    listaUsuarios, //func
    crearUsuario, //func

    obtenerUsuarios, //fund
    obtenerUsuariosNicks, //func

  }
}
