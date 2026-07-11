<template>
  <div class="acciones-container">
    <!-- estado: SIN_VALIDACIONES -->
    <div v-if="estadoActualDocumento === 'SIN_VALIDACIONES'" class="empty-state">
      <div class="d-flex align-center mb-3">
        <v-icon size="20" color="warning" class="mr-2">mdi-account-group-outline</v-icon>
        <div>
          <div class="text-body-2 font-weight-medium">Sin revisores asignados</div>
          <div class="text-caption text-grey-darken-1">
            Este documento aún no tiene revisores designados
          </div>
        </div>
      </div>
    </div>

    <!-- estado: PENDIENTE -->
    <div v-else-if="estadoActualDocumento === 'PENDIENTE'" class="accion-card">
      <div class="d-flex align-center mb-3">
        <v-icon size="20" color="info" class="mr-2">mdi-clock-outline</v-icon>
        <div>
          <div class="text-body-2 font-weight-medium">Revision en Proceso</div>
          <div class="text-caption text-grey-darken-1">El documento está siendo revisado.</div>
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        <v-btn
          block
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-eye"
          @click="abrirDialogoRevisores"
        >
          Ver Detalles
        </v-btn>
      </div>
    </div>

    <!-- estado: APROBADO -->
    <div v-else-if="estadoActualDocumento === 'APROBADO'" class="accion-card">
      <div class="d-flex align-center gap-2">
        <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
        <span class="text-body-2 font-weight-medium">Documento Aprobado</span>
      </div>
      <p class="text-caption text-medium-emphasis mt-2 mb-0">
        Este documento ha sido aprobado exitosamente.
      </p>
    </div>

    <!-- estado: RECHAZADO -->
    <div v-else-if="estadoActualDocumento === 'RECHAZADO'" class="accion-card">
      <div class="d-flex align-center mb-3">
        <v-icon size="20" color="error" class="mr-2">mdi-alert-circle</v-icon>
        <div>
          <div class="text-body-2 font-weight-medium">Documento Rechazado</div>
          <div class="text-caption text-grey-darken-1">
            Este documento ha sido rechazado. Puede revisar los comentarios y solicitar una nueva
            revisión con los validadores asignados.
          </div>
        </div>
      </div>
      <!-- Resumen de validadores actuales -->
      <div class="validadores-summary mb-3">
        <v-btn
          block
          color="warning"
          variant="tonal"
          size="small"
          prepend-icon="mdi-refresh"
          @click="abrirDialogoRevisores"
        >
          Solicitar Nueva Revisión
        </v-btn>
      </div>
    </div>

    <!-- Diálogo de Revisores -->
    <v-dialog v-model="dialogoRevisores" max-width="600px">
      <v-card rounded="lg">
        <v-card-item>
          <template #prepend>
            <v-icon :color="getEstadoColor" size="24">mdi-account-group</v-icon>
          </template>
          <v-card-title class="text-h6">Revisores Designados</v-card-title>
          <template #append>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="cerrarDialogoRevisores"
              :disabled="loadingPeticionRevision"
            />
          </template>
        </v-card-item>
        <v-divider />

        <v-card-text class="pa-4">
          <!--Informacion del documento-->
          <div class="info-documento mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="primary" class="mr-2">mdi-file-document</v-icon>
              <span class="text-caption font-weight-medium">Información del Documento</span>
            </div>
            <div class="d-flex gap-3 flex-wrap">
              <div class="info-item">
                <span class="text-caption text-grey-darken-1">Numero Formulario:</span>
                <span class="text-caption font-weight-medium">{{
                  documento?.numeroFormulario || 'S/Numero'
                }}</span>
              </div>
              <div class="info-item">
                <span class="text-caption text-grey-darken-1">Versión:</span>
                <v-chip size="x-small" color="primary" variant="tonal">{{ version }} </v-chip>
              </div>
            </div>
          </div>

          <v-divider class="mb-4" />

          <!-- Resumen de la validacion -->
          <div class="resumen-validacion mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="info" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-caption font-weight-medium">Resumen de Validación</span>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <v-chip size="x-small" color="info" variant="tonal">
                <v-icon start size="14">mdi-account-group</v-icon>
                Total: {{ resumen?.total || 0 }}
              </v-chip>
              <v-chip size="x-small" color="warning" variant="tonal">
                <v-icon start size="14">mdi-clock-outline</v-icon>
                Pendientes: {{ resumen?.pendientes || 0 }}
              </v-chip>
              <v-chip size="x-small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check-circle</v-icon>
                Aprobados: {{ resumen?.aprobados || 0 }}
              </v-chip>
              <v-chip size="x-small" color="error" variant="tonal">
                <v-icon start size="14">mdi-close-circle</v-icon>
                Rechazados: {{ resumen?.rechazados || 0 }}
              </v-chip>
            </div>
            <!-- Barra de progreso -->
            <div class="mt-3">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span>Progreso</span>
                <span>{{ calcularPorcentajeCompletado }}%</span>
              </div>
              <v-progress-linear
                :model-value="calcularPorcentajeCompletado"
                :color="getEstadoColor"
                height="6"
                rounded
              />
            </div>
          </div>

          <v-divider class="mb-4" />

          <!-- Lista de revisores -->
          <div class="text-caption font-weight-medium mb-2">
            <v-icon size="14" class="mr-1">mdi-format-list-bulleted</v-icon>
            Lista de Revisores
          </div>

          <div class="revisores-dialog-list">
            <div
              v-for="(validador, index) in validadores"
              :key="validador.validacion_id"
              class="revisor-dialog-item"
              :class="{ 'mt-2': index > 0 }"
            >
              <div class="d-flex align-center">
                <!-- Avatar con estado -->
                <v-avatar size="36" :color="getColorEstado(validador.estado)" class="mr-3">
                  <v-icon size="18" color="white">
                    {{ getIconoEstado(validador.estado) }}
                  </v-icon>
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="d-flex align-center flex-wrap gap-2">
                    <span class="text-body-2 font-weight-medium">
                      {{ validador.validador_nombre }}
                    </span>
                    <v-chip
                      size="x-small"
                      :color="getColorEstado(validador.estado)"
                      variant="tonal"
                    >
                      {{ validador.estado }}
                    </v-chip>
                  </div>

                  <!-- Detalles -->
                  <div class="mt-1">
                    <div class="text-caption text-grey-darken-1">
                      <v-icon size="12" class="mr-1">mdi-identifier</v-icon>
                      {{ validador.codigo_seguimiento }}
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      <v-icon size="12" class="mr-1">mdi-calendar-plus</v-icon>
                      Asignado: {{ formatDate(validador.fecha_asignacion) }}
                    </div>
                    <div v-if="validador.fecha_resolucion" class="text-caption text-grey-darken-1">
                      <v-icon size="12" class="mr-1">mdi-calendar-check</v-icon>
                      Resuelto: {{ formatDate(validador.fecha_resolucion) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comentario si existe -->
              <div
                v-if="validador.comentarios && validador.comentarios !== 'Nueva Entrada'"
                class="mt-2 pa-2 bg-grey-lighten-4 rounded"
              >
                <div class="text-caption text-grey-darken-1 mb-1">
                  <v-icon size="12" class="mr-1">mdi-comment-text-outline</v-icon>
                  Comentario:
                </div>
                <div class="text-caption">{{ validador.comentarios }}</div>
              </div>
              <v-divider v-if="index < validadores.length - 1" class="mt-2" />
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <!-- Acciones del diálogo -->
        <v-card-actions class="pa-4">
          <v-btn
            v-if="estadoActualDocumento === 'RECHAZADO'"
            color="warning"
            variant="tonal"
            size="small"
            :loading="loadingPeticionRevision"
            @click="confirmarSolicitudRevision"
          >
            <v-icon start size="16">mdi-send</v-icon>
            Enviar Petición de Revisión
          </v-btn>

          <v-spacer />

          <v-btn
            color="grey-darken-1"
            variant="tonal"
            size="small"
            @click="cerrarDialogoRevisores"
            :disabled="loadingPeticionRevision"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  getIconoEstado,
  getColorEstado,
  formatDate,
} from '@/modules/formularios/utils/validadoresHelpers'

const props = defineProps({
  //Estado de validacion del documento
  estadoDocumento: {
    type: String,
    required: true,
    validator: (value) =>
      ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'SIN_VALIDACIONES'].includes(value),
  },
  //COntenido de la solicitud o rendicion
  documentoContenido: {
    type: Object,
    required: true,
  },
  //Version del documento
  versionDocumento: {
    type: [Number, String],
    required: true,
  },
  //Resumen del documento
  resumenDocumento: {
    type: Object,
    required: true,
  },
  //Revisores
  validadoresDocumento: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['solicitar-revision'])

//Estado
const dialogoRevisores = ref(false)
const loadingPeticionRevision = ref(false)

//Funcion para los revisores
const abrirDialogoRevisores = () => {
  dialogoRevisores.value = true
}

//Cerrar dialogo revisores
const cerrarDialogoRevisores = () => {
  dialogoRevisores.value = false
}

// Computed para acceder al estado
const estadoActualDocumento = computed(() => {
  console.log('Estado del documento:', props.estadoDocumento) // Debug
  return props.estadoDocumento
})
//Contenido del documento
const documento = computed(() => props.documentoContenido)
//Version del documento
const version = computed(() => props.versionDocumento)
//Resumen numerico del documento
const resumen = computed(() => props.resumenDocumento)
//Validadores
const validadores = computed(() => props.validadoresDocumento)
//Porcentaje
const calcularPorcentajeCompletado = computed(() => {
  const resumen = props.resumenDocumento
  if (!resumen || !resumen.total || resumen.total === 0) return 0

  const aprobados = resumen.aprobados || 0
  const rechazados = resumen.rechazados || 0 // Corregido: 'rechazados' en plural
  const completados = aprobados + rechazados

  return Math.round((completados / resumen.total) * 100) // Corregido: paréntesis correctos
})

//Confirmar Solicitud de Revision
const confirmarSolicitudRevision = () => {
  //Activar la carga localmente
  loadingPeticionRevision.value = true
  // Enviar datos al padre y callbacks
  emit('solicitar-revision', {
    //Datos a enviar
    solicitudId: documento.value.id,
    versionDocumento: props.versionDocumento,
    //Callback de exito
    onSuccess: async () => {
      loadingPeticionRevision.value = false //Desactivar carga
      dialogoRevisores.value = false //cerrar el dialogo
    },
    onError: () => {
      loadingPeticionRevision.value = false //Desactivar carga
    },
  })
}

// Color para el chip de debug
const getEstadoColor = computed(() => {
  const colores = {
    PENDIENTE: 'warning',
    APROBADO: 'success',
    RECHAZADO: 'error',
    SIN_VALIDACIONES: 'grey',
  }
  return colores[estadoActualDocumento.value] || 'grey'
})
</script>

<style scoped>
.acciones-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.debug-info {
  display: flex;
  justify-content: flex-start;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  min-height: 100px;
}

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
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Colores específicos para cada estado */
.accion-card:has(.text-warning) {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

.accion-card:has(.text-success) {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.accion-card:has(.text-error) {
  border-left: 4px solid rgb(var(--v-theme-error));
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.mt-2 {
  margin-top: 8px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-2 {
  margin-bottom: 8px;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.4;
}

.text-body-2 {
  font-size: 0.875rem;
  line-height: 1.5;
}

.font-weight-medium {
  font-weight: 500;
}

/* Estilos para el diálogo */
.info-documento {
  padding: 12px;
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.resumen-validacion {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.revisores-dialog-list {
  max-height: 400px;
  overflow-y: auto;
}

.revisor-dialog-item {
  transition: background-color 0.2s ease;
}

.revisor-dialog-item:hover {
  background-color: rgba(0, 0, 0, 0.01);
}
</style>
