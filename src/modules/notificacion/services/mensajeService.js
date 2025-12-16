import { apiMsg } from '@/services/axios'

export const mensajeServicios = {
  /* Obtener la bandeja de mensajes  */
  obtenerBandeja: async (accessToken) => {
    try {
      const respuesta = await apiMsg.get('/mensajes/bandeja/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al obtener la bandeja de mensajes', error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /* Obtener la bandeja de mensajes paginada */
  obtenerBandejaPaginada: async (limite, offset, accessToken) => {
    try {
      const respuesta = await apiMsg.get(
        '/mensajes/bandeja/?limit=' + limite + '&offset=' + offset,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al obtener la bandeja de mensajes paginada', error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /* Obtener mensaje y marcarlo como leido */
  obtenerMensaje: async (idmensaje, accessToken) => {
    try {
      const respuesta = await apiMsg.get('/mensajes/' + idmensaje + '/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al obtener el mensaje con id: ' + error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /* Enviar un mensaje a un usuario */
  enviarMensaje: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/enviar/', mensajeData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al enviar mensaje al usuario: ', error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /* Enviar alerta de actividad */
  enviarAlertaActividad: async (alertaData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/alertas/actividad/', alertaData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al enviar alerta actividad ', error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /*Actualizar el estado de un mensaje*/
  actualizarEstadoMensaje: async (idmensaje, estadoData, accessToken) => {
    try {
      const respuesta = await apiMsg.put('/mensajes/' + idmensaje + '/estado/', estadoData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al actualizar estado de mensaje ', error)
      throw new Error(`Error al obtener bandeja: ${error.message}`)
    }
  },
  /* Crear mensaje */
  crearMensaje: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/crear/', mensajeData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al crear el mensaje', error)
      throw new Error(`Error mensaje: ${error.message}`)
    }
  },
  /* Crear Mensaje Manual Sistema */
  crearMensajeSistema: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/crear/sistema/', mensajeData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al crear mensaje sistema', error)
      throw new Error(`Error mensaje sistema: ${error.message}`)
    }
  },
  /* Envio de multiples mensajes */
  crearMensajesMultiples: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/crear/multiple/', mensajeData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al crear mensajes multiples', error)
      throw new Error(`Error envio mensajes multiples: ${error.message}`)
    }
  },
  /* Envio de mensajes automaticos */
  crearMensajeAutomaticoSistema: async (mensajeData) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/crear/sistema-automatico/', mensajeData)
      return respuesta
    } catch (error) {
      console.error('Axios: error al crear mensaje automatico', error)
      throw new Error(`Error envio mensajes automatico: ${error.message}`)
    }
  },
  /* Marcar mensajes leidos */
  marcarMensajesLeidos: async (mensajesData, accessToken) => {
    try {
      const respuesta = await apiMsg.post('/mensajes/marcar-leidos/', mensajesData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta
    } catch (error) {
      console.error('Axios: error al marcar leidos', error)
      throw new Error(`Error envio mensajes automatico: ${error.message}`)
    }
  },
  /*Eliminar mensaje*/
  eliminarMensajes: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.delete('/mensajes/eliminar-multiples/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        mensajeData,
      })
      return respuesta
    } catch (error) {
      console.error('Axios: error a eliminar mensajes', error)
    }
  },
  /* Elimar (soft) un mensaje */
  eliminarMensaje: async (idmensaje, accessToken) => {
    try {
      const respuesta = await apiMsg.delete('/mensajes/' + idmensaje + '/eliminar/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return respuesta
    } catch (error) {
      console.error('Axios: Error al eliminar mensaje con id: ' + idmensaje, error)
    }
  },
  /* Eliminar (hard), mensaje */
  eliminarMensajeHard: async (idmensaje, accessToken) => {
    try {
      const respuesta = await apiMsg.delete(
        '/mensajes/' + idmensaje + '/eliminar/?tipo_eliminacion=hard',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return respuesta
    } catch (error) {
      console.error('Axios: Error al eliminar(hard) mensaje con id: ' + idmensaje, error)
    }
  },
  /* Cambiar estados */
  cambiarEstadoMensajes: async (mensajeData, accessToken) => {
    try {
      const respuesta = await apiMsg.patch('/mensajes/cambiar-estado/', mensajeData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      return respuesta
    } catch (error) {
      console.error('Axios: Canbiar el estado de multiples mensajes', error)
    }
  },
}
