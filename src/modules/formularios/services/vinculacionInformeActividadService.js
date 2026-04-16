//Servicio para vincular solicitudes a informes actividad/tarea
import api from '@/services/axios'

export const vinculacionInformeActividadServicio = {
  /**************** Vincular Sol de viaje a Informe de actividad ***********************************/
  /* Solicitudes de viajes vinculadas a un Informe de Actividad*/
  solViajesVinculadasInformesActividad: async (idInformeActividad) => {
    try {
      const respuesta = await api.get('/vinculacion-sv-iap/por-informe/' + idInformeActividad + '/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al cargar las sol de viajes vinculadas al informe de actividad: ' +
          idInformeActividad,
        error,
      )
      throw error
    }
  },
  /* Sol de viajes sin vincular */
  /* Solo toma en cuenta las solicitudes aprobadas */
  solViajeDisponiblesPorIdActividad: async (idActividad) => {
    try {
      const respuesta = await api.get(
        '/vinculacion-sv-iap/solicitudes-disponibles?tipo_solicitud=solo_actividad&&actividad_id=' +
          idActividad,
      )
      return respuesta
    } catch (error) {
      console.error(
        'Axios: Error al cargar las sol de viajes de la actividad: ' + idActividad,
        error,
      )
    }
  },
}
