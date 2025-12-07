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
    try {
      const respuesta = await mensajeServicios.crearMensajeAutomaticoSistema(mensajeData)
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
  }
}
