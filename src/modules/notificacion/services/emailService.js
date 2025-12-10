import apiMsg from '@/services/axios'

export const emailServicios = {
  /* Email de prueba */
  emitirEmailPrueba: async (emailData) => {
    try {
      const respuesta = await apiMsg.post('/correos/prueba-sistema/', emailData)
      return respuesta.data
    } catch (error) {
      console.log('Axios: No se pudo emitir el email de prueba', error)
      throw error
    }
  },
  /* Email Solicitud pendiente */
  emitirEmailSolPendiente: async (emailData) => {
    try {
      const respuesta = await apiMsg.post('/correos/solicitud-pendiente/', emailData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo emitir el email de Solicitud Pendiente', error)
      throw error
    }
  },
  /* Email Solicitud Aprovada */
  emitirEmailSolAprobada: async (emailData) => {
    try {
      const respuesta = await apiMsg.post('/correos/solicitud-aprobada/', emailData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo emitir el email de Solicitud Aprobada', error)
      throw error
    }
  },
}
