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
  /* Validaciones pendientes del usuario actual


  /**************************** Validadores Informe SubActividad/Tarea *******************/
}
