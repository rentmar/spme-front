import { ref, computed } from 'vue'
import { presupuestoProyectoServicio } from '@/modules/planificacionxlsv1/services/presupuestoProyectoService'
import { actividadFormularioServicio } from '../services/actividadFormularioService'

export const useActividadFormulaioPresupuesto = (idActividad) => {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)
  //Estado
  const actividadPresupuesto = ref(null)
  const actividad = ref(null)

  //--------------------Getters-------------------
  //Actividad del presupuesto asignado
  const actividadPresupuestoAsignado = computed(
    () => actividadPresupuesto.value?.datos.presupuesto_actividad,
  )
  //Presupuesto asignado a las tareas
  const tareasPresupuestoAsignado = computed(
    () => actividadPresupuesto.value?.datos.presupuesto_tareas,
  )

  //Presupuesto saldo
  const actividadPresupuestoDisponible = computed(() => {
    return (
      actividadPresupuesto.value?.datos.presupuesto_actividad -
      actividadPresupuesto.value?.datos.presupuesto_tareas
    )
  })

  const cargarDatos = async () => {
    loading.value = true
    error.value = null
    try {
      const [nodo, actividadResp] = await Promise.all([
        presupuestoProyectoServicio.obtenerActividad(idActividad),
        actividadFormularioServicio.actividadInformacion(idActividad),
      ])
      //poblar las variables
      actividadPresupuesto.value = nodo.arbol
      actividad.value = actividadResp

      console.log('✅ Datos cargados para actividad:', idActividad)
      console.log('Presupuesto:', actividadPresupuesto.value)
      console.log('Actividad:', actividad.value)
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
    actividadPresupuesto,
    actividad,
    //gett
    actividadPresupuestoAsignado,
    tareasPresupuestoAsignado,
    actividadPresupuestoDisponible,
  }
}
