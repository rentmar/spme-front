<template>
  <div class="pa-4">
    <div v-if="solicitudes.length === 0" class="text-center py-12">
      <v-icon size="80" color="grey-lighten-3">mdi-file-document-check</v-icon>
      <p class="text-h6 text-grey mt-4">No hay rendiciones de cuentas</p>
      <p class="text-body-1 text-grey">No se encontraron registros</p>
    </div>

    <div v-else class="text-caption text-grey mb-3">
      Mostrando {{ solicitudes.length }} rendiciones de cuentas
    </div>

    <v-table hover class="solicitudes-table" density="comfortable">
      <thead>
        <tr>
          <th class="text-left" width="180">Código Seguimiento</th>
          <th class="text-left" width="200">Solicitud</th>
          <th class="text-left" width="200">Sol. Asociada</th>
          <th class="text-left" width="180">Solicitante</th>
          <th class="text-center" width="130">Monto</th>
          <th class="text-center" width="120">Cumplimiento</th>
          <th class="text-center" width="120">Estado</th>
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
            <v-chip
              v-if="solicitud.solicitud_asociada"
              size="small"
              color="error"
              variant="outlined"
            >
              {{ solicitud.solicitud_asociada }}
            </v-chip>
            <span v-else class="text-caption text-grey">N/A</span>
          </td>
          <td>
            <div class="d-flex align-center gap-3">
              <v-avatar size="36" :color="getAvatarColor(solicitud.solicitante_nombre)">
                <span class="text-white">{{ getIniciales(solicitud.solicitante_nombre) }}</span>
              </v-avatar>
              <span class="text-body-2">{{ solicitud.solicitante_nombre }}</span>
            </div>
          </td>
          <td class="text-center">
            <span class="text-body-1 font-weight-bold text-error-darken-1">
              Bs. {{ formatMonto(solicitud.solicitud_monto) }}
            </span>
          </td>
          <td class="text-center">
            <v-chip
              size="small"
              :color="getCumplimientoColor(solicitud.cumplimiento)"
              class="font-weight-medium"
            >
              <v-icon start size="16">{{ getCumplimientoIcono(solicitud.cumplimiento) }}</v-icon>
              {{ getCumplimientoTexto(solicitud.cumplimiento) }}
            </v-chip>
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
              >
                <v-icon start size="18">mdi-eye</v-icon>Ver
              </v-btn>
              <v-btn
                v-if="solicitud.estado === 'PENDIENTE'"
                size="small"
                variant="tonal"
                color="success"
                @click.stop="$emit('accion', { solicitud, accion: 'aprobar' })"
              >
                <v-icon size="18">mdi-check</v-icon>
              </v-btn>
              <v-btn
                v-if="solicitud.estado === 'EN_REVISION'"
                size="small"
                variant="tonal"
                color="primary"
                @click.stop="$emit('accion', { solicitud, accion: 'revisar' })"
              >
                <v-icon size="18">mdi-file-document-edit</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
defineProps({ solicitudes: { type: Array, default: () => [] } })
defineEmits(['verDetalle', 'accion'])

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
const getCumplimientoColor = (cumplimiento) => {
  const colores = { completo: 'success', parcial: 'warning', pendiente: 'error' }
  return colores[cumplimiento] || 'grey'
}
const getCumplimientoIcono = (cumplimiento) => {
  const iconos = {
    completo: 'mdi-check-circle',
    parcial: 'mdi-alert-circle',
    pendiente: 'mdi-clock',
  }
  return iconos[cumplimiento] || 'mdi-help-circle'
}
const getCumplimientoTexto = (cumplimiento) => {
  const textos = { completo: 'Completo', parcial: 'Parcial', pendiente: 'Pendiente' }
  return textos[cumplimiento] || cumplimiento || 'N/A'
}
const getAvatarColor = (name) => {
  if (!name) return 'grey'
  const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  return colors[name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length]
}
const getIniciales = (name) =>
  name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?'
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''
const formatMonto = (monto) =>
  monto
    ? Number(monto).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
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
