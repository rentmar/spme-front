<!-- components/validation/ListaRevisores.vue -->
<template>
  <div>
    <!-- Estado vacío: Sin revisores -->
    <div v-if="!revisores || revisores.length === 0" class="empty-state">
      <v-icon size="32" color="grey-lighten-1">mdi-account-off</v-icon>
      <p class="text-caption text-grey mt-2 mb-0">No hay revisores asignados</p>
    </div>

    <!-- Lista de revisores -->
    <div v-else class="revisores-container">
      <div v-for="revisor in revisores" :key="revisor.validacion_id" class="revisor-card">
        <!-- Nombre del revisor con avatar -->
        <div class="d-flex align-center mb-2">
          <v-avatar size="28" :color="getColorEstado(revisor.estado)" class="mr-2">
            <v-icon size="14" color="white">
              {{ getIconoEstado(revisor.estado) }}
            </v-icon>
          </v-avatar>
          <span class="text-caption font-weight-medium">{{ revisor.validador_nombre }}</span>
        </div>

        <!-- Código de seguimiento -->
        <div class="text-caption text-grey mb-1">
          <v-icon size="x-small" class="mr-1">mdi-identifier</v-icon>
          {{ revisor.codigo_seguimiento }}
        </div>

        <!-- Fecha de asignación -->
        <div class="text-caption text-grey mb-1">
          <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
          Asignado: {{ formatDate(revisor.fecha_asignacion) }}
        </div>

        <!-- Fecha de resolución -->
        <div v-if="revisor.fecha_resolucion" class="text-caption text-grey mb-2">
          <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
          Resuelto: {{ formatDate(revisor.fecha_resolucion) }}
        </div>

        <!-- Estado de la validación (chip) -->
        <div class="mb-2">
          <v-chip :color="getColorEstado(revisor.estado)" size="x-small" variant="tonal">
            {{ revisor.estado }}
          </v-chip>
        </div>

        <!-- Ver comentario (colapsable) -->
        <div v-if="revisor.comentarios && revisor.comentarios !== 'Nueva Entrada'">
          <v-expansion-panels variant="accordion" flat>
            <v-expansion-panel class="bg-transparent" density="compact">
              <v-expansion-panel-title class="text-caption pa-0" style="min-height: 24px">
                <v-icon size="x-small" class="mr-1">mdi-comment-text-outline</v-icon>
                Ver comentario
              </v-expansion-panel-title>
              <v-expansion-panel-text class="pa-2 bg-grey-lighten-4 rounded mt-1">
                {{ revisor.comentarios }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getColorEstado,
  getIconoEstado,
  formatDate,
} from '@/modules/formularios/utils/validadoresHelpers'

defineProps({
  revisores: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.revisores-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.revisor-card {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
