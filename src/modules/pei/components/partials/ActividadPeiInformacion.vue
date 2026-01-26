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
              {{ actividadPei?.codigo || 'PEI-ACT-SIN-CODIGO' }}
            </h3>
            <v-chip :color="estadoColor(actividadPei?.estado)" size="x-small" class="status-chip">
              {{ estadoTexto(actividadPei?.estado) }}
            </v-chip>
          </div>
          <div class="text-caption text-medium-emphasis activity-subtitle">
            {{ actividadPei?.nombreCorto || 'Sin Nombre' }}
          </div>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="activity-content pa-3">
      <v-row dense>
        <!-- Columna 1: Información básica -->
        <v-col cols="12" sm="6" md="4">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-start" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Inicio:</strong> {{ formatDate(actividadPei?.fecha_inicio) || 'Sin Fecha' }}
            </span>
          </div>
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-calendar-end" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Cierre:</strong> {{ formatDate(actividadPei?.fecha_cierre) || 'Sin Fecha' }}
            </span>
          </div>
          <div v-if="actividadPei?.presupuesto" class="d-flex align-center mb-1">
            <v-icon icon="mdi-finance" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Presupuesto:</strong> Bs. {{ formatNumber(actividadPei.presupuesto) }}
            </span>
          </div>
        </v-col>

        <!-- Columna 2: Estado y ejecución -->
        <v-col cols="12" sm="6" md="4">
          <div v-if="actividadPei?.gradoEjecucion" class="d-flex align-center mb-1">
            <v-icon icon="mdi-progress-check" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Ejecución:</strong> {{ actividadPei.gradoEjecucion }}
            </span>
          </div>
          <div v-if="actividadPei?.totalEjecutado !== undefined" class="d-flex align-center mb-1">
            <v-icon icon="mdi-cash-check" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Ejecutado:</strong> Bs. {{ formatNumber(actividadPei.totalEjecutado) }}
            </span>
          </div>
          <div v-if="actividadPei?.saldo !== undefined" class="d-flex align-center mb-1">
            <v-icon icon="mdi-wallet" class="mr-1" size="x-small"></v-icon>
            <span class="text-caption">
              <strong>Saldo:</strong> Bs. {{ formatNumber(actividadPei.saldo) }}
            </span>
          </div>
        </v-col>

        <!-- Columna 3: Información adicional PEI -->
        <v-col cols="12" sm="6" md="4">
          <div v-if="actividadPei?.descripcion" class="d-flex align-start mb-1">
            <v-icon icon="mdi-text" class="mr-1 mt-1" size="x-small"></v-icon>
            <span class="text-caption" style="white-space: normal; line-height: 1.3">
              <strong>Descripción:</strong>
              {{ truncateText(actividadPei.descripcion, 80) }}
            </span>
          </div>
          <div v-if="actividadPei?.objetivo_de_actividad" class="d-flex align-start mb-1">
            <v-icon icon="mdi-target" class="mr-1 mt-1" size="x-small"></v-icon>
            <span class="text-caption" style="white-space: normal; line-height: 1.3">
              <strong>Objetivo:</strong>
              {{ truncateText(actividadPei.objetivo_de_actividad, 60) }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const props = defineProps({
  actividadPeiId: {
    type: [Number, String],
    required: true,
  },
})

const { actividadPei, cargarActividadPeiPorId, loading: loadingActividad } = useActividad()

// Cargar datos cuando se monta el componente o cambia el ID
onMounted(() => {
  if (props.actividadPeiId) {
    cargarActividadPeiPorId(props.actividadPeiId)
  }
})

// También cargar cuando cambia el ID (si el componente es reactivo)
watch(
  () => props.actividadPeiId,
  (newId) => {
    if (newId) {
      cargarActividadPeiPorId(newId)
    }
  },
)

// Función para asignar colores según el estado
function estadoColor(estado) {
  if (!estado) return 'grey'

  const estadoLower = estado.toLowerCase()

  switch (estadoLower) {
    case 'plan':
    case 'planificada':
    case 'pendiente':
      return 'blue-lighten-1'
    case 'ejec':
    case 'en ejecución':
    case 'en_progreso':
      return 'green-darken-1'
    case 'cerrada':
    case 'completada':
    case 'finalizada':
      return 'grey'
    case 'atrasada':
    case 'vencida':
      return 'red-lighten-1'
    default:
      return 'orange'
  }
}

// Función para formatear el texto del estado
function estadoTexto(estado) {
  if (!estado) return 'Sin Estado'

  const estadoLower = estado.toLowerCase()

  switch (estadoLower) {
    case 'plan':
      return 'PLANIFICADA'
    case 'ejec':
      return 'EN EJECUCIÓN'
    default:
      return estado.toUpperCase()
  }
}

// Función para formatear fechas
function formatDate(dateString) {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch (error) {
    return dateString
  }
}

// Función para formatear números con separadores de miles
function formatNumber(value) {
  if (!value && value !== 0) return '0.00'

  const num = parseFloat(value)
  if (isNaN(num)) return '0.00'

  return num.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Función para truncar texto largo
function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.activity-card {
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease;
}

.activity-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-header {
  padding-bottom: 0;
  min-height: 56px;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.activity-title {
  line-height: 1.2;
  margin-bottom: 0;
  color: #1976d2;
}

.activity-subtitle {
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
}

.status-chip {
  height: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.activity-content {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Estilos más compactos para Vuetify 3 */
:deep(.v-chip--size-x-small) {
  --v-chip-height: 20px;
  font-size: 0.625rem;
}

:deep(.v-icon--size-x-small) {
  font-size: 14px;
}

/* Mejoras de legibilidad */
.text-caption {
  font-size: 0.75rem;
  line-height: 1.4;
}

.d-flex.align-center {
  min-height: 24px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .activity-header {
    min-height: 48px;
  }

  .activity-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .activity-card {
    margin-bottom: 8px;
  }

  .activity-header {
    padding: 8px 12px;
  }

  .activity-content {
    padding: 6px 12px;
  }
}
</style>
