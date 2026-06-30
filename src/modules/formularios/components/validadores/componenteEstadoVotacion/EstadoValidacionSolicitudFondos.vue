<template>
  <BaseEstadoValidacion>
    <!--Icono-->
    <template #icono>
      <v-avatar color="success" size="40">
        <v-icon color="white" size="20">mdi-clipboard-account</v-icon>
      </v-avatar>
    </template>

    <!-- Titulo -->
    <template #titulo>
      <v-tooltip text="Revisores asignados al Documento" location="bottom">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="titulo-completo"> REVISORES </span>
        </template>
      </v-tooltip>
    </template>

    <!-- Subtitulo -->
    <template #subtitulo>
      <div class="d-flex flex-wrap gap-2">Solicitud de Fondos</div>
    </template>

    <!-- Información -->
    <template #informacion>
      <div v-if="storeSolFondos.solicitudFondosActual" class="info-container">
        <!-- Cabecera con datos principales -->
        <div class="info-header mb-3">
          <div class="d-flex align-center">
            <v-icon size="18" color="primary" class="mr-2">{{
              getIconoTipoSolicitud('solicitud_fondos')
            }}</v-icon>
            <div>
              <div class="text-caption text-grey-darken-1">Solicitud de Fondos</div>
              <div class="text-body-2 font-weight-bold">
                #{{ storeSolFondos.solicitudFondosActual.numeroFormulario || 'N/A' }}
              </div>
            </div>
          </div>

          <!-- Monto si existe -->
          <div v-if="storeSolFondos.solicitudFondosActual.monto" class="text-right">
            <div class="text-caption text-grey-darken-1">Monto Solicitado</div>
            <div class="text-body-2 font-weight-bold success--text">
              ${{ storeSolFondos.solicitudFondosActual.monto.toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Chips informativos -->
        <div class="chips-container">
          <v-chip size="x-small" :color="chipTipoColor" variant="tonal" class="info-chip">
            {{ storeSolFondos.tipoSolicitud || 'Tipo' }}
          </v-chip>

          <v-chip size="x-small" :color="chipEstadoColor" variant="tonal" class="info-chip">
            <v-icon start size="14">{{ chipEstadoIcono }}</v-icon>
            {{ storeSolFondos.estadoDocumento || 'Estado' }}
          </v-chip>

          <v-chip
            v-if="storeSolFondos.actividad"
            size="x-small"
            color="info"
            variant="tonal"
            class="info-chip"
          >
            <v-icon start size="14">mdi-calendar-clock</v-icon>
            {{ storeSolFondos.actividad }}
          </v-chip>

          <!-- Chip de prioridad (opcional) -->
          <v-chip
            v-if="storeSolFondos.solicitudFondosActual.prioridad"
            size="x-small"
            :color="getColorPrioridad(storeSolFondos.solicitudFondosActual.prioridad)"
            variant="tonal"
            class="info-chip"
          >
            <v-icon start size="14">mdi-flag</v-icon>
            {{ storeSolFondos.solicitudFondosActual.prioridad }}
          </v-chip>
        </div>
      </div>
    </template>

    <!-- Revisores -->
    <template #revisores>
      <LIstaRevisores :revisores="storeSolFondos.validadoresAsignados" />
    </template>

    <!-- Revisor Actual -->
    <template #revisor-actual>
      <!-- Mostrar error si existe -->
      <v-alert
        v-if="errorValidacion"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-3"
        closable
        @click:close="errorValidacion = null"
      >
        <template #text>
          {{ errorValidacion.message || 'Error al procesar la validación' }}
        </template>
      </v-alert>

      <MiValidacion
        :miValidacion="storeSolFondos.miValidacion"
        :loading="loadingValidacion"
        @aprobar="handleAprobacion"
        @rechazar="handleRechazo"
      />
    </template>
  </BaseEstadoValidacion>
</template>

<script setup>
import { computed } from 'vue'
import BaseEstadoValidacion from './BaseEstadoValidacion.vue'
import { useSolicitudFondosStore } from '@/modules/formularios/store/useSolicitudDeFondosStore.js'
import LIstaRevisores from './partials/LIstaRevisores.vue'
import MiValidacion from './partials/MiValidacion.vue'
import { useValidadoresSolFondos } from '@/modules/formularios/composables/useValidadoresSolFondos.js'
import { useSnackbar } from '@/composables/useSnackbar.js'
import {
  getColorEstado,
  getIconoEstadoConsolidado,
  getColorTipoSolicitud,
  getIconoTipoSolicitud,
} from '@/modules/formularios/utils/validadoresHelpers'

// Store
const storeSolFondos = useSolicitudFondosStore()

// Validadores
const {
  aprobarSolicitudFondos,
  rechazarSolicitudFondos,
  loading: loadingValidacion,
  error: errorValidacion,
} = useValidadoresSolFondos()

// Snackbar
const { successMsg, errorMsg } = useSnackbar()

// Computed properties para chips
const chipTipoColor = computed(() => {
  return getColorTipoSolicitud(storeSolFondos.tipoSolicitud)
})

const chipEstadoColor = computed(() => {
  return getColorEstado(storeSolFondos.estadoDocumento)
})

const chipEstadoIcono = computed(() => {
  return getIconoEstadoConsolidado(storeSolFondos.estadoDocumento)
})

const getColorPrioridad = (prioridad) => {
  const colores = {
    Alta: 'error',
    Media: 'warning',
    Baja: 'success',
  }
  return colores[prioridad] || 'grey'
}

// Handlers
const handleAprobacion = async (datos) => {
  try {
    console.log('Aprob Datos rx:', datos.validacionId)
    console.log('idSolicitud ', storeSolFondos.solicitudFondosActual.id)
    await aprobarSolicitudFondos(
      storeSolFondos.solicitudFondosActual.id,
      datos.validacionId,
      datos.comentario,
    )
    await storeSolFondos.cargarSolicitud(storeSolFondos.solicitudFondosActual.id)
    successMsg('Solicitud de Fondos Aprobada')
  } catch (error) {
    console.error('Error al aprobar:', error)
    errorMsg('Error al aprobar la solicitud')
  }
}

const handleRechazo = async (datos) => {
  try {
    console.log('Reject Datos rx: ', datos)
    await rechazarSolicitudFondos(
      storeSolFondos.solicitudFondosActual.id,
      datos.validacionId,
      datos.comentario,
    )
    await storeSolFondos.cargarSolicitud(storeSolFondos.solicitudFondosActual.id)
    successMsg('Solicitud de Fondos Rechazada')
  } catch (error) {
    console.error('Error al rechazar:', error)
    errorMsg('Error al rechazar la solicitud')
  }
}
</script>

<style scoped>
/* Estilos del título */
.titulo-completo {
  word-break: break-word;
  white-space: normal;
  display: block;
  line-height: 1.3;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  font-size: 1.05rem;
}

.gap-2 {
  gap: 6px;
}

/* Estilos para la información */
.info-container {
  padding: 4px 0;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 12px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.info-chip {
  font-size: 0.7rem !important;
  height: 24px !important;
  letter-spacing: 0.02em;
  font-weight: 500;
}

.info-adicional {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  padding: 8px 12px;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-detail-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.success--text {
  color: rgb(var(--v-theme-success)) !important;
}

/* Responsive */
@media (max-width: 600px) {
  .info-header {
    flex-direction: column;
    gap: 8px;
  }

  .info-header .text-right {
    text-align: left !important;
  }
}
</style>
