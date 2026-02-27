import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useInformeActividad } from '../composables/useInformeActividad'
import { formulariosServico } from '../services/formularioService'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'

export const useInformeActividadStore = defineStore('informe-actividad', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Variables de estado
  const actividadDetalles = ref() //La totalidad de informacion de la rest api
  const actividad = ref() //Contiene la informacion de la actividad
  const tareas = ref([]) //Contiene la informacion de las tareas
  const listaAcvidadSubActividadInformes = ref([]) //Contiene la lista de informes de actividad y subactividades
  const listaInformeActividad = ref([]) //Lista de informes de una actividad
  const listaInformeTareas = ref([]) //Lista de informes de una tarea
  const listaInformes = ref([]) //Lista conjunta de los informes
  //Estructura de procedencia
  const estructuraProcedencia = ref(null)
  const indicadores = ref(null)
  const indicadoresIds = ref(null)
  //Indicadores del Informe de Actividad
  const indicadorog = ref(null) //Indicador del Objetivo General
  const indicadoroe = ref(null) //Indicadores del objetivo Especifico
  const indicadorrog = ref(null) //Indicadores Resultado Objetivo General
  const indicadorroe = ref(null) //Indicdores Resultado Objetivo Especifico

  //Estado para registros de indicadores
  const registrosIndicadores = ref({
    indicadorog: {}, // key: id_indicador, value: registro
    indicadoroe: {},
    indicadorrog: {},
    indicadorroe: {},
  })

  //Getters computados para totales
  const totalesPorTipo = computed(() => ({
    indicadorog: Object.keys(registrosIndicadores.value.indicadorog).length,
    indicadoroe: Object.keys(registrosIndicadores.value.indicadoroe).length,
    indicadorrog: Object.keys(registrosIndicadores.value.indicadorrog).length,
    indicadorroe: Object.keys(registrosIndicadores.value.indicadorroe).length,
  }))

  const totalGeneral = computed(() => {
    const totals = totalesPorTipo.value
    return totals.indicadorog + totals.indicadoroe + totals.indicadorrog + totals.indicadorroe
  })

  /***************  MANEJAR INDICADORES  ********************/
  // ⭐ NUEVO: Computed que genera el JSON exacto que necesitas (con arrays)
  const indicadoresParaAPI = computed(() => {
    // Función auxiliar para convertir objeto a array
    const objetoToArray = (objeto) => {
      return Object.values(objeto).map((registro) => ({
        ...registro,
        // Asegurar que los valores nulos estén presentes
        valor_literal: registro.valor_literal || null,
        valor_numerico: registro.valor_numerico || null,
        valor_porcentual: registro.valor_porcentual || null,
      }))
    }

    // Construir el objeto exactamente como lo necesita la API
    return {
      metadatos: {
        total_indicadorog: totalesPorTipo.value.indicadorog,
        total_indicadoroe: totalesPorTipo.value.indicadoroe,
        total_indicadorrog: totalesPorTipo.value.indicadorrog,
        total_indicadorroe: totalesPorTipo.value.indicadorroe,
        total_general: totalGeneral.value,
      },
      indicadorog: objetoToArray(registrosIndicadores.value.indicadorog),
      indicadoroe: objetoToArray(registrosIndicadores.value.indicadoroe),
      indicadorrog: objetoToArray(registrosIndicadores.value.indicadorrog),
      indicadorroe: objetoToArray(registrosIndicadores.value.indicadorroe),
    }
  })

  // NUEVO: Acciones para manejar indicadores
  const guardarRegistroIndicador = (tipo, indicadorId, registro) => {
    console.log(`💾 Store guardando registro ${tipo} para indicador ${indicadorId}:`, registro)

    // Validar que el tipo existe
    if (!registrosIndicadores.value[tipo]) {
      console.error(`Tipo de indicador inválido: ${tipo}`)
      return
    }

    // Guardar el registro usando el ID del indicador como key
    registrosIndicadores.value[tipo][indicadorId] = {
      id: Date.now(), // ID único del registro
      tipo_indicador: tipo,
      id_indicador: indicadorId,
      fecha_registro: registro.fecha_registro,
      tipo_dato: registro.tipo_dato,
      // Solo el valor correspondiente al tipo tendrá datos
      valor_literal: registro.tipo_dato === 'A-Z' ? registro.valor_literal : null,
      valor_numerico: registro.tipo_dato === '1-9' ? registro.valor_numerico : null,
      valor_porcentual: registro.tipo_dato === '%' ? registro.valor_porcentual : null,
      observaciones: registro.observaciones || '',
      timestamp_registro: registro.timestamp_registro || new Date().toISOString(),
      registrado_por: registro.registrado_por || 'Usuario Actual',
      fecha_actualizacion: new Date().toISOString(),
    }

    console.log('✅ Store actualizado:', registrosIndicadores.value)
    console.log('📊 JSON generado para API:', indicadoresParaAPI.value)
  }

  const eliminarRegistroIndicador = (tipo, indicadorId) => {
    console.log(`🗑️ Store eliminando registro ${tipo} para indicador ${indicadorId}`)

    if (registrosIndicadores.value[tipo]?.[indicadorId]) {
      delete registrosIndicadores.value[tipo][indicadorId]
      console.log('✅ Store actualizado después de eliminar')
    }
  }

  // NUEVO: Cargar registros existentes desde el backend
  const cargarRegistrosIndicadores = (data) => {
    // Si vienen datos del backend, procesarlos
    if (data?.indicadorog) {
      data.indicadorog.forEach((registro) => {
        registrosIndicadores.value.indicadorog[registro.id_indicador] = registro
      })
    }
    if (data?.indicadoroe) {
      data.indicadoroe.forEach((registro) => {
        registrosIndicadores.value.indicadoroe[registro.id_indicador] = registro
      })
    }
    if (data?.indicadorrog) {
      data.indicadorrog.forEach((registro) => {
        registrosIndicadores.value.indicadorrog[registro.id_indicador] = registro
      })
    }
    if (data?.indicadorroe) {
      data.indicadorroe.forEach((registro) => {
        registrosIndicadores.value.indicadorroe[registro.id_indicador] = registro
      })
    }
  }

  const resetearRegistrosIndicadores = () => {
    registrosIndicadores.value = {
      indicadorog: {},
      indicadoroe: {},
      indicadorrog: {},
      indicadorroe: {},
    }
  }

  /***************  FIN MANEJAR INDICADORES  *******************/

  //Iniciar composables
  const { actividadInfo, obtenerActidadPorId } = useActividad() //manejo de actividades
  const {
    //informeActividadMinRespuesta,
    listaInformeActividadSubactividadMin,
    //crearInformeActividadMin,
    listarInformeActividadSubactividadMinPorId,
  } = useInformeActividad()

  const {
    cargarIndicadoresOgporIds, //indicadorog
    cargarIndicadoresOePorIds, //indicadoroe
    cargarIndicadoresResultadoOgPorIds, //indicadorrog
    cargarIndicadoresResultadoOePorIds, //indicadorroe
  } = useIndicadores()

  //Cargar la actividad y desestructurar en los estados
  async function cargarActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar la informacion detallada usando el composable
      await obtenerActidadPorId(idactividad)
      //La respuesta completa
      actividadDetalles.value = actividadInfo.value
      estructuraProcedencia.value = actividadInfo.value.estructuraProcedencia
      indicadores.value = actividadInfo.value.estructuraProcedencia.indicadores_recolectados
      indicadoresIds.value = extraerIdsIndicadores(indicadores.value)
      console.log('indicadores ids OG: ', indicadoresIds.value.indicadorog)
      indicadorog.value = await cargarIndicadoresOgporIds(indicadoresIds.value.indicadorog)
      indicadoroe.value = await cargarIndicadoresOePorIds(indicadoresIds.value.indicadoroe)
      indicadorrog.value = await cargarIndicadoresResultadoOgPorIds(
        indicadoresIds.value.indicadorrog,
      )
      indicadorroe.value = await cargarIndicadoresResultadoOePorIds(
        indicadoresIds.value.indicadorroe,
      )

      // Desestructurar la respuesta en las variables específicas
      if (actividadInfo.value) {
        // Extraer la información principal de la actividad (excluyendo tareas)
        const { tareas: tareasData, ...actividadData } = actividadInfo.value
        actividad.value = actividadData
        tareas.value = tareasData || []
      }
    } catch (err) {
      console.error('Error al cargar la tarea', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar los informes de actividad y desestructurar los datos
  async function cargarInformesActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar los informes usando el composable
      await listarInformeActividadSubactividadMinPorId(idactividad)

      // Desestructurar la respuesta y almacenar en las variables correspondientes
      if (listaInformeActividadSubactividadMin.value) {
        listaAcvidadSubActividadInformes.value = listaInformeActividadSubactividadMin.value
        const respuesta = listaInformeActividadSubactividadMin.value
        // Almacenar informes de actividad
        listaInformeActividad.value = respuesta.informes_actividad || []
        // Almacenar informes de tareas (extraer todos los informes_tarea de todas las tareas)
        const todosInformesTareas = []
        if (respuesta.tareas_con_todos_informes) {
          respuesta.tareas_con_todos_informes.forEach((tarea) => {
            if (tarea.informes_tarea && tarea.informes_tarea.length > 0) {
              todosInformesTareas.push(...tarea.informes_tarea)
            }
          })
        }
        listaInformeTareas.value = todosInformesTareas

        // Combinar ambos tipos de informes en listaInformes
        listaInformes.value = [...listaInformeActividad.value, ...listaInformeTareas.value]
      }
    } catch (err) {
      console.error('Error al cargar los informes de la actividad con id: ' + idactividad, err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /***********************Funciones indicadores*********************************************/
  // Función para extraer IDs de indicadores agrupados por tipo
  // Opción 3: Si solo te interesan los tipos que ya existen en resultado
  const extraerIdsIndicadores = (indicadoresData) => {
    const resultado = {
      indicadorog: [],
      indicadoroe: [],
      indicadorrog: [],
      indicadorroe: [],
    }

    if (!indicadoresData || typeof indicadoresData !== 'object') {
      return resultado
    }

    // Solo procesar los tipos que nos interesan
    Object.keys(resultado).forEach((tipo) => {
      if (Array.isArray(indicadoresData[tipo])) {
        resultado[tipo] = indicadoresData[tipo].map((item) => item.id)
      }
    })

    return resultado
  }

  /***********************Funciones indicadores FIN*********************************************/

  // FUNCIONES DE BÚSQUEDA INCORPORADAS

  /**
   * Busca un informe de actividad por su ID
   * @param {number} informeId - ID del informe de actividad a buscar
   * @returns {Object|null} - Informe encontrado o null si no existe
   */
  function buscarInformeActividadPorId(informeId) {
    if (!informeId || !listaInformeActividad.value.length) {
      console.warn('No hay informes de actividad cargados o ID inválido')
      return null
    }

    const informe = listaInformeActividad.value.find((informe) => informe.id === informeId)

    if (!informe) {
      console.warn(`Informe de actividad con ID ${informeId} no encontrado`)
      console.log(
        'Informes disponibles:',
        listaInformeActividad.value.map((i) => i.id),
      )
    }

    return informe || null
  }

  /**
   * Busca un informe de tarea por su ID
   * @param {number} informeId - ID del informe de tarea a buscar
   * @returns {Object|null} - Informe de tarea encontrado o null si no existe
   */
  function buscarInformeTareaPorId(informeId) {
    if (!informeId || !listaInformeTareas.value.length) {
      console.warn('No hay informes de tareas cargados o ID inválido')
      return null
    }

    const informe = listaInformeTareas.value.find((informe) => informe.id === informeId)

    if (!informe) {
      console.warn(`Informe de tarea con ID ${informeId} no encontrado`)
      console.log(
        'Informes de tareas disponibles:',
        listaInformeTareas.value.map((i) => i.id),
      )
    }

    return informe || null
  }

  /**
   * Busca cualquier tipo de informe (actividad o tarea) por su ID
   * @param {number} informeId - ID del informe a buscar
   * @returns {Object|null} - Informe encontrado o null si no existe
   */
  function buscarInformePorId(informeId) {
    if (!informeId) return null

    // Primero busca en informes de actividad
    const informeActividad = buscarInformeActividadPorId(informeId)
    if (informeActividad) return informeActividad

    // Si no encuentra, busca en informes de tareas
    const informetarea = buscarInformeTareaPorId(informeId)
    if (informetarea) return informetarea

    console.warn(`Informe con ID ${informeId} no encontrado en ningún tipo`)
    return null
  }

  /**
   * Busca informes de tarea por el ID de la tarea padre
   * @param {number} tareaId - ID de la tarea
   * @returns {Array} - Array de informes de la tarea especificada
   */
  function buscarInformesTareaPorTareaId(tareaId) {
    if (!tareaId || !listaInformeTareas.value.length) {
      return []
    }

    const informes = listaInformeTareas.value.filter((informe) => informe.id_tarea === tareaId)

    console.log(`Encontrados ${informes.length} informes para tarea ID ${tareaId}`)
    return informes
  }

  /**
   * Busca informes por número de informe (búsqueda parcial en texto)
   * @param {string} numeroInforme - Número o parte del número de informe
   * @returns {Array} - Array de informes que coinciden
   */
  function buscarInformesPorNumero(numeroInforme) {
    if (!numeroInforme) return []

    const searchTerm = numeroInforme.toLowerCase()
    const resultados = []

    // Buscar en informes de actividad
    listaInformeActividad.value.forEach((informe) => {
      if (informe.numeroInforme && informe.numeroInforme.toLowerCase().includes(searchTerm)) {
        resultados.push({ ...informe, tipo: 'actividad' })
      }
    })

    // Buscar en informes de tareas
    listaInformeTareas.value.forEach((informe) => {
      if (informe.numeroInforme && informe.numeroInforme.toLowerCase().includes(searchTerm)) {
        resultados.push({ ...informe, tipo: 'tarea' })
      }
    })

    console.log(`Búsqueda "${numeroInforme}": ${resultados.length} resultados`)
    return resultados
  }

  /**
   * Verifica si un informe específico existe en los datos cargados
   * @param {number} informeId - ID del informe a verificar
   * @returns {boolean} - True si el informe existe
   */
  function existeInforme(informeId) {
    return !!buscarInformePorId(informeId)
  }

  /**
   * Obtiene estadísticas de los informes cargados
   * @returns {Object} - Estadísticas de informes
   */
  function obtenerEstadisticasInformes() {
    return {
      totalInformesActividad: listaInformeActividad.value.length,
      totalInformesTareas: listaInformeTareas.value.length,
      totalGeneral: listaInformes.value.length,
      informesActividadIds: listaInformeActividad.value.map((i) => i.id),
      informesTareasIds: listaInformeTareas.value.map((i) => i.id),
    }
  }

  const crearInformeActividadPrincipal = async (infData) => {
    loading.value = true
    try {
      const respuesta = await formulariosServico.creaInformeActividadPrincipal(infData)
      return respuesta
    } catch (err) {
      console.error('Error al crear el informe de actividad', err)
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    actividadDetalles,
    actividad,
    tareas,
    listaAcvidadSubActividadInformes,
    listaInformeActividad,
    listaInformeTareas,
    listaInformes,
    estructuraProcedencia,
    indicadores,
    indicadoresIds,
    indicadorog,
    indicadoroe,
    indicadorrog,
    indicadorroe,

    //Estados para los datos indicadores recolectados
    registrosIndicadores,
    totalesPorTipo,
    totalGeneral,
    indicadoresParaAPI,

    //Funciones de carga
    cargarActividadPorId,
    cargarInformesActividadPorId,

    // NUEVAS FUNCIONES DE BÚSQUEDA
    buscarInformeActividadPorId,
    buscarInformeTareaPorId,
    buscarInformePorId,
    buscarInformesTareaPorTareaId,
    buscarInformesPorNumero,
    existeInforme,
    obtenerEstadisticasInformes,

    //Funciones de creacion
    crearInformeActividadPrincipal,

    //Recoleccion de indicadores
    guardarRegistroIndicador,
    eliminarRegistroIndicador,
    cargarRegistrosIndicadores,
    resetearRegistrosIndicadores,
  }
})
