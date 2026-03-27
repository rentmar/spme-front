<template>
  <div></div>
</template>

<script setup>
import { useSolicitudesStore } from '../../store/useSolicitudesStore'
import { onMounted, ref } from 'vue'

//props
const props = defineProps({
  idActividad: {
    type: [Number, String],
    required: true,
    default: null,
  },
})

//Iniciar el store
const solicitudesStore = useSolicitudesStore()

/********************** CARGAR DATOS DEL COMPONENTE ******************************/
const loading = ref(false)
const error = ref(null)

//Funcion de carga
const cargarDatos = async () => {
  loading.value = true
  try {
    await solicitudesStore.cargarFormulariosDeActividad(props.idActividad)
  } catch (err) {
    console.error('Error al cargar datos', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

//Hook
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped></style>
