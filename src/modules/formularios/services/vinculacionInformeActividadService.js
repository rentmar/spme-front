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
}
