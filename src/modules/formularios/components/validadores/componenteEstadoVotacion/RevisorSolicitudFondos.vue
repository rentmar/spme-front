<template>
  <BaseComponenteRevisoresAside>
    <!-- Informacion Documento -->
    <template #documento-content>
      <div v-if="storeSolFondos.solicitudFondosActual" class="info-container">
        <DocumentoInfo
          :tipo-documento="'solicitud_fondos'"
          :documento="storeSolFondos.solicitudFondosActual"
          :estado-documento="storeSolFondos.estadoSolicitudFondosActual"
        >
        </DocumentoInfo>
      </div>
    </template>
    <!-- Revisores del documento-->
    <template #revisores-content>
      <div v-if="storeSolFondos.validadoresAsignados">
        <LIstaRevisores :revisores="storeSolFondos.validadoresAsignados"></LIstaRevisores>
      </div>
    </template>
    <!-- Revisor-->
    <template #validacion-content>
      <div>
        <RevisorVoto
          v-if="storeSolFondos.miValidacion"
          :mi-validacion="storeSolFondos.miValidacion"
          :esta-validado="storeSolFondos.yaValido"
          :documento_id="storeSolFondos.idSolicitud"
          @aprobar="handleAprobar"
          @rechazar="handleRechazar"
        ></RevisorVoto>
      </div>
    </template>
  </BaseComponenteRevisoresAside>
</template>

<script setup>
//Componente Base
import BaseComponenteRevisoresAside from './BaseComponenteRevisoresAside.vue'
//componentes
import DocumentoInfo from '../../partials/DocumentoInfo.vue'
import LIstaRevisores from './partials/LIstaRevisores.vue'
import RevisorVoto from './partials/RevisorVoto.vue'
//store
import { useSolicitudFondosStore } from '@/modules/formularios/store/useSolicitudDeFondosStore.js'
//composable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolFondos } from '@/modules/formularios/composables/useValidadoresSolFondos.js'

//Inicializar el store
const storeSolFondos = useSolicitudFondosStore()
//Inicializa composable
const { successMsg, errorMsg } = useSnackbar() //mensajes
const { aprobarSolicitudFondos, rechazarSolicitudFondos } = useValidadoresSolFondos()

// ============================================
// HANDLERS CON CALLBACKS
// ============================================
const handleAprobar = async (payload) => {
  // console.log('🟢 [PADRE] Procesando APROBACIÓN:', payload)

  try {
    // ✅ Llamar a la API con await y pasando los parámetros correctos

    await aprobarSolicitudFondos(
      storeSolFondos.idSolicitud,
      payload.validacionId,
      payload.comentario,
    )

    // ✅ Éxito → avisar al hijo que cierre el diálogo
    payload.onSuccess()

    // Recargar datos del store
    await storeSolFondos.cargarSolicitud(storeSolFondos.idSolicitud)

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
    await rechazarSolicitudFondos(
      storeSolFondos.idSolicitud,
      payload.validacionId,
      payload.comentario,
    )

    // ✅ Éxito → avisar al hijo que cierre el diálogo
    payload.onSuccess()

    // Recargar el store
    await storeSolFondos.cargarSolicitud(storeSolFondos.idSolicitud)

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
