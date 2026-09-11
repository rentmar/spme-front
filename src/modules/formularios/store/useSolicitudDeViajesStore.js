//Store para el manejo de una sol de viajes
//store useSolicitudDeViajesStore

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSolicitudViaje } from '../composables/useSolicitudViaje'
import { useValidadoresSolViajes } from '../composables/useValidadoresSolViajes'
import { useUserStore } from '@/stores/user'
import { solicitudViajeServicio } from '../services/solicitudViajeService'
import SolicitudDeViaje from '@/views/monitoreo/SolicitudDeViaje.vue'

export const useSolicitudDeViajesStore = defineStore('solicitud-viaje', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)
  // Estado - Informacion de la solicitud
  const solicitudViajesActual = ref()
  //Tipo de la solicitud
  const estadoSolicitudViajesActual = ref()

  /****************************** COMPOSABLES *******************************************************/
  //Solicitud de viajes
  const { solicitudViaje, obtenerSolicitudViajesPorId } = useSolicitudViaje()

  //Validadores
  const { estadoSolicitudViajes } = useValidadoresSolViajes()

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
    console.log('Usuario: ', usuarioId)
    console.log('redactor: ', redactor)

    return redactor.id === usuarioId
  })

  //Tipo de solicitud
  const tipoSolicitud = computed(() => {
    if (!estadoSolicitudViajesActual.value) return ''
    const tipo = estadoSolicitudViajesActual.value.tipo_solicitud
    if (!tipo) return ''
    if (tipo === 'TAREA') return 'SUBACTIVIDAD'
    return tipo
  })

  //Estado de la solicitud
  const estadoDocumento = computed(() => {
    if (!estadoSolicitudViajesActual.value) return ''
    return estadoSolicitudViajesActual.value.estado_consolidado || ''
  })

  //Resumen
  const resumenSolicitud = computed(() => {
    if (!estadoSolicitudViajesActual.value) return null
    return estadoSolicitudViajesActual.value.resumen || null
  })

  //Validadores asignados
  const validadoresAsignados = computed(() => {
    if (!estadoSolicitudViajesActual.value) return []
    if (!Array.isArray(estadoSolicitudViajesActual.value.detalle_validadores)) return []
    return estadoSolicitudViajesActual.value.detalle_validadores
  })

  //Redactor del documento - CORREGIDO
  const redactorDocumento = computed(() => {
    return solicitudViajesActual.value?.usuario_info || null
    // Verificar que exista el estado y los validadores
    // if (!estadoSolicitudViajesActual.value) {
    //   return null
    // }

    // const detalle = estadoSolicitudViajesActual.value.detalle_validadores

    // Verificar que detalle_validadores existe y es un array
    // if (!detalle || !Array.isArray(detalle)) {
    //   console.warn('redactorDocumento: detalle_validadores no es un array', detalle)
    //   return null
    // }

    // Verificar que el array tiene elementos
    // if (detalle.length === 0) {
    //   console.warn('redactorDocumento: detalle_validadores está vacío')
    //   return null
    // }

    // Verificar que el primer elemento tiene redactor
    // if (!detalle[0].redactor) {
    //   console.warn('redactorDocumento: el primer validador no tiene redactor', detalle[0])
    //   return null
    // }

    // return detalle[0].redactor
  })

  //Version del documento
  const versionDocumento = computed(() => {
    if (!estadoSolicitudViajesActual.value) return null
    if (!validadoresAsignados.value.length) return null
    // La versión está en el primer validador (todos tienen la misma versión)
    return validadoresAsignados.value[0]?.version_documento || null
  })

  // También puedes obtener el ID de la solicitud
  const idSolicitud = computed(() => {
    return solicitudViajesActual.value?.id || null
  })

  /****************************** Funciones Solicitud de Fondos *******************************************************/
  //Cargar la Solicitud
  const cargarSolicitud = async (idSolViajes) => {
    loading.value = true
    try {
      await Promise.all([
        cargarSolicitudViajes(idSolViajes),
        cargarEstadoDeSolicitudViajes(idSolViajes),
      ])
    } catch (error) {
      console.error('Error al cargar los datos de la solictud de viajes', error)
    } finally {
      loading.value = false
    }
  }

  //Cargar la solicitud de fondos
  const cargarSolicitudViajes = async (idSolViajes) => {
    loading.value = true
    try {
      // await obtenerSolicitudViajesPorId(idSolViajes)
      const respuesta = await solicitudViajeServicio.solViajeValidarPorId(idSolViajes)
      solicitudViajesActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar la Solicitud de Viajes', error)
    } finally {
      loading.value = false
    }
  }

  /****************************** Funciones Validadores *******************************************************/
  //Cargar el estado de la sol de viajes
  const cargarEstadoDeSolicitudViajes = async (idSolViajes) => {
    loading.value = true
    try {
      const respuesta = await estadoSolicitudViajes(idSolViajes)
      estadoSolicitudViajesActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar la sol de viajes', error)
    } finally {
      loading.value = false
    }
  }
  /******************************** Funciones de limpieza *********************************/
  //Resetear el store
  const resetStore = () => {
    solicitudViajesActual.value = null
    estadoSolicitudViajesActual.value = null
    loading.value = false
    error.value = null
  }
  return {
    //Estados
    loading,
    error,
    //Estado
    solicitudViajesActual,
    estadoSolicitudViajesActual,

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

    //func
    cargarSolicitudViajes,
    cargarEstadoDeSolicitudViajes,
    cargarSolicitud,
    resetStore,
  }
})
