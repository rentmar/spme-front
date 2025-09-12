<template>
  <div>
    <h1>Notificaciones</h1>
    <!-- <indicador-line-chart></indicador-line-chart> -->
    <!-- Botón para abrir el modal -->
    <v-btn
      color="blue-darken-1"
      variant="elevated"
      block
      size="large"
      @click="modalAbierto = true"
      class="rounded-lg"
    >
      Abrir Registro de Bitácora
    </v-btn>
    <indicador-registro-bitacora
      v-model="modalAbierto"
      :idactividad="idactividad"
    ></indicador-registro-bitacora>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IndicadorLineChart from '@/modules/reportes/components/partials-indicador-registro/IndicadorLineChart.vue'
import IndicadorRegistroBitacora from '@/modules/reportes/components/IndicadorRegistroBitacora.vue'

const idactividad = ref(15)

const modalAbierto = ref(false)
</script>

<style lang="scss" scoped></style>
