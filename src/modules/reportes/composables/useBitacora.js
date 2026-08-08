import { ref } from 'vue'
import { bitacoraIndicadorServicio } from '../services/bitacoraIndicadorService'
import { useBitacoraHelpers } from './useBitacoraHelpers'

/**
 * Composable genérico para operaciones CRUD de bitácoras.
 * Usa bitacoraIndicadorServicio para las llamadas HTTP.
 *
 * @param {string} tipo - 'og' | 'oe' | 'rog' | 'roe'
 */
export function useBitacora(tipo) {
  // ═══════════════════════════════════════════════════
  // ESTADO REACTIVO
  // ═══════════════════════════════════════════════════

  const entradas = ref([])
  const entrada = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const count = ref(0)

  const { prepararPayload, prepararPayloadActualizacion } = useBitacoraHelpers()

  // ═══════════════════════════════════════════════════
  // CONSULTAS (READ)
  // ═══════════════════════════════════════════════════

  async function fetchTodas() {
    loading.value = true
    error.value = null

    try {
      const data = await bitacoraIndicadorServicio.obtenerTodas(tipo)
      entradas.value = data.results
      count.value = data.count
      return data
    } catch (err) {
      error.value = err.message || 'Error al obtener bitácoras'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPorId(id) {
    loading.value = true
    error.value = null

    try {
      const data = await bitacoraIndicadorServicio.obtenerPorId(tipo, id)
      entrada.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al obtener bitácora'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPorIndicador(indicadorId) {
    loading.value = true
    error.value = null

    try {
      const data = await bitacoraIndicadorServicio.obtenerPorIndicador(tipo, indicadorId)
      entradas.value = data.results
      count.value = data.count
      return data
    } catch (err) {
      error.value = err.message || 'Error al obtener bitácoras del indicador'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUltimo(indicadorId) {
    loading.value = true
    error.value = null

    try {
      const data = await bitacoraIndicadorServicio.obtenerUltimo(tipo, indicadorId)
      entrada.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al obtener último registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPorFechas(fechaInicio, fechaFin, indicadorId = null) {
    loading.value = true
    error.value = null

    try {
      const data = await bitacoraIndicadorServicio.consultarPorFechas(
        tipo,
        fechaInicio,
        fechaFin,
        indicadorId,
      )
      entradas.value = data.results
      count.value = data.count
      return data
    } catch (err) {
      error.value = err.message || 'Error al consultar por fechas'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ═══════════════════════════════════════════════════
  // CREAR
  // ═══════════════════════════════════════════════════

  async function crear(datos) {
    loading.value = true
    error.value = null

    const payload = prepararPayload(datos)

    try {
      const data = await bitacoraIndicadorServicio.crear(tipo, payload)
      entrada.value = data
      return data
    } catch (err) {
      // Extraer errores de validación del backend
      if (err.response && err.response.data) {
        throw err.response.data
      }
      error.value = err.message || 'Error al crear bitácora'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ═══════════════════════════════════════════════════
  // ACTUALIZAR
  // ═══════════════════════════════════════════════════

  async function actualizar(id, datos) {
    loading.value = true
    error.value = null

    const payload = prepararPayloadActualizacion(datos)

    try {
      const data = await bitacoraIndicadorServicio.actualizar(tipo, id, payload)
      entrada.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al actualizar bitácora'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ═══════════════════════════════════════════════════
  // ELIMINAR
  // ═══════════════════════════════════════════════════

  async function eliminar(id) {
    loading.value = true
    error.value = null

    try {
      await bitacoraIndicadorServicio.eliminar(tipo, id)
      entrada.value = null
      return true
    } catch (err) {
      error.value = err.message || 'Error al eliminar bitácora'
      return false
    } finally {
      loading.value = false
    }
  }

  // ═══════════════════════════════════════════════════
  // RETORNO
  // ═══════════════════════════════════════════════════

  return {
    entradas,
    entrada,
    loading,
    error,
    count,
    fetchTodas,
    fetchPorId,
    fetchPorIndicador,
    fetchUltimo,
    fetchPorFechas,
    crear,
    actualizar,
    eliminar,
  }
}
