<template>
  <BaseComponenteRedactorAside>
    <!--Informacion del documento-->
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
    <!--Revisores-->
    <template #revisores-content>
      <div v-if="storeSolFondos.validadoresAsignados">
        <LIstaRevisores :revisores="storeSolFondos.validadoresAsignados"></LIstaRevisores>
      </div>
    </template>
    <!--Redactor informacion-->
    <template #redactor-content>
      <RedactorInfo :redactor="storeSolFondos.redactorDocumento"></RedactorInfo>
    </template>
    <!--Acciones redactor-->
    <template #redaccion-content>
      <div
        v-if="storeSolFondos.solicitudFondosActual && storeSolFondos.estadoSolicitudFondosActual"
      >
        <AsignarRevisoresSolicitud
          v-if="storeSolFondos.estadoDocumento === 'SIN_VALIDACIONES'"
          :id-solicitud="storeSolFondos.idSolicitud"
          :contenido-documento="storeSolFondos.solicitudFondosActual"
          :es-revisor="storeSolFondos.esRedactor"
          @revisores-asignados="handleRevisoresAsignados"
        ></AsignarRevisoresSolicitud>
        <RedactorAccion
          v-else-if="storeSolFondos.esRedactor"
          :estado-documento="storeSolFondos.estadoDocumento"
          :documento-contenido="storeSolFondos.solicitudFondosActual"
          :version-documento="storeSolFondos.versionDocumento"
          :resumen-documento="storeSolFondos.resumenSolicitud"
          :validadores-documento="storeSolFondos.validadoresAsignados"
          @solicitar-revision="handleSolicitudRevision"
        ></RedactorAccion>
      </div>
    </template>
    <template #reasignar-content> </template>
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
import { useSolicitudFondosStore } from '@/modules/formularios/store/useSolicitudDeFondosStore.js'
//composable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresSolFondos } from '@/modules/formularios/composables/useValidadoresSolFondos.js'
//Inicar composable
const { successMsg, errorMsg } = useSnackbar()
const { asignarValidadores, resetearSolicitudFondos } = useValidadoresSolFondos()
//Iniciar el store
const storeSolFondos = useSolicitudFondosStore()

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
    await storeSolFondos.cargarSolicitud(storeSolFondos.idSolicitud)
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
    await resetearSolicitudFondos(payload.solicitudId, payload.versionDocumento)
    await storeSolFondos.cargarSolicitud(storeSolFondos.idSolicitud)
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
