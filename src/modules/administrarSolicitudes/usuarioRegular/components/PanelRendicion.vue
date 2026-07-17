<!-- components/usuario/PanelRendicion.vue -->
<template>
  <div class="pa-4">
    <MisSolicitudesFiltros
      :filtros="filtros"
      :campos="camposFiltro"
      :resultados="solicitudes.length"
      @update:filtros="$emit('update:filtros', $event)"
      @limpiar-filtros="$emit('limpiar-filtros')"
    />

    <MisSolicitudesTabla
      :items="solicitudes"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :page="page"
      no-data-text="No tienes rendiciones de cuentas"
      empty-icon="mdi-file-document-check"
      empty-title="No tienes rendiciones de cuentas"
      empty-subtitle="Las rendiciones aparecerán cuando rindas cuentas de una solicitud aprobada"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <template #item.codigo="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.codigo }}</div>
          <div class="text-caption text-grey">{{ item.solicitud_asociada || '-' }}</div>
        </div>
      </template>

      <template #item.estado="{ item }">
        <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
          {{ item.estado }}
        </v-chip>
      </template>

      <template #item.cumplimiento="{ item }">
        <v-chip :color="getCumplimientoColor(item.cumplimiento)" size="small" variant="tonal">
          {{ getCumplimientoDisplay(item.cumplimiento) }}
        </v-chip>
      </template>

      <template #item.monto="{ item }">
        <span class="text-body-2 font-weight-medium">
          {{ item.monto ? `Bs. ${formatMonto(item.monto)}` : '-' }}
        </span>
      </template>

      <template #item.fecha_creacion="{ item }">
        <span class="text-body-2">{{ formatDate(item.fecha_creacion) }}</span>
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

          <v-tooltip
            v-if="item.estado === 'PENDIENTE' || item.estado === 'OBSERVADO'"
            text="Editar rendición"
            location="top"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil"
                size="x-small"
                variant="text"
                color="warning"
                @click="$emit('editar', item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </MisSolicitudesTabla>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MisSolicitudesFiltros from './MisSolicitudesFiltros.vue'
import MisSolicitudesTabla from './MisSolicitudesTabla.vue'
import { formatDate, formatMonto, getEstadoColor } from '../utils/solicitudesHelpers'

const props = defineProps({
  solicitudes: { type: Array, default: () => [] },
  filtros: { type: Object, required: true },
})

defineEmits(['update:filtros', 'limpiar-filtros', 'ver-detalle', 'editar'])

const itemsPerPage = ref(10)
const page = ref(1)

watch(
  () => props.filtros,
  () => {
    page.value = 1
  },
  { deep: true },
)

const getCumplimientoColor = (cumplimiento) => {
  const colors = {
    completo: 'success',
    parcial: 'warning',
    pendiente: 'error',
  }
  return colors[cumplimiento] || 'grey'
}

const getCumplimientoDisplay = (cumplimiento) => {
  const displays = {
    completo: 'Completo',
    parcial: 'Parcial',
    pendiente: 'Pendiente',
  }
  return displays[cumplimiento] || cumplimiento || '-'
}

const camposFiltro = [
  {
    type: 'select',
    key: 'estado',
    label: 'Estado',
    items: [
      { title: 'Pendiente', value: 'PENDIENTE' },
      { title: 'En Revisión', value: 'EN_REVISION' },
      { title: 'Aprobado', value: 'APROBADO' },
      { title: 'Observado', value: 'OBSERVADO' },
      { title: 'Rechazado', value: 'RECHAZADO' },
    ],
  },
  { type: 'text', key: 'solicitudAsociada', label: 'Solicitud asociada', width: 220 },
  {
    type: 'select',
    key: 'cumplimiento',
    label: 'Cumplimiento',
    items: [
      { title: 'Completo', value: 'completo' },
      { title: 'Parcial', value: 'parcial' },
      { title: 'Pendiente', value: 'pendiente' },
    ],
  },
]

const headers = [
  { title: 'Código', key: 'codigo', sortable: true, width: '140' },
  { title: 'Sol. Asociada', key: 'solicitud_asociada', sortable: true, width: '160' },
  { title: 'Cumplimiento', key: 'cumplimiento', sortable: true, width: '130', align: 'center' },
  { title: 'Estado', key: 'estado', sortable: true, width: '130', align: 'center' },
  { title: 'Monto', key: 'monto', sortable: true, width: '130', align: 'end' },
  { title: 'Fecha', key: 'fecha_creacion', sortable: true, width: '120' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '120', align: 'center' },
]
</script>
