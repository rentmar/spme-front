//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const formulariosServico = {
  /************************ INFORME DE ACTIVIDAD MINIMO *******************************************/
  /* Crear formulario minimo  de Informe de Actividad */
  crearInformeActividadMinimo: async (informeActividadMinData) => {
    try {
      const respuesta = await api.post('/informe-de-actividad-min/', informeActividadMinData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el Informe de Actividad Minimo', error)
      throw error
    }
  },
  /************************ INFORME DE SUBACTIVIDAD MINIMO *******************************************/
  /* Crear formulario minimo de Informe de Subactividad */
  informeSubactividadMinimoCrear: async (informeActividadMinData) => {
    try {
      const respuesta = await api.post('crear-informes-tarea-minimo/', informeActividadMinData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el Informe de Subactividad Minimo', error)
      throw error
    }
  },
  /* Listar informe de subactividad minimo */
  informeSubactividadMinimoListar: async () => {
    try {
      const respuesta = await api.post('/informe-de-tarea-min/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al listar el informe de Subactividad Minimo', err)
      throw err
    }
  },
  /* Infor de subactividad minimo por su id */
  informeSubactividadMinimoPorId: async (idinfsubac) => {
    try {
      const respuesta = await api.post('/informe-de-tarea-min/' + idinfsubac + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener el informe de subactividad con id: ' + idinfsubac, err)
    }
  },
  /* Informe de subactividad minimo por su idtarea */
  informeSubactividadMinPorIdTarea: async (idtarea) => {
    try {
      const respuesta = await api.get('/informe-subactividad-min/por-tarea/' + idtarea + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener lista de informe de subactividad por idtarea: ' + idtarea,
        err,
      )
    }
  },
  /* Listar Actividad - Informes + Tareas/Subactividad - Informes */
  listaActividadPorIdInformesActSubac: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividades/' + idactividad + '/informes-completos/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener la lista de informes actividad/subactividad, actividad id: ' +
          idactividad,
        err,
      )
      throw err
    }
  },
  /* Informe de actividad principal CRUD BASICO */
  listarInformeActividadPrincipal: async () => {
    try {
      const respuesta = await api.get('/informe-actividad-principal/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar la lista de informes de Actividad Principal', err)
    }
  },
  unInformeActividadPrincipaPorId: async (idinfactividad) => {
    try {
      const respuesta = await api.get('/informe-actividad-principal/' + idinfactividad + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al cargar la lista de informes de Actividad Principal', err)
    }
  },
  creaInformeActividadPrincipal: async (infData) => {
    try {
      const respuesta = await api.post('/informe-actividad-principal/', infData)
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al crear la lista de informes de Actividad Principal', err)
    }
  },
}
