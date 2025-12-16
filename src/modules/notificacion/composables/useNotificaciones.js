//Composable useNotificaciones.js
import { ref } from 'vue'
import { mensajeServicios } from '../services/mensajeService'

//Estados
const loading = ref(false)
const error = ref(null)

export function useNotificaciones() {
  //Enviar mensaje
  async function enviarMensaje(mensajeData, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.crearMensaje(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Enviar mensaje sistema
  async function enviarMensajeSistema(mensajeData, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.crearMensajeSistema(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Enviar mensaje multiple
  async function enviarMensajeMultiple(mensajeData, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.crearMensajesMultiples(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Mensaje automatico del sistema
  async function enviarMensajeAutomatico(mensajeData) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.crearMensajeAutomaticoSistema(mensajeData)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cambiar estado de mensajes a leidos
  //mensajesIds: [1, 2, 3, 4]
  async function cambiarMensajeALeidos(mensajesIds, accessToken) {
    const mensajesData = {
      mensaje_ids: mensajesIds,
    }

    loading.value = true
    try {
      const respuesta = await mensajeServicios.marcarMensajesLeidos(mensajesData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Lee un mensaje y cambia su estado a leido
  async function leerMensaje(idmensaje, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.obtenerMensaje(idmensaje, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cambiar el estado de una notificacion
  // no_leido, leido, archivado, eliminado
  async function cambiarEstadoMensaje(idmensaje, estadoData, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.actualizarEstadoMensaje(
        idmensaje,
        estadoData,
        accessToken,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar(soft) mensajes
  // idmensajes: [1, 3, 4]
  async function eliminarMensajesHard(idmensajes, accessToken) {
    loading.value = true
    const mensajeData = {
      ids: idmensajes,
      tipo_eliminacion: 'hard',
    }
    try {
      const respuesta = await mensajeServicios.eliminarMensajes(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar(hard) mensajes
  async function eliminarMensajesSoft(idmensajes, accessToken) {
    loading.value = true
    const mensajeDataSoft = {
      ids: idmensajes,
    }
    try {
      const respuesta = await mensajeServicios.eliminarMensajes(mensajeDataSoft, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar(soft) mensaje
  //idmensaje = 1
  async function eliminaMensajeSoft(idmensaje, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.eliminarMensaje(idmensaje, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar(soft) mensaje
  async function eliminaMensajeHard(idmensaje, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.eliminarMensajeHard(idmensaje, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Actualizar estado de mensajes
  // {"ids": [1, 2, 3], "estado": "leido"}
  // no_leido, leido, archivado, eliminado
  async function cambiarEstadoMensajes(mensajeData, accessToken) {
    loading.value = true
    try {
      const respuesta = await mensajeServicios.cambiarEstadoMensajes(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cambiar a estado archivado
  //"ids": [1, 2, 3]
  async function cambiarEstadoMensajesArchivado(idmensajes, accessToken) {
    loading.value = true
    const mensajeData = { ids: idmensajes, estado: 'archivado' }
    try {
      const respuesta = await mensajeServicios.cambiarEstadoMensajes(mensajeData, accessToken)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    //func
    enviarMensaje,
    enviarMensajeSistema,
    enviarMensajeMultiple,
    enviarMensajeAutomatico,
    cambiarMensajeALeidos,
    leerMensaje,
    cambiarEstadoMensaje,
    cambiarEstadoMensajes,
    eliminarMensajesHard,
    eliminarMensajesSoft,
    eliminaMensajeHard,
    eliminaMensajeSoft,
    cambiarEstadoMensajesArchivado,
  }
}
