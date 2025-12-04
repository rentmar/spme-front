//Store para el seguimiento de la planificacion
//useSeguimientoPlanificacionStore.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSeguimientoPlanificacion } from '../composables/useSeguimientoPlanificacion'

export const useSeguimientoPlanificacionStore = defineStore('seguimiento-plan', () => {
  //Estados del Store
  const loading = ref(false)
  const error = ref(null)
  const planificacionProyectoLista = ref() //Lista de todas las versiones de la planificacion almacendas
  const cambioPlanificacionProyectoLista = ref([]) //planificaion y una LIsta de todos los cambios hechos por los usuarios
  const planificacionProyecto = ref() //Una planificacion especifa
  const cambioPlanificacionProyecto = ref() //Un camnio especifico de la planificacion

  //Iniciar el composable
  const {
    planificacion,
    planificacionLista,
    cambioPlanificacionLista,
    cambioPlanificacion,
    obtenerPlanificacionesPorIdProyecto,
    obtenerCambiosPlanIdPlan,
    obtenerPlanificacionPorId,
    obtenerCambioPlanificacion,
  } = useSeguimientoPlanificacion()

  /********************Funciones Computadas******************/
  //Obtener la ultima version de la planificacion almacenada
  const ultimaVersionPlanificada = computed(() => {
    if (!planificacionProyectoLista.value?.data?.length) {
      return null
    }
    //Orden descendente
    const planificacionesOrdenadas = [...planificacionProyectoLista.value.data].sort(
      (a, b) => b.version - a.version,
    )

    const resultado = planificacionesOrdenadas[0] || null
    return resultado ? { ...resultado } : null
  })

  //Obtener la planificacion vigente (ultima version)
  const planificacionVigenteComputada = computed(() => {
    if (!planificacionProyectoLista.value?.data?.length) {
      return null
    }
    //Buscar la planificacion que tenga el campo vigente = true
    return planificacionProyectoLista.value.data
      .filter((p) => p.vigente === true)
      .map((item) => ({ ...item }))
  })

  //Verificar si existen planificaciones para el proyecto cargado
  const existenPlanificaciones = computed(() => {
    return planificacionProyectoLista.value?.data?.length > 0
  })

  //Obtener el numero total de planificaciones
  const totalPlanificaciones = computed(() => {
    return planificacionProyectoLista.value?.total_planificaciones || 0
  })

  //Obtener el id del proyecto cargado
  const proyectoIdCargado = computed(() => {
    return planificacionProyectoLista.value?.proyecto_id || null
  })

  // Computed: Obtener la planificación vigente (primer elemento del array)
  const planificacionVigente = computed(() => {
    if (!planificacionVigenteComputada.value?.length) {
      return null
    }
    return planificacionVigenteComputada.value[0] // Primer elemento del array
  })

  // Computed: Obtener la versión de la planificación vigente
  const versionPlanificacionVigente = computed(() => {
    if (!planificacionVigente.value) {
      return null
    }
    return planificacionVigente.value.version
  })

  /******************** Funciones ****************************/
  //Funcion, cargar todas las planificaciones por ID de Proyecto
  async function cargarPlanificacionesDeProyecto(idproyecto) {
    loading.value = true
    try {
      await obtenerPlanificacionesPorIdProyecto(idproyecto)
      planificacionProyectoLista.value = planificacionLista.value
    } catch (err) {
      error.value = err
      console.error('Error al cargar las planificaciones del proyecto con id ' + idproyecto, err)
    } finally {
      loading.value = false
    }
  }

  //Funcion para cargar una planificacion con sus modificaciones
  async function cargarPlanificacionesCambiosPorIdPlanificacion(idplanificacion) {
    loading.value = true
    try {
      await obtenerCambiosPlanIdPlan(idplanificacion)
      cambioPlanificacionProyectoLista.value = cambioPlanificacionLista.value
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  //Funcion para cargar una planificacion por su id
  async function cargarPlanificacionPorId(idplan) {
    loading.value = true
    try {
      await obtenerPlanificacionPorId(idplan)
      planificacionProyecto.value = planificacion.value
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  //Funcions para cargar un cambio de planificacion por su id
  async function cargarCambioPlanificacionPorId(idcplan) {
    loading.value = true
    try {
      await obtenerCambioPlanificacion(idcplan)
      cambioPlanificacionProyecto.value = cambioPlanificacion
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    // Estados del composable
    loading,
    error,

    // Estados del store
    planificacionProyectoLista,
    cambioPlanificacionProyectoLista,
    planificacionProyecto,
    cambioPlanificacionProyecto,
    planificacionVigente,

    // Computed
    ultimaVersionPlanificada,
    planificacionVigenteComputada,
    existenPlanificaciones,
    totalPlanificaciones,
    proyectoIdCargado,
    versionPlanificacionVigente,

    // Funciones del store
    cargarPlanificacionesDeProyecto,
    cargarPlanificacionesCambiosPorIdPlanificacion,
    cargarPlanificacionPorId,
    cargarCambioPlanificacionPorId,
  }
})
