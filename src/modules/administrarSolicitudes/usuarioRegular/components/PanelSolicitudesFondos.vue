<!-- components/usuario/PanelSolicitudesFondos.vue -->
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
      no-data-text="No tienes solicitudes de fondos"
      empty-icon="mdi-cash-multiple"
      empty-title="No tienes solicitudes de fondos"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <template #item.codigo="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.codigo }}</div>
          <div class="text-caption text-grey">{{ item.subtipo || '-' }}</div>
        </div>
      </template>

      <template #item.estado="{ item }">
        <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">{{
          item.estado
        }}</v-chip>
      </template>

      <template #item.monto="{ item }">
        <span>{{ item.monto ? `Bs. ${formatMonto(item.monto)}` : '-' }}</span>
      </template>

      <template #item.fecha_creacion="{ item }">
        <span>{{ formatDate(item.fecha_creacion) }}</span>
      </template>

      <template #item.acciones="{ item }">
        <UsuarioAccionesSolicitud
          :solicitud="item"
          @ver-detalle="$emit('ver-detalle', item)"
          @editar="$emit('editar', item)"
          @cancelar="$emit('cancelar', item)"
          @reenviar="$emit('reenviar', item)"
          @rendir-cuentas="$emit('rendir-cuentas', item)"
        />
      </template>
    </MisSolicitudesTabla>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MisSolicitudesFiltros from './MisSolicitudesFiltros.vue'
import MisSolicitudesTabla from './MisSolicitudesTabla.vue'
import UsuarioAccionesSolicitud from './UsuarioAccionesSolicitud.vue'
import { formatDate, formatMonto, getEstadoColor } from '../utils/solicitudesHelpers.js'
const props = defineProps({
  solicitudes: { type: Array, default: () => [] },
  filtros: { type: Object, required: true },
})

defineEmits([
  'update:filtros',
  'limpiar-filtros',
  'ver-detalle',
  'editar',
  'cancelar',
  'reenviar',
  'rendir-cuentas',
])

const itemsPerPage = ref(10)
const page = ref(1)

watch(
  () => props.filtros,
  () => {
    page.value = 1
  },
  { deep: true },
)

const camposFiltro = [
  {
    type: 'select',
    key: 'estado',
    label: 'Estado',
    items: [
      { title: 'Pendiente', value: 'PENDIENTE' },
      { title: 'Aprobado', value: 'APROBADO' },
      { title: 'Rechazado', value: 'RECHAZADO' },
    ],
  },
  { type: 'text', key: 'actividad', label: 'Código de actividad', width: 200 },
  { type: 'number', key: 'montoMinimo', label: 'Monto mínimo', prefix: 'Bs.' },
]

const headers = [
  { title: 'Código', key: 'codigo', sortable: true, width: '150' },
  { title: 'Subtipo', key: 'subtipo', sortable: true, width: '120' },
  { title: 'Actividad', key: 'actividad', sortable: true, width: '150' },
  { title: 'Estado', key: 'estado', sortable: true, width: '120', align: 'center' },
  { title: 'Monto', key: 'monto', sortable: true, width: '130', align: 'end' },
  { title: 'Fecha', key: 'fecha_creacion', sortable: true, width: '120' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '200', align: 'center' },
]
</script>
