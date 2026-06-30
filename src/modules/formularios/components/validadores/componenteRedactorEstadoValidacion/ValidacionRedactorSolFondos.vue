<template>
  <BaseValidacionRedactor>
    <!--Icono-->
    <template #icono>
      <v-avatar color="success" size="40">
        <v-icon color="white" size="20">mdi-notebook-edit</v-icon>
      </v-avatar>
    </template>

    <!-- Titulo -->
    <template #titulo>
      <v-tooltip text="Redactor del documento" location="bottom">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="titulo-completo"> REDACTOR </span>
        </template>
      </v-tooltip>
    </template>

    <!-- Subtitulo -->
    <template #subtitulo>
      <div class="d-flex flex-wrap gap-2">Solicitud de Fondos</div>
    </template>

    <!-- Información -->
    <template #estado-documento>
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
                #{{ storeSolFondos.solicitudFondosActual?.numeroFormulario || 'N/A' }}
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

    <!--Redactor-->
    <template #info-redactor>
      <RedactorInfo :redactor="storeSolFondos.redactorDocumento"></RedactorInfo>
    </template>

    <!--Redactor-->
    <template #acciones-redactor>
      <AccionesRedactor
        v-if="storeSolFondos.esRedactor"
        :estado-documento="storeSolFondos.estadoDocumento"
        :validadores="storeSolFondos.validadoresAsignados"
        :resumen="storeSolFondos.resumenSolicitud"
        :version-documento="storeSolFondos.versionDocumento"
        :id-solicitud="storeSolFondos.idSolicitud"
        :contenido-documento="storeSolFondos.solicitudFondosActual"
        @solicitar-revision="handleSolicitarRevision"
      ></AccionesRedactor>
    </template>
  </BaseValidacionRedactor>
</template>

<script setup>
import BaseValidacionRedactor from './BaseValidacionRedactor.vue'
import { useSolicitudFondosStore } from '@/modules/formularios/store/useSolicitudDeFondosStore.js'
import {
  getColorEstado,
  getIconoEstadoConsolidado,
  getColorTipoSolicitud,
  getIconoTipoSolicitud,
} from '@/modules/formularios/utils/validadoresHelpers'
import { computed } from 'vue'
//Componentes
import LIstaRevisores from '../componenteEstadoVotacion/partials/LIstaRevisores.vue'
import RedactorInfo from './partials/RedactorInfo.vue'
import AccionesRedactor from './partials/AccionesRedactor.vue'
//Composables
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolFondos } from '@/modules/formularios/composables/useValidadoresSolFondos.js'

// Store
const storeSolFondos = useSolicitudFondosStore()

//Inicializar composables
const { successMsg, errorMsg } = useSnackbar()
const { resetearSolicitudFondos } = useValidadoresSolFondos()

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

const handleSolicitarRevision = async (payload) => {
  // payload contiene:
  // - solicitudId: ID de la solicitud
  // - versionDocumento: versión actual del documento
  // - onSuccess: callback de éxito
  // - onError: callback de error

  console.log('Solicitando revisión para:')
  console.log('ID Solicitud:', payload.solicitudId)
  console.log('Versión Documento:', payload.versionDocumento)

  try {
    const nuevaVersion = parseInt(payload.versionDocumento) + 1
    //Enviar al rest api
    await resetearSolicitudFondos(payload.solicitudId, nuevaVersion)
    //Recargar Datos
    await storeSolFondos.cargarSolicitud(payload.solicitudId)

    payload.onSuccess()
    successMsg('✅ Petición de revisión enviada correctamente')
  } catch (error) {
    console.error('❌ Error al solicitar revisión:', error)
    payload.onError()
    errorMsg('Error al enviar la petición de revisión')
  }
}
</script>

<style scoped></style>
