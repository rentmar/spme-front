<template>
  <div></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIndicadoresStore } from '../stores/useIndicadoresStore'

// Props del componente
const props = defineProps({
  idactividad: {
    type: [Number, String],
    required: true,
  },
})

//Iniciar el store
const storeIndicadores = useIndicadoresStore()

onMounted(async () => {
  if (props.idactividad) {
    await cargarDatos()
  }
})

const isLoading = ref(false)
const cargarDatos = async () => {
  isLoading.value = true
  try {
    await storeIndicadores.cargarActividad(props.idactividad)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
