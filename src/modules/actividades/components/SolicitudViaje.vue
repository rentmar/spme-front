<template>
  <div>
    {{ solicitud }}
  </div>
  <br /><br /><br />
  <div>
    {{ solicitudes }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSolicitudViajes } from '../composables/useSolicitudViajes'

//Iniciar el composable
const {
  loading,
  error,
  solicitud,
  solicitudes,
  cargarSolicitudViajes,
  cargarSolicitudViajesPorId,
} = useSolicitudViajes()

onMounted(async () => {
  await cargarDatos()
})

// Funciones
const cargarDatos = async () => {
  await cargarSolicitudViajes()
  await cargarSolicitudViajesPorId(1)
}
</script>

<style scoped></style>
