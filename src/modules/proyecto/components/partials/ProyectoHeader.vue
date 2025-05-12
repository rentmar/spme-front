<template>
  <v-card variant="outlined" elevation="1" class="project-card" @click="emit('click')">
    <v-card-title class="project-header">
      <div class="d-flex align-center w-100">
        <v-icon :icon="'mdi-notebook'" size="x-large" class="mr-3" :color="'primary'"></v-icon>
        <div class="project-title-container">
          <h2 class="text-h5 font-weight-bold project-title text-wrap">
            {{ proyecto.titulo }}
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis project-subtitle">
            {{ proyecto.codigo }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          :prepend-icon="'mdi-progress-check'"
          :color="getStatusColor(proyecto.estado)"
          size="small"
          class="status-chip"
        >
          {{ getEstadoTexto(proyecto.estado) }}
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="project-content">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha inicio:</strong> {{ formatDate(proyecto.fecha_inicio) }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-end" class="mr-2" size="small"></v-icon>
            <span><strong>Fecha fin:</strong> {{ formatDate(proyecto.fecha_finalizacion) }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account" class="mr-2" size="small"></v-icon>
            <span><strong>Responsable:</strong> {{ proyecto.creado_por }}</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-finance" class="mr-2" size="small"></v-icon>
            <span><strong>Presupuesto:</strong> {{ proyecto.presupuesto }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="project-actions">
      <v-btn
        v-if="activarDetalles"
        variant="text"
        color="primary"
        prepend-icon="mdi-eye"
        @click.stop="emit('view')"
      >
        Ver detalles
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="activarEditar"
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-pencil"
        @click.stop="emit('edit')"
      >
        Editar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { getStatusColor, getEstadoTexto, formatDate } from '@/utility/formatters'

defineProps({
  proyecto: { type: Object, required: true },
  activarDetalles: { type: Boolean, default: false },
  activarEditar: { type: Boolean, default: false },
})

const emit = defineEmits(['click', 'view', 'edit'])
</script>

<style scoped>
.v-card {
  margin-bottom: 24px; /* Aumenta el margen inferior */
}

/* Opcional: ajusta el espaciado específico para la última tarjeta si es necesario */
.v-card:last-child {
  margin-bottom: 0;
}
/* Estilos para hacer la tarjeta de resumen pegajosa */
.sticky-card {
  position: sticky;
  top: 20px;
}

/* Estilos generales para las tarjetas */
.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Efecto hover para las tarjetas */
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Estilos para los paneles del acordeón */
.v-expansion-panel {
  border-radius: 6px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.project-title-container {
  min-width: 0; /* Permite que el texto se trunque correctamente */
  margin-right: 12px;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.project-subtitle {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

/* Chip de estado mejorado */
.status-chip {
  min-width: 100px; /* Ancho mínimo garantizado */
  padding: 0 10px;
  font-weight: 500;
  height: 28px;
  font-size: 0.8125rem;
  letter-spacing: 0.5px;
  margin-left: 8px;
  flex-shrink: 0; /* Evita que se encoja */
}
</style>
