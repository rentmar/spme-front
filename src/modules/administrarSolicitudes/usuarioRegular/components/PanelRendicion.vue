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
      no-data-text="No tienes rendiciones de cuentas"
      empty-icon="mdi-file-document-check"
      empty-title="No tienes rendiciones de cuentas"
      empty-subtitle="Las rendiciones aparecerán cuando rindas cuentas de una solicitud aprobada"
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

      <!-- COMPROBANTE DIARIO (columna específica de rendición) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.cpteDiario="{ item }">
        <span class="text-body-2">{{ item.cpteDiario || '-' }}</span>
      </template>

      <!-- MONTOS DE RENDICIÓN -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.montosRendicion="{ item }">
        <div>
          <div class="text-body-2">
            <span class="text-caption text-grey">Asignado: </span>
            {{ item.montoAsignado != null ? formatearMonto(item.montoAsignado) : '-' }}
          </div>
          <div class="text-body-2">
            <span class="text-caption text-grey">Descargado: </span>
            {{ item.montoDescargado != null ? formatearMonto(item.montoDescargado) : '-' }}
          </div>
        </div>
      </template>

      <!-- SALDO (columna específica de rendición) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.saldo="{ item }">
        <span
          class="text-body-2 font-weight-medium"
          :class="item.saldo > 0 ? 'text-warning' : item.saldo < 0 ? 'text-error' : 'text-success'"
        >
          {{ item.saldo != null ? formatearMonto(item.saldo) : '-' }}
        </span>
      </template>

      <!-- FECHA RENDICIÓN -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.fechaRendicion="{ item }">
        <span class="text-body-2">{{ formatDateCorta(item.fechaRendicion) }}</span>
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

      <!-- SOLICITUD ORIGEN (columna específica de rendición) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showProyectoActividad" #item.solicitudOrigen="{ item }">
        <div v-if="item.solicitudOrigen">
          <div class="text-body-2">{{ item.solicitudOrigen.numeroForm || '-' }}</div>
          <div class="text-caption text-grey">{{ item.solicitudOrigen.tipo || '-' }}</div>
        </div>
        <span v-else class="text-caption text-grey">-</span>
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
  { title: 'N° Formulario', key: 'numeroForm', sortable: true, width: '130' },
  { title: 'Cpte. Diario', key: 'cpteDiario', sortable: true, width: '120' },
  { title: 'Montos (Asig/Desc)', key: 'montosRendicion', sortable: false, width: '160' },
  { title: 'Saldo', key: 'saldo', sortable: true, width: '120', align: 'end' },
  { title: 'Fecha Rend.', key: 'fechaRendicion', sortable: true, width: '110' },
]

const headersProyectoActividad = [
  { title: 'Proyecto', key: 'proyecto', sortable: true, width: '130' },
  { title: 'Actividad', key: 'actividad', sortable: true, width: '150' },
  { title: 'Subactividad', key: 'tarea', sortable: true, width: '140' },
  { title: 'Sol. Origen', key: 'solicitudOrigen', sortable: true, width: '150' },
]

const headersPersonas = [
  { title: 'Solicitante', key: 'solicitante', sortable: true, width: '150' },
  { title: 'Revisores', key: 'revisores', sortable: false, width: '190' },
]

const headersFinal = [
  { title: 'Estado', key: 'estadoConsolidado', sortable: true, width: '110', align: 'center' },
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
    key: 'busqueda',
    label: 'Buscar por código o comprobante...',
    icon: 'mdi-magnify',
    width: 260,
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
