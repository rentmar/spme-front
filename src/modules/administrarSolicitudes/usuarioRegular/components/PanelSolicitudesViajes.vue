<!-- components/usuario/PanelSolicitudesViajes.vue -->
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
      no-data-text="No tienes solicitudes de viajes"
      empty-icon="mdi-airplane"
      empty-title="No tienes solicitudes de viajes"
      empty-subtitle="Crea una nueva solicitud de viaje para empezar"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <template #item.codigo="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.codigo }}</div>
          <div class="text-caption text-grey">{{ item.destino || '-' }}</div>
        </div>
      </template>

      <template #item.estado="{ item }">
        <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
          {{ item.estado }}
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
        <UsuarioAccionesSolicitud
          :solicitud="item"
          @ver-detalle="$emit('ver-detalle', item)"
          @editar="$emit('editar', item)"
          @cancelar="$emit('cancelar', item)"
          @reenviar="$emit('reenviar', item)"
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
import { formatDate, formatMonto, getEstadoColor } from '../utils/solicitudesHelpers'

const props = defineProps({
  solicitudes: { type: Array, default: () => [] },
  filtros: { type: Object, required: true },
})

defineEmits(['update:filtros', 'limpiar-filtros', 'ver-detalle', 'editar', 'cancelar', 'reenviar'])

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
  { type: 'text', key: 'destino', label: 'Destino', width: 180 },
  { type: 'text', key: 'busqueda', label: 'Buscar...', icon: 'mdi-magnify', width: 220 },
]

const headers = [
  { title: 'Código', key: 'codigo', sortable: true, width: '150' },
  { title: 'Destino', key: 'destino', sortable: true, width: '180' },
  { title: 'Estado', key: 'estado', sortable: true, width: '120', align: 'center' },
  { title: 'Monto', key: 'monto', sortable: true, width: '130', align: 'end' },
  { title: 'Fecha', key: 'fecha_creacion', sortable: true, width: '120' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '160', align: 'center' },
]
</script>
