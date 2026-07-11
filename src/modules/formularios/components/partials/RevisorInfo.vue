<template>
  <div class="mb-3">
    <div class="d-flex align-center">
      <v-avatar size="32" color="primary" class="mr-2">
        <v-icon size="16" color="white">mdi-account</v-icon>
      </v-avatar>
      <div>
        <div class="text-caption font-weight-medium">
          {{ nombreRevisor || 'Revisor' }}
        </div>
        <div class="text-caption text-grey"></div>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="text-caption text-grey">
      <div class="d-flex align-center mb-1">
        <v-icon size="x-small" class="mr-1">mdi-identifier</v-icon>
        <span class="font-weight-medium mr-1">Codigo:</span>
        {{ codigoSeguimiento }}
      </div>
      <div class="d-flex align-center mb-1">
        <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
        <span class="font-weight-medium mr-1">Asignado:</span>
        {{ fechaAsignacion }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '../../utils/validadoresHelpers'
const props = defineProps({
  revisor: {
    type: Object,
    required: true,
  },
})

//Computed
const nombreRevisor = computed(() => props.revisor?.validador_nombre)
const fechaAsignacion = computed(() => formatDate(props.revisor.fecha_asignacion))
const codigoSeguimiento = computed(() => props.revisor?.codigo_seguimiento)
</script>
