import api from '@/services/axios'

export const proyectoServicios = {
  /*Obtener todos los Proyectos*/
  obtenerTodos: async () => {
    try {
      const respuesta = await api.get('/proyectos')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puedo obteners la lista de proyectos', error)
      return []
    }
  },
  /* Obtener todos los proyectos en estado de PLANIFICACION */
  obtenerTodosPlanificacion: async (idPei) => {
    try {
      const respuesta = await api.get('proyectos/planificacion/' + idPei + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo obtener la lista de proyectos en planificacion', error)
      return []
    }
  },
  /* Proyecto por identificador */
  obtenertPorId: async (id) => {
    try {
      const respuesta = await api.get('/proyectos/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo obtener el proyecto con el ID: ' + id, error)
    }
  },
  /* Proyecto por identificador */
  estructuraPorId: async (id) => {
    try {
      const respuesta = await api.get('/proyecto-estructura/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo obtener el proyecto con el ID: ' + id, error)
    }
  },
  /* Crear un nuevo proyecto */
  crear: async (proyectoData) => {
    try {
      const respuesta = await api.post('/proyectos/', proyectoData)
      return respuesta
    } catch (error) {
      console.error('AXios: Error al crear nuevo proyecto', error)
      throw error
    }
  },
  /* Elimiar proyecto */
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/proyectos/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el proyecto con ID: ' + id, error)
      throw error
    }
  },
  /* Actualizar proyecto  */
  actualizar: async (id, data) => {
    try {
      const respuesta = await api.put('/proyectos/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar el proyecto con ID: ' + id, error)
      throw error
    }
  },
  /* Obtener proy - obj general - info adicional*/
  proyecto_objgral_info: async (id) => {
    try {
      const respuesta = await api.get('proy-objgral-info/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el proyecto con ID: ' + id, error)
      throw error
    }
  },
  /* Obtener todos los proyectos del PEI vigente */
  porIdPeiVigente: async () => {},
}

export const proyectoObjetivos = {
  /* Obtener todos los objetivos generales */
  generalesAll: async () => {
    try {
      const respuesta = await api.get('/proy_obj_general/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener los objetivos generales', error)
    }
  },
  generalesPorId: async (id) => {
    try {
      const respuesta = await api.get('/proy_obj_general/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener el objetivo generale ID: ' + id, error)
    }
  },
  generalesPorIdProyecto: async (id) => {
    try {
      const respuesta = await api.get('/proyectos/' + id + '/objetivo-general/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener el objetivo generale ID: ' + id, error)
    }
  },
  generalesCrear: async (objGralData) => {
    try {
      const respuesta = await api.post('/proy-obj-gral/', objGralData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el objetigo general', error)
      throw error
    }
  },
  generalesModificar: async (id, data) => {
    try {
      const respuesta = await api.put('/proy-obj-gral/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar la el objetivo general con ID: ' + id, error)
      throw error
    }
  },
  generalesEliminar: async (id) => {
    try {
      const respuesta = await api.delete('/proy-obj-gral/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el objetivo general con ID: ' + id, error)
      throw error
    }
  },
  especificosAll: async () => {
    try {
      const respuesta = await api.get('/proy-obj-esp/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener los objetivos especificos', error)
    }
  },
  especificosPorId: async (id) => {
    try {
      const respuesta = await api.get('/proy-obj-esp/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener objetivos especifico ID: ' + id, error)
    }
  },
  especificosPorIdProyecto: async (id) => {
    try {
      const respuesta = await api.get('/proy-obj-esp/por-proyecto/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener objetivos especifico ID: ' + id, error)
    }
  },
  especificoCrear: async (data) => {
    try {
      const respuesta = await api.post('/proy-obj-esp/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el objetigo especifico', error)
      throw error
    }
  },
  especificoUpdate: async (id, data) => {
    try {
      const respuesta = await api.put('/proy-obj-esp/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar la el objetivo general con ID: ' + id, error)
      throw error
    }
  },
  especificoDel: async (id) => {
    try {
      const respuesta = await api.delete('/proy-obj-esp/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el objetivo especifico con ID: ' + id, error)
      throw error
    }
  },
  objetivosIndicadoresPorIdProyecto: async (idproyecto) => {
    try {
      const respuesta = await api.get('/proy-obj-esp/' + idproyecto + '/objetivos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Fallo de objetivos con indicadores', error)
    }
  },
}

export const proyectoResultadoProducto = {
  resultadoProdIndicadoresPorIdProyecto: async (idproyecto) => {
    try {
      const respuesta = await api.get('/proyectos_rec/' + idproyecto + '/recursos/')
      return respuesta
    } catch (error) {
      console.error('Axios: Fallo al obtener resultados, productos e indicadores ', error)
    }
  },
  resultadoProdActividadesPorIdProyecto: async (idproyecto) => {
    try {
      const respuesta = await api.get('/proyectos/' + idproyecto + '/detalle-extendido/')
      return respuesta
    } catch (error) {
      console.error('Axios: Fallo al obtener resultados, productos y actividades', error)
    }
  },
}
