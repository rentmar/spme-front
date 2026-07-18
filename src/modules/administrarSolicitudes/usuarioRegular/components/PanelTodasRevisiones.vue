<!-- components/usuario/PanelTodasRevisiones.vue -->
<template>
  <div class="pa-4">
    <!-- Filtros -->
    <MisSolicitudesFiltros
      :filtros="filtros"
      :campos="camposFiltro"
      :resultados="solicitudesFiltradas.length"
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
          :color="showInfoAdicional ? 'teal-darken-1' : 'grey-darken-1'"
          :variant="showInfoAdicional ? 'flat' : 'tonal'"
          size="x-small"
          rounded="lg"
          class="btn-toggle"
          @click="showInfoAdicional = !showInfoAdicional"
        >
          <v-icon size="16" class="mr-1">
            {{ showInfoAdicional ? 'mdi-information' : 'mdi-information-outline' }}
          </v-icon>
          Info Adicional
          <v-icon v-if="showInfoAdicional" size="14" class="ml-1">mdi-check</v-icon>
        </v-btn>

        <v-btn
          :color="showComentarios ? 'indigo-darken-1' : 'grey-darken-1'"
          :variant="showComentarios ? 'flat' : 'tonal'"
          size="x-small"
          rounded="lg"
          class="btn-toggle"
          @click="showComentarios = !showComentarios"
        >
          <v-icon size="16" class="mr-1">
            {{ showComentarios ? 'mdi-comment-text' : 'mdi-comment-text-outline' }}
          </v-icon>
          Comentarios
          <v-icon v-if="showComentarios" size="14" class="ml-1">mdi-check</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Tabla de revisiones -->
    <MisSolicitudesTabla
      :items="solicitudesFiltradas"
      :headers="computedHeaders"
      :items-per-page="itemsPerPage"
      :page="page"
      no-data-text="No tienes revisiones realizadas"
      empty-icon="mdi-check-all"
      empty-title="No tienes revisiones"
      empty-subtitle="Las solicitudes que hayas revisado aparecerán aquí"
      @update:items-per-page="itemsPerPage = $event"
      @update:page="page = $event"
    >
      <!-- CÓDIGO SEGUIMIENTO -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.codigoSeguimiento="{ item }">
        <code class="text-caption">{{ item.codigoSeguimiento }}</code>
      </template>

      <!-- TIPO DOCUMENTO -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.tipoDocumento="{ item }">
        <div class="d-flex align-center">
          <v-icon
            :color="getColorTipoSolicitudExtendido(tipoSolicitudNormalizado(item.tipoDocumento))"
            size="18"
            class="mr-1"
          >
            {{ getIconoTipoSolicitud(tipoSolicitudNormalizado(item.tipoDocumento)) }}
          </v-icon>
          <span class="text-body-2">{{ item.tipoDocumento }}</span>
        </div>
      </template>

      <!-- CÓDIGO DOCUMENTO -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.documentoCodigo="{ item }">
        <div>
          <div class="text-body-2 font-weight-medium">
            {{ item.solicitudCodigo || item.documentoCodigo || 'S/N' }}
          </div>
          <div class="text-caption text-grey">{{ item.subtipo || '-' }}</div>
        </div>
      </template>

      <!-- SOLICITANTE -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.solicitanteNombre="{ item }">
        <span class="text-body-2">{{ item.solicitanteNombre || 'N/A' }}</span>
      </template>

      <!-- ESTADO -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.estado="{ item }">
        <v-chip :color="getColorEstado(item.estado)" size="small" variant="tonal">
          <v-icon start size="14">{{ getIconoEstado(item.estado) }}</v-icon>
          {{ item.estado }}
        </v-chip>
      </template>

      <!-- MONTO -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.monto="{ item }">
        <span class="text-body-2 font-weight-medium">
          {{ formatearMonto(item.solicitudMonto || item.documentoMonto || 0) }}
        </span>
      </template>

      <!-- FECHA ASIGNACIÓN -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.fechaAsignacion="{ item }">
        <span class="text-body-2">{{ formatDateCorta(item.fechaAsignacion) }}</span>
      </template>

      <!-- FECHA RESOLUCIÓN -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.fechaResolucion="{ item }">
        <span class="text-body-2">{{
          item.fechaResolucion ? formatDateCorta(item.fechaResolucion) : '—'
        }}</span>
      </template>

      <!-- VERSIÓN (Info Adicional) -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showInfoAdicional" #item.version="{ item }">
        <span class="text-body-2">v{{ item.versionDocumento || '1' }}</span>
      </template>

      <!-- COMENTARIOS -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-if="showComentarios" #item.comentarios="{ item }">
        <div v-if="item.comentarios" class="text-body-2">
          <v-icon size="14" color="grey" class="mr-1">mdi-comment</v-icon>
          {{ item.comentarios }}
        </div>
        <span v-else class="text-caption text-grey">—</span>
      </template>

      <!-- ACCIONES -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.acciones="{ item }">
        <div class="d-flex gap-1 justify-center">
          <v-tooltip
            :text="item.solicitudUrlTexto || item.documentoUrlTexto || 'Ver documento'"
            location="top"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-arrow-right-circle"
                size="x-small"
                variant="text"
                color="info"
                :href="item.solicitudUrl || item.documentoUrl"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Abrir en nueva pestaña" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-open-in-new"
                size="x-small"
                variant="text"
                color="primary"
                :href="item.solicitudUrl || item.documentoUrl"
                target="_blank"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </MisSolicitudesTabla>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MisSolicitudesFiltros from './MisSolicitudesFiltros.vue'
import MisSolicitudesTabla from './MisSolicitudesTabla.vue'
import {
  getColorEstado,
  getIconoEstado,
  getIconoTipoSolicitud,
  getColorTipoSolicitudExtendido,
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
const showInfoAdicional = ref(false)
const showComentarios = ref(false)

watch(
  () => props.filtros,
  () => {
    page.value = 1
  },
  { deep: true },
)

const headersBase = [
  { title: 'Seguimiento', key: 'codigoSeguimiento', sortable: false, width: '170' },
  { title: 'Tipo', key: 'tipoDocumento', sortable: true, width: '170' },
  { title: 'Código', key: 'documentoCodigo', sortable: true, width: '170' },
  { title: 'Solicitante', key: 'solicitanteNombre', sortable: true, width: '150' },
]

const headersEstado = [
  { title: 'Estado', key: 'estado', sortable: true, width: '120', align: 'center' },
  { title: 'Monto', key: 'monto', sortable: true, width: '130', align: 'end' },
]

const headersFechas = [
  { title: 'Asignado', key: 'fechaAsignacion', sortable: true, width: '110' },
  { title: 'Resuelto', key: 'fechaResolucion', sortable: true, width: '110' },
]

const headersInfoAdicional = [
  { title: 'Versión', key: 'version', sortable: false, width: '70', align: 'center' },
]

const headersComentarios = [
  { title: 'Comentarios', key: 'comentarios', sortable: false, width: '180' },
]

const headersAcciones = [
  { title: 'Acciones', key: 'acciones', sortable: false, width: '90', align: 'center' },
]

const computedHeaders = computed(() => {
  let headers = [...headersBase]
  headers = [...headers, ...headersEstado]
  headers = [...headers, ...headersFechas]
  if (showInfoAdicional.value) headers = [...headers, ...headersInfoAdicional]
  if (showComentarios.value) headers = [...headers, ...headersComentarios]
  return [...headers, ...headersAcciones]
})

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
  {
    type: 'select',
    key: 'tipoDocumento',
    label: 'Tipo Documento',
    items: [
      { title: 'Fondos', value: 'Solicitud de Fondos' },
      { title: 'Viajes', value: 'Solicitud de Viaje' },
      { title: 'Pago Directo', value: 'Solicitud de Pago Directo' },
      { title: 'Reembolso', value: 'Solicitud de Reembolso' },
      { title: 'Rendición', value: 'Rendición de Cuentas' },
    ],
  },
  {
    type: 'text',
    key: 'busqueda',
    label: 'Buscar por código, seguimiento o solicitante...',
    icon: 'mdi-magnify',
    width: 300,
  },
]

const solicitudesFiltradas = computed(() => {
  return props.solicitudes.filter((s) => {
    if (props.filtros.estado && s.estado !== props.filtros.estado) return false
    if (props.filtros.tipoDocumento && s.tipoDocumento !== props.filtros.tipoDocumento) return false
    if (props.filtros.busqueda) {
      const search = props.filtros.busqueda.toLowerCase()
      const codigoSeguimiento = (s.codigoSeguimiento || '').toLowerCase()
      const codigoDocumento = (s.solicitudCodigo || s.documentoCodigo || '').toLowerCase()
      const solicitante = (s.solicitanteNombre || '').toLowerCase()
      if (
        !codigoSeguimiento.includes(search) &&
        !codigoDocumento.includes(search) &&
        !solicitante.includes(search)
      )
        return false
    }
    return true
  })
})

const tipoSolicitudNormalizado = (tipo) => {
  if (!tipo) return 'default'
  const mapping = {
    'Solicitud de Fondos': 'solicitud_fondos',
    'Solicitud de Viaje': 'solicitud_viaje',
    'Solicitud de Pago Directo': 'solicitud_pago_directo',
    'Solicitud de Reembolso': 'solicitud_reposicion',
    'Rendición de Cuentas': 'rendicion_cuentas',
  }
  return mapping[tipo] || 'default'
}
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
