//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const solicitudViajeServicio = {
  /************************ CRUD BASICO Solicitud de Fondos Actividad *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  solViajeAll: async () => {
    try {
      const respuesta = await api.get('/solicitud-viaje/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista ', error)
      throw error
    }
  },
  //Sol de Fondos por id
  solViajePorId: async (idsolviaje) => {
    try {
      const respuesta = await api.get('/solicitud-viaje/' + idsolviaje + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  ' + idsolviaje, error)
      throw error
    }
  },
  solViajeCrear: async (dataSolViaje) => {
    try {
      const respuesta = await api.post('/solicitud-viaje/', dataSolViaje)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la ', error)
      throw error
    }
  },
  solViajeUpdate: async (id) => {
    try {
      const respuesta = await api.put('/solicitud-viaje/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar la ' + id, error)
      throw error
    }
  },
  solViajeDel: async (id) => {
    try {
      const respuesta = await api.del('/solicitud-viaje/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el ', error)
      throw error
    }
  },

  /************************ Solicitud de Viaje Actividad *******************************************/
  //Solicitudes de viaje por id Actividad
  solViajePorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('/solicitudes-viaje/actividad/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar las solicitudes de viaje con id ' + idactividad, error)
      throw error
    }
  },
  /************************ Solicitud de Viaje Tarea *******************************************/
  //Solicitude de viaje por id tarea
  solViajePorIdTarea: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-viaje/actividades/' + idactividad + '/tareas/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea con id ' + idtarea)
      throw error
    }
  },

  /************************ Solicitud de Viaje Actividad PEI *******************************************/
  //Solicitudes de viaje por id Actividad
  solViajePorIdActividadPei: async (idactividadpei) => {
    try {
      const respuesta = await api.get('/solicitudes-viaje/actividad-pei/' + idactividadpei + '/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al cargar las solicitudes de viaje con id ' + idactividadpei,
        error,
      )
      throw error
    }
  },
  /************************ Solicitud de Viaje Tarea Pei *******************************************/
  //Solicitude de viaje por id tarea
  solViajePorIdTareaPei: async (idactividadpei, idtareapei) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-viaje-pei/actividad/' + idactividadpei + '/tarea/' + idtareapei + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea  peicon id ' + idtareapei)
      throw error
    }
  },
}
