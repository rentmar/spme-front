//Datos de carga auxiliares para los formularios de monitoreo
// src/modules/formularios/services/formulariosHelpersService.js
import api from '@/services/axios'

export const formulariosHelpersService = {
  /************************ Carga lista de benefeciarios forma de pago para los formularios *******************************************/
  cargarBeneficiarios: async () => {
    try {
      const respuesta = await api.get('/beneficiarios-forma-pago/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista de beneficiarios', error)
    }
  },
  //Cargar lugares
  cargarLugares: async () => {
    try {
      const respuesta = await api.get('/lugares-solicitud/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar los lugares', error)
    }
  },
}
