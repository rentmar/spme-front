<!-- components/ActividadInfoGeneral.vue -->
<template>
  <div>
    <!-- Estado de carga -->
    <v-card v-if="cargando" elevation="2" rounded="lg" class="mb-4">
      <v-card-text class="pa-4 text-center">
        <v-progress-circular indeterminate color="primary" size="24" />
        <p class="text-caption mt-2 mb-0">Cargando actividad...</p>
      </v-card-text>
    </v-card>

    <!-- Contenido normal -->
    <v-card v-else elevation="2" rounded="lg" class="mb-4">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white text-body-2">
          <v-icon size="18" class="mr-1">mdi-information</v-icon>
          Información General
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-3">
        <!-- Código + Estado en línea -->
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <span class="text-caption text-medium-emphasis">Código: </span>
            <span class="text-body-2 font-weight-bold text-primary">{{ actividad.codigo }}</span>
          </div>
          <v-chip
            :color="getColorEstadoActividad(actividad.estado)"
            size="x-small"
            variant="flat"
            class="text-white"
          >
            <v-icon size="14" class="mr-1">{{ getIconoEstadoActividad(actividad.estado) }}</v-icon>
            {{ getTextoEstadoActividad(actividad.estado) }}
          </v-chip>
        </div>

        <!-- Nombre -->
        <div class="text-body-2 font-weight-medium mb-2">
          {{ actividad.nombreCorto }}
        </div>

        <v-divider class="mb-2" />

        <!-- Tipo -->
        <div class="d-flex align-center mb-2">
          <span class="text-caption text-medium-emphasis mr-2">Tipo:</span>
          <v-icon :color="getColorTipoActividad(actividad.tipo?.sigla)" size="16" class="mr-1">
            {{ getIconoTipoActividad(actividad.tipo?.sigla) }}
          </v-icon>
          <span class="text-caption">{{ actividad.tipo?.tipo_actividad || 'No definido' }}</span>
        </div>

        <v-divider class="mb-2" />

        <!-- Sección Presupuesto -->
        <div class="text-caption font-weight-bold text-primary mb-2">
          <v-icon size="16" color="primary" class="mr-1">mdi-cash-multiple</v-icon>
          Información de Presupuesto
        </div>

        <!-- Presupuesto Asignado a la Actividad -->
        <div class="d-flex align-center mb-1">
          <v-icon size="14" color="primary" class="mr-1">mdi-circle-medium</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Presupuesto actividad:</span>
          <span class="text-caption font-weight-bold">
            {{ formatearMonto(actividad.presupuesto) }}
          </span>
        </div>

        <!-- Presupuesto Asignado a las Tareas -->
        <div
          v-if="presupuestoTareas !== null && presupuestoTareas !== undefined"
          class="d-flex align-center mb-1"
        >
          <v-icon size="14" color="info" class="mr-1">mdi-circle-medium</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Asignado a tareas:</span>
          <span class="text-caption font-weight-bold text-info">
            {{ formatearMonto(presupuestoTareas) }}
          </span>
        </div>

        <!-- Presupuesto Asignado a las Solicitudes -->
        <div
          v-if="presupuestoSolicitudes !== null && presupuestoSolicitudes !== undefined"
          class="d-flex align-center mb-1"
        >
          <v-icon size="14" color="warning" class="mr-1">mdi-circle-medium</v-icon>
          <span class="text-caption text-medium-emphasis mr-1">Asignado a solicitudes:</span>
          <span class="text-caption font-weight-bold text-warning">
            {{ formatearMonto(presupuestoSolicitudes) }}
          </span>
        </div>

        <!-- Presupuesto Disponible -->
        <div
          v-if="presupuestoDisponible !== null && presupuestoDisponible !== undefined"
          class="d-flex align-center mb-2"
        >
          <v-icon size="14" :color="presupuestoDisponible > 0 ? 'success' : 'error'" class="mr-1"
            >mdi-circle-medium</v-icon
          >
          <span class="text-caption text-medium-emphasis mr-1">Disponible:</span>
          <span
            class="text-caption font-weight-bold"
            :class="presupuestoDisponible > 0 ? 'text-success' : 'text-error'"
          >
            {{ formatearMonto(presupuestoDisponible) }}
          </span>
        </div>

        <!-- Totales por tipo de solicitud -->
        <div v-if="totalesSolicitudes && Object.keys(totalesSolicitudes).length > 0">
          <v-divider class="mb-2" />
          <div class="text-caption font-weight-bold text-secondary mb-1">
            <v-icon size="16" color="secondary" class="mr-1">mdi-chart-pie</v-icon>
            Totales por Solicitud
          </div>
          <div
            v-for="(monto, tipo) in totalesSolicitudes"
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
import {
  getColorEstadoActividad,
  getIconoEstadoActividad,
  getTextoEstadoActividad,
  getColorTipoActividad,
  getIconoTipoActividad,
  formatearMonto,
} from '../../utils/actividadHelpers'

defineProps({
  actividad: {
    type: Object,
    default: null,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  presupuestoTareas: {
    type: Number,
    default: null,
  },
  presupuestoSolicitudes: {
    type: Number,
    default: null,
  },
  presupuestoDisponible: {
    type: Number,
    default: null,
  },
  totalesSolicitudes: {
    type: Object,
    default: () => ({}),
  },
})

const getIniciales = (responsable) => {
  if (!responsable) return '?'
  return `${responsable.nombre?.[0] || ''}${responsable.paterno?.[0] || ''}`.toUpperCase()
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
