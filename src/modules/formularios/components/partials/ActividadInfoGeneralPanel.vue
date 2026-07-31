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

        <!-- Presupuesto -->
        <div v-if="actividad.presupuesto" class="d-flex align-center mb-2">
          <span class="text-caption text-medium-emphasis mr-2">Presupuesto asignado:</span>
          <span class="text-caption text-success font-weight-bold">
            {{ formatearMonto(actividad.presupuesto) }}
          </span>
        </div>

        <!-- Responsable -->
        <!-- <div v-if="actividad.responsable" class="d-flex align-center">
          <span class="text-caption text-medium-emphasis mr-2">Responsable:</span>
          <v-avatar color="primary" size="20" class="mr-2">
            <span class="text-white text-caption" style="font-size: 10px">
              {{ getIniciales(actividad.responsable) }}
            </span>
          </v-avatar>
          <span class="text-caption">
            {{ actividad.responsable.nombre }} {{ actividad.responsable.paterno }}
          </span>
        </div> -->
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
})

const getIniciales = (responsable) => {
  if (!responsable) return '?'
  return `${responsable.nombre?.[0] || ''}${responsable.paterno?.[0] || ''}`.toUpperCase()
}
</script>
