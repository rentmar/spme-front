<template>
  <BaseComponenteRevisoresAside>
    <!-- Informacion Documento -->
    <template #documento-content>
      <div
        v-if="
          storeDocumento.solicitudReposicionActual && storeDocumento.estadosolicitudReposicionActual
        "
        class="info-container"
      >
        <DocumentoInfo
          :tipo-documento="'solicitud_reposicion'"
          :documento="storeDocumento.solicitudReposicionActual"
          :estado-documento="storeDocumento.estadosolicitudReposicionActual"
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
          storeDocumento.solicitudReposicionActual && storeDocumento.estadosolicitudReposicionActual
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
import BaseComponenteRevisoresAside from './BaseComponenteRevisoresAside.vue'
//Componentes
import DocumentoInfo from '../../partials/DocumentoInfo.vue'
import LIstaRevisores from './partials/LIstaRevisores.vue'
import RevisorVoto from './partials/RevisorVoto.vue'
//store
import { useSolicitudDeReposicionStore } from '@/modules/formularios/store/useSolicitudDeReposicionStore.js'
//composable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolReposicion } from '@/modules/formularios/composables/useValidadoresSolReposicion.js'

//Inicializar el store
const storeDocumento = useSolicitudDeReposicionStore()
//Inicializar los composables
const { successMsg, errorMsg } = useSnackbar()
const { aprobarSolReposicion, rechazarSolReposicion } = useValidadoresSolReposicion()

// ============================================
// HANDLERS CON CALLBACKS
// ============================================
const handleAprobar = async (payload) => {
  // console.log('🟢 [PADRE] Procesando APROBACIÓN:', payload)

  try {
    // ✅ Llamar a la API con await y pasando los parámetros correctos

    await aprobarSolReposicion(storeDocumento.idSolicitud, payload.validacionId, payload.comentario)

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
    await rechazarSolReposicion(
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
