<template>
  <div>
    <h1>Notificaciones</h1>
    <indicador-line-chart></indicador-line-chart>
    <!-- <indicador-registro-bitacora :idactividad="idactividad"></indicador-registro-bitacora> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IndicadorLineChart from '@/modules/reportes/components/partials-indicador-registro/IndicadorLineChart.vue'
import IndicadorRegistroBitacora from '@/modules/reportes/components/IndicadorRegistroBitacora.vue'

const idactividad = ref('1')
</script>

<style lang="scss" scoped></style>
