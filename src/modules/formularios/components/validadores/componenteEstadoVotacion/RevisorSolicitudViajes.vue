<template>
  <BaseComponenteRevisoresAside>
    <!-- Informacion Documento -->
    <template #documento-content>
      <div
        v-if="storeDocumento.solicitudViajesActual && storeDocumento.estadoSolicitudViajesActual"
        class="info-container"
      >
        <DocumentoInfo
          :tipo-documento="'solicitud_viaje'"
          :documento="storeDocumento.solicitudViajesActual"
          :estado-documento="storeDocumento.estadoSolicitudViajesActual"
        ></DocumentoInfo>
      </div>
    </template>
    <!-- Revisores del documento-->
    <template #revisores-content>
      <div v-if="storeDocumento.validadoresAsignados">
        <LIstaRevisores :revisores="storeDocumento.validadoresAsignados"></LIstaRevisores>
      </div>
    </template>
    <!-- Revisor-->
    <template #validacion-content>
      <div
        v-if="storeDocumento.solicitudViajesActual && storeDocumento.estadoSolicitudViajesActual"
      >
        <RevisorVoto
          :es-revisor="storeDocumento.esValidador"
          :mi-validacion="storeDocumento.miValidacion"
          :esta-validado="storeDocumento.yaValido"
          :documento_id="storeDocumento.idSolicitud"
          @aprobar="handleAprobar"
          @rechazar="handleRechazar"
        ></RevisorVoto>
      </div>
    </template>
  </BaseComponenteRevisoresAside>
</template>

<script setup>
//Componente base
import BaseComponenteRevisoresAside from './BaseComponenteRevisoresAside.vue'
//Componentes
import DocumentoInfo from '../../partials/DocumentoInfo.vue'
import LIstaRevisores from './partials/LIstaRevisores.vue'
import RevisorVoto from './partials/RevisorVoto.vue'
//store
import { useSolicitudDeViajesStore } from '@/modules/formularios/store/useSolicitudDeViajesStore.js'
//composable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolViajes } from '@/modules/formularios/composables/useValidadoresSolViajes.js'

//Inicializar el store

const storeDocumento = useSolicitudDeViajesStore()

//Inicializar los composables
const { successMsg, errorMsg } = useSnackbar()
const { aprobarSolicitudViajes, rechazarSolicitudViajes } = useValidadoresSolViajes()

// ============================================
// HANDLERS CON CALLBACKS
// ============================================
const handleAprobar = async (payload) => {
  // console.log('🟢 [PADRE] Procesando APROBACIÓN:', payload)

  try {
    // ✅ Llamar a la API con await y pasando los parámetros correctos

    await aprobarSolicitudViajes(
      storeDocumento.idSolicitud,
      payload.validacionId,
      payload.comentario,
    )

    // ✅ Éxito → avisar al hijo que cierre el diálogo
    payload.onSuccess()

    // Recargar datos del store
    await storeDocumento.cargarSolicitud(storeDocumento.idSolicitud)

    // Mensaje
    successMsg('✅ Solicitud aprobada exitosamente')
  } catch (error) {
    // console.error('❌ [PADRE] Error al aprobar:', error)

    // ✅ Error → avisar al hijo que reseteé el loading
    payload.onError(error)

    // Mostrar mensaje de error
    errorMsg(error?.message || 'Error al aprobar la solicitud')
  }
}

const handleRechazar = async (payload) => {
  // console.log('🔴 [PADRE] Procesando RECHAZO:', payload)

  try {
    // ✅ Llamar a la API con await y pasando los parámetros correctos
    await rechazarSolicitudViajes(
      storeDocumento.idSolicitud,
      payload.validacionId,
      payload.comentario,
    )

    // ✅ Éxito → avisar al hijo que cierre el diálogo
    payload.onSuccess()

    // Recargar el store
    await storeDocumento.cargarSolicitud(storeDocumento.idSolicitud)

    // Feedback al usuario
    successMsg('❌ Solicitud rechazada')
  } catch (error) {
    // console.error('❌ [PADRE] Error al rechazar:', error)

    // ✅ Error → avisar al hijo que reseteé el loading
    payload.onError(error)

    // Mostrar mensaje de error
    errorMsg(error?.message || 'Error al rechazar la solicitud')
  }
}
</script>

<style scoped></style>
