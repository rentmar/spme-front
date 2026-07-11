<template>
  <BaseComponenteRedactorAside>
    <!--Informacion del documento-->
    <template #documento-content>
      <div
        v-if="storeDocumento.rendicionCuentasActual && storeDocumento.estadoRendicionCuentasActual"
        class="info-container"
      >
        <DocumentoInfo
          :tipo-documento="'solicitud_viaje'"
          :documento="storeDocumento.rendicionCuentasActual"
          :estado-documento="storeDocumento.estadoRendicionCuentasActual"
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
        v-if="storeDocumento.rendicionCuentasActual && storeDocumento.estadoRendicionCuentasActual"
      >
        <AsignarRevisoresSolicitud
          v-if="storeDocumento.estadoDocumento === 'SIN_VALIDACIONES'"
          :id-solicitud="storeDocumento.idSolicitud"
          :contenido-documento="storeDocumento.rendicionCuentasActual"
          @revisores-asignados="handleRevisoresAsignados"
        ></AsignarRevisoresSolicitud>
        <RedactorAccion
          v-else-if="storeDocumento.esRedactor"
          :estado-documento="storeDocumento.estadoDocumento"
          :documento-contenido="storeDocumento.rendicionCuentasActual"
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
import { useRendicionCuentasStore } from '@/modules/formularios/store/useRendicionCuentasStore.js'
//COmposable
import { useSnackbar } from '@/composables/useSnackbar.js'
import { useValidadoresRendCuentas } from '@/modules/formularios/composables/useValidadoresRendicionCuentas.js'

//Iniciar el store del documento
const storeDocumento = useRendicionCuentasStore()

//Iniciallizar composables
const { successMsg, errorMsg } = useSnackbar()
const { asignarValidadores, resetearRendicionCuentas } = useValidadoresRendCuentas()

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
    await resetearRendicionCuentas(payload.solicitudId, payload.versionDocumento)
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
