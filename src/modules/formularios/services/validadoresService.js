//Servicio peticiones de los validadores de formularios
import { apiValid } from '@/services/axios'

export const validadoresServicio = {
  /**************************** Validadores ****************************/
  //Lista del usuario actual y los validadores disponibles
  listaValidadores: async () => {
    try {
      const respuesta = await apiValid.get('/lista-usuario-redactor-validadores/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al obtener la lista de validadores', error)
      throw new Error(`Error al obtener la lista de validadores ${error.message}`)
    }
  },
  /**************************** Validadores Informe Actividad ****************************/
  /* Estado de la validacion del Informe de Actividad Principal */
  estadoValidacionInformeActividad: async (idInformeActividad) => {
    try {
      const respuesta = await apiValid.get(
        '/estado-validacion/?tipo=actividad&id=' + idInformeActividad,
      )
      return respuesta.data
    } catch (error) {
      console.log(
        'Axios: Error al obtener el estado del informe de actividad ' + idInformeActividad,
        error,
      )
      throw new Error(`Error al obtener el estado de validadores ${error.message}`)
    }
  },
  /* listar mis validaciones */
  listarMisValidaciones: async () => {
    try {
      const respuesta = await apiValid.get('/validaciones/')
      return respuesta.data
    } catch (error) {
      console.error('axios: Error al obtener todas mis validaciones', error)
    }
  },
  /* listar mis validaciones pendientes */
  listarMisValidacionesPendientes: async () => {
    try {
      const respuesta = await apiValid.get('/api/validaciones/pendientes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener mis validaciones pendientes', error)
      throw new Error(error)
    }
  },

  /**************************** Validadores Informe SubActividad/Tarea *******************/
}
