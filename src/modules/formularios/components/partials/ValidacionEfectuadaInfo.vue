<template>
  <div class="text-center mb-3">
    <v-icon :color="miValidacion.estado === 'APROBADO' ? 'success' : 'error'" size="40">
      {{ miValidacion.estado === 'APROBADO' ? 'mdi-check-circle' : 'mdi-close-circle' }}
    </v-icon>
    <p class="text-caption font-weight-medium mt-1 mb-0">
      Solicitud {{ miValidacion.estado === 'APROBADO' ? 'Aprobada' : 'Rechazada' }}
    </p>
  </div>
  <div class="revisor-info">
    <div class="d-flex align-center mb-2">
      <div>
        <div class="text-caption font-weight-medium">
          {{ miValidacion?.validador_nombre || 'Nombre revisor' }}
        </div>
        <div class="text-caption text-grey">
          {{ miValidacion?.codigo_seguimiento || 'Codigo de seguimiento' }}
        </div>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="text-caption text-grey">
      <div class="d-flex align-center">
        <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
        <span class="font-weight-medium mr-1">Resuelto:</span>
        {{ formatDate(miValidacion?.fecha_resolucion) }}
      </div>
    </div>
    <div
      v-if="miValidacion.comentarios && miValidacion.comentarios !== 'Nueva Entrada'"
      class="comentario-box mt-2"
    >
      <v-icon size="14" class="mr-1">mdi-comment</v-icon>
      <span>{{ miValidacion.comentarios }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '../../utils/validadoresHelpers'
const props = defineProps({
  miValidacion: {
    type: Object,
    required: true,
  },
})

//computed
const miValidacion = computed(() => props.miValidacion)
</script>

<style scoped>
.linea-divisora {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(var(--v-theme-warning), 0.15) 20%,
    rgba(var(--v-theme-warning), 0.15) 80%,
    transparent
  );
  margin: 6px 0;
}
.mi-voto-emitido {
  padding: 8px 0;
}

.revisor-info {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.comentario-box {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid rgb(var(--v-theme-primary));
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
}
</style>
