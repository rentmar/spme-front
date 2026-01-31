import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useInformeActividad } from '../composables/useInformeActividad'
import { formulariosServico } from '../services/formularioService'

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

  //Iniciar composables
  const { actividadInfo, obtenerActidadPorId } = useActividad() //manejo de actividades
  const {
    //informeActividadMinRespuesta,
    listaInformeActividadSubactividadMin,
    //crearInformeActividadMin,
    listarInformeActividadSubactividadMinPorId,
  } = useInformeActividad()

  //Cargar la actividad y desestructurar en los estados
  async function cargarActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar la informacion detallada usando el composable
      await obtenerActidadPorId(idactividad)
      //La respuesta completa
      actividadDetalles.value = actividadInfo.value

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
      console.error('Error al crear el informe de actividad')
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
  }
})
