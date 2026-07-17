// src/modules/formularios/services/listasSolicitudesService.js
import { apiValid } from '@/services/axios'

export const listasSolicitudesServicio = {
  //Lista de solicitudes por usuario
  listaSolFondos: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes-fondos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de sol de fondos', error)
      throw new error()
    }
  },
  //Lista de solicitudes de viaje
  listaSolViaje: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes-viaje/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de sol de viajes', error)
      throw new error()
    }
  },
  //Lista de solicitudes de reposicion
  listaSolReposicion: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes-reembolso/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de sol de reposicion', error)
      throw new error()
    }
  },
  //Lista de sol de pago directo
  listaSolPagoDirecto: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes-pago-directo/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de sol de pago directo', error)
      throw new error()
    }
  },
  //Lista de Rendicion de cuentas
  listaRendicionCuentas: async () => {
    try {
      const respuesta = await apiValid.get('/mis-rendiciones-cuentas/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de rendicion de cuentas', error)
      throw new error()
    }
  },
  //Lista de Solicitudes pendientes para revision
  listaSolPendientes: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes-pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la listad de rendicion de cuentas', error)
      throw new error()
    }
  },
  //Lista general de formularios
  listaSolicitudes: async () => {
    try {
      const respuesta = await apiValid.get('/mis-solicitudes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener la lista de solicitudes', error)
      throw new error()
    }
  },
}
