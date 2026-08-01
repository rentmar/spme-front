import { computed, ref } from 'vue'
import { presupuestoProyectoServicio } from '@/modules/planificacionxlsv1/services/presupuestoProyectoService'
import { tareaFormularioServicio } from '../services/tareaFormularioService'
export const useTareaFormularioPresupuesto = (idtarea) => {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)
  //Estados
  const tareaNodoPresupuesto = ref(null)
  const tareaNodoInformacion = ref(null)
  const formularios = ref([])

  //----------------------Getters
  //Presupuesto asignado a la tarea
  const tareaPresupuestoAsignado = computed(
    () => tareaNodoPresupuesto.value?.datos?.presupuesto_tarea,
  )

  //Presupuesto Asignado
  //Total de solicitudes sin rendicion
  const totalSolicitudesSinRendicion = computed(() => {
    if (!formularios.value) return 0
    return formularios.value
      .filter((f) => f.tipo !== 'rendicion_cuentas')
      .reduce((total, f) => total + (Number(f.monto) || 0), 0)
  })

  /*Total de Solicitudes por tipo
  {
    "solicitud_fondos": 40,572
    "solicitud_reembolso": 8,986
    "solicitud_viaje": 154,375
    "solicitud_pago_directo": 5,500
  }
  */
  const totalSolicitudesPorTipo = computed(() => {
    if (!formularios.value) return {}
    return formularios.value
      .filter((f) => f.tipo !== 'rendicion_cuentas')
      .reduce((acc, f) => {
        acc[f.tipo] = (acc[f.tipo] || 0) + (Number(f.monto) || 0)
        return acc
      }, {})
  })

  //El presupuesto disponible se calcula
  //PresupuestoAsignadoTarea - total de las solicitudes
  const tareaPresupuestoDisponible = computed(() => {
    return tareaPresupuestoAsignado.value - totalSolicitudesSinRendicion.value
  })

  const cargarDatos = async () => {
    loading.value = true
    try {
      const [pres, info] = await Promise.all([
        presupuestoProyectoServicio.obtenerNodo('tarea', idtarea),
        tareaFormularioServicio.tareaInformacion(idtarea),
      ])
      tareaNodoPresupuesto.value = pres.arbol
      tareaNodoInformacion.value = info
      formularios.value = pres.arbol?.formularios
    } catch (error) {
      console.error('Error al cargar la informacion', error)
    } finally {
      loading.value = false
    }
  }

  cargarDatos()

  return {
    //estado
    loading,
    error,
    tareaNodoInformacion,
    tareaNodoPresupuesto,
    //getters
    tareaPresupuestoAsignado,
    totalSolicitudesSinRendicion,
    totalSolicitudesPorTipo,
    tareaPresupuestoDisponible,
  }
}
