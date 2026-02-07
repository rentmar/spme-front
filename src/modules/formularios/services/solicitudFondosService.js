//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const solicitudDeFondosServico = {
  /************************ CRUD BASICO Solicitud de Fondos Actividad *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  solFondosAll: async () => {
    try {
      const respuesta = await api.get('/solicitud-fondos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista de solicitudes de fondos', error)
      throw error
    }
  },
  //Sol de Fondos por id
  solFondosPorId: async (id) => {
    try {
      const respuesta = await api.get('/solicitud-fondos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol de fondos ' + id, error)
      throw error
    }
  },
  solFondosCrear: async (dataSolFond) => {
    try {
      const respuesta = await api.post('/solicitud-fondos/', dataSolFond)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la sol de fondos', error)
      throw error
    }
  },
  solFondosUpdate: async (id) => {
    try {
      const respuesta = await api.put('/solicitud-fondos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar la sol de fondos' + id, error)
      throw error
    }
  },
  solFondosDel: async (id) => {
    try {
      const respuesta = await api.del('/solicitud-fondos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el Informe de Actividad Minimo', error)
      throw error
    }
  },

  /************************ Solicitud de Fondos Actividad *******************************************/
  //Solicitudes de fondos por id Actividad
  solFondosPorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('/solicitudes-fondos/actividad/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al cargar la sol de fondos de la actividad con id ' + idactividad,
        error,
      )
      throw error
    }
  },
  /************************ Solicitud de Fondos Tarea *******************************************/
  solFondosPorIdtarea: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-fondos/actividad/' + idactividad + '/tarea/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol de fondos de tarea con id ' + idtarea)
      throw error
    }
  },
  /************************ Solicitud de Fondos Actividad Pei *******************************************/
  //Solicitudes de fondos por id Actividad
  solFondosPorIdActividadPei: async (idactividadpei) => {
    try {
      const respuesta = await api.get('/solicitudes-fondos/actividad-pei/' + idactividadpei + '/')
      return respuesta.data
    } catch (error) {
      console.error(
        'Axios: Error al cargar la sol de fondos de la actividad con id ' + idactividadpei,
        error,
      )
      throw error
    }
  },
  /************************ Solicitud de Fondos Tarea Pei *******************************************/
  solFondosPorIdtareaPei: async (idactividadpei, idtareapei) => {
    try {
      const respuesta = await api.get(
        '/solicitudes-fondos-pei/actividad/' + idactividadpei + '/tarea/' + idtareapei + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol de fondos de tarea con id ' + idtareapei)
      throw error
    }
  },
}
