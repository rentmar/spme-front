<template>
  <div>
    <h1>Formularios Vinculados a la Rendicion Cuentas - Actividad</h1>
    <p>{{ props.idRendicionCuentas }}</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSolicitudesStore } from '../../store/useSolicitudesStore'

const props = defineProps({
  idRendicionCuentas: {
    type: [Number, String],
    required: true,
    default: null,
  },
  idSolicitudFondos: {
    type: [Number, String],
    required: false,
    default: null,
  },
  idSolicitudReembolso: {
    type: [Number, String],
    required: false,
    default: null,
  },
  idSolicitudViaje: {
    type: [Number, String],
    required: false,
    default: null,
  },
  idSolicitudPagoDirecto: {
    type: [Number, String],
    required: false,
    default: null,
  },
})
</script>
<style scoped></style>
