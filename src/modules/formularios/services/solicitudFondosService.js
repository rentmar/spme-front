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
  //Sol de Fondos por id de actividad
  solFondosPorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('//')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la sol de fondos por id actividad' + idactividad, error)
      throw error
    }
  },
  //Sol de Fondos por id de actividad
  solFondosPorIdTarea: async (idtarea) => {
    try {
      const respuesta = await api.get('//')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la Sol de fondos por id tare' + idtarea, error)
      throw error
    }
  },
}
