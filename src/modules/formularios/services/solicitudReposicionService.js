//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const solicitudReposicionServicio = {
  /************************ CRUD BASICO Solicitud de Reposicion Actividad *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  solReposicionAll: async () => {
    try {
      const respuesta = await api.get('/solicitud-reembolso/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista ', error)
      throw error
    }
  },
  //Sol de Fondos por id
  solReposicionPorId: async (id) => {
    try {
      const respuesta = await api.get('/solicitud-reembolso/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol Reposicion ' + id, error)
      throw error
    }
  },
  solReposicionCrear: async (dataSolFond) => {
    try {
      const respuesta = await api.post('/solicitud-reembolso/', dataSolFond)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la ', error)
      throw error
    }
  },
  solReposicionUpdate: async (id) => {
    try {
      const respuesta = await api.put('/solicitud-reembolso/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar la ' + id, error)
      throw error
    }
  },
  solReposicionDel: async (id) => {
    try {
      const respuesta = await api.del('/solicitud-reembolso/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el ', error)
      throw error
    }
  },

  /************************ Solicitud de Fondos Actividad *******************************************/
  //Solicitudes de fondos por id Actividad
  solReposicionPorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('/solicitudes-reembolso/actividad/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  con id ' + idactividad, error)
      throw error
    }
  },
  /************************ Solicitud de Fondos Tarea *******************************************/
  solReposicionPorIdTarea: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-reembolso/actividades/' + idactividad + '/tareas/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea con id ' + idtarea)
      throw error
    }
  },
}
