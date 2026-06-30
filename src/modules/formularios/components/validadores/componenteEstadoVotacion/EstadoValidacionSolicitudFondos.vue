<template>
  <BaseEstadoValidacion>
    <!--Icono-->
    <template #icono>
      <v-avatar color="success" size="40">
        <v-icon color="white" size="20">mdi-cash</v-icon>
      </v-avatar>
    </template>

    <!-- Titulo -->
    <template #titulo>
      <v-tooltip :text="storeSolFondos.estadoDocumento" location="bottom">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="titulo-completo">
            {{ storeSolFondos.solicitudFondosActual?.numeroFormulario || 'Sin formulario' }}
          </span>
        </template>
      </v-tooltip>
    </template>

    <template #subtitulo>
      <div class="d-flex flex-wrap gap-2">
        <v-chip size="x-small" color="primary" variant="tonal" label> Solicitud de Fondos </v-chip>
        <v-chip size="x-small" :color="chipTipoColor" variant="flat" label>
          {{ storeSolFondos.tipoSolicitud }}
        </v-chip>
        <v-chip size="x-small" :color="chipEstadoColor" variant="flat" label>
          <v-icon start size="14">{{ chipEstadoIcono }}</v-icon>
          {{ storeSolFondos.estadoDocumento }}
        </v-chip>
      </div>
    </template>

    <template #revisores>
      <LIstaRevisores :revisores="storeSolFondos.validadoresAsignados" />
    </template>

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
} from '@/modules/formularios/utils/validadoresHelpers'

const storeSolFondos = useSolicitudFondosStore()

const {
  aprobarSolicitudFondos,
  rechazarSolicitudFondos,
  loading: loadingValidacion,
  error: errorValidacion,
} = useValidadoresSolFondos()

const { successMsg, errorMsg } = useSnackbar()

const chipTipoColor = computed(() => {
  return getColorTipoSolicitud(storeSolFondos.tipoSolicitud)
})

const chipEstadoColor = computed(() => {
  return getColorEstado(storeSolFondos.estadoDocumento)
})

const chipEstadoIcono = computed(() => {
  return getIconoEstadoConsolidado(storeSolFondos.estadoDocumento)
})

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
    successMsg('Solicitu de Fondos Aprobada')
  } catch (error) {
    console.error('Error al aprobar:', error)
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
    errorMsg('Error al rechazar')
  }
}
</script>
<style scoped>
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
</style>
