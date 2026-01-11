import api from '@/services/axios'

export const actividadServicios = {
  /* Fetch Actividades */
  all: async () => {
    try {
      const respuesta = await api.get('/actividades/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividades ', error)
      throw error
    }
  },
  /* Por id */
  porId: async (id) => {
    try {
      const respuesta = await api.get('/actividades/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividad  id ' + id, error)
      throw error
    }
  },
  /*crear */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/actividades/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear actividad', error)
      throw error
    }
  },
  /*actualizar */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/actividades/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar actividad id ' + id, error)
      throw error
    }
  },
  /*eliminar */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/actividades/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar actividad  id' + id, error)
      throw error
    }
  },
  /*Actividades por id de proyecto*/
  allPorIdProyecto: async (id) => {
    try {
      const respuesta = await api.get('/actividades/proyecto/' + id + '/')
      //console.log(respuesta)
      return respuesta.data
    } catch (err) {
      console.log('Axios: fetch error actividades del proyecto id:' + id, err)
    }
  },
  /* Guardar Actividades - Metodo Bulk */
  guardarBulk: async (id, data) => {
    try {
      const respuesta = await api.post('/actividades/procesar-bulk/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: No se guardo el conjunto de actividades', error)
      throw error
    }
  },
  /* Lista de actividades y tareas */
  listaActividadesTareas: async () => {
    try {
      const respuesta = await api.get('/actividades-con-tareas/')
      //console.log(respuesta)
      return respuesta.data
    } catch (err) {
      console.log('Axios: fetch actividades tareas', err)
    }
  },
  /*Lista de Actividades y tareas*/
  actividadesTareasLista: async () => {
    try {
      const respuesta = await api.get('/actividades-tareas-lista/todas/')
      return respuesta.data
    } catch (err) {
      console.log('Axios: fetch de actividades y tareas', err)
    }
  },
  actividadInforPorId: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividad-indicadores-proyecto/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: fecth actividad por id: ' + error, error)
      throw error
    }
  },
  /*********************************************************/
  /******************* TAREAS ******************************/
  /*********************************************************/
  //Obtener todas las tareas
  tareaAll: async () => {
    try {
      const respuesta = await api.get('/tareas-actividad/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: fetch de todas las tareas', error)
      throw error
    }
  },
  //Obtener una tarea por su id
  tareaPorId: async (idtarea) => {
    try {
      const respuesta = await api.get('/tareas-actividad/' + idtarea + '/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: fetch tarea con id: ' + idtarea, error)
      throw error
    }
  },
  /* Crear una tarea */
  tareaCrear: async (tareaData) => {
    try {
      const respuesta = await api.post('/tareas-actividad/', tareaData)
      return respuesta.data
    } catch (error) {
      console.log('axios: error al crear tarea', error)
      throw error
    }
  },
  /* Actualizar una tarea por su id */
  tareaUpdate: async (idtarea, tareaData) => {
    try {
      const respuesta = await api.put('/tareas-actividad/' + idtarea + '/', tareaData)
      return respuesta.data
    } catch (error) {
      console.log('axios: error al actualizar tarea con id: ' + idtarea, error)
      throw error
    }
  },
  /*Eliminar una tarea por su id */
  tareaDelete: async (idtarea) => {
    try {
      const respuesta = await api.delete('/tareas-actividad/' + idtarea + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar tarea  id' + idtarea, error)
      throw error
    }
  },
  /* Tarea con detalles */
  tareaDetalles: async (idtarea) => {
    try {
      const respuesta = await api.get('/tarea-detalles/' + idtarea + '/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: fetch tarea con id: ' + idtarea, error)
      throw error
    }
  },
  /****************************************************************************************/
  /**************************ACTIVIDADDES/TAREAS PEI **************************************/
  /****************************************************************************************/
  /* Todas las actividades de un pei */
  allPorIdPei: async (idpei) => {
    try {
      const respuesta = await api.get('actividades/pei/' + idpei + '/')
      //console.log(respuesta)
      return respuesta.data
    } catch (err) {
      console.log('Axios: fetch error actividades del PEI con id:' + idpei, err)
    }
  },
  /* Crear una tarea de Act PEI */
  tareaPeiCrear: async (tareaData) => {
    try {
      const respuesta = await api.post('/tareas-pei-actividad-pei/', tareaData)
      return respuesta.data
    } catch (error) {
      console.log('axios: error al crear tarea', error)
      throw error
    }
  },
  /* CRUD BASICO DE LAS ACTIVIDADES PEI */
  allActPei: async () => {
    try {
      const respuesta = await api.get('/actividades-pei/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividades ', error)
      throw error
    }
  },
  /* Una actividad PEI */
  porIdActPei: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividades-pei/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fetch actividad  id ' + idactividad, error)
      throw error
    }
  },
  /*crear */
  crearActPei: async (dataActividadPei) => {
    try {
      const respuesta = await api.post('/actividades-pei-principal/', dataActividadPei)
      return respuesta.data
    } catch (err) {
      console.error('Axios: No se pudo crear la actividad', err)
    }
  },
  /*actualizar */
  updateActPei: async (idactividad, dataActividadPei) => {
    try {
      const respuesta = await api.put('/actividades-pei/' + idactividad + '/', dataActividadPei)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar actividad id ' + idactividad, error)
      throw error
    }
  },
  /*eliminar */
  deleteActPei: async (idactividad) => {
    try {
      const respuesta = await api.delete('/actividades-pei/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar actividad  id' + idactividad, error)
      throw error
    }
  },
}
