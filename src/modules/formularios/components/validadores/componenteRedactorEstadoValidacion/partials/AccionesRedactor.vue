<!-- components/validation/AccionesDocumento.vue -->
<template>
  <div>
    <!-- Estado vacío: Sin acciones disponibles -->
    <div v-if="!tieneAcciones" class="empty-state">
      <v-icon size="32" color="grey-lighten-1">mdi-gesture-tap-button</v-icon>
      <p class="text-caption text-grey mt-2 mb-0">No hay acciones disponibles</p>
    </div>

    <!-- Acciones disponibles -->
    <div v-else class="acciones-container">
      <!-- Caso 1: No hay validadores asignados -->
      <div v-if="!tieneValidadores" class="accion-card">
        <div class="d-flex align-center mb-3">
          <v-icon size="20" color="warning" class="mr-2">mdi-account-group-outline</v-icon>
          <div>
            <div class="text-body-2 font-weight-medium">Sin revisores asignados</div>
            <div class="text-caption text-grey-darken-1">
              Este documento aún no tiene revisores designados
            </div>
          </div>
        </div>

        <v-btn
          block
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-account-plus"
          :loading="loadingAsignar"
          @click="
            $emit('asignar-revisores', {
              solicitudId: idSolicitud,
              versionDocumento: versionDocumento,
            })
          "
        >
          Asignar Revisores
        </v-btn>
      </div>

      <!-- Caso 2: Documento rechazado Y tiene validadores -->
      <div v-if="esRechazadoConValidadores" class="accion-card">
        <div class="d-flex align-center mb-3">
          <v-icon size="20" color="error" class="mr-2">mdi-alert-circle</v-icon>
          <div>
            <div class="text-body-2 font-weight-medium">Documento Rechazado</div>
            <div class="text-caption text-grey-darken-1">
              Este documento ha sido rechazado. Puede solicitar una nueva revisión con los
              validadores asignados.
            </div>
          </div>
        </div>

        <!-- Resumen de validadores actuales -->
        <div class="validadores-summary mb-3">
          <div class="text-caption text-grey-darken-1 mb-1">
            <v-icon size="12" class="mr-1">mdi-account-group</v-icon>
            {{ validadores.length }} revisores asignados
          </div>
          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="validador in validadores"
              :key="validador.validacion_id"
              size="x-small"
              :color="getColorEstado(validador.estado)"
              variant="tonal"
            >
              {{ validador.validador_nombre }}
            </v-chip>
          </div>
        </div>

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

      <!-- Caso 3: Documento pendiente con validadores -->
      <div v-if="estadoDocumento === 'PENDIENTE' && tieneValidadores" class="accion-card">
        <div class="d-flex align-center mb-3">
          <v-icon size="20" color="info" class="mr-2">mdi-clock-outline</v-icon>
          <div>
            <div class="text-body-2 font-weight-medium">Validación en Proceso</div>
            <div class="text-caption text-grey-darken-1">El documento está siendo revisado.</div>
          </div>
        </div>

        <div class="d-flex gap-2">
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

          <v-btn
            v-if="puedeCancelar"
            block
            color="error"
            variant="tonal"
            size="small"
            prepend-icon="mdi-cancel"
            :loading="loadingCancelar"
            @click="
              $emit('cancelar-validacion', {
                solicitudId: idSolicitud,
                versionDocumento: versionDocumento,
              })
            "
          >
            Cancelar
          </v-btn>
        </div>
      </div>

      <!-- Caso 4: Documento aprobado -->
      <div v-if="estadoDocumento === 'APROBADO'" class="accion-card">
        <div class="d-flex align-center mb-3">
          <v-icon size="20" color="success" class="mr-2">mdi-check-circle</v-icon>
          <div>
            <div class="text-body-2 font-weight-medium">Documento Aprobado</div>
            <div class="text-caption text-grey-darken-1">
              El documento ha sido aprobado exitosamente
            </div>
          </div>
        </div>

        <v-btn
          block
          color="success"
          variant="tonal"
          size="small"
          prepend-icon="mdi-file-document"
          @click="abrirDialogoRevisores"
        >
          Ver Documento Final
        </v-btn>
      </div>
    </div>

    <!-- Diálogo Unificado de Revisores -->
    <v-dialog v-model="dialogoRevisores" max-width="600" persistent>
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
          <!-- Información del documento -->
          <div v-if="esRechazadoConValidadores && contenidoDocumento" class="info-documento mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="primary" class="mr-2">mdi-file-document</v-icon>
              <span class="text-caption font-weight-medium">Información del Documento</span>
            </div>
            <div class="d-flex gap-3 flex-wrap">
              <div class="info-item">
                <span class="text-caption text-grey-darken-1">Numero Formulario:</span>
                <span class="text-caption font-weight-medium">{{
                  contenidoDocumento?.numeroFormulario || 'N/A'
                }}</span>
              </div>
              <div class="info-item">
                <span class="text-caption text-grey-darken-1">Versión:</span>
                <v-chip size="x-small" color="primary" variant="tonal">
                  v{{ versionDocumento || 'N/A' }}
                </v-chip>
              </div>
            </div>
          </div>

          <v-divider v-if="esRechazadoConValidadores" class="mb-4" />

          <!-- Resumen de validación -->
          <div class="resumen-validacion mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" color="info" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-caption font-weight-medium">Resumen de Validación</span>
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <v-chip size="x-small" color="info" variant="tonal">
                <v-icon start size="14">mdi-account-group</v-icon>
                Total: {{ resumen?.total || validadores.length }}
              </v-chip>

              <v-chip size="x-small" color="warning" variant="tonal">
                <v-icon start size="14">mdi-clock-outline</v-icon>
                Pendientes: {{ resumen?.pendientes || contarPorEstado('PENDIENTE') }}
              </v-chip>

              <v-chip size="x-small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check-circle</v-icon>
                Aprobados: {{ resumen?.aprobados || contarPorEstado('APROBADO') }}
              </v-chip>

              <v-chip size="x-small" color="error" variant="tonal">
                <v-icon start size="14">mdi-close-circle</v-icon>
                Rechazados: {{ resumen?.rechazados || contarPorEstado('RECHAZADO') }}
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
          <!-- Botón de Solicitar Revisión (solo para Caso 2: Rechazado) -->
          <v-btn
            v-if="esRechazadoConValidadores"
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
  getColorEstado,
  getIconoEstado,
  formatDate,
} from '@/modules/formularios/utils/validadoresHelpers'

const props = defineProps({
  estadoDocumento: {
    type: String,
    default: '',
  },
  validadores: {
    type: Array,
    default: () => [],
  },
  resumen: {
    type: Object,
    default: null,
  },
  idSolicitud: {
    type: [Number, String],
    default: null,
  },
  versionDocumento: {
    type: [Number, String],
    default: null,
  },
  contenidoDocumento: {
    type: Object,
    default: null,
  },
  puedeCancelar: {
    type: Boolean,
    default: false,
  },
  loadingAsignar: {
    type: Boolean,
    default: false,
  },
  loadingCancelar: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['asignar-revisores', 'solicitar-revision', 'cancelar-validacion'])

// Estado del diálogo
const dialogoRevisores = ref(false)
const loadingPeticionRevision = ref(false)

// Diálogo de Revisores
const abrirDialogoRevisores = () => {
  dialogoRevisores.value = true
}

const cerrarDialogoRevisores = () => {
  if (!loadingPeticionRevision.value) {
    dialogoRevisores.value = false
  }
}

// Confirmar solicitud de revisión
const confirmarSolicitudRevision = () => {
  //Activar la carga localmente
  loadingPeticionRevision.value = true

  // Enviar datos al padre y callbacks
  emit('solicitar-revision', {
    //Datos a enviar
    solicitudId: props.idSolicitud,
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

// Computed properties
const tieneValidadores = computed(() => {
  return props.validadores && props.validadores.length > 0
})

const esRechazadoConValidadores = computed(() => {
  return props.estadoDocumento === 'RECHAZADO' && tieneValidadores.value
})

const tieneAcciones = computed(() => {
  return (
    !tieneValidadores.value ||
    esRechazadoConValidadores.value ||
    props.estadoDocumento === 'PENDIENTE' ||
    props.estadoDocumento === 'APROBADO'
  )
})

const getEstadoColor = computed(() => {
  return getColorEstado(props.estadoDocumento)
})

const contarPorEstado = (estado) => {
  if (!props.validadores) return 0
  return props.validadores.filter((v) => v.estado === estado).length
}

const calcularPorcentajeCompletado = computed(() => {
  if (!props.validadores || props.validadores.length === 0) return 0

  const completados = props.validadores.filter(
    (v) => v.estado === 'APROBADO' || v.estado === 'RECHAZADO',
  ).length

  return Math.round((completados / props.validadores.length) * 100)
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.acciones-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
}

.validadores-summary {
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
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
