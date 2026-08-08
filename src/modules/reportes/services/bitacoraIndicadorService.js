import { apiRep } from '@/services/axios'

/**
 * Servicio HTTP para bitácoras de indicadores.
 * Usa la instancia apiRep de Axios.
 */
export const bitacoraIndicadorServicio = {
  // ═══════════════════════════════════════════════════
  // CONSULTAS (READ)
  // ═══════════════════════════════════════════════════

  /**
   * Obtiene todas las entradas de un tipo de bitácora.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   */
  obtenerTodas: async (tipo) => {
    try {
      const respuesta = await apiRep.get(`/bitacoras/${tipo}/`)
      return respuesta.data
    } catch (error) {
      console.error(`Axios: error fetch bitacoras/${tipo}/`, error)
      throw error
    }
  },

  /**
   * Obtiene una entrada por ID.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {number} id
   */
  obtenerPorId: async (tipo, id) => {
    try {
      const respuesta = await apiRep.get(`/bitacoras/${tipo}/${id}/`)
      return respuesta.data
    } catch (error) {
      if (error.response && error.response.status === 404) return null
      console.error(`Axios: error fetch bitacoras/${tipo}/${id}/`, error)
      throw error
    }
  },

  /**
   * Obtiene todas las entradas de un indicador específico.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {number} indicadorId
   */
  obtenerPorIndicador: async (tipo, indicadorId) => {
    try {
      const respuesta = await apiRep.get(`/bitacoras/${tipo}/por_indicador/`, {
        params: { indicador_id: indicadorId },
      })
      return respuesta.data
    } catch (error) {
      console.error(`Axios: error fetch bitacoras/${tipo}/por_indicador/`, error)
      throw error
    }
  },

  /**
   * Obtiene el último registro de un indicador.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {number} indicadorId
   */
  obtenerUltimo: async (tipo, indicadorId) => {
    try {
      const respuesta = await apiRep.get(`/bitacoras/${tipo}/ultimo/`, {
        params: { indicador_id: indicadorId },
      })
      return respuesta.data
    } catch (error) {
      if (error.response && error.response.status === 404) return null
      console.error(`Axios: error fetch bitacoras/${tipo}/ultimo/`, error)
      throw error
    }
  },

  /**
   * Consulta entradas por rango de fechas.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {string} fechaInicio - 'YYYY-MM-DD'
   * @param {string} fechaFin - 'YYYY-MM-DD'
   * @param {number|null} indicadorId - Opcional
   */
  consultarPorFechas: async (tipo, fechaInicio, fechaFin, indicadorId = null) => {
    try {
      const body = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      }
      if (indicadorId) body.indicador_id = indicadorId

      const respuesta = await apiRep.post(`/bitacoras/${tipo}/consultar/`, body)
      return respuesta.data
    } catch (error) {
      console.error(`Axios: error consulta bitacoras/${tipo}/consultar/`, error)
      throw error
    }
  },

  // ═══════════════════════════════════════════════════
  // CREAR
  // ═══════════════════════════════════════════════════

  /**
   * Crea una nueva entrada de bitácora.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {object} datos - Datos del formulario
   */
  crear: async (tipo, datos) => {
    try {
      const respuesta = await apiRep.post(`/bitacoras/${tipo}/`, datos)
      return respuesta.data
    } catch (error) {
      console.error(`Axios: error crear bitacoras/${tipo}/`, error)
      throw error
    }
  },

  // ═══════════════════════════════════════════════════
  // ACTUALIZAR
  // ═══════════════════════════════════════════════════

  /**
   * Actualiza una entrada existente.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {number} id
   * @param {object} datos - Campos a actualizar
   */
  actualizar: async (tipo, id, datos) => {
    try {
      const respuesta = await apiRep.patch(`/bitacoras/${tipo}/${id}/`, datos)
      return respuesta.data
    } catch (error) {
      console.error(`Axios: error actualizar bitacoras/${tipo}/${id}/`, error)
      throw error
    }
  },

  // ═══════════════════════════════════════════════════
  // ELIMINAR
  // ═══════════════════════════════════════════════════

  /**
   * Elimina una entrada por ID.
   * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
   * @param {number} id
   */
  eliminar: async (tipo, id) => {
    try {
      await apiRep.delete(`/bitacoras/${tipo}/${id}/`)
      return true
    } catch (error) {
      console.error(`Axios: error eliminar bitacoras/${tipo}/${id}/`, error)
      throw error
    }
  },
}
