<template>
  <div>
    <!-- Estado vacío: Sin Solicitud -->
    <div v-if="!documento" class="empty-state">
      <v-icon size="24" color="grey-lighten-1">mdi-file-document-off</v-icon>
      <p class="text-caption text-grey">No hay Informacion sobre el documento</p>
    </div>
    <!-- Información de la solicitud -->
    <div v-else class="documento-content">
      <!-- Cabecera con icono y datos principales -->
      <div class="d-flex align-start mb-3">
        <!-- Icono -->
        <v-icon size="18" color="primary" class="mr-2 mt-1">{{
          getIconoTipoSolicitud(props.tipoDocumento)
        }}</v-icon>
        <!-- Información documento -->
        <div>
          <!-- Tipo de solicitud -->
          <div class="text-caption text-grey-darken-1">
            {{ getNombreCompletoTipoSolicitud(props.tipoDocumento) }}
          </div>
          <!-- Número de formulario -->
          <div class="text-body-2 font-weight-bold">
            {{ props.documento?.numeroFormulario || 'N/A' }}
          </div>
          <!-- Monto si existe -->
          <div v-if="props.documento.montoSolicitado" class="mt-1">
            <span class="text-caption text-grey-darken-1">Monto Solicitado: </span>
            <span class="text-body-2 font-weight-bold success--text">
              {{ formatearMonto(props.documento.montoSolicitado) }}
            </span>
          </div>
        </div>
      </div>
      <!-- Chips informativos -->
      <div class="d-flex flex-wrap gap-1">
        <!-- Chip de tipo de Documento -->
        <v-chip size="x-small" :color="colorTipoDocumento" variant="tonal">
          {{ tipoDocumento }}
        </v-chip>
        <!-- Chip del subtipo de Documento -->
        <v-chip size="x-small" :color="colorSubTipoDocumento" variant="tonal">
          {{ subTipoDocumento }}
        </v-chip>
        <!-- Chip de estado del documento -->
        <v-chip size="x-small" :color="colorEstado" variant="tonal">
          <v-icon start size="14">{{ iconoEstado }}</v-icon
          >{{ estado }}</v-chip
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
//Helpers
import {
  getIconoTipoSolicitud,
  getNombreCompletoTipoSolicitud,
  getNombreCortoTipoSolicitud,
  getColorTipoSolicitudExtendido,
  getColorSubTipoSolicitud,
  getTextoEstadoConsolidado,
  getIconoEstadoConsolidado,
  getColorEstado,
  formatearMonto,
} from '@/modules/formularios/utils/validadoresHelpers'
const props = defineProps({
  tipoDocumento: {
    type: String,
    default: 'solicitud',
  },
  documento: {
    type: Object,
    default: null,
  },
  estadoDocumento: {
    type: Object,
    default: null,
  },
})

/******************************** COMPUTED *************************************/
//Tipo de documento
const colorTipoDocumento = computed(() => getColorTipoSolicitudExtendido(props.tipoDocumento))
const tipoDocumento = computed(() => getNombreCortoTipoSolicitud(props.tipoDocumento))
//Subtipo de documento
const colorSubTipoDocumento = computed(() =>
  getColorSubTipoSolicitud(props.estadoDocumento.tipo_solicitud),
)
const subTipoDocumento = computed(() => {
  return props.estadoDocumento.tipo_solicitud
})
//Estado del documento
const colorEstado = computed(() => getColorEstado(props.estadoDocumento.estado_consolidado))
const iconoEstado = computed(() =>
  getIconoEstadoConsolidado(props.estadoDocumento.estado_consolidado),
)
const estado = computed(() => getTextoEstadoConsolidado(props.estadoDocumento.estado_consolidado))
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.documento-content {
  padding: 12px;
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.gap-1 {
  gap: 4px;
}

.success--text {
  color: #4caf50 !important;
}

.mt-1 {
  margin-top: 4px;
}
</style>
