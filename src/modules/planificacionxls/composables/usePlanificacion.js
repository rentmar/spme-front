//Composable usePlanificacion
//CRUD de Actividades
import { ref, computed } from 'vue'
import { planificacionServicios } from '../services/planificacionService'

//Estados
const loading = ref(null)
const error = ref(null)
const planes = ref([])
const plan = ref(null)
const planesPorProyecto = ref([])
const contadorPlan = ref(null)

//Estados validos
const estadosValidos = {
  CRD: 'Creada',
  PLAN: 'Planificada',
  RETR: 'Retraso',
  REPROG: 'Reprogramacion',
  EJEC: 'En Ejecucion',
  REP: 'En Reporte',
  FIN: 'Finalizado',
}

export function usePlanificacion() {
  //fetch planes
  async function cargarPlanes() {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.all()
      planes.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarPlanPorId(id) {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.porId(id)
      plan.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearPlan(data) {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.crear(data)
      plan.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updatePlan(id, data) {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delPlan(id) {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Planes por proyecto
  async function planesPorIdProyecto(id) {
    loading.value = true
    error.value = null
    try {
      const respuesta = await planificacionServicios.planIdProyecto(id)
      planesPorProyecto.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Plan por proyecto
  async function planPorIdProyecto(id) {
    loading.value = true
    error.value = null
    try {
      const respuesta = await planificacionServicios.planProyecto(id)
      plan.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Contador de planes por proyecto
  async function contarPlanPorIdProyecto(idProyecto) {
    loading.value = true
    try {
      const respuesta = await planificacionServicios.contarPlanificacionesPorIdProyecto(idProyecto)
      contadorPlan.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Propiedad computada para el conteo de actividades por estado
  const conteoEstados = computed(() => {
    const conteo = {}
    //Inicializa el conteo para todos los estados validos en 0
    for (const estado in estadosValidos) {
      conteo[estado] = 0
    }
    //Itera sobre el Array
    planes.value.forEach((item) => {
      const estado = item.estado
      if (estadosValidos[estado] !== undefined) {
        conteo[estado]++
      }
    })

    return conteo
  })

  return {
    loading,
    error,
    planes,
    plan,
    planesPorProyecto,
    contadorPlan,
    conteoEstados,
    cargarPlanes,
    cargarPlanPorId,
    crearPlan,
    updatePlan,
    delPlan,
    planesPorIdProyecto,
    planPorIdProyecto,
    contarPlanPorIdProyecto,
  }
}
