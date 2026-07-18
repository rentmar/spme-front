<!-- components/usuario/PanelRevisiones.vue -->
<template>
  <div class="pa-4">
    <v-alert v-if="revisiones.length > 0" type="warning" variant="tonal" class="mb-4" prominent>
      <template #title>Tienes {{ revisiones.length }} solicitudes pendientes de revisión</template>
      <template #text>Estas solicitudes requieren tu atención como revisor asignado.</template>
    </v-alert>

    <MisSolicitudesTabla
      :items="revisiones"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :page="page"
      no-data-text="No tienes revisiones pendientes"
      empty-icon="mdi-check-circle-outline"
      empty-title="¡Todo al día!"
      empty-subtitle="No tienes revisiones pendientes"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <template #item.tipo_solicitud="{ item }">
        <div class="d-flex align-center gap-2">
          <v-icon
            :icon="getTipoIcon(item.tipo_solicitud)"
            size="20"
            :color="getTipoColor(item.tipo_solicitud)"
          />
          <span class="text-body-2">{{ getTipoDisplay(item.tipo_solicitud) }}</span>
        </div>
      </template>

      <template #item.codigo="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.codigo }}</div>
          <div class="text-caption text-grey">{{ item.solicitante_nombre }}</div>
        </div>
      </template>

      <template #item.estado="{ item }">
        <v-chip color="warning" size="small" variant="tonal">{{ item.estado }}</v-chip>
      </template>

      <template #item.fecha_asignacion="{ item }">
        <span>{{ formatDate(item.fecha_asignacion) }}</span>
      </template>

      <template #item.acciones="{ item }">
        <div class="d-flex gap-1 justify-center">
          <v-tooltip text="Ver detalle" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-eye"
                size="x-small"
                variant="text"
                color="info"
                @click="$emit('ver-detalle', item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Aprobar" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-check-circle"
                size="x-small"
                variant="text"
                color="success"
                @click="$emit('aprobar', item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Rechazar" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-close-circle"
                size="x-small"
                variant="text"
                color="error"
                @click="$emit('rechazar', item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </MisSolicitudesTabla>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MisSolicitudesTabla from './MisSolicitudesTabla.vue'
import {
  formatDate,
  getTipoIcon,
  getTipoColor,
  getTipoDisplay,
} from '../utils/solicitudesHelpers.js'

defineProps({
  revisiones: { type: Array, default: () => [] },
})

defineEmits(['ver-detalle', 'aprobar', 'rechazar'])

const itemsPerPage = ref(10)
const page = ref(1)

const headers = [
  { title: 'Tipo', key: 'tipo_solicitud', sortable: true, width: '140' },
  { title: 'Código / Solicitante', key: 'codigo', sortable: true, width: '200' },
  { title: 'Estado', key: 'estado', sortable: true, width: '120', align: 'center' },
  { title: 'Asignado', key: 'fecha_asignacion', sortable: true, width: '130' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '160', align: 'center' },
]
</script>
