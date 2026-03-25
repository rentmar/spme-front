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
  comprobarInformesActividadPrincipalPorIdActividad: async (idActividad) => {
    try {
      const respuesta = await api.get(
        '/verificar-informes-actividad-principal/' + idActividad + '/',
      )
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al comprobar existencia de informes actividad: ' + idActividad,
        err,
      )
      throw err
    }
  },
  /* Informe de actividad principal por ID CRUD BASICO */
  informeActividadPrincipalPorId: async (idInformeActividad) => {
    try {
      const respuesta = await api.get('/informe-actividad-principal/' + idInformeActividad + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al cargar el inform de actividad con id' + idInformeActividad,
        err,
      )
    }
  },
  /*Informe de actividad principal CRUD BASICO*/
  todosInformesActividadPrin: async () => {
    try {
      const respuesta = await api.get('/informe-actividad-principal/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar los informes de actividad principal', error)
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
  /**********Cargar informes de tarea/subactividad principal *****************/
  cargarInformesSubActividadPrincipal: async () => {
    try {
      const respuesta = await api.get('/informe-tarea-principal/')
      return respuesta.data
    } catch (err) {
      console.error('Error al cargar los informes de subactividad', err)
      throw err
    }
  },
  //Cargar un informe de subactividad por su ID
  cargarInfSubActividadPorId: async (idinformesubactividad) => {
    try {
      const respuesta = await api.get('/informe-tarea-principal/' + idinformesubactividad + '/')
      return respuesta.data
    } catch (err) {
      console.error('Error al cargar el informe de suabactividad principal con id: ', err)
    }
  },
}
