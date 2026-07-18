<template>
  <div class="pa-4">
    <MisSolicitudesFiltros
      :filtros="filtros"
      :campos="camposFiltro"
      :resultados="solicitudes.length"
      @update:filtros="$emit('update:filtros', $event)"
      @limpiar-filtros="$emit('limpiar-filtros')"
    />

    <!-- Barra de herramientas con botones de columnas -->
    <div class="toolbar-columns d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center gap-2">
        <v-icon size="16" color="grey">mdi-table-column</v-icon>
        <span class="text-caption text-grey font-weight-medium">Columnas:</span>
      </div>
      <div class="d-flex gap-2">
        <v-btn
          :color="showProyectoActividad ? 'teal-darken-1' : 'grey-darken-1'"
          :variant="showProyectoActividad ? 'flat' : 'tonal'"
          size="x-small"
          rounded="lg"
          class="btn-toggle"
          @click="showProyectoActividad = !showProyectoActividad"
        >
          <v-icon size="16" class="mr-1">
            {{ showProyectoActividad ? 'mdi-folder-open' : 'mdi-folder-outline' }}
          </v-icon>
          Proyecto, Act. y Tarea
          <v-icon v-if="showProyectoActividad" size="14" class="ml-1">mdi-check</v-icon>
        </v-btn>

        <v-btn
          :color="showPersonas ? 'indigo-darken-1' : 'grey-darken-1'"
          :variant="showPersonas ? 'flat' : 'tonal'"
          size="x-small"
          rounded="lg"
          class="btn-toggle"
          @click="showPersonas = !showPersonas"
        >
          <v-icon size="16" class="mr-1">
            {{ showPersonas ? 'mdi-account-group' : 'mdi-account-group-outline' }}
          </v-icon>
          Solicitante y Revisores
          <v-icon v-if="showPersonas" size="14" class="ml-1">mdi-check</v-icon>
        </v-btn>
      </div>
    </div>

    <MisSolicitudesTabla
      :items="solicitudes"
      :headers="computedHeaders"
      :items-per-page="itemsPerPage"
      :page="page"
      no-data-text="No tienes solicitudes de viajes"
      empty-icon="mdi-airplane"
      empty-title="No tienes solicitudes de viajes"
      empty-subtitle="Crea una nueva solicitud de viaje para empezar"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.numeroForm="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.numeroForm || 'S/N' }}</div>
          <div class="text-caption text-grey">{{ item.subtipo || '-' }}</div>
        </div>
      </template>

      <!-- EVENTO (columna específica de viajes) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.evento="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.evento || '-' }}</div>
          <div class="text-caption text-grey">{{ item.lugarEvento || '-' }}</div>
        </div>
      </template>

      <!-- FECHA EVENTO (columna específica de viajes) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.fechaEvento="{ item }">
        <span class="text-body-2">{{ formatDateCorta(item.fechaEvento) }}</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showProyectoActividad" #item.proyecto="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">
            {{ item.actividad?.proyecto?.codigo || '-' }}
          </div>
          <div class="text-caption text-grey">{{ item.actividad?.proyecto?.nombre || '-' }}</div>
        </div>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showProyectoActividad" #item.actividad="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.actividad?.codigo || '-' }}</div>
          <div class="text-caption text-grey">{{ item.actividad?.nombre || '-' }}</div>
        </div>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showProyectoActividad" #item.tarea="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">{{ item.tarea?.codigo || '-' }}</div>
          <div class="text-caption text-grey">
            {{ item.tarea?.titulo || item.tarea?.descripcion || '-' }}
          </div>
        </div>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showPersonas" #item.solicitante="{ item }">
        <div>
          <div class="text-body-2">{{ item.usuarioSolicitante?.nombre || '-' }}</div>
        </div>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showPersonas" #item.revisores="{ item }">
        <div v-if="item.revisores?.length">
          <div v-for="revisor in item.revisores.slice(0, 2)" :key="revisor.id" class="text-body-2">
            <v-icon :color="getColorEstado(revisor.estado)" size="12" class="mr-1">
              {{ getIconoEstado(revisor.estado) }}
            </v-icon>
            {{ revisor.nombre }}
          </div>
          <div v-if="item.revisores.length > 2" class="text-caption text-grey">
            +{{ item.revisores.length - 2 }} más
          </div>
        </div>
        <span v-else class="text-caption text-grey">Sin revisores</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.estadoConsolidado="{ item }">
        <v-chip :color="getColorEstado(item.estadoConsolidado)" size="small" variant="tonal">
          {{ item.estadoConsolidado || '-' }}
        </v-chip>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.montoSolicitado="{ item }">
        <span class="text-body-2 font-weight-medium">
          {{ item.montoSolicitado != null ? formatearMonto(item.montoSolicitado) : '-' }}
        </span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.fechaSolicitud="{ item }">
        <span class="text-body-2">{{ formatDateCorta(item.fechaSolicitud) }}</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.acciones="{ item }">
        <UsuarioAccionesSolicitud :solicitud="item" />
      </template>
    </MisSolicitudesTabla>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MisSolicitudesFiltros from './MisSolicitudesFiltros.vue'
import MisSolicitudesTabla from './MisSolicitudesTabla.vue'
import UsuarioAccionesSolicitud from './UsuarioAccionesSolicitud.vue'
import {
  getColorEstado,
  getIconoEstado,
  formatDateCorta,
  formatearMonto,
} from '@/modules/formularios/utils/validadoresHelpers'

const props = defineProps({
  solicitudes: { type: Array, default: () => [] },
  filtros: { type: Object, default: () => ({}) },
})

defineEmits(['update:filtros', 'limpiar-filtros'])

const itemsPerPage = ref(10)
const page = ref(1)
const showProyectoActividad = ref(false)
const showPersonas = ref(false)

watch(
  () => props.filtros,
  () => {
    page.value = 1
  },
  { deep: true },
)

const headersBase = [
  { title: 'N° Formulario', key: 'numeroForm', sortable: true, width: '180' },
  { title: 'Evento', key: 'evento', sortable: true, width: '180' },
  { title: 'Fecha Evento', key: 'fechaEvento', sortable: true, width: '110' },
]

const headersProyectoActividad = [
  { title: 'Proyecto', key: 'proyecto', sortable: true, width: '140' },
  { title: 'Actividad', key: 'actividad', sortable: true, width: '160' },
  { title: 'Subactividad', key: 'tarea', sortable: true, width: '150' },
]

const headersPersonas = [
  { title: 'Solicitante', key: 'solicitante', sortable: true, width: '160' },
  { title: 'Revisores', key: 'revisores', sortable: false, width: '200' },
]

const headersFinal = [
  { title: 'Estado', key: 'estadoConsolidado', sortable: true, width: '110', align: 'center' },
  { title: 'Monto', key: 'montoSolicitado', sortable: true, width: '130', align: 'end' },
  { title: 'Fecha Sol.', key: 'fechaSolicitud', sortable: true, width: '110' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '90', align: 'center' },
]

const computedHeaders = computed(() => {
  let headers = [...headersBase]
  if (showProyectoActividad.value) headers = [...headers, ...headersProyectoActividad]
  if (showPersonas.value) headers = [...headers, ...headersPersonas]
  return [...headers, ...headersFinal]
})

const camposFiltro = [
  {
    type: 'select',
    key: 'estado',
    label: 'Estado',
    items: [
      { title: 'Pendiente', value: 'Pendiente' },
      { title: 'Aprobado', value: 'Aprobado' },
      { title: 'Rechazado', value: 'Rechazado' },
      { title: 'Sin Revisores', value: 'SinRevisores' },
    ],
  },
  {
    type: 'text',
    key: 'destino',
    label: 'Destino / Lugar del evento',
    icon: 'mdi-map-marker',
    width: 220,
  },
  {
    type: 'text',
    key: 'busqueda',
    label: 'Buscar por código o evento...',
    icon: 'mdi-magnify',
    width: 220,
  },
]
</script>

<style scoped>
.toolbar-columns {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 6px 12px;
}

.btn-toggle {
  transition: all 0.2s ease;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

.btn-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-toggle:active {
  transform: translateY(0);
}
</style>
