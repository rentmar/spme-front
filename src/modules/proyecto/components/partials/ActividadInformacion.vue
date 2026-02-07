<template>
  <v-card variant="outlined" elevation="1" class="activity-card">
    <v-card-title class="activity-header pa-3">
      <div class="d-flex align-center w-100">
        <v-icon
          icon="mdi-clipboard-text-outline"
          size="large"
          class="mr-2"
          color="deep-purple"
        ></v-icon>
        <div class="activity-title-container">
          <div class="d-flex align-center">
            <h3 class="text-h6 font-weight-bold activity-title mr-2">
              {{ actividad?.codigo || 'Sin codigo' }}
            </h3>
            <v-chip :color="estadoColor(actividad?.estado)" size="x-small" class="status-chip">
              {{ actividad?.estado }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            {{ actividad?.descripcion || 'Sin Descripcion' }}
          </div>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="activity-content pa-3">
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Programada:</strong> {{ actividad?.fecha_programada || 'Sin Fecha' }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-account" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Responsable:</strong> {{ actividad?.responsable || 'Sin responsable' }}</span
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Presupuesto:</strong> ${{
                actividad?.presupuesto || 'Sin presupuesto'
              }}</span
            >
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption"
              ><strong>Cierre:</strong> {{ actividad?.fecha_cierre || 'Sin fecha de cierre' }}</span
            >
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <!-- {{ actividad }} -->
</template>

<script setup>
import { onMounted } from 'vue'
import { useActividad } from '../../composables/useActividad'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  actividadId: {
    type: [Number, String],
    required: true,
  },
})

const { actividad, cargarActividadPorId } = useActividad()

onMounted(() => {
  if (props.actividadId) {
    //obtenerDatosActividad()
    cargarActividadPorId(props.actividadId)
  }
})

function estadoColor(estado) {
  switch (estado) {
    case 'Planificada':
      return 'blue-lighten-1'
    case 'En Ejecución':
      return 'green-darken-1'
    case 'Cerrada':
      return 'grey'
    default:
      return 'orange'
  }
}
</script>

<style scoped>
.activity-card {
  margin-bottom: 12px;
}

.activity-header {
  padding-bottom: 0;
  min-height: 56px;
}

.activity-title {
  line-height: 1.2;
  margin-bottom: 0;
}

.activity-subtitle {
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-chip {
  height: 20px;
}

.activity-content {
  padding-top: 0;
}

/* Estilos más compactos para Vuetify 3 */
:deep(.v-chip--size-x-small) {
  --v-chip-height: 20px;
  font-size: 0.625rem;
}

:deep(.v-icon--size-x-small) {
  font-size: 14px;
}
</style>
