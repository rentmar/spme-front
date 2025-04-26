import api from '@/services/axios'

export const proyectoServicios = {
  /*Obtener todos los Proyectos*/
  obtenerTodos: async () => {
    try {
      const respuesta = await api.get('/proyectos')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puedo obteners la lista de proyectos', error)
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
      const respuesta = await api.get('/proy_obj_general/por-proyecto/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener el objetivo generale ID: ' + id, error)
    }
  },
  especificosAll: async () => {
    try {
      const respuesta = await api.get('/proy_obj_especifico/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener los objetivos especificos', error)
    }
  },
  especificosPorId: async (id) => {
    try {
      const respuesta = await api.get('/proy_obj_especifico/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener objetivos especifico ID: ' + id, error)
    }
  },
  especificosPorIdProyecto: async (id) => {
    try {
      const respuesta = await api.get('/proy_obj_especifico/por-proyecto/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede obtener objetivos especifico ID: ' + id, error)
    }
  },
  objetivosIndicadoresPorIdProyecto: async (idproyecto) => {
    try {
      const respuesta = await api.get('/proyectos_obj/' + idproyecto + '/objetivos/')
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
}
