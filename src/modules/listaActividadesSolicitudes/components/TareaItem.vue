<template>
  <v-list-item class="mb-1">
    <template v-slot:prepend>
      <v-icon :color="getStatusColor(tarea.estado)" size="small">
        {{ getEstadoIcon(tarea.estado) }}
      </v-icon>
    </template>
    <v-list-item-title class="text-body-2">
      {{ tarea.titulo || tarea.descripcion || 'Tarea sin título' }}
    </v-list-item-title>
    <template v-slot:append>
      <BotoneraSolicitudes
        :actividad-id="actividadId"
        :tarea-id="tarea.id"
        tipo="tarea"
        :badges="tarea.badges || defaultBadges"
        @crear-fondos="
          $emit('accion', {
            tipo: 'crear',
            actividadId,
            tareaId: tarea.id,
            formulario: 'formulario01',
          })
        "
        @validar-fondos="
          $emit('accion', { tipo: 'validar', actividadId, tareaId: tarea.id, formulario: 'fondos' })
        "
        @crear-viaje="
          $emit('accion', {
            tipo: 'crear',
            actividadId,
            tareaId: tarea.id,
            formulario: 'formulario05',
          })
        "
        @validar-viaje="
          $emit('accion', { tipo: 'validar', actividadId, tareaId: tarea.id, formulario: 'viaje' })
        "
        @crear-pago-directo="
          $emit('accion', {
            tipo: 'crear',
            actividadId,
            tareaId: tarea.id,
            formulario: 'formulario08',
          })
        "
        @validar-pago-directo="
          $emit('accion', {
            tipo: 'validar',
            actividadId,
            tareaId: tarea.id,
            formulario: 'pagoDirecto',
          })
        "
        @crear-reposicion="
          $emit('accion', {
            tipo: 'crear',
            actividadId,
            tareaId: tarea.id,
            formulario: 'formulario03',
          })
        "
        @validar-reposicion="
          $emit('accion', {
            tipo: 'validar',
            actividadId,
            tareaId: tarea.id,
            formulario: 'reposicion',
          })
        "
      />
    </template>
  </v-list-item>
</template>

<script setup>
import BotoneraSolicitudes from './BotoneraSolicitudes.vue'
import { getEstadoColor, getEstadoIcon } from '@/modules/formularios/utils/estadoTareaUtils.js'

defineProps({
  actividadId: { type: Number, required: true },
  tarea: { type: Object, required: true },
})
defineEmits(['accion'])

const defaultBadges = {
  fondos: { creadas: 0, aprobadas: 0 },
  viajes: { creadas: 0, aprobadas: 0 },
  pagosDirectos: { creadas: 0, aprobadas: 0 },
  reposiciones: { creadas: 0, aprobadas: 0 },
}

const getStatusColor = (s) => getEstadoColor(s)
</script>
<style scoped>
.tarea-item {
  min-height: 52px;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  padding-right: 8px !important;
  border-radius: 8px;
  margin-bottom: 4px;
  background-color: white;
  border: 1px solid #eee;
  overflow: visible !important;
}

.tarea-item :deep(.v-list-item__append) {
  overflow: visible !important;
  padding-top: 4px !important;
}

/* Dar espacio al badge */
.badge-chico :deep(.v-badge__badge) {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  z-index: 10;
}

/* Margen extra en la primera línea de botonera */
.botonera-solicitudes {
  margin-top: 6px;
}
</style>
