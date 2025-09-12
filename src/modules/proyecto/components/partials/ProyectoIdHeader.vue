<template>
  <!-- Overlay de carga -->
  <v-overlay
    :model-value="isLoadingProyecto"
    class="align-center justify-center"
    persistent
    opacity="0.8"
  >
    <div class="text-center">
      <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando información del proyecto...</p>
    </div>
  </v-overlay>

  <!-- Mensaje de error -->
  <v-alert v-if="isErrorProyecto && !isLoadingProyecto" type="error" variant="tonal" class="mb-4">
    Error al cargar la información del proyecto
    {{ isErrorProyecto }}
  </v-alert>

  <!-- Contenido principal cuando los datos están cargados -->
  <v-card
    v-if="!isLoadingProyecto && !isErrorProyecto && proyecto"
    variant="outlined"
    elevation="1"
    class="project-card"
  >
    <v-card-title class="project-header">
      <div class="d-flex align-center w-100">
        <v-icon :icon="'mdi-notebook'" size="x-large" class="mr-3" :color="'primary'"></v-icon>
        <div class="project-title-container">
          <h2 class="text-h5 font-weight-bold project-title text-wrap">
            {{ proyecto.titulo }}
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis project-subtitle">
            CODIGO: {{ proyecto.codigo }}
          </div>
          <div
            v-if="proyecto.pei && proyecto.pei.titulo"
            class="text-caption text-medium-emphasis mt-1 font-italic"
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
          >
            PEI: {{ proyecto.pei.titulo }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          :prepend-icon="'mdi-progress-check'"
          :color="getStatusColor(proyecto.estado)"
          size="small"
          class="status-chip"
        >
          {{ getEstadoTexto(proyecto.estado_display) }}
        </v-chip>
      </div>

      <!-- Chips de instancias gestoras -->
      <div
        v-if="proyecto.instancia_gestora && proyecto.instancia_gestora.length"
        class="mt-2 d-flex flex-wrap"
      >
        <v-chip
          v-for="instancia in proyecto.instancia_gestora"
          :key="instancia.id"
          class="ma-1"
          :color="getChipColor(instancia.codigo)"
          label
          size="small"
        >
          <v-icon start :icon="getInstanciaIcon(instancia.codigo)" size="small"></v-icon>
          {{ instancia.instancia }}
          <v-tooltip activator="parent" location="top">
            Código: {{ instancia.codigo }} | Clasificador: {{ instancia.clasificador || 'N/A' }}
          </v-tooltip>
        </v-chip>
      </div>

      <!-- Chips de procedencia de fondos -->
      <div
        v-if="proyecto.procedencia_fondos && proyecto.procedencia_fondos.length"
        class="mt-2 d-flex flex-wrap"
      >
        <v-chip
          v-for="fuente in proyecto.procedencia_fondos"
          :key="fuente.id"
          class="ma-1"
          color="info"
          variant="outlined"
          label
          size="small"
        >
          <v-icon start icon="mdi-cash" size="small"></v-icon>
          {{ fuente.sigla }} - {{ fuente.financiera }}
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
import {
  getStatusColor,
  getEstadoTexto,
  formatDate,
  getChipColor,
  getInstanciaIcon,
} from '@/utility/formatters'
import { watch, onMounted } from 'vue'
import { useProyectoCrud } from '../../composables/useProyectoCrud'

defineOptions({
  inheritAttrs: true,
})

const props = defineProps({
  proyectoId: { type: [Number, String], required: true },
  activarDetalles: { type: Boolean, default: false },
  activarEditar: { type: Boolean, default: false },
})

// Inicializar el composable
const {
  proyecto,
  loading: isLoadingProyecto,
  error: isErrorProyecto,
  obtenerProyectoDetallesPorId,
} = useProyectoCrud()

const emit = defineEmits(['click', 'view', 'edit'])

// Watch para recargar datos cuando cambia el ID del proyecto
watch(
  () => props.proyectoId,
  (newId) => {
    if (newId) {
      cargar()
    }
  },
)

// Hook
onMounted(async () => {
  if (props.proyectoId) {
    await cargar()
  }
})
// Carga de Datos
const cargar = async () => {
  await obtenerProyectoDetallesPorId(props.proyectoId)
}
</script>

<style scoped>
.project-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.project-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.project-title-container {
  flex: 1;
  min-width: 0;
}

.project-title {
  color: #1976d2;
  margin-bottom: 4px;
}

.project-subtitle {
  font-weight: 500;
}

.status-chip {
  flex-shrink: 0;
}

.project-content {
  padding: 16px;
}

.project-actions {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

/* Ajustes responsivos */
@media (max-width: 600px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-title {
    font-size: 1.25rem;
  }

  .status-chip {
    margin-top: 8px;
    align-self: flex-start;
  }
}
</style>
