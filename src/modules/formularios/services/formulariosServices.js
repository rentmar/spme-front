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
  crearRendicionCuentas: async (informacion) => {
    try {
      const respuesta = await apiMonitoreo.post('/crearRendicionCuentas/', informacion)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear Rendicion de Cuentas', error)
      throw error
    }
  },
  crearSolicitudReposicion: async (informacion) => {
    try {
      const respuesta = await apiMonitoreo.post('/crearSolicitudReembolso/', informacion)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear Solicitud de Reposicion', error)
      throw error
    }
  },
  crearSolicitudViaje: async (informacion) => {
    try {
      const respuesta = await apiMonitoreo.post('/crearSolicitudViaje/', informacion)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear Solicitud de Viaje', error)
      throw error
    }
  },
}
