// composables/useSolicitudViajeEditarValidar.js
import { ref, computed } from 'vue'
import { actividadServicios } from '@/modules/proyecto/services/actividadService'

import { tareasServicios } from '@/modules/proyecto/services/tareasService'
import { solicitudViajeServicio } from '../services/solicitudViajeService'
import { useUserStore } from '@/stores/user'

export function useSolicitudViajeEditarValidar(idSolicitud, idActividad, idTarea = null) {
  //Discriminante
  const esTarea = computed(() => !!idTarea)
  const esActividad = computed(() => !idTarea)
  //Estado de carga
  const cargando = ref(true)
  const error = ref(null)
  const loading = ref(false)
  //Estado
  const datosOriginales = ref(null)
  const solicitante = ref('')
  const numeroFormulario = ref('')
  const actividad = ref(null)
  const tarea = ref(null)

  const formasPago = ref([])

  const formData = ref({
    evento: '',
    fecha_evento: '',
    lugar_evento: '',
    instituciones_participantes: '',
    organizador: '',
    quien_cubregastos: '',
    fondos_unitas: '',
    justificacion_asistencia: '',
    tareas_previas: '',
    detalle_destino_fondos: [{ partida: '', fuente: null, descripcion_gasto: '', monto: 0 }],
    forma_pago: null,
    lugar_solicitud: '',
    fecha_solicitud: '',
    id_responsable: null,
    id_coordinador: null,
    datos_forma_pago: {
      efectivo: { nombre_efectivo: '', ci_efectivo: '' },
      transferencia: {
        nombre_transferencia: '',
        ci_transferencia: '',
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: '',
      },
      cheque: { nombre_cheque: '', ci_cheque: '' },
      otros: { nombre_otros: '', ci_otros: '' },
    },
  })

  //Inicializar el store de usuarios
  const userstore = useUserStore()

  const soloLectura = computed(() => {
    if (!datosOriginales?.value?.usuario || !userstore.id) return true
    return datosOriginales.value.usuario !== userstore.id
  })

  // ── Computed ────────────────────────────
  const totalMonto = computed(
    () => formData.value.detalle_destino_fondos.reduce((t, g) => t + Number(g.monto || 0), 0),
    // formData.value.detalle_destino_fondos.reduce((t, g) => t + Number(g.monto || 0), 0),
  )

  //Inicializar el composable
  async function inicializar() {
    cargando.value = true
    error.value = null
    try {
      await cargarActividad(idActividad)
      if (esTarea.value) await cargarTarea(idTarea)
      await cargarSolicitudViaje(idSolicitud)
      console.log('iniciar')
    } catch (err) {
      error.value = err
      console.error('Error al inicializar', err)
      throw err
    } finally {
      cargando.value = false
    }
  }

  //Cargar actividad
  async function cargarActividad(idActividad) {
    const respuesta = await actividadServicios.actividadPorId(idActividad)
    actividad.value = respuesta
  }

  //Cargar tarea
  async function cargarTarea(idTarea) {
    const respuesta = await tareasServicios.porId(idTarea)
    tarea.value = respuesta
  }

  //Cargar la solicitud
  async function cargarSolicitudViaje(idsol) {
    const respuesta = await solicitudViajeServicio.solViajePorId(idsol)
    //Guardar los datos originales
    datosOriginales.value = respuesta
    //Cargar la informacion al v-model formData ligada a la UIX
    formData.value.evento = respuesta.evento || ''
    formData.value.fecha_evento = respuesta.fechaEvento || ''
    formData.value.lugar_evento = respuesta.lugarEvento || ''
    formData.value.organizador = respuesta.organizador || ''
    formData.value.instituciones_participantes = respuesta.institucionesParticipantes || ''
    formData.value.organizador = respuesta.organizador || ''
    formData.value.quien_cubregastos = respuesta.quienCubreGastos || ''
    formData.value.fondos_unitas = respuesta.fondosUnitas || ''
    formData.value.justificacion_asistencia = respuesta.justificacionAsistencia || ''
    formData.value.tareas_previas = respuesta.tareasPrevias || ''
    formData.value.lugar_solicitud = respuesta.lugarSolicitud || ''
    formData.value.fecha_solicitud = respuesta.fechaSolicitud || ''
    formData.value.forma_pago = respuesta.formaPago || null
    formData.value.id_responsable = respuesta.responsable || null
    formData.value.id_coordinador = respuesta.coordinador || null
    formData.value.datos_forma_pago = respuesta.datos_forma_pago || formData.value.datos_forma_pago
    numeroFormulario.value = respuesta.numeroFormulario || ''

    //Cargar el detalle de gastos
    if (respuesta.detalleGasto?.items) {
      formData.value.detalle_destino_fondos = respuesta.detalleGasto.items.map((item) => ({
        partida: item.partida || '',
        fuente: item.fuente || null,
        descripcion_gasto: item.concepto || '',
        monto: item.monto || 0,
      }))
    }
  }

  function addGasto() {
    formData.value.detalle_destino_fondos.push({
      partida: '',
      fuente: null,
      descripcion_gasto: '',
      monto: 0,
    })
  }

  function removeGasto(i) {
    if (formData.value.detalle_destino_fondos.length > 1) {
      formData.value.detalle_destino_fondos.splice(i, 1)
    }
  }

  function construirPayload() {
    return {
      // ── Datos del evento ──────────────────
      evento: formData.value.evento,
      fechaEvento: formData.value.fecha_evento,
      lugarEvento: formData.value.lugar_evento,
      institucionesParticipantes: formData.value.instituciones_participantes,
      organizador: formData.value.organizador,
      quienCubreGastos: formData.value.quien_cubregastos,
      fondosUnitas: formData.value.fondos_unitas,
      justificacionAsistencia: formData.value.justificacion_asistencia,
      tareasPrevias: formData.value.tareas_previas,

      // ── Detalle de gastos ──────────────────
      detalleGasto: {
        items: formData.value.detalle_destino_fondos.map((g) => ({
          partida: g.partida,
          fuente: g.fuente,
          concepto: g.descripcion_gasto,
          monto: Number(g.monto),
        })),
      },

      // ── Información adicional ──────────────
      formaPago: formData.value.forma_pago,
      lugarSolicitud: formData.value.lugar_solicitud,
      fechaSolicitud: formData.value.fecha_solicitud,
      datos_forma_pago: formData.value.datos_forma_pago,

      // // ── Validadores ────────────────────────
      responsable: formData.value.id_responsable,
      coordinador: formData.value.id_coordinador,

      // // ── Monto ──────────────────────────────
      montoSolicitado: totalMonto.value,

      // // ── Metadata ───────────────────────────
      // bloquearIconos: true,
    }
  }

  //Actualizar la solicitud
  async function actualizar() {
    loading.value = true
    error.value = null
    try {
      const payload = construirPayload()
      console.log('Payload: ', payload)
      await solicitudViajeServicio.solViajeUpdate(idSolicitud, payload)
      return true
    } catch (e) {
      error.value = e.message
      console.error('Error al actualizar:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    cargando,
    loading, //bandera de carga para el boton actualizar
    error,
    datosOriginales,
    solicitante,
    numeroFormulario,
    actividad,
    tarea,
    formasPago,
    formData,
    //getters
    esActividad,
    esTarea,
    soloLectura,
    totalMonto,
    //funciones
    inicializar,
    addGasto,
    removeGasto,
    actualizar,
  }
}
