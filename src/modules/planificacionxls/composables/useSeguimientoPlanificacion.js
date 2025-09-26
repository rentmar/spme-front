// composables/useSeguimientoPlanificacion.js
import { ref, computed } from 'vue'
import { segPlanService } from '../services/segPlanService'

export function useSeguimientoPlanificacion() {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  const planificacionActual = ref(null)
  const planificacion = ref(null)
  const planificacionLista = ref([])
  const cambioPlanificacion = ref(null)
  const cambioPlanificacionLista = ref([])
  const historialRevisiones = ref([])

  /********************Propiedades computadas*****************/

  //Version actual
  const versionActual = computed(() => {
    return planificacionActual.value?.version || 0
  })

  //Total de revisiones
  const totalRevisiones = computed(() => {
    return historialRevisiones.value.length
  })

  //Es primera version
  const esPrimeraVersion = computed(() => {
    return versionActual.value === 0
  })

  /******************* METODOS *******************************************/
  //Carga el historial de planificaciones del proyecto

  //Carga el historial de planificaciones del Proyecto
  /*
  async function cargarHistorialPlanificacion(idProyecto) {
    loading.value = true
    try {
    } catch (error) {}
  }*/

  return {
    loading,
    error,
    planificacionActual,
    historialRevisiones,
    versionActual,
    totalRevisiones,
    esPrimeraVersion,
    // cargarHistorialPlanificacion,
  }
}
