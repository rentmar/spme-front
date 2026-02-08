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
  /*********************** Informe Tarea Principal ************************************/
}
