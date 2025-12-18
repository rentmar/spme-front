import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificaciones } from '../composables/useNotificaciones'
import { useUserStore } from '@/stores/user'

export const useNotificacionesBellStore = defineStore('notificaciones-bell', () => {
  // Estados (mantener los mismos)
  const loading = ref(false)
  const error = ref(null)
  const listaMensajes = ref(null) // Bandeja de entrada total
  const listaMensajesFiltrada = ref([]) // Cambiar a array vacío inicialmente

  // Inicializar el store
  const usuarioStore = useUserStore()
  // Inicializar el composable
  const { leerBandejaUsuario, cambiarEstadoMensaje, cambiarMensajeALeidos } = useNotificaciones()

  // Cargar la bandeja de mensajes completa
  async function cargarBandejaMensajes() {
    loading.value = true
    try {
      const respuesta = await leerBandejaUsuario(usuarioStore.accessToken)
      listaMensajes.value = respuesta.data?.mensajes || []
      // Llamar automáticamente a filtrarNoLeidos después de cargar
      filtrarNoLeidos()
    } catch (err) {
      console.error('Error al cargar la bandeja de mensajes al store', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Función para filtrar mensajes no leídos
  function filtrarNoLeidos() {
    if (!listaMensajes.value || !Array.isArray(listaMensajes.value)) {
      listaMensajesFiltrada.value = []
      return
    }

    // Filtrar mensajes con estado "no_leido"
    listaMensajesFiltrada.value = listaMensajes.value.filter(
      (mensaje) => mensaje.estado === 'no_leido',
    )
  }

  // Opcional: Función para obtener conteo de no leídos
  function obtenerConteoNoLeidos() {
    if (!listaMensajes.value || !Array.isArray(listaMensajes.value)) {
      return 0
    }
    return listaMensajes.value.filter((mensaje) => mensaje.estado === 'no_leido').length
  }

  //Funcion para colocar en estado "leido", el mensaje
  async function mensajeAEstadoLeido(idmensaje) {
    loading.value = true
    try {
      const respuesta = await cambiarEstadoMensaje(
        idmensaje,
        { estado: 'leido' },
        usuarioStore.accessToken,
      )
      return respuesta
    } catch (err) {
      console.error('No se pudo cambiar el mansaje a leido', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Funcion para cambiar varios mensajes a leidos
  //idsMensaje = [1,2,3]
  async function marcarTodosALeidos(idsMensaje) {
    loading.value = true
    try {
      const respuesta = await cambiarMensajeALeidos(idsMensaje, usuarioStore.accessToken)
      return respuesta
    } catch (err) {
      console.error('No se pudo marcar a leidos', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    listaMensajes,
    listaMensajesFiltrada,

    // Funciones
    cargarBandejaMensajes,
    filtrarNoLeidos,
    obtenerConteoNoLeidos,
    mensajeAEstadoLeido,
    marcarTodosALeidos,
  }
})
