// src/modules/administrarSolicitudes/usuarioRegular/store/useMisSolicitudesStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listasSolicitudesServicio } from '@/modules/formularios/services/listasSolicitudesService'

export const useMisSolicitudesStore = defineStore('mis-solicitudes', () => {
  /*============================================
   *  ESTADO
   * ===========================================*/
  const loading = ref(false)
  const error = ref(null)

  //Las sol de
  const solicitudesPrueba = ref()

  //Solicitudes clasificadadas por tipo
  const solicitudes = ref({
    solicitudesFondos: [],
    solicitudesViaje: [],
    solicitudesPagoDirecto: [],
    solicitudesReembolso: [],
    rendicionesCuentas: [],
  })

  //Resumenes por tipo
  const resumenes = ref({
    solicitudesFondos: null,
    solicitudesViaje: null,
    solicitudesPagoDirecto: null,
    solicitudesReembolso: null,
    rendicionesCuentas: null,
  })

  //Pendientes de revision
  const pendientesRevision = ref({
    solicitudesFondos: [],
    solicitudesViaje: [],
    solicitudesPagoDirecto: [],
    solicitudesReembolso: [],
    rendicionesCuentas: [],
  })

  //Solicitudes revisadas/por revisar
  const formulariosRevisadosPorRevisar = ref({
    solicitudesFondos: [],
    solicitudesViaje: [],
    solicitudesPagoDirecto: [],
    solicitudesReembolso: [],
    rendicionesCuentas: [],
  })

  // ============================================
  // GETTERS - SOLICITUDES POR TIPO
  // ============================================

  //Todas las solicitudes unificadas con tipo inyectado
  const todasLasSolicitudes = computed(() => {
    return [
      ...solicitudes.value.solicitudesFondos.map((s) => ({
        ...s,
        _tipo: 'solicitud_fondos', // ← Cambiado
        _tipoDisplay: 'Solicitud de Fondos',
        _uid: 'fondos_' + s.id,
      })),
      ...solicitudes.value.solicitudesViaje.map((s) => ({
        ...s,
        _tipo: 'solicitud_viaje', // ← Cambiado
        _tipoDisplay: 'Solicitud de Viaje',
        _uid: 'viajes_' + s.id,
      })),
      ...solicitudes.value.solicitudesPagoDirecto.map((s) => ({
        ...s,
        _tipo: 'solicitud_pago_directo', // ← Cambiado
        _tipoDisplay: 'Pago Directo',
        _uid: 'pago_' + s.id,
      })),
      ...solicitudes.value.solicitudesReembolso.map((s) => ({
        ...s,
        _tipo: 'solicitud_reposicion', // ← Cambiado (coincide con helper)
        _tipoDisplay: 'Reposición/Reembolso',
        _uid: 'reembolso_' + s.id,
      })),
      ...solicitudes.value.rendicionesCuentas.map((s) => ({
        ...s,
        _tipo: 'rendicion_cuentas', // ← Cambiado
        _tipoDisplay: 'Rendición de Cuentas',
        _uid: 'rendicion_' + s.id,
      })),
    ]
  })

  //Solicitudes de fondos
  const solicitudesFondos = computed(() => {
    return solicitudes.value?.solicitudesFondos
  })

  //Solcitudes de viajes
  const solicitudesViaje = computed(() => {
    return solicitudes.value?.solicitudesViaje
  })

  //Sol de pago directo
  const solicitudPagoDirecto = computed(() => {
    return solicitudes.value?.solicitudesPagoDirecto
  })

  //Sol de reposicion
  const solicitudReposicion = computed(() => {
    return solicitudes.value?.solicitudesReembolso
  })

  //Rendicion de cuentas
  const rendicionCuentas = computed(() => {
    return solicitudes.value?.rendicionesCuentas
  })

  //Solicitudes por revisar
  const totalSolicitudesPendientes = computed(() => {
    return [
      ...pendientesRevision.value.solicitudesFondos,
      ...pendientesRevision.value.solicitudesViaje,
      ...pendientesRevision.value.solicitudesPagoDirecto,
      ...pendientesRevision.value.solicitudesReembolso,
      ...pendientesRevision.value.rendicionesCuentas,
    ]
  })

  //Solicitudes revision
  const totalSolRevisionesPorRevisar = computed(() => {
    return [
      ...formulariosRevisadosPorRevisar.value.solicitudesFondos,
      ...formulariosRevisadosPorRevisar.value.solicitudesViaje,
      ...formulariosRevisadosPorRevisar.value.solicitudesPagoDirecto,
      ...formulariosRevisadosPorRevisar.value.solicitudesReembolso,
      ...formulariosRevisadosPorRevisar.value.rendicionesCuentas,
    ]
  })

  // ============================================
  // GETTERS - ESTADÍSTICAS (basadas en estadoConsolidado)
  // ============================================
  //Total de todas las solicitudes (suma de todos los tipos)
  const totalSolicitudes = computed(() => todasLasSolicitudes.value.length)

  //Solicitudes pendientes (estadoConsolidado = 'Pendiente')
  const solicitudesPendientes = computed(
    () => todasLasSolicitudes.value.filter((s) => s.estadoConsolidado === 'Pendiente').length,
  )

  //Solicitudes aprobadas (estadoConsolidado = 'Aprobado')
  const solicitudesAprobadas = computed(
    () => todasLasSolicitudes.value.filter((s) => s.estadoConsolidado === 'Aprobado').length,
  )

  //Solicitudes rechazadas (estadoConsolidado = 'Rechazado')
  const solicitudesRechazadas = computed(
    () => todasLasSolicitudes.value.filter((s) => s.estadoConsolidado === 'Rechazado').length,
  )

  //Solicitudes sin revisores (estadoConsolidado = 'SinRevisores')
  const solicitudesSinRevisores = computed(
    () => todasLasSolicitudes.value.filter((s) => s.estadoConsolidado === 'SinRevisores').length,
  )
  //Pendientes de revision
  const totalPendientesRevision = computed(() => pendientesRevision.value.totalPendientes)
  //Revisados y por revisar
  const totalPorRevisarRevisadas = computed(() => {
    return formulariosRevisadosPorRevisar.value.totalRevisiones
  })

  // ============================================
  // GETTERS - CONTEOS POR TIPO (badges)
  // ============================================

  const countFondos = computed(() => solicitudes.value.solicitudesFondos.length)
  const countViajes = computed(() => solicitudes.value.solicitudesViaje.length)
  const countPagoDirecto = computed(() => solicitudes.value.solicitudesPagoDirecto.length)
  const countReembolso = computed(() => solicitudes.value.solicitudesReembolso.length)
  const countRendiciones = computed(() => solicitudes.value.rendicionesCuentas.length)

  // ============================================
  // ACCIONES DE CARGA
  // ============================================

  //Inicializa el store
  const inicializar = async () => {
    await cargarTodasLasSolicitudes()
  }

  //Carga todas las solicitudes del usuario actual
  const cargarTodasLasSolicitudes = async () => {
    loading.value = true
    try {
      //Obtener datos del servicion
      const datos = await listasSolicitudesServicio.listaSolicitudes()
      solicitudesPrueba.value = datos

      //Validar que la respuesta tiene la estructura esperada
      if (!esRespuestaValida(datos)) {
        console.warn(
          '⚠️ La respuesta no contiene solicitudes válidas. Inicializando arrays vacíos.',
        )
        inicializarArraysVacios()
        return null
      }

      //Asignar datos a las variables
      asignarDatosSolicitudes(datos)

      return datos
    } catch (err) {
      error.value = err
      inicializarArraysVacios()
    } finally {
      loading.value = false
    }
  }

  /**
   * Valida que la respuesta tenga la estructura correcta
   * Verifica que al menos una categoría tenga solicitudes
   */
  function esRespuestaValida(datos) {
    // Verificar que datos existe y es un objeto
    if (!datos || typeof datos !== 'object') {
      return false
    }

    // Claves esperadas en la respuesta
    const clavesEsperadas = [
      'solicitudesFondos',
      'solicitudesViaje',
      'solicitudesPagoDirecto',
      'solicitudesReembolso',
      'rendicionesCuentas',
    ]

    // Verificar que al menos una clave tenga la estructura correcta
    const tieneDatosValidos = clavesEsperadas.some((clave) => {
      const categoria = datos[clave]
      return (
        categoria &&
        typeof categoria === 'object' &&
        categoria.solicitudes !== undefined &&
        Array.isArray(categoria.solicitudes)
      )
    })

    return tieneDatosValidos
  }

  /**
   * Asigna los datos de la respuesta a las variables reactivas
   * Usa valores por defecto seguros con optional chaining
   */
  function asignarDatosSolicitudes(datos) {
    // Asignar solicitudes por categoría
    solicitudes.value = {
      solicitudesFondos: datos.solicitudesFondos?.solicitudes ?? [],
      solicitudesViaje: datos.solicitudesViaje?.solicitudes ?? [],
      solicitudesPagoDirecto: datos.solicitudesPagoDirecto?.solicitudes ?? [],
      solicitudesReembolso: datos.solicitudesReembolso?.solicitudes ?? [],
      rendicionesCuentas: datos.rendicionesCuentas?.solicitudes ?? [],
    }

    // Asignar resúmenes
    resumenes.value = {
      solicitudesFondos: datos.solicitudesFondos?.resumen ?? null,
      solicitudesViaje: datos.solicitudesViaje?.resumen ?? null,
      solicitudesPagoDirecto: datos.solicitudesPagoDirecto?.resumen ?? null,
      solicitudesReembolso: datos.solicitudesReembolso?.resumen ?? null,
      rendicionesCuentas: datos.rendicionesCuentas?.resumen ?? null,
    }

    // Asignar pendientes de revisión
    pendientesRevision.value = datos.pendientesRevision ?? {
      totalPendientes: 0,
      solicitudesFondos: [],
      solicitudesViaje: [],
      solicitudesPagoDirecto: [],
      solicitudesReembolso: [],
      rendicionesCuentas: [],
    }

    //Asignar los formularios revisados y por revisar
    formulariosRevisadosPorRevisar.value = datos.solicitudesRevisor ?? {
      totalRevisiones: [],
      solicitudesFondos: [],
      solicitudesViaje: [],
      solicitudesPagoDirecto: [],
      solicitudesReembolso: [],
      rendicionesCuentas: [],
    }
  }

  /**
   * Inicializa todos los arrays como vacíos
   * Útil cuando no hay datos o ocurre un error
   */
  function inicializarArraysVacios() {
    solicitudes.value = {
      solicitudesFondos: [],
      solicitudesViaje: [],
      solicitudesPagoDirecto: [],
      solicitudesReembolso: [],
      rendicionesCuentas: [],
    }

    resumenes.value = {
      solicitudesFondos: null,
      solicitudesViaje: null,
      solicitudesPagoDirecto: null,
      solicitudesReembolso: null,
      rendicionesCuentas: null,
    }

    pendientesRevision.value = {
      totalPendientes: 0,
      solicitudesFondos: [],
      solicitudesViaje: [],
      solicitudesPagoDirecto: [],
      solicitudesReembolso: [],
      rendicionesCuentas: [],
    }
  }

  return {
    //Estado
    loading,
    error,
    solicitudes,
    resumenes,
    pendientesRevision,
    formulariosRevisadosPorRevisar,
    solicitudesPrueba,

    //Getters unificados
    todasLasSolicitudes,
    totalSolicitudesPendientes,
    totalSolRevisionesPorRevisar,

    //Getters por tipo
    solicitudesFondos,
    solicitudesViaje,
    solicitudPagoDirecto,
    solicitudReposicion,
    rendicionCuentas,

    //Getters estadisticas
    totalSolicitudes,
    solicitudesPendientes,
    solicitudesAprobadas,
    solicitudesRechazadas,
    solicitudesSinRevisores,
    totalPendientesRevision,
    totalPorRevisarRevisadas,

    //Getter conteos por tipo
    countFondos,
    countViajes,
    countPagoDirecto,
    countReembolso,
    countRendiciones,

    //Getter dinamico

    //acciones
    inicializar,
  }
})
