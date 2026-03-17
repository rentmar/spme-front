<template>
  <div>
    <h1>Filtro de Actividades</h1>
  </div>
  {{ storeActividades.actividadesFiltradas }}
</template>

<script setup>
import { useListaActividadStore } from '@/modules/proyecto/store/useListaActividadesStore'
import { ref, onMounted } from 'vue'

//Iniciar el store
const storeActividades = useListaActividadStore()

/***************************** Cargar informacion ******************************/
const loading = ref(false)
const error = ref(null)

const cargarDatos = async () => {
  loading.value = true
  try {
    await storeActividades.cargarActividadesTareas()
  } catch (error) {
    console.error('Error al cargar la informacion', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped></style>
