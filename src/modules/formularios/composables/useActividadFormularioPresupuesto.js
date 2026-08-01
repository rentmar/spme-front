import { ref, computed } from 'vue'
import { presupuestoProyectoServicio } from '@/modules/planificacionxlsv1/services/presupuestoProyectoService'
import { actividadFormularioServicio } from '../services/actividadFormularioService'

export const useActividadFormulaioPresupuesto = (idActividad) => {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)
  //Estado
  const actividadNodoPresupuesto = ref(null) //Nodo de Actividad - Arbol Presupuesto (Presupuesto)
  const actividadNodoInformacion = ref(null) //Nodo Actividad - Arbol Estructura (Informacion)
  const formularios = ref([])

  //--------------------Getters-------------------
  //Procedencia de fondos
  const procedenciaFondosActividad = computed(
    () => actividadNodoInformacion.value?.proyecto.procedencia_fondos,
  )
  //Presupuesto asignado a la Actividad
  const actividadPresupuestoAsignado = computed(
    () => actividadNodoPresupuesto.value?.datos.presupuesto_actividad,
  )
  //Presupuesto asignado a las tareas
  //Sumatoria de los presupuestos asignados a las tareas
  const tareasPresupuestoAsignado = computed(
    () => actividadNodoPresupuesto.value?.datos.presupuesto_tareas,
  )

  //Numero de formularios de la actividad
  const numeroTotalFormularios = computed(() => {
    if (!formularios.value) return 0
    return formularios.value.length
  })

  //Total de solicitudes
  const totalSolicitudesSinRendicion = computed(() => {
    if (!formularios.value) return 0
    return formularios.value
      .filter((f) => f.tipo !== 'rendicion_cuentas')
      .reduce((total, f) => total + (Number(f.monto) || 0), 0)
  })
  // Resultado: 216,349 - (10 + 456 + 450 + 2000) = 213,433

  /* Resultado:
{
  "solicitud_fondos": 40,572
  "solicitud_reembolso": 8,986
  "solicitud_viaje": 154,375
  "solicitud_pago_directo": 5,500
  "rendicion_cuentas": 2,916
}
*/
  const totalFormulariosPorTipo = computed(() => {
    if (!formularios.value) return {}
    return formularios.value.reduce((acc, f) => {
      acc[f.tipo] = (acc[f.tipo] || 0) + (Number(f.monto) || 0)
      return acc
    }, {})
  })

  /* Resultado:
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

  /* Resultado:
{
  "pendiente": 146,240
  "borrador": 49,007
  "aprobado": 10,598
  "rechazado": 5,500
}
*/
  const totalSolicitudesPorEstado = computed(() => {
    if (!formularios.value) return {}
    return formularios.value
      .filter((f) => f.tipo !== 'rendicion_cuentas')
      .reduce((acc, f) => {
        acc[f.estado] = (acc[f.estado] || 0) + (Number(f.monto) || 0)
        return acc
      }, {})
  })

  //Presupuesto disponible
  //El presupuesot disponible se calculo
  //Es el resultado de:
  //actividadPresupuestoAsignado - (tareasPresupuestoAsignado + total asignado a las solicitudes)

  const actividadPresupuestoDisponible = computed(() => {
    return (
      actividadPresupuestoAsignado.value -
      (tareasPresupuestoAsignado.value + totalSolicitudesSinRendicion.value)
    )
  })

  //Funciones
  const cargarDatos = async () => {
    loading.value = true
    error.value = null
    try {
      const [nodo, actividadResp] = await Promise.all([
        presupuestoProyectoServicio.obtenerActividad(idActividad),
        actividadFormularioServicio.actividadInformacion(idActividad),
      ])
      //poblar las variables
      actividadNodoPresupuesto.value = nodo.arbol

      actividadNodoInformacion.value = actividadResp
      formularios.value = actividadNodoPresupuesto.value?.formularios

      // console.log('✅ Datos cargados para actividad:', idActividad)
      // console.log('Presupuesto:', actividadPresupuesto.value)
      // console.log('Actividad:', actividad.value)
    } catch (err) {
      console.error('❌ Error al cargar actividad:', idActividad, err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  //Carga los datos al instanciarse
  cargarDatos()

  return {
    loading,
    error,
    actividadNodoPresupuesto,
    actividadNodoInformacion,
    //gett
    actividadPresupuestoAsignado,
    actividadPresupuestoDisponible,
    tareasPresupuestoAsignado,
    procedenciaFondosActividad,
    numeroTotalFormularios,
    //getter totales
    totalSolicitudesSinRendicion,
    totalFormulariosPorTipo,
    totalSolicitudesPorTipo,
    totalSolicitudesPorEstado,
  }
}
