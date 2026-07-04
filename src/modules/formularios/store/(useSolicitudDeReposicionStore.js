//store para Solicitud De Reposicion
//useSolicitudDeReposicion.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSolicitudReposicion } from '../composables/useSolicitudReposicion'
import { useValidadoresSolReposicion } from '../composables/useValidadoresSolReposicion'
import { useUserStore } from '@/stores/user'

export const useSolicitudDeReposicionStore = defineStore('solicitud-reposicion', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)

  // Estado - Informacion de la solicitud
  const solicitudReposicionActual = ref(null)
  //Tipo de la solicitud
  const estadosolicitudReposicionActual = ref(null)

  /****************************** COMPOSABLES *******************************************************/
  //Solicitud de fondos
  const { solicitudReposicion, obtenerSolicitudReposicionPorId } = useSolicitudReposicion()
  //Validadores
  const { estadoSolReposicion } = useValidadoresSolReposicion()

  /******************************* Stores ********************************************************/
  //Inicializar el store
  const storeUsuario = useUserStore()

  /****************************** COMPUTED *******************************************************/
  //Id del revisor Actual
  const idRevisor = computed(() => {
    return storeUsuario.id
  })

  //Obtener la validacion del revisor
  const miValidacion = computed(() => {
    if (!idRevisor.value) return null
    if (!validadoresAsignados.value.length) return null
    return (
      validadoresAsignados.value.find((validador) => validador.validador_id === idRevisor.value) ||
      null
    )
  })

  //Comprobar si es validador
  const esValidador = computed(() => {
    return miValidacion.value !== null
  })

  // Computed para verificar si ya validó
  const yaValido = computed(() => {
    if (!miValidacion.value) return false
    return miValidacion.value.estado !== 'PENDIENTE'
  })

  //Verificar si el usuario actual es el redactor
  const esRedactor = computed(() => {
    const redactor = redactorDocumento.value
    const usuarioId = storeUsuario.id

    if (!redactor || !usuarioId) return false

    return redactor.id === usuarioId
  })

  //Tipo de solicitud
  const tipoSolicitud = computed(() => {
    if (!estadosolicitudReposicionActual.value) return ''
    const tipo = estadosolicitudReposicionActual.value.tipo_solicitud
    if (!tipo) return ''
    if (tipo === 'TAREA') return 'SUBACTIVIDAD'
    return tipo
  })

  //Estado de la solicitud
  const estadoDocumento = computed(() => {
    if (!estadosolicitudReposicionActual.value) return ''
    return estadosolicitudReposicionActual.value.estado_consolidado || ''
  })

  //Resumen
  const resumenSolicitud = computed(() => {
    if (!estadosolicitudReposicionActual.value) return null
    return estadosolicitudReposicionActual.value.resumen || null
  })

  //Validadores asignados
  const validadoresAsignados = computed(() => {
    if (!estadosolicitudReposicionActual.value) return []
    if (!Array.isArray(estadosolicitudReposicionActual.value.detalle_validadores)) return []
    return estadosolicitudReposicionActual.value.detalle_validadores
  })

  //Redactor del documento - CORREGIDO
  const redactorDocumento = computed(() => {
    // Verificar que exista el estado y los validadores
    if (!estadosolicitudReposicionActual.value) {
      return null
    }

    const detalle = estadosolicitudReposicionActual.value.detalle_validadores

    // Verificar que detalle_validadores existe y es un array
    if (!detalle || !Array.isArray(detalle)) {
      console.warn('redactorDocumento: detalle_validadores no es un array', detalle)
      return null
    }

    // Verificar que el array tiene elementos
    if (detalle.length === 0) {
      console.warn('redactorDocumento: detalle_validadores está vacío')
      return null
    }

    // Verificar que el primer elemento tiene redactor
    if (!detalle[0].redactor) {
      console.warn('redactorDocumento: el primer validador no tiene redactor', detalle[0])
      return null
    }

    return detalle[0].redactor
  })

  //Version del documento
  const versionDocumento = computed(() => {
    if (!estadosolicitudReposicionActual.value) return null
    if (!validadoresAsignados.value.length) return null
    // La versión está en el primer validador (todos tienen la misma versión)
    return validadoresAsignados.value[0]?.version_documento || null
  })

  // También puedes obtener el ID de la solicitud
  const idSolicitud = computed(() => {
    return estadosolicitudReposicionActual.value?.id || null
  })

  /****************************** Funciones Solicitud de Fondos *******************************************************/

  //Cargar la Solicitud
  const cargarSolicitud = async (idSolReposicion) => {
    loading.value = true
    resetStore()
    try {
      await Promise.all([
        cargarSolicitudReposicion(idSolReposicion),
        cargarEstadoDeSolicitudReposicion(idSolReposicion),
      ])
    } catch (error) {
      console.error('Error al cargar los datos de la solicitud', error)
    } finally {
      loading.value = false
    }
  }

  //Cargar la solicitud de fondos
  const cargarSolicitudReposicion = async (idSolReposicion) => {
    loading.value = true
    try {
      await obtenerSolicitudReposicionPorId(idSolReposicion)
      solicitudReposicionActual.value = solicitudReposicion.value
    } catch (error) {
      console.error('Error al cargar la Sol de Fondos', error)
    } finally {
      loading.value = false
    }
  }

  /****************************** Funciones Validadores *******************************************************/

  //Cargar el estado de la solicitud de fondos
  const cargarEstadoDeSolicitudReposicion = async (idSolReposicion) => {
    loading.value = true
    try {
      const respuesta = await estadoSolReposicion(idSolReposicion)
      estadosolicitudReposicionActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar el estado de la sol de fondos', error)
    } finally {
      loading.value = false
    }
  }

  /******************************** Funciones de limpieza *********************************/

  //Resetear el store
  const resetStore = () => {
    solicitudReposicionActual.value = null
    estadosolicitudReposicionActual.value = null
    loading.value = false
    error.value = null
  }

  return {
    //Estado carga
    loading,
    error,

    //Computed
    idRevisor,
    miValidacion,
    esValidador,
    yaValido,
    esRedactor,
    tipoSolicitud,
    estadoDocumento,
    resumenSolicitud,
    validadoresAsignados,
    redactorDocumento,
    versionDocumento,
    idSolicitud,

    //Estado
    solicitudReposicionActual,
    estadosolicitudReposicionActual,

    //func
    resetStore,
    cargarSolicitudReposicion,
    cargarEstadoDeSolicitudReposicion,
    cargarSolicitud,
  }
})
