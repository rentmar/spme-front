// src/modules/notificacionEmail/composables/useNotificacionEmail.js
import { ref } from 'vue'
import { notificacionEmailServicio } from '../services/notificacionEmailService'

export function useNotificacionEmail() {
  const loading = ref(false)
  const error = ref(null)
  const resultado = ref(null)

  const enviar = async (tipo_solicitud, solicitud_id, accion, destinatarios_ids, base_url) => {
    loading.value = true
    error.value = null
    try {
      const data = await notificacionEmailServicio.enviarNotificacionBase({
        tipo_solicitud,
        solicitud_id,
        accion,
        destinatarios_ids,
        base_url: base_url || window.location.origin,
      })
      resultado.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const notificarRevision = (tipo, id, ids, url) => enviar(tipo, id, 'revision', ids, url)

  const notificarAprobacion = (tipo, id, ids, url) => enviar(tipo, id, 'aprobacion', ids, url)

  const notificarRechazo = (tipo, id, ids, url) => enviar(tipo, id, 'rechazo', ids, url)

  const notificarNuevaRevision = (tipo, id, ids, url) =>
    enviar(tipo, id, 'nueva_revision', ids, url)

  return {
    loading,
    error,
    resultado,
    enviar,
    notificarRevision,
    notificarAprobacion,
    notificarRechazo,
    notificarNuevaRevision,
  }
}
