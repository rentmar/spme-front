// src/modules/notificacionEmail/services/notificacionEmailService.js
import { apiEmail } from '@/services/axios'

export const notificacionEmailServicio = {
  //Servico base para el envio de emails
  /***************************************
   POST /api/notificaciones/enviar/
    Authorization: Bearer <JWT>

    datosNotificacion = {
        "tipo_solicitud": "fondos",
        "solicitud_id": 42,
        "accion": "revision",
        "destinatarios_ids": [68, 71],
        "base_url": "https://spme.gob.bo"
    }

   */
  enviarNotificacionBase: async (datosNotificacion) => {
    try {
      const respuesta = await apiEmail.post('/email/notificaciones/enviar/', datosNotificacion)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo enviar el email', error)
    }
  },
}
