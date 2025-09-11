<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
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

onMounted(() => {})

const cargarDatos = async () => {}
</script>

<style scoped></style>
