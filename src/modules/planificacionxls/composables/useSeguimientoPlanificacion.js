// composables/useSeguimientoPlanificacion.js
import { ref } from 'vue'
import { segPlanService } from '../services/segPlanService'

export function useSeguimientoPlanificacion() {
  //Estado
  const loading = ref(false)
  const error = ref(null)
  //const planificacionActual = ref(null)
  const planificacion = ref(null)
  const planificacionLista = ref([])
  const cambioPlanificacion = ref(null)
  const cambioPlanificacionLista = ref([])
  //const historialRevisiones = ref()

  /******************* METODOS *******************************************/
  //Cargar planificacion por id - funcional
  async function obtenerPlanificacionPorId(idplan) {
    loading.value = true
    try {
      const respuestas = await segPlanService.planificacionPorId(idplan)
      planificacion.value = respuestas
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Carga el historial de planificaciones del proyecto -funcional
  async function obtenerPlanificacionesPorIdProyecto(idProyecto) {
    loading.value = true
    try {
      const respuesta = await segPlanService.planificacionPorIdProyecto(idProyecto)
      planificacionLista.value = respuesta
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar cambio de planificacion - funcional
  async function obtenerCambioPlanificacion(idcplan) {
    loading.value = true
    try {
      const respuesta = await segPlanService.cambioPlanPorId(idcplan)
      cambioPlanificacion.value = respuesta
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar cambios de planificacion por id del planificacion - funcional
  async function obtenerCambiosPlanIdPlan(idplan) {
    loading.value = true
    try {
      const respuesta = await segPlanService.cambiosPlanIdPlan(idplan)
      cambioPlanificacionLista.value = respuesta
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    planificacionLista,
    planificacion,
    cambioPlanificacion,
    cambioPlanificacionLista,
    obtenerPlanificacionPorId,
    obtenerPlanificacionesPorIdProyecto,
    obtenerCambioPlanificacion,
    obtenerCambiosPlanIdPlan,
  }
}
