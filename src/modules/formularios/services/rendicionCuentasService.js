//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const rendicionCuentasServicio = {
  /************************ CRUD BASICO Solicitud de Fondos Actividad *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  solRendicionCuentasAll: async () => {
    try {
      const respuesta = await api.get('/rendicion-cuentas/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la lista ', error)
      throw error
    }
  },
  //Sol de Fondos por id
  solRendicionCuentasPorId: async (id) => {
    try {
      const respuesta = await api.get('/rendicion-cuentas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  ' + id, error)
      throw error
    }
  },
  solRendicionCuentasCrear: async (dataSolFond) => {
    try {
      const respuesta = await api.post('/rendicion-cuentas/', dataSolFond)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear la ', error)
      throw error
    }
  },
  solRendicionCuentasUpdate: async (id) => {
    try {
      const respuesta = await api.put('/rendicion-cuentas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar la ' + id, error)
      throw error
    }
  },
  solRendicionCuentasDel: async (id) => {
    try {
      const respuesta = await api.del('/rendicion-cuentas/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el ', error)
      throw error
    }
  },
  /************************ Solicitud de Fondos Actividad *******************************************/
  //Solicitudes de fondos por id Actividad
  solRendicionCuentasPorIdActividad: async (idactividad) => {
    try {
      const respuesta = await api.get('/rendiciones-cuentas/actividad/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  con id ' + idactividad, error)
      throw error
    }
  },
  /************************ Solicitud de Fondos Tarea *******************************************/
  solRendicionCuentasPorIdTarea: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/rendiciones-cuentas/actividades/' + idactividad + '/tareas/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea con id ' + idtarea)
      throw error
    }
  },
  /************************ Solicitud de Fondos Actividad *******************************************/
  //Solicitudes de fondos por id Actividad
  solRendicionCuentasPorIdActividadPei: async (idactividad) => {
    try {
      const respuesta = await api.get('/rendiciones-cuentas/actividad-pei/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  con id ' + idactividad, error)
      throw error
    }
  },
  /************************ Solicitud de Fondos Tarea *******************************************/
  solRendicionCuentasPorIdTareaPei: async (idactividad, idtarea) => {
    try {
      const respuesta = await api.get(
        '/rendiciones-cuentas-pei/actividad/' + idactividad + '/tarea/' + idtarea + '/',
      )
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar la  de tarea con id ' + idtarea)
      throw error
    }
  },
}
