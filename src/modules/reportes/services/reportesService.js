import { apiRep, api } from '@/services/axios'

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
  actidadIndPorId: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividad-indicadores-proyecto/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idactividad, error)
      throw error
    }
  },
  estructuraProyectoReporte: async (idproyecto) => {
    try {
      const respuesta = await apiRep.get('/proyectos/' + idproyecto + '/estructura-reportes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idproyecto, error)
    }
  },
  /****** Crear bitacora **********/
}
