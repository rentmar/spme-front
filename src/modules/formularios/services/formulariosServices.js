import { apiMonitoreo } from '@/services/axios'

export const formulariosServicios = {
  /*Crear solicitud de fondos*/
  crearSolitudFondos: async (informacion) => {
    try {
      const respuesta = await apiMonitoreo.post('/crearSolicitudFondos/', informacion)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear solicitud de fondos', error)
      throw error
    }
  },
}
