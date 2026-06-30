<template>
  <div>
    <!-- No está asignado como revisor -->
    <div v-if="!miValidacion" class="text-center py-4">
      <v-icon size="32" color="grey-lighten-1">mdi-account-off</v-icon>
      <p class="text-caption text-grey mt-2 mb-0">No está asignado como Revisor</p>
    </div>

    <!-- Ya emitió su voto -->
    <div v-else-if="yaValido" class="mi-voto-emitido">
      <div class="text-center mb-3">
        <v-icon :color="miValidacion.estado === 'APROBADO' ? 'success' : 'error'" size="40">
          {{ miValidacion.estado === 'APROBADO' ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <p class="text-caption font-weight-medium mt-1 mb-0">
          Solicitud {{ miValidacion.estado === 'APROBADO' ? 'Aprobada' : 'Rechazada' }}
        </p>
      </div>

      <div class="revisor-info">
        <div class="d-flex align-center mb-2">
          <div>
            <div class="text-caption font-weight-medium">
              {{ miValidacion.validador_nombre }}
            </div>
            <div class="text-caption text-grey">
              {{ miValidacion.codigo_seguimiento }}
            </div>
          </div>
        </div>

        <v-divider class="my-2"></v-divider>

        <div class="text-caption text-grey">
          <div class="d-flex align-center">
            <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
            <span class="font-weight-medium mr-1">Resuelto:</span>
            {{ formatDate(miValidacion.fecha_resolucion) }}
          </div>
        </div>

        <div
          v-if="miValidacion.comentarios && miValidacion.comentarios !== 'Nueva Entrada'"
          class="comentario-box mt-2"
        >
          <v-icon size="14" class="mr-1">mdi-comment</v-icon>
          <span>{{ miValidacion.comentarios }}</span>
        </div>
      </div>
    </div>

    <!-- Pendiente de validación -->
    <div v-else>
      <!-- Overlay de carga -->
      <v-overlay :model-value="loading" contained class="align-center justify-center" persistent>
        <v-progress-circular color="primary" indeterminate size="48"></v-progress-circular>
        <p class="text-white mt-3 text-caption">Procesando validación...</p>
      </v-overlay>

      <v-alert type="warning" variant="tonal" density="compact" class="mb-3">
        <div class="d-flex align-center">
          <v-icon size="16" class="mr-2">mdi-clock-outline</v-icon>
          <span class="text-caption">Tienes una validación pendiente</span>
        </div>
      </v-alert>

      <v-btn
        color="success"
        variant="tonal"
        size="small"
        block
        prepend-icon="mdi-check"
        class="mb-2"
        :loading="loading"
        :disabled="loading"
        @click="abrirDialogo('aprobar')"
      >
        Aprobar
      </v-btn>
      <v-btn
        color="error"
        variant="tonal"
        size="small"
        block
        prepend-icon="mdi-close"
        :loading="loading"
        :disabled="loading"
        @click="abrirDialogo('rechazar')"
      >
        Rechazar
      </v-btn>
    </div>

    <!-- Diálogo de Aprobación/Rechazo -->
    <v-dialog v-model="dialogoVisible" max-width="400px" persistent>
      <v-card rounded="lg">
        <v-toolbar :color="accion === 'aprobar' ? 'success' : 'error'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon start dark>
              {{ accion === 'aprobar' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{ accion === 'aprobar' ? 'Aprobar' : 'Rechazar' }} Solicitud
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <div class="revisor-info mb-3">
            <div class="d-flex align-center mb-2">
              <v-avatar size="32" :color="accion === 'aprobar' ? 'success' : 'error'" class="mr-2">
                <v-icon size="16" color="white">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption font-weight-medium">
                  {{ miValidacion?.validador_nombre }}
                </div>
                <div class="text-caption text-grey">
                  {{ miValidacion?.codigo_seguimiento }}
                </div>
              </div>
            </div>

            <v-divider class="my-2"></v-divider>

            <div class="text-caption text-grey">
              <div class="d-flex align-center mb-1">
                <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
                <span class="font-weight-medium mr-1">Asignado:</span>
                {{ formatDate(miValidacion?.fecha_asignacion) }}
              </div>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <p class="text-body-2 mb-3">
            {{
              accion === 'aprobar'
                ? '¿Está seguro de aprobar esta solicitud?'
                : '¿Está seguro de rechazar esta solicitud?'
            }}
          </p>

          <v-textarea
            v-model="comentario"
            :label="accion === 'aprobar' ? 'Comentario (opcional)' : 'Motivo del rechazo *'"
            :placeholder="
              accion === 'aprobar'
                ? 'Agregue un comentario...'
                : 'Describa el motivo del rechazo...'
            "
            variant="outlined"
            rows="3"
            auto-grow
            counter
            maxlength="500"
            :rules="reglasComentario"
            :disabled="loading"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" :disabled="loading" @click="cerrarDialogo">
            Cancelar
          </v-btn>
          <v-btn
            :color="accion === 'aprobar' ? 'success' : 'error'"
            variant="flat"
            :loading="loading"
            :disabled="!puedeEnviar || loading"
            @click="confirmarAccion"
          >
            {{ accion === 'aprobar' ? 'Aprobar' : 'Rechazar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatDate } from '@/modules/formularios/utils/validadoresHelpers'

const props = defineProps({
  miValidacion: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['aprobar', 'rechazar'])

const dialogoVisible = ref(false)
const accion = ref('aprobar')
const comentario = ref('')
const loadingAnterior = ref(false)

const yaValido = computed(() => {
  if (!props.miValidacion) return false
  return props.miValidacion.estado !== 'PENDIENTE'
})

const reglasComentario = computed(() => {
  if (accion.value === 'rechazar') {
    return [(v) => !!v || 'El motivo de rechazo es obligatorio']
  }
  return []
})

const puedeEnviar = computed(() => {
  if (accion.value === 'rechazar') {
    return comentario.value.trim().length > 0
  }
  return true
})

// Cerrar el diálogo cuando termina la carga
watch(
  () => props.loading,
  (nuevoLoading) => {
    if (loadingAnterior.value && !nuevoLoading) {
      // loading pasó de true a false = terminó el proceso
      dialogoVisible.value = false
      comentario.value = ''
    }
    loadingAnterior.value = nuevoLoading
  },
)

const abrirDialogo = (tipo) => {
  accion.value = tipo
  comentario.value = ''
  dialogoVisible.value = true
}

const cerrarDialogo = () => {
  if (props.loading) return
  dialogoVisible.value = false
  comentario.value = ''
}

const confirmarAccion = () => {
  if (!puedeEnviar.value || props.loading) return

  emit(accion.value, {
    comentario: comentario.value,
    validacionId: props.miValidacion?.validacion_id,
  })
}
</script>

<style scoped>
.mi-voto-emitido {
  padding: 8px 0;
}

.revisor-info {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.comentario-box {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid rgb(var(--v-theme-primary));
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
}
</style>
