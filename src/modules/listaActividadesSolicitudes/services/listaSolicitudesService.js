import api from '@/services/axios'

export const listaSolicitudesServicio = {
  /**
   * Obtiene actividades con tareas y badges de solicitudes.
   *
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página (default: 1)
   * @param {number} params.page_size - Items por página (default: 20, max: 100)
   * @param {string} params.search - Búsqueda por código o nombre corto
   * @param {string} params.estado - Filtrar por estado (PLAN,EJEC,FIN,REPROG,REP)
   * @returns {Promise<Object>} Actividades con badges y paginación
   */
  obtenerActividades: async (params = {}) => {
    try {
      const respuesta = await api.get('/actividades/tareas/solicitudes/', { params })
      return respuesta.data
    } catch (error) {
      console.error('Error al cargar actividades:', error)
      throw error
    }
  },

  /**
   * Obtiene una página específica de actividades con filtros.
   *
   * @param {number} pagina - Número de página
   * @param {Object} filtros - Filtros adicionales
   * @param {string} filtros.search - Búsqueda por código o nombre corto
   * @param {string} filtros.estado - Estados separados por coma (PLAN,EJEC)
   * @param {number} filtros.page_size - Items por página
   * @returns {Promise<Object>}
   */
  obtenerPagina: async (pagina = 1, filtros = {}) => {
    const params = {
      page: pagina,
      page_size: filtros.page_size || 20,
    }

    if (filtros.search) {
      params.search = filtros.search
    }

    if (filtros.estado) {
      params.estado = filtros.estado
    }

    return listaSolicitudesServicio.obtenerActividades(params)
  },
  /**
   * Busca actividades por código o nombre corto.
   *
   * @param {string} query - Texto de búsqueda
   * @param {number} pagina - Número de página
   * @returns {Promise<Object>}
   */
  buscar: async (query, pagina = 1) => {
    return listaSolicitudesServicio.obtenerActividades({
      page: pagina,
      search: query,
    })
  },
  /**
   * Filtra actividades por estado.
   *
   * @param {string[]} estados - Array de estados (PLAN, EJEC, FIN)
   * @param {number} pagina - Número de página
   * @returns {Promise<Object>}
   */
  filtrarPorEstado: async (estados, pagina = 1) => {
    return listaSolicitudesServicio.obtenerActividades({
      page: pagina,
      estado: Array.isArray(estados) ? estados.join(',') : estados,
    })
  },
}
