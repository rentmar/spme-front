//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const solicitudPagoDirectoServicio = {
  /************************ CRUD BASICO Solicitud de Fondos Actividad *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  solPagoDirectoAll: async () => {
    try {
      const respuesta = await api.get('/solicitud-pago-directo/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista de sol de pago directo', error)
      throw error
    }
  },
  //Sol de Fondos por id
  solPagoDirectoPorId: async (id) => {
    try {
      const respuesta = await api.get('/solicitud-pago-directo/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol de pago directo  ' + id, error)
      throw error
    }
  },
  solPagoDirectoCrear: async (dataSolFond) => {
    try {
      const respuesta = await api.post('/solicitud-pago-directo/', dataSolFond)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la sol de pago directo ', error)
      throw error
    }
  },
  solPagoDirectoUpdate: async (id) => {
    try {
      const respuesta = await api.put('/solicitud-pago-directo/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar la sol de pago directo ' + id, error)
      throw error
    }
  },
  solPagoDirectoDel: async (id) => {
    try {
      const respuesta = await api.del('/solicitud-pago-directo/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la sol de pago directo ', error)
      throw error
    }
  },

  /************************ Solicitud de Pago directo Actividad *******************************************/
  //Solicitudes de fondos por id Actividad
  solPagoDirectoPorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('/solicitudes-pago-directo/actividad/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  con id ' + idactividad, error)
      throw error
    }
  },
  /************************ Solicitud de Pago directo Tarea *******************************************/
  solPagoDirectoPorIdTarea: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-pago-directo/actividades/' + idactividad + '/tareas/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea con id ' + idtarea)
      throw error
    }
  },
}
