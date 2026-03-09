//Servicio para informe de actividad/tarea principales
import api from '@/services/axios'

export const informeActividadPrinServicio = {
  /*********************** Informe Actividad Principal ************************************/
  infActividadPrinDetalles: async (idactividadprin) => {
    try {
      const respuesta = await api.get('/actividades/' + idactividadprin + '/detalle-informes/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar detalles Actividad con id ' + idactividadprin, err)
      throw err
    }
  },
  crearInformeActividadPrincipal: async (data) => {
    try {
      const respuesta = await api.post('/informe-actividad-principal/crear/', data)
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al enviar el Informe de Actividad Principal')
      throw err
    }
  },
  /*********************** Informe Tarea Principal ************************************/
  crearInformeTareaPrincipal: async (data) => {
    try {
      const respuesta = await api.post('/informe-tarea-principal/crear/', data)
      return respuesta.data
    } catch (err) {
      console.error('Error al crear el informe de tarea', err)
      throw err
    }
  },
}
