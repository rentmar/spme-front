import { apiRep } from '@/services/axios'

export const reportesServicios = {
  estructuraJerReportes: async (idProyecto) => {
    try {
      const respuesta = await apiRep.get('/proyecto/estructura-jerarquica/' + idProyecto + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idProyecto, error)
      throw error
    }
  },
}
