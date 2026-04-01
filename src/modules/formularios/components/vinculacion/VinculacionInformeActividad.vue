<template>
  <div>
    <h1>Vinculacion de Solucitudes de viaje a informe de Actividad</h1>
    <p>Solicitud de viaje</p>
    <p>{{ solicitudesStore.solicitudesViajeActividad }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSolicitudesStore } from '../../store/useSolicitudesStore'

// Props
const props = defineProps({
  idActividad: {
    type: [Number, String],
    required: true,
    default: null,
  },
})

//Incializa el store
const solicitudesStore = useSolicitudesStore()

/*************************** CARGAR DATOS********************************************/
const loading = ref(false)

const cargarDatos = async () => {
  loading.value = true
  try {
    await Promise.all([solicitudesStore.cargarSolicitudViajeActividad(props.idActividad)])
  } catch (error) {
    console.error('Error al cargar la informacion', error)
    throw error
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped></style>
