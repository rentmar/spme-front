<template>
  <v-list-item class="mb-1 tarea-item">
    <template v-slot:prepend>
      <v-icon :color="getStatusColor(tarea.estado)" size="small">
        {{ getEstadoIcon(tarea.estado) }}
      </v-icon>
    </template>
    <v-list-item-title class="text-body-2">
      {{ tarea.titulo || tarea.descripcion || 'Tarea sin título' }}
    </v-list-item-title>
    <template v-slot:append>
      <BotoneraRendiciones
        :actividad-id="actividadId"
        :tarea-id="tarea.id"
        tipo="tarea"
        :badges="tarea.badges || defaultBadges"
        @crear-rendicion="
          $emit('accion', {
            tipo: 'crear',
            actividadId,
            tareaId: tarea.id,
            formulario: 'formulario02',
          })
        "
        @validar-rendicion="
          $emit('accion', {
            tipo: 'validar',
            actividadId,
            tareaId: tarea.id,
            formulario: 'rendicion',
          })
        "
      />
    </template>
  </v-list-item>
</template>

<script setup>
import BotoneraRendiciones from './BotoneraRendiciones.vue'
import { getEstadoColor, getEstadoIcon } from '@/modules/formularios/utils/estadoTareaUtils.js'

defineProps({
  actividadId: { type: Number, required: true },
  tarea: { type: Object, required: true },
})
defineEmits(['accion'])

const defaultBadges = {
  rendiciones: { creadas: 0, aprobadas: 0 },
}
const getStatusColor = (s) => getEstadoColor(s)
</script>

<style scoped>
.tarea-item {
  min-height: 52px;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  border-radius: 8px;
  margin-bottom: 4px;
  background-color: white;
  border: 1px solid #eee;
  overflow: visible !important;
}
.tarea-item:hover {
  background-color: #f5f5f5;
}
.tarea-item :deep(.v-list-item__append) {
  overflow: visible !important;
  padding-top: 4px !important;
}
</style>
