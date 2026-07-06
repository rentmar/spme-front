//Store para el manejo de una solicitud de fondos
//store useSolicitudFondosStore
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSolucitudFondos } from '../composables/useSolicitudFondos'
import { useValidadoresSolFondos } from '../composables/useValidadoresSolFondos'
import { useUserStore } from '@/stores/user'

export const useSolicitudFondosStore = defineStore('solicitud-fondos', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)
  // Estado - Informacion de la solicitud
  const solicitudFondosActual = ref(null)
  //Tipo de la solicitud
  const estadoSolicitudFondosActual = ref(null)

  /****************************** COMPOSABLES *******************************************************/
  //Solicitud de fondos
  const { solucitudFondos, obtenerSolFondosPorId } = useSolucitudFondos()
  //Validadores
  const { estadoSolicitudFondos } = useValidadoresSolFondos()

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
    if (!estadoSolicitudFondosActual.value) return ''
    const tipo = estadoSolicitudFondosActual.value.tipo_solicitud
    if (!tipo) return ''
    if (tipo === 'TAREA') return 'SUBACTIVIDAD'
    return tipo
  })

  //Estado de la solicitud
  const estadoDocumento = computed(() => {
    if (!estadoSolicitudFondosActual.value) return ''
    return estadoSolicitudFondosActual.value.estado_consolidado || ''
  })

  //Resumen
  const resumenSolicitud = computed(() => {
    if (!estadoSolicitudFondosActual.value) return null
    return estadoSolicitudFondosActual.value.resumen || null
  })

  //Validadores asignados
  const validadoresAsignados = computed(() => {
    if (!estadoSolicitudFondosActual.value) return []
    if (!Array.isArray(estadoSolicitudFondosActual.value.detalle_validadores)) return []
    return estadoSolicitudFondosActual.value.detalle_validadores
  })

  //Redactor del documento - CORREGIDO
  const redactorDocumento = computed(() => {
    // Verificar que exista el estado y los validadores
    if (!estadoSolicitudFondosActual.value) {
      return null
    }

    const detalle = estadoSolicitudFondosActual.value.detalle_validadores

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
    if (!estadoSolicitudFondosActual.value) return null
    if (!validadoresAsignados.value.length) return null
    // La versión está en el primer validador (todos tienen la misma versión)
    return validadoresAsignados.value[0]?.version_documento || null
  })

  // También puedes obtener el ID de la solicitud
  const idSolicitud = computed(() => {
    return solicitudFondosActual.value?.id || null
  })

  /****************************** Funciones Solicitud de Fondos *******************************************************/

  //Cargar la Solicitud
  const cargarSolicitud = async (idSolFondos) => {
    loading.value = true
    //resetStore()
    try {
      await Promise.all([
        cargarSolicitudFondos(idSolFondos),
        cargarEstadoDeSolicitudFondos(idSolFondos),
      ])
    } catch (error) {
      console.error('Error al cargar los datos de la solicitud', error)
    } finally {
      loading.value = false
    }
  }

  //Cargar la solicitud de fondos
  const cargarSolicitudFondos = async (idSolFondos) => {
    loading.value = true
    try {
      await obtenerSolFondosPorId(idSolFondos)
      solicitudFondosActual.value = solucitudFondos.value
    } catch (error) {
      console.error('Error al cargar la Sol de Fondos', error)
    } finally {
      loading.value = false
    }
  }
  /****************************** Funciones Validadores *******************************************************/

  //Cargar el estado de la solicitud de fondos
  const cargarEstadoDeSolicitudFondos = async (idSolFondos) => {
    loading.value = true
    try {
      const respuesta = await estadoSolicitudFondos(idSolFondos)
      estadoSolicitudFondosActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar el estado de la sol de fondos', error)
    } finally {
      loading.value = false
    }
  }

  /******************************** Funciones de limpieza *********************************/

  //Resetear el store
  const resetStore = () => {
    solicitudFondosActual.value = null
    estadoSolicitudFondosActual.value = null
    loading.value = false
    error.value = null
  }

  return {
    // Estados
    loading,
    error,
    //Estado
    solicitudFondosActual,
    estadoSolicitudFondosActual,

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

    //Func
    cargarSolicitudFondos,
    cargarEstadoDeSolicitudFondos,
    cargarSolicitud,
    resetStore,
  }
})
