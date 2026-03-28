<!-- components/PopupActividad.vue -->
<template>
  <div
    v-if="visible && actividad"
    class="popup-actividad"
    :style="{ top: positionY + 'px', left: positionX + 'px' }"
    @mouseenter="cancelarCierre"
    @mouseleave="iniciarCierre"
  >
    <v-card :elevation="8" class="popup-card" rounded="lg" max-width="400">
      <v-card-text class="pa-3">
        <!-- Header -->
        <div class="d-flex align-center mb-2">
          <v-avatar :color="getStatusColor(actividad.estado)" size="32" class="mr-2">
            <v-icon :icon="getTipoIcon(actividad.estado)" size="18" color="white"></v-icon>
          </v-avatar>
          <span class="font-weight-bold text-subtitle-1"
            >{{ actividad.codigo }} - {{ actividad.nombreCorto }}</span
          >
        </div>
        <v-divider class="mb-2"></v-divider>

        <!-- Datos de la actividad (rápido) -->
        <div class="popup-content mb-2">
          <div class="popup-row">
            <span class="popup-label">ID:</span>
            <span class="popup-value">{{ actividad.id }}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">Estado:</span>
            <v-chip :color="getStatusColor(actividad.estado)" size="x-small" text-color="white">
              {{ actividad.estado_display || actividad.estado }}
            </v-chip>
          </div>
          <div class="popup-row">
            <span class="popup-label">Presupuesto:</span>
            <span class="popup-value text-success font-weight-medium">{{
              formatMonto(actividad.presupuesto)
            }}</span>
          </div>
          <div class="popup-row">
            <span class="popup-label">Responsable:</span>
            <span class="popup-value">{{
              actividad.responsable_info?.nombre_completo || 'No asignado'
            }}</span>
          </div>
        </div>

        <v-divider class="my-2"></v-divider>

        <!-- Tareas de la actividad (mostradas directamente, sin carga adicional) -->
        <div class="d-flex align-center mb-2">
          <v-icon icon="mdi-playlist-check" size="18" color="primary" class="mr-1"></v-icon>
          <span class="font-weight-medium text-caption">Subactividades ({{ tareas.length }})</span>
        </div>

        <div v-if="tareas.length === 0" class="text-center pa-2">
          <v-icon icon="mdi-playlist-remove" size="24" color="grey-lighten-2"></v-icon>
          <p class="text-caption text-grey mt-1">No tiene subactividades</p>
        </div>

        <div v-else class="tareas-list">
          <v-list density="compact" class="pa-0 bg-transparent">
            <v-list-item
              v-for="tarea in tareas.slice(0, 5)"
              :key="tarea.id"
              class="tarea-item pa-1"
              density="compact"
            >
              <template v-slot:prepend>
                <v-icon
                  :icon="getTareaIcon(tarea.estado)"
                  size="16"
                  :color="getStatusColorTarea(tarea.estado)"
                  class="mr-1"
                ></v-icon>
              </template>
              <v-list-item-title class="text-caption font-weight-medium">
                {{ tarea.titulo || tarea.descripcion || 'Sin título' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey">
                <div class="d-flex gap-2">
                  <span v-if="tarea.codigo">Código: {{ tarea.codigo }}</span>
                  <span v-if="tarea.presupuesto">Monto: {{ formatMonto(tarea.presupuesto) }}</span>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-if="tareas.length > 5" class="text-center mt-1">
            <v-chip size="x-small" color="grey" variant="tonal">
              +{{ tareas.length - 5 }} más
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  actividadData: {
    type: Object,
    default: null,
  },
  positionX: {
    type: Number,
    default: 0,
  },
  positionY: {
    type: Number,
    default: 0,
  },
})

// Emits
const emit = defineEmits(['close'])

// Usar los datos directamente (ya vienen del padre)
const actividad = computed(() => props.actividadData)
const tareas = computed(() => actividad.value?.tareas || [])

let timeoutId = null

const iniciarCierre = () => {
  timeoutId = setTimeout(() => {
    emit('close')
  }, 300)
}

const cancelarCierre = () => {
  if (timeoutId) clearTimeout(timeoutId)
}

// Métodos auxiliares (rápidos, sin llamadas)
const formatMonto = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(monto))
}

const getStatusColor = (estado) => {
  const colors = {
    CRD: 'grey',
    PLAN: 'light-blue',
    RETR: 'red',
    REPROG: 'warning',
    EJEC: 'orange',
    REP: 'light-green',
    FIN: 'success',
  }
  return colors[estado] || 'grey'
}

const getTipoIcon = (estado) => {
  const icons = {
    CRD: 'mdi-plus-circle',
    PLAN: 'mdi-calendar-check-outline',
    RETR: 'mdi-calendar-alert',
    REPROG: 'mdi-calendar-refresh',
    EJEC: 'mdi-calendar-arrow-right',
    REP: 'mdi-calendar-edit',
    FIN: 'mdi-calendar-done',
  }
  return icons[estado] || 'mdi-help-circle'
}

const getStatusColorTarea = (estado) => {
  const colors = {
    PEN: 'grey',
    EPROG: 'warning',
    COMPL: 'success',
  }
  return colors[estado] || 'grey'
}

const getTareaIcon = (estado) => {
  const icons = {
    PEN: 'mdi-clock-outline',
    EPROG: 'mdi-progress-clock',
    COMPL: 'mdi-check-circle',
  }
  return icons[estado] || 'mdi-help-circle'
}
</script>

<style scoped>
.popup-actividad {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  animation: fadeIn 0.1s ease-out;
}

.popup-card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.75rem;
}

.popup-label {
  font-weight: 600;
  min-width: 80px;
  color: #64748b;
}

.popup-value {
  flex: 1;
  color: #1e293b;
  word-break: break-word;
}

.tareas-list {
  max-height: 200px;
  overflow-y: auto;
}

.tarea-item {
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}

.tarea-item:hover {
  background-color: #f8fafc;
  border-left-color: #1976d2;
}

.gap-2 {
  gap: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scroll personalizado */
.popup-card::-webkit-scrollbar,
.tareas-list::-webkit-scrollbar {
  width: 4px;
}

.popup-card::-webkit-scrollbar-track,
.tareas-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.popup-card::-webkit-scrollbar-thumb,
.tareas-list::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.popup-actividad {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  animation: fadeIn 0.1s ease-out;
  max-width: 90vw; /* Responsive */
}

/* Para pantallas pequeñas */
@media (max-width: 600px) {
  .popup-actividad {
    left: 10px !important;
    right: 10px !important;
    max-width: calc(100vw - 20px);
  }

  .popup-card {
    max-width: 100%;
  }
}
</style>
