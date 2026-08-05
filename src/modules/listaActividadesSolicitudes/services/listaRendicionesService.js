import api from '@/services/axios'

export const listaRendicionesServicio = {
  //Obtener actividades con tareas y badges de las rendiciones
  obtenerActividades: async (params = {}) => {
    try {
      const respuesta = await api.get('/actividades/tareas/rendiciones/', { params })
      return respuesta.data
    } catch (error) {
      console.error('Axios: error al obtener la lista de actividades con rendiciones', error)
      throw error
    }
  },
  //Obtener una pagina especifica con actividades y filtros
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

    return listaRendicionesServicio.obtenerActividades(params)
  },
  //busca actividades por codigo o nombre corto
  buscar: async (query, pagina = 1) => {
    return listaRendicionesServicio.obtenerActividades({
      page: pagina,
      search: query,
    })
  },
  //Filtrar por estado
  filtrarPorEstado: async (estados, pagina = 1) => {
    return listaRendicionesServicio.obtenerActividades({
      page: pagina,
      estado: Array.isArray(estados) ? estados.join(',') : estados,
    })
  },
}
