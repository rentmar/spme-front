<!-- components/TareaInfoGeneral.vue -->
<template>
  <div>
    <!-- Estado de carga -->
    <v-card v-if="cargando" elevation="2" rounded="lg" class="mb-4">
      <v-card-text class="pa-4 text-center">
        <v-progress-circular indeterminate color="primary" size="24" />
        <p class="text-caption mt-2 mb-0">Cargando subactividad...</p>
      </v-card-text>
    </v-card>

    <!-- Contenido normal -->
    <v-card v-else elevation="2" rounded="lg" class="mb-4">
      <v-toolbar color="secondary" density="compact">
        <v-toolbar-title class="text-white text-body-2">
          <v-icon size="18" class="mr-1">mdi-clipboard-list</v-icon>
          Información de Subactividad
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-3">
        <!-- Código + Estado en línea -->
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <span class="text-caption text-medium-emphasis">Código: </span>
            <span class="text-body-2 font-weight-bold text-primary">{{ tarea.codigo }}</span>
          </div>
          <v-chip
            :color="getColorEstadoTarea(tarea.estado)"
            size="x-small"
            variant="flat"
            class="text-white"
          >
            <v-icon size="14" class="mr-1">{{ getIconoEstadoTarea(tarea.estado) }}</v-icon>
            {{ getTextoEstadoTarea(tarea.estado) }}
          </v-chip>
        </div>

        <!-- Título -->
        <div class="text-body-2 font-weight-medium mb-2">
          {{ tarea.titulo }}
        </div>

        <!-- Descripción -->
        <div v-if="tarea.descripcion" class="mb-2">
          <span class="text-caption text-medium-emphasis">Descripción:</span>
          <p class="text-caption mb-0 mt-1">{{ tarea.descripcion }}</p>
        </div>

        <v-divider class="mb-2" />

        <!-- Fechas -->
        <div class="d-flex align-center mb-2">
          <v-icon size="16" color="primary" class="mr-1">mdi-calendar-start</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Inicio:</span>
          <span class="text-caption">{{ tarea.fecha_creacion || 'No definida' }}</span>
        </div>

        <div v-if="tarea.fecha_limite" class="d-flex align-center mb-2">
          <v-icon size="16" color="error" class="mr-1">mdi-calendar-end</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Límite:</span>
          <span class="text-caption">{{ tarea.fecha_limite }}</span>
        </div>

        <v-divider class="mb-2" />

        <!-- Sección Presupuesto -->
        <div class="text-caption font-weight-bold text-secondary mb-2">
          <v-icon size="16" color="secondary" class="mr-1">mdi-cash-multiple</v-icon>
          Información de Presupuesto
        </div>

        <!-- Presupuesto Asignado a la Subactividad -->
        <div v-if="tarea.presupuesto" class="d-flex align-center mb-1">
          <v-icon size="14" color="secondary" class="mr-1">mdi-circle-medium</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Presupuesto asignado:</span>
          <span class="text-caption text-success font-weight-bold">
            {{ formatearMonto(tarea.presupuesto) }}
          </span>
        </div>

        <!-- Presupuesto Asignado a las Solicitudes de la Subactividad -->
        <div
          v-if="presupuestoSolicitudesTarea !== null && presupuestoSolicitudesTarea !== undefined"
          class="d-flex align-center mb-1"
        >
          <v-icon size="14" color="warning" class="mr-1">mdi-circle-medium</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Asignado a solicitudes:</span>
          <span class="text-caption font-weight-bold text-warning">
            {{ formatearMonto(presupuestoSolicitudesTarea) }}
          </span>
        </div>

        <!-- Presupuesto Disponible de la Subactividad -->
        <div
          v-if="presupuestoDisponibleTarea !== null && presupuestoDisponibleTarea !== undefined"
          class="d-flex align-center mb-2"
        >
          <v-icon
            size="14"
            :color="presupuestoDisponibleTarea > 0 ? 'success' : 'error'"
            class="mr-1"
            >mdi-circle-medium</v-icon
          >
          <span class="text-caption text-medium-emphasis mr-1">Disponible:</span>
          <span
            class="text-caption font-weight-bold"
            :class="presupuestoDisponibleTarea > 0 ? 'text-success' : 'text-error'"
          >
            {{ formatearMonto(presupuestoDisponibleTarea) }}
          </span>
        </div>

        <!-- Desglose de presupuesto -->
        <div v-if="tarea.presupuestoDesglose && tarea.presupuestoDesglose.length > 0" class="mb-2">
          <v-divider class="mb-2" />
          <span class="text-caption text-medium-emphasis"
            >Desglose de presupuesto Subactividad (Resumen):</span
          >
          <div
            v-for="(item, index) in tarea.presupuestoDesglose"
            :key="index"
            class="d-flex align-center mt-1"
          >
            <v-icon size="14" color="grey" class="mr-1">mdi-chevron-right</v-icon>
            <span class="text-caption">
              {{ item.descripcion || 'Sin descripción' }}:
              <strong>{{ formatearMonto(item.monto) }}</strong>
            </span>
          </div>
        </div>

        <!-- Sin desglose -->
        <div v-else-if="tarea.presupuesto" class="mb-2">
          <v-icon size="14" color="warning" class="mr-1">mdi-alert-circle</v-icon>
          <span class="text-caption text-medium-emphasis">Sin desglose de presupuesto</span>
        </div>

        <!-- Totales por tipo de solicitud de la Subactividad -->
        <div v-if="totalesSolicitudesTarea && Object.keys(totalesSolicitudesTarea).length > 0">
          <v-divider class="mb-2" />
          <div class="text-caption font-weight-bold text-info mb-1">
            <v-icon size="16" color="info" class="mr-1">mdi-chart-pie</v-icon>
            Totales por Solicitud (Subactividad)
          </div>
          <div
            v-for="(monto, tipo) in totalesSolicitudesTarea"
            :key="tipo"
            class="d-flex align-center mb-1"
          >
            <v-icon size="14" color="grey" class="mr-1">mdi-chevron-right</v-icon>
            <span class="text-caption text-medium-emphasis mr-1"
              >{{ formatearTipoSolicitud(tipo) }}:</span
            >
            <span class="text-caption font-weight-bold">
              {{ formatearMonto(monto) }}
            </span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { formatearMonto } from '../../utils/actividadHelpers'

defineProps({
  tarea: {
    type: Object,
    default: null,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  presupuestoSolicitudesTarea: {
    type: Number,
    default: null,
  },
  presupuestoDisponibleTarea: {
    type: Number,
    default: null,
  },
  totalesSolicitudesTarea: {
    type: Object,
    default: () => ({}),
  },
})

// Funciones helper para estados de tarea
const getColorEstadoTarea = (estado) => {
  const colores = {
    PEN: 'warning',
    EPROG: 'info',
    COMPL: 'success',
  }
  return colores[estado] || 'grey'
}

const getIconoEstadoTarea = (estado) => {
  const iconos = {
    PEN: 'mdi-clock-outline',
    EPROG: 'mdi-progress-check',
    COMPL: 'mdi-check-circle',
  }
  return iconos[estado] || 'mdi-help-circle'
}

const getTextoEstadoTarea = (estado) => {
  const textos = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return textos[estado] || estado
}

const formatearTipoSolicitud = (tipo) => {
  const nombres = {
    solicitud_fondos: 'Solicitud de Fondos',
    solicitud_reembolso: 'Solicitud de Reembolso',
    solicitud_viaje: 'Solicitud de Viaje',
    solicitud_pago_directo: 'Solicitud de Pago Directo',
  }
  return nombres[tipo] || tipo
}
</script>
