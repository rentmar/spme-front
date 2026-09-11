<template>
  <BaseComponenteRedactorAside>
    <!--Informacion del documento-->
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
    <!--Revisores-->
    <template #revisores-content>
      <div v-if="storeDocumento.validadoresAsignados">
        <LIstaRevisores :revisores="storeDocumento.validadoresAsignados"></LIstaRevisores>
      </div>
    </template>
    <!--Redactor informacion-->
    <template #redactor-content>
      <div v-if="storeDocumento.redactorDocumento">
        <RedactorInfo :redactor="storeDocumento.redactorDocumento"></RedactorInfo>
      </div>
    </template>
    <!--Acciones redactor-->
    <template #redaccion-content>
      <div
        v-if="storeDocumento.solicitudViajesActual && storeDocumento.estadoSolicitudViajesActual"
      >
        <AsignarRevisoresSolicitud
          v-if="storeDocumento.estadoDocumento === 'SIN_VALIDACIONES'"
          :id-solicitud="storeDocumento.idSolicitud"
          :contenido-documento="storeDocumento.solicitudViajesActual"
          :es-revisor="storeDocumento.esRedactor"
          @revisores-asignados="handleRevisoresAsignados"
        ></AsignarRevisoresSolicitud>
        <RedactorAccion
          v-else-if="storeDocumento.esRedactor"
          :estado-documento="storeDocumento.estadoDocumento"
          :documento-contenido="storeDocumento.solicitudViajesActual"
          :version-documento="storeDocumento.versionDocumento"
          :resumen-documento="storeDocumento.resumenSolicitud"
          :validadores-documento="storeDocumento.validadoresAsignados"
          @solicitar-revision="handleSolicitudRevision"
        ></RedactorAccion>
      </div>
    </template>
  </BaseComponenteRedactorAside>
</template>

<script setup>
import BaseComponenteRedactorAside from './BaseComponenteRedactorAside.vue'
//Componentes
import DocumentoInfo from '../../partials/DocumentoInfo.vue'
import LIstaRevisores from '../componenteEstadoVotacion/partials/LIstaRevisores.vue'
import RedactorInfo from './partials/RedactorInfo.vue'
import AsignarRevisoresSolicitud from '../AsignarRevisoresSolicitud.vue'
import RedactorAccion from './partials/RedactorAccion.vue'
//store
import { useSolicitudDeViajesStore } from '@/modules/formularios/store/useSolicitudDeViajesStore.js'
//COmposable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolViajes } from '@/modules/formularios/composables/useValidadoresSolViajes.js'

//Iniciar el store del documento
const storeDocumento = useSolicitudDeViajesStore()

//Iniciallizar composables
const { successMsg, errorMsg } = useSnackbar()
const { asignarValidadores, resetearSolicitudViajes } = useValidadoresSolViajes()

//Funcion para la asignacion de revisores
const handleRevisoresAsignados = async (payload) => {
  console.log('Revisores: ', payload)
  try {
    //Enviar al API
    // ✅ Simular envío al API
    // console.log('solicitudId: ', payload.solicitudId)
    // console.log('Revisores: ', payload.validadoresIds)
    // await simularAPI('POST /api/revisores/asignar', {
    //   solicitudId: payload.solicitudId,
    //   revisores: payload.validadoresIds,
    // })
    await asignarValidadores(payload.solicitudId, payload.validadoresIds)
    //Recargar Datos
    await storeDocumento.cargarSolicitud(storeDocumento.idSolicitud)
    payload.onSuccess()
    successMsg('✅ Revisores asignados correctamente')
  } catch (error) {
    console.error('Error al asingnar revisores al documento', error)
    payload.onError()
    errorMsg('❌ Error al asignar revisores')
  }
}

//Funcion para la solicitud de nueva revision
const handleSolicitudRevision = async (payload) => {
  console.log('Peticion Revision: ', payload)
  try {
    //Enviar al API
    await resetearSolicitudViajes(payload.solicitudId, payload.versionDocumento)
    await storeDocumento.cargarSolicitud(storeDocumento.idSolicitud)
    payload.onSuccess()
    successMsg('✅ Revisores asignados correctamente')
  } catch (error) {
    console.error('Error al enviar peticion de revision', error)
    payload.onError()
    errorMsg('❌ Error al asignar revisores')
  }
}
</script>

<style scoped></style>
