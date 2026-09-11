import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSolicitudPagoDirecto } from '../composables/useSolicitudPagoDirecto'
import { useValidadoresSolPagoDirecto } from '../composables/useValidadoresSolPagoDirecto'
import { useUserStore } from '@/stores/user'
import { solicitudPagoDirectoServicio } from '../services/solicitudPagoDirecto'

export const useSolicitudDePagoDirectoStore = defineStore('solicitud-pago-directo', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)

  // Estado - Informacion de la solicitud
  const solicitudPagoDirectoActual = ref(null)
  //Tipo de la solicitud
  const estadoSolicitudPagoDirectoActual = ref(null)

  /****************************** COMPOSABLES *******************************************************/
  //Solicitud de Pago Directo
  const { solicitudPagoDirecto, obtenerSolicitudDePagoDirectoPorId } = useSolicitudPagoDirecto()
  //Validadores
  const { estadoSolicitudPagoDirecto } = useValidadoresSolPagoDirecto()
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
    if (!estadoSolicitudPagoDirectoActual.value) return ''
    const tipo = estadoSolicitudPagoDirectoActual.value.tipo_solicitud
    if (!tipo) return ''
    if (tipo === 'TAREA') return 'SUBACTIVIDAD'
    return tipo
  })

  //Estado de la solicitud
  const estadoDocumento = computed(() => {
    if (!estadoSolicitudPagoDirectoActual.value) return ''
    return estadoSolicitudPagoDirectoActual.value.estado_consolidado || ''
  })

  //Resumen
  const resumenSolicitud = computed(() => {
    if (!estadoSolicitudPagoDirectoActual.value) return null
    return estadoSolicitudPagoDirectoActual.value.resumen || null
  })

  //Validadores asignados
  const validadoresAsignados = computed(() => {
    if (!estadoSolicitudPagoDirectoActual.value) return []
    if (!Array.isArray(estadoSolicitudPagoDirectoActual.value.detalle_validadores)) return []
    return estadoSolicitudPagoDirectoActual.value.detalle_validadores
  })

  //Redactor del documento - CORREGIDO
  const redactorDocumento = computed(() => {
    return solicitudPagoDirectoActual.value?.usuario_info || null

    // Verificar que exista el estado y los validadores
    // if (!estadoSolicitudPagoDirectoActual.value) {
    //   return null
    // }

    // const detalle = estadoSolicitudPagoDirectoActual.value.detalle_validadores

    // // Verificar que detalle_validadores existe y es un array
    // if (!detalle || !Array.isArray(detalle)) {
    //   console.warn('redactorDocumento: detalle_validadores no es un array', detalle)
    //   return null
    // }

    // // Verificar que el array tiene elementos
    // if (detalle.length === 0) {
    //   console.warn('redactorDocumento: detalle_validadores está vacío')
    //   return null
    // }

    // // Verificar que el primer elemento tiene redactor
    // if (!detalle[0].redactor) {
    //   console.warn('redactorDocumento: el primer validador no tiene redactor', detalle[0])
    //   return null
    // }

    // return detalle[0].redactor
  })

  //Version del documento
  const versionDocumento = computed(() => {
    if (!estadoSolicitudPagoDirectoActual.value) return null
    if (!validadoresAsignados.value.length) return null
    // La versión está en el primer validador (todos tienen la misma versión)
    return validadoresAsignados.value[0]?.version_documento || null
  })

  // También puedes obtener el ID de la solicitud
  const idSolicitud = computed(() => {
    // return solicitudPagoDirecto.value?.id || null
    return solicitudPagoDirectoActual.value?.id || null
  })

  /****************************** Funciones Solicitud de Fondos *******************************************************/
  //Cargar la Solicitud
  const cargarSolicitud = async (idSolPagoDirecto) => {
    loading.value = true
    try {
      await Promise.all([
        cargarSolicitudPagoDirecto(idSolPagoDirecto),
        cargarEstadoDeSolicitudPagoDirecto(idSolPagoDirecto),
      ])
    } catch (error) {
      console.error('Error al cargar los datos de la solictud de pago directo', error)
    } finally {
      loading.value = false
    }
  }

  //Cargar la solicitud de pago directo
  const cargarSolicitudPagoDirecto = async (idSolPagoDirecto) => {
    loading.value = true
    try {
      // await obtenerSolicitudDePagoDirectoPorId(idSolPagoDirecto)
      const respuesta =
        await solicitudPagoDirectoServicio.solPagoDirectoPorIdEditar(idSolPagoDirecto)
      solicitudPagoDirectoActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar la Solicitud de Viajes', error)
    } finally {
      loading.value = false
    }
  }

  /****************************** Funciones Validadores *******************************************************/

  //Cargar el estado de la sol de viajes
  const cargarEstadoDeSolicitudPagoDirecto = async (idSolPagoDirecto) => {
    loading.value = true
    try {
      const respuesta = await estadoSolicitudPagoDirecto(idSolPagoDirecto)
      estadoSolicitudPagoDirectoActual.value = respuesta
    } catch (error) {
      console.error('Error al cargar la sol de viajes', error)
    } finally {
      loading.value = false
    }
  }
  /******************************** Funciones de limpieza *********************************/
  //Resetear el store
  const resetStore = () => {
    solicitudPagoDirectoActual.value = null
    estadoSolicitudPagoDirectoActual.value = null
    loading.value = false
    error.value = null
  }

  return {
    //Estados de carga
    loading,
    error,
    //Estado
    solicitudPagoDirectoActual,
    estadoSolicitudPagoDirectoActual,

    //COmputed
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
    cargarSolicitud,
    cargarSolicitudPagoDirecto,
    cargarEstadoDeSolicitudPagoDirecto,
    resetStore,
  }
})
