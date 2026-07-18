<template>
  <div>
    <!-- Estado: Sin revisores asignados -->
    <div class="accion-card">
      <div class="d-flex align-center mb-3">
        <v-icon size="20" color="warning" class="mr-2">mdi-account-group-outline</v-icon>
        <div>
          <div class="text-body-2 font-weight-medium">Sin Revisores</div>
          <div class="text-caption text-grey-darken-1">
            Este documento no tiene revisores asignados. Asignelos para continuar con el proceso de
            validación.
          </div>
        </div>
      </div>

      <!-- Información del documento -->
      <div class="info-documento mb-3">
        <div class="d-flex align-center mb-2">
          <v-icon size="16" color="primary" class="mr-2">mdi-file-document</v-icon>
          <span class="text-caption font-weight-medium">Información del Documento</span>
        </div>
        <div class="d-flex gap-3 flex-wrap">
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">Número Formulario:</span>
            <span class="text-caption font-weight-medium">
              {{ props.contenidoDocumento?.numeroFormulario || 'N/A' }}
            </span>
          </div>
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">ID Solicitud:</span>
            <span class="text-caption font-weight-medium">
              {{ props.idSolicitud || 'N/A' }}
            </span>
          </div>
          <div v-if="contenidoDocumento?.montoSolicitado" class="info-item">
            <span class="text-caption text-grey-darken-1">Monto:</span>
            <span class="text-caption font-weight-medium">
              ${{ props.contenidoDocumento.montoSolicitado }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botón para abrir diálogo de asignación -->
      <v-btn
        block
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-account-plus"
        @click="abrirDialogoAsignacion"
      >
        Asignar Revisores
      </v-btn>
    </div>

    <!-- Diálogo para asignar revisores -->
    <v-dialog v-model="dialogoAsignacion" max-width="600" persistent>
      <v-card rounded="lg">
        <v-card-item>
          <template #prepend>
            <v-icon color="primary" size="24">mdi-account-multiple-plus</v-icon>
          </template>
          <v-card-title class="text-h6">Asignar Revisores</v-card-title>
          <template #append>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="dialogoAsignacion = false"
              :disabled="loadingAsignar"
            />
          </template>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-4">
          <AsignacionRevisoresRendicionForm
            ref="formRef"
            v-model="datosFormulario"
          ></AsignacionRevisoresRendicionForm>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="tonal"
            size="small"
            @click="dialogoAsignacion = false"
            :disabled="loadingAsignar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            :loading="loadingAsignar"
            :disabled="!datosFormulario?.validacionCompleta"
            @click="confirmarAsignacion"
          >
            <v-icon start size="16">mdi-check</v-icon>
            Confirmar Asignación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AsignacionRevisoresRendicionForm from '../../partials/AsignacionRevisoresRendicionForm.vue'

const props = defineProps({
  idSolicitud: {
    type: [Number, String],
    default: null,
  },
  contenidoDocumento: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['revisores-asignados'])

const formRef = ref(false)
const dialogoAsignacion = ref(false)
const loadingAsignar = ref(false)
const datosFormulario = ref(false)

const abrirDialogoAsignacion = () => {
  dialogoAsignacion.value = true
}

const confirmarAsignacion = () => {
  loadingAsignar.value = true
  emit('revisores-asignados', {
    // Datos
    solicitudId: props.idSolicitud,
    redactorId: datosFormulario.value?.redactorId,
    validadoresIds: datosFormulario.value?.validadoresIds,

    // ⭐ Callbacks
    onSuccess: () => {
      loadingAsignar.value = false
      dialogoAsignacion.value = false
    },
    onError: () => {
      loadingAsignar.value = false
      // El diálogo se mantiene abierto para reintentar
    },
  })
}
</script>

<style scoped></style>
