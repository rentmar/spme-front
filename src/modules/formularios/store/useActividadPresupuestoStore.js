import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { presupuestoProyectoServicio } from '@/modules/planificacionxlsv1/services/presupuestoProyectoService'
import { actividadFormularioServicio } from '../services/actividadFormularioService'

export const useActividadPresupuesto = defineStore('actividad-presupuesto', () => {
  //estado de carga
  const loading = ref(false)
  const error = ref(null)
  const inicializado = ref(false)

  //estado
  const actividadPresupuesto = ref()
  const actividad = ref()

  //getters
  const presupuestoActividad = computed(
    () => actividadPresupuesto.value.datos?.presupuesto_actividad,
  )

  const presupuestoTareas = computed(() => actividadPresupuesto.value.datos?.presupuesto_tareas)
  const presupuestoDisponible = computed(() => {
    return (
      actividadPresupuesto.value.datos?.presupuesto_actividad -
      actividadPresupuesto.value.datos?.presupuesto_tareas
    )
  })

  //INicializar
  const inicializar = async (idActividad) => {
    if (inicializado.value) return
    loading.value = true
    try {
      const [nodo, actividadResp] = await Promise.all([
        cargarNodoActividad(idActividad),
        cargarActividad(idActividad),
      ])
      actividadPresupuesto.value = nodo.arbol
      inicializado.value = true
      actividad.value = actividadResp
    } catch (error) {
      console.error('Error al inicializar', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  //Cargar el nodo de actividad del arbol de presupuestos
  const cargarNodoActividad = async (idActividad) => {
    loading.value = false
    try {
      const respuesta = await presupuestoProyectoServicio.obtenerActividad(idActividad)
      return respuesta
    } catch (err) {
      console.error('No se pudo cargar la actividad', err)
      error.value = err
      throw err
    }
  }

  //Cargar Informacion de la actividad
  const cargarActividad = async (idActividad) => {
    loading.value = false
    try {
      const respuesta = await actividadFormularioServicio.actividadInformacion(idActividad)
      return respuesta.data
    } catch (err) {
      console.error('Fallo al cargar la info actividad')
    }
  }

  //limpiar el store
  const reset = () => {
    error.value = null
    actividadPresupuesto.value = null
    inicializado.value = false
  }

  return {
    //estado
    loading,
    error,
    inicializado,
    actividadPresupuesto,
    //getters
    presupuestoActividad,
    presupuestoTareas,
    presupuestoDisponible,
    //func
    inicializar,
    reset,
  }
})
