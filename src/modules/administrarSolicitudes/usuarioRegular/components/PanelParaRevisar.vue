<!-- components/usuario/PanelParaRevisar.vue -->
<template>
  <div class="pa-4">
    <!-- Banner de alerta -->
    <v-alert
      v-if="solicitudes.length > 0"
      type="warning"
      variant="tonal"
      prominent
      class="mb-4"
      density="compact"
    >
      <template #text>
        <strong>{{ solicitudes.length }}</strong> solicitudes pendientes de tu revisión
      </template>
    </v-alert>

    <!-- Filtros -->
    <MisSolicitudesFiltros
      :filtros="filtros"
      :campos="camposFiltro"
      :resultados="solicitudesFiltradas.length"
      @update:filtros="$emit('update:filtros', $event)"
      @limpiar-filtros="$emit('limpiar-filtros')"
    />

    <!-- Tabla de pendientes -->
    <MisSolicitudesTabla
      :items="solicitudesFiltradas"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :page="page"
      no-data-text="No tienes revisiones pendientes"
      empty-icon="mdi-check-circle"
      empty-title="¡Todo al día!"
      empty-subtitle="No tienes solicitudes pendientes de revisión"
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
        <v-chip color="warning" size="small" variant="tonal">
          <v-icon start size="14">mdi-clock-outline</v-icon>
          PENDIENTE
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
        <div>
          <div class="text-body-2">{{ formatDateCorta(item.fechaAsignacion) }}</div>
          <div class="text-caption" :class="getColorDias(item.fechaAsignacion)">
            {{ calcularDiasTranscurridos(item.fechaAsignacion) }}
          </div>
        </div>
      </template>

      <!-- VERSIÓN -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.version="{ item }">
        <span class="text-body-2">v{{ item.versionDocumento || '1' }}</span>
      </template>

      <!-- ACCIONES -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.acciones="{ item }">
        <div class="d-flex gap-1 justify-center">
          <v-tooltip
            :text="item.solicitudUrlTexto || item.documentoUrlTexto || 'Revisar'"
            location="top"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-arrow-right-circle"
                size="x-small"
                variant="text"
                color="warning"
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

watch(
  () => props.filtros,
  () => {
    page.value = 1
  },
  { deep: true },
)

const headers = [
  { title: 'Seguimiento', key: 'codigoSeguimiento', sortable: false, width: '180' },
  { title: 'Tipo', key: 'tipoDocumento', sortable: true, width: '180' },
  { title: 'Código', key: 'documentoCodigo', sortable: true, width: '180' },
  { title: 'Solicitante', key: 'solicitanteNombre', sortable: true, width: '150' },
  { title: 'Estado', key: 'estado', sortable: true, width: '110', align: 'center' },
  { title: 'Monto', key: 'monto', sortable: true, width: '130', align: 'end' },
  { title: 'Asignado', key: 'fechaAsignacion', sortable: true, width: '120' },
  { title: 'Versión', key: 'version', sortable: false, width: '70', align: 'center' },
  { title: 'Acciones', key: 'acciones', sortable: false, width: '90', align: 'center' },
]

const camposFiltro = [
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

const calcularDiasTranscurridos = (fecha) => {
  if (!fecha) return ''
  const ahora = new Date()
  const asignacion = new Date(fecha)
  const diff = Math.floor((ahora - asignacion) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `Hace ${diff} días`
}

const getColorDias = (fecha) => {
  if (!fecha) return 'text-grey'
  const ahora = new Date()
  const asignacion = new Date(fecha)
  const diff = Math.floor((ahora - asignacion) / (1000 * 60 * 60 * 24))
  if (diff > 7) return 'text-error'
  if (diff > 3) return 'text-warning'
  return 'text-grey'
}

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
