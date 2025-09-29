<template>
  <div>
    <h1>Seguimiento de la planificacion</h1>
  </div>
  Planificaciones:<br />
  {{ storeSeguimientoPlan.planificacionProyectoLista }}<br /><br /><br />
  Ultima Version Planificacion:<br />
  {{ storeSeguimientoPlan.ultimaVersionPlanificada }}<br /><br /><br />
  Planificacion Vigente COmputada: <br />
  {{ storeSeguimientoPlan.planificacionVigenteComputada }}<br /><br /><br />
  CambioPlanificacion: {{}}<br /><br /><br /><br /><br /><br />
  : {{}}<br /><br /><br /><br /><br /><br />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSeguimientoPlanificacion } from '@/modules/planificacionxls/composables/useSeguimientoPlanificacion'
import { useSeguimientoPlanificacionStore } from '@/modules/planificacionxls/store/useSeguimientoPlanificacionStore'

//Comprobacion del composable
const {
  planificacion,
  planificacionLista,
  cambioPlanificacion,
  cambioPlanificacionLista,
  obtenerPlanificacionPorId,
  obtenerPlanificacionesPorIdProyecto,
  obtenerCambioPlanificacion,
  obtenerCambiosPlanIdPlan,
} = useSeguimientoPlanificacion()

//Comprobacion del store
const storeSeguimientoPlan = useSeguimientoPlanificacionStore()

//Hook
onMounted(async () => {
  cargarDatos()
})

const isLoading = ref(false)
const cargarDatos = async () => {
  isLoading.value = true
  try {
    /* Funciones del composable */
    //await obtenerPlanificacionPorId(1)
    await obtenerPlanificacionesPorIdProyecto(1)
    //await obtenerCambioPlanificacion(1)
    //await obtenerCambiosPlanIdPlan(1)
    /* Funciones del store */
    await storeSeguimientoPlan.cargarPlanificacionesDeProyecto(1)
    await storeSeguimientoPlan.cargarPlanificacionesCambiosPorIdPlanificacion(1)
    await storeSeguimientoPlan.cargarPlanificacionPorId(1)
    await storeSeguimientoPlan.cargarCambioPlanificacionPorId(1)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
