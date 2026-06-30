<template>
  <div class="pa-4">
    <div v-if="solicitudes.length === 0" class="text-center py-12">
      <v-icon size="80" color="grey-lighten-3">mdi-file-document-outline</v-icon>
      <p class="text-h6 text-grey mt-4">No se encontraron solicitudes</p>
      <p class="text-body-1 text-grey">No hay registros disponibles en esta categoría</p>
    </div>

    <div v-else class="text-caption text-grey mb-3">
      Mostrando {{ solicitudes.length }} solicitudes
    </div>

    <v-table hover class="solicitudes-table" density="comfortable">
      <thead>
        <tr>
          <th class="text-left" width="180">Código Seguimiento</th>
          <th class="text-left" width="220">Solicitud</th>
          <th class="text-left" width="200">Solicitante</th>
          <th class="text-left" width="180">Tipo</th>
          <th class="text-center" width="130">Monto</th>
          <th class="text-center" width="130">Estado</th>
          <th class="text-center" width="140">Fecha</th>
          <th class="text-center" width="160">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="solicitud in solicitudes"
          :key="solicitud.validacion_id"
          class="solicitud-row"
          @click="$emit('verDetalle', solicitud)"
        >
          <td>
            <v-chip size="small" color="grey-darken-2" variant="outlined">
              {{ solicitud.codigo_seguimiento }}
            </v-chip>
          </td>
          <td>
            <div class="text-body-2 font-weight-medium">{{ solicitud.solicitud_codigo }}</div>
          </td>
          <td>
            <div class="d-flex align-center gap-3">
              <v-avatar size="36" :color="getAvatarColor(solicitud.solicitante_nombre)">
                <span class="text-white">{{ getIniciales(solicitud.solicitante_nombre) }}</span>
              </v-avatar>
              <span class="text-body-2">{{ solicitud.solicitante_nombre }}</span>
            </div>
          </td>
          <td>
            <v-chip
              size="small"
              :color="getTipoColor(solicitud.tipo_solicitud)"
              class="font-weight-medium"
            >
              <v-icon start size="16">{{ getTipoIcono(solicitud.tipo_solicitud) }}</v-icon>
              {{ solicitud.tipo_display || getTipoTexto(solicitud.tipo_solicitud) }}
            </v-chip>
          </td>
          <td class="text-center">
            <span class="text-body-1 font-weight-bold"
              >Bs. {{ formatMonto(solicitud.solicitud_monto) }}</span
            >
          </td>
          <td class="text-center">
            <v-chip
              size="small"
              :color="getEstadoColor(solicitud.estado)"
              class="font-weight-medium px-3"
            >
              {{ solicitud.estado.replace('_', ' ') }}
            </v-chip>
          </td>
          <td class="text-center">
            <div class="text-body-2">{{ formatDate(solicitud.fecha_asignacion) }}</div>
          </td>
          <td class="text-center">
            <div class="d-flex justify-center gap-2">
              <v-btn
                size="small"
                variant="tonal"
                color="info"
                @click.stop="$emit('verDetalle', solicitud)"
                title="Ver detalle"
              >
                <v-icon start size="18">mdi-eye</v-icon>
                Ver
              </v-btn>
              <v-btn
                v-if="solicitud.estado === 'PENDIENTE'"
                size="small"
                variant="tonal"
                color="success"
                @click.stop="$emit('accion', { solicitud, accion: 'aprobar' })"
                title="Aprobar"
              >
                <v-icon size="18">mdi-check</v-icon>
              </v-btn>
              <v-btn
                v-if="solicitud.estado === 'PENDIENTE'"
                size="small"
                variant="tonal"
                color="error"
                @click.stop="$emit('accion', { solicitud, accion: 'rechazar' })"
                title="Rechazar"
              >
                <v-icon size="18">mdi-close</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
defineProps({
  solicitudes: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['verDetalle', 'accion'])

const getTipoColor = (tipo) => {
  const colores = {
    fondos: 'success',
    viajes: 'info',
    pago_directo: 'warning',
    reposicion: 'secondary',
    rendicion: 'error',
  }
  return colores[tipo] || 'grey'
}

const getTipoIcono = (tipo) => {
  const iconos = {
    fondos: 'mdi-cash-multiple',
    viajes: 'mdi-airplane',
    pago_directo: 'mdi-credit-card',
    reposicion: 'mdi-cash-refund',
    rendicion: 'mdi-file-document-check',
  }
  return iconos[tipo] || 'mdi-file-document'
}

const getTipoTexto = (tipo) => {
  const textos = {
    fondos: 'Solicitud de Fondos',
    viajes: 'Solicitud de Viajes',
    pago_directo: 'Pago Directo',
    reposicion: 'Reposición',
    rendicion: 'Rendición de Cuentas',
  }
  return textos[tipo] || tipo
}

const getEstadoColor = (estado) => {
  const colores = {
    PENDIENTE: 'warning',
    APROBADO: 'success',
    RECHAZADO: 'error',
    EN_REVISION: 'info',
    OBSERVADO: 'orange',
  }
  return colores[estado] || 'grey'
}

const getAvatarColor = (name) => {
  if (!name) return 'grey'
  const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

const getIniciales = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatMonto = (monto) => {
  if (!monto) return '0.00'
  return Number(monto).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<style scoped>
.solicitudes-table :deep(th) {
  background: #f8f9fa !important;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #555;
  border-bottom: 2px solid #e0e0e0 !important;
  padding: 14px 16px !important;
}

.solicitud-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.solicitud-row:hover {
  background: rgba(33, 150, 243, 0.04) !important;
}

.solicitud-row td {
  padding: 16px !important;
  border-bottom: 1px solid #f0f0f0;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
