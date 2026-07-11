<template>
  <BaseComponenteRevisoresAside>
    <!-- Informacion Documento -->
    <template #documento-content>
      <div
        v-if="
          storeDocumento.solicitudPagoDirectoActual &&
          storeDocumento.estadoSolicitudPagoDirectoActual
        "
        class="info-container"
      >
        <DocumentoInfo
          :tipo-documento="'solicitud_pago_directo'"
          :documento="storeDocumento.solicitudPagoDirectoActual"
          :estado-documento="storeDocumento.estadoSolicitudPagoDirectoActual"
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
        v-if="
          storeDocumento.solicitudPagoDirectoActual &&
          storeDocumento.estadoSolicitudPagoDirectoActual
        "
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
import { useSolicitudDePagoDirectoStore } from '@/modules/formularios/store/useSolicitudDePagoDirectoStore.js'
//Composable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolPagoDirecto } from '@/modules/formularios/composables/useValidadoresSolPagoDirecto.js'

//Iniciar el store
const storeDocumento = useSolicitudDePagoDirectoStore()

//Inicializar composables
const { successMsg, errorMsg } = useSnackbar()
const { aprobarSolicitudPagoDirecto, rechazarSolicitudPagoDirecto } = useValidadoresSolPagoDirecto()

// ============================================
// HANDLERS CON CALLBACKS
// ============================================
const handleAprobar = async (payload) => {
  // console.log('🟢 [PADRE] Procesando APROBACIÓN:', payload)

  try {
    // ✅ Llamar a la API con await y pasando los parámetros correctos

    await aprobarSolicitudPagoDirecto(
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
    await rechazarSolicitudPagoDirecto(
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
