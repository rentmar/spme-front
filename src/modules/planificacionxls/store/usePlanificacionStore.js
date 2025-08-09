import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { planificacionServicios } from '../services/planificacionService'

export const usePlanificacionStore = defineStore('planificacion', () => {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  const currentPlanificacion = ref(null)
  const revisiones = ref([])
  const inicializado = ref(false)
  const columnStats = ref(null)
  // Estado reactivo para columnas ocultas
  const columnasEscondidas = ref({
    columns: [], // Columna 0 siempre oculta por defecto
    indicators: true,
    version: 1,
  })

  const COLUMN_MAP = Object.freeze({
    objetivoPei: 0,
    indicadorPei: 1,
    objetivoGeneral: 2,
    indicadorOg: 3,
    resultadoOg: 4,
    indicadorResultadoOg: 5,
    objetivoEspecifico: 6,
    indicadorOe: 7,
    productoOe: 8,
    resultadoOe: 9,
    indicadorResultadoOe: 10,
  })

  const getDefaultStats = () => ({
    indicadores_og: 1,
    resultados_og: 1,
    objetivos_especificos: 1,
    indicadores_oe: 1,
    productos_oe: 1,
  })

  // Getters
  const hasPlanificacion = computed(() => (proyectoId) => {
    return currentPlanificacion.value?.proyecto?.id === proyectoId
  })

  const getCurrentVersion = computed(() => {
    return currentPlanificacion.value?.version || 1
  })

  const fetchColumnStats = async (proyectoId) => {
    try {
      const stats = await planificacionServicios.getColumnasCount(proyectoId)
      columnStats.value = stats
      updateHiddenColumns(stats)
      return stats
    } catch (err) {
      console.error('Error fetching column stats:', err)
      const defaultStats = getDefaultStats()
      updateHiddenColumns(defaultStats)
      return defaultStats
    }
  }

  //Comprobar si hay planificaciones
  const fetchPlanificacion = async (proyectoId) => {
    try {
      loading.value = true
      error.value = null
      const [respuesta, stats] = await Promise.all([
        planificacionServicios.planProyecto(proyectoId),
        fetchColumnStats(proyectoId),
      ])
      //const respuesta = await planificacionServicios.planProyecto(proyectoId)
      if (respuesta.exists) {
        //Cargar la planificacion
        currentPlanificacion.value = respuesta.planificacion
        console.log(stats)
      } else {
        //Crear la planificacion
        await crearPlanificacion(proyectoId)
        console.log(stats)
      }
      inicializado.value = true
      return currentPlanificacion.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const crearPlanificacion = async (proyectoId, stats = null) => {
    try {
      loading.value = true
      error.value = null

      //Si no se proporciona stats, obtenerlas del api
      const columnStats = stats || (await fetchColumnStats(proyectoId))

      const nuevaPlanificacion = {
        proyecto: proyectoId,
        table_config: generateDynamicConfig(columnStats),
        rows_data: [],
        version: 1,
      }

      const respuesta = await planificacionServicios.crear(nuevaPlanificacion)
      currentPlanificacion.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateHiddenColumns = (stats) => {
    const hiddenColumns = []
    if (!stats.indicadores_og) {
      hiddenColumns.push(COLUMN_MAP.indicadorOg)
    }
    if (!stats.resultados_og) {
      hiddenColumns.push(COLUMN_MAP.resultadoOg, COLUMN_MAP.indicadorResultadoOg)
    }
    if (!stats.objetivos_especificos) {
      hiddenColumns.push(COLUMN_MAP.objetivoEspecifico, COLUMN_MAP.indicadorOe)
    }
    if (!stats.productos_oe) {
      hiddenColumns.push(COLUMN_MAP.productoOe)
    }

    if (!stats.resultados_oe) {
      hiddenColumns.push(COLUMN_MAP.resultadoOe, COLUMN_MAP.indicadorResultadoOe)
    }

    columnasEscondidas.value = {
      columns: [...new Set(hiddenColumns)].sort((a, b) => a - b),
      indicators: true,
      version: columnasEscondidas.value.version + 1,
    }
  }

  const generateDefaultConfig = () => ({
    hiddenColumns: {
      columns: [0],
      indicators: true,
    },
  })

  const generateDynamicConfig = (stats) => {
    const columnasEscondidas = []
    if (!stats.indicadores_og) {
      columnasEscondidas.push(COLUMN_MAP.indicadorOg)
    }
    if (!stats.resultados_og) {
      columnasEscondidas.push(COLUMN_MAP.resultadoOg, COLUMN_MAP.indicadorResultadoOg)
    }
    if (!stats.objetivos_especificos) {
      columnasEscondidas.push(COLUMN_MAP.objetivoEspecifico, COLUMN_MAP.indicadorOe)
    }
    if (!stats.productos_oe) {
      columnasEscondidas.push(COLUMN_MAP.productoOe)
    }
    return {
      hiddenColumns: {
        columns: [...new Set(columnasEscondidas)].sort((a, b) => a - b),
        indicators: true,
      },
    }
  }

  return {
    loading,
    error,
    inicializado,
    currentPlanificacion,
    columnStats,
    columnasEscondidas,
    revisiones,
    hasPlanificacion, //get
    getCurrentVersion, //get
    fetchPlanificacion, //fun
  }
})
