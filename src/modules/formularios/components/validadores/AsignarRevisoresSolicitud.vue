<!-- components/validation/partials/AsignarRevisoresSolicitud.vue -->
<template>
  <div>
    <!-- Estado: Sin revisores asignados -->
    <div class="accion-card">
      <div class="d-flex align-center mb-3">
        <v-icon size="20" color="warning" class="mr-2">mdi-account-group-outline</v-icon>
        <div>
          <div class="text-body-2 font-weight-medium">Sin Revisores</div>
          <div class="text-caption text-grey-darken-1">
            Este documento no tiene revisores asignados. Asigne revisores para continuar con el
            proceso de validación.
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
              {{ contenidoDocumento?.numeroFormulario || 'N/A' }}
            </span>
          </div>
          <div class="info-item">
            <span class="text-caption text-grey-darken-1">ID Solicitud:</span>
            <span class="text-caption font-weight-medium">
              {{ idSolicitud || 'N/A' }}
            </span>
          </div>
          <div v-if="contenidoDocumento?.montoSolicitado" class="info-item">
            <span class="text-caption text-grey-darken-1">Monto:</span>
            <span class="text-caption font-weight-medium">
              ${{ contenidoDocumento.montoSolicitado }}
            </span>
          </div>
        </div>
      </div>

      <!-- Aviso si no es revisor -->
      <v-alert v-if="!esRevisor" type="info" variant="tonal" density="compact" class="mb-3">
        <template #prepend>
          <v-icon size="18">mdi-information</v-icon>
        </template>
        Solo el redactor del documento puede asignar revisores.
      </v-alert>

      <!-- Botón para abrir diálogo de asignación -->
      <v-btn
        v-if="esRevisor"
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
          <AsignacionRevisoresSolicitudesForm ref="formRef" v-model="datosFormulario" />
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
import AsignacionRevisoresSolicitudesForm from '../partials/AsignacionRevisoresSolicitudesForm.vue'

const props = defineProps({
  idSolicitud: {
    type: [Number, String],
    default: null,
  },
  contenidoDocumento: {
    type: Object,
    default: null,
  },
  // Prop para habilitar el botón "Asignar Revisores"
  esRevisor: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['revisores-asignados'])

const formRef = ref(null)
const dialogoAsignacion = ref(false)
const loadingAsignar = ref(false)
const datosFormulario = ref(null)

const abrirDialogoAsignacion = () => {
  if (!props.esRevisor) return
  dialogoAsignacion.value = true
}

const confirmarAsignacion = () => {
  loadingAsignar.value = true

  emit('revisores-asignados', {
    solicitudId: props.idSolicitud,
    redactorId: datosFormulario.value?.redactorId,
    validadoresIds: datosFormulario.value?.validadoresIds,
    onSuccess: () => {
      loadingAsignar.value = false
      dialogoAsignacion.value = false
    },
    onError: () => {
      loadingAsignar.value = false
    },
  })
}
</script>

<style scoped>
.accion-card {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.accion-card:hover {
  background-color: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.info-documento {
  padding: 12px;
  background-color: rgba(var(--v-theme-primary), 0.03);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.gap-3 {
  gap: 12px;
}

.mb-3 {
  margin-bottom: 12px;
}
</style>
