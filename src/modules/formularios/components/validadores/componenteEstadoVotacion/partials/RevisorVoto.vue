<template>
  <div>
    <!-- El usuario logueado No está asignado como revisor -->
    <div v-if="!miValidacion" class="estado-container estado-no-asignado">
      <v-icon size="40" color="grey-lighten-1">mdi-account-off</v-icon>
      <p class="text-caption text-grey mt-2 mb-0">No está asignado como Revisor</p>
    </div>

    <!-- Revisor asignado -->
    <div v-else>
      <!-- Ya emitió su voto -->
      <div v-if="estaValidado" class="estado-container estado-completado">
        <ValidacionEfectuadaInfo
          v-if="props.miValidacion"
          :mi-validacion="props.miValidacion"
        ></ValidacionEfectuadaInfo>
      </div>

      <!-- Pendiente de votar -->
      <div v-else class="voto-pendiente">
        <v-card rounded="lg" class="card-revision">
          <v-card-text class="pa-3">
            <!-- Info del revisor -->
            <RevisorInfo v-if="props.miValidacion" :revisor="props.miValidacion" />

            <!-- Línea divisora -->
            <div class="linea-divisora"></div>

            <!-- Alerta de pendiente -->
            <v-alert
              type="warning"
              variant="tonal"
              density="compact"
              class="alerta-pendiente"
              border="start"
            >
              <template #prepend>
                <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
              </template>
              <span class="text-caption font-weight-medium">Tienes una validación pendiente</span>
            </v-alert>

            <!-- Línea divisora -->
            <div class="linea-divisora"></div>

            <!-- Botones de acción -->
            <div class="botones-accion">
              <v-btn
                color="success"
                variant="tonal"
                size="small"
                block
                prepend-icon="mdi-check"
                class="btn-aprobar"
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
                class="btn-rechazar"
                @click="abrirDialogo('rechazar')"
              >
                Rechazar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <!--Cuadro de Dialogo Aprobacion/Rechazo-->
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
          <RevisorInfo :revisor="props.miValidacion" />
          <v-divider class="my-2"></v-divider>
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
                ? 'Agregue un comentario'
                : 'Escriba el motivo del rechazo (10 caracteres minimo)'
            "
            variant="outlined"
            rows="3"
            auto-grow
            counter
            maxlength="500"
            :rules="reglasComentario"
          >
          </v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" :disabled="loadingDialogo" @click="cerrarDialogo">
            Cancelar
          </v-btn>
          <v-btn
            :color="accion === 'aprobar' ? 'success' : 'error'"
            variant="flat"
            :disabled="!puedeEnviarRechazo"
            :loading="loadingDialogo"
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
import { computed, ref } from 'vue'
import RevisorInfo from '../../../partials/RevisorInfo.vue'
import ValidacionEfectuadaInfo from '../../../partials/ValidacionEfectuadaInfo.vue'

const props = defineProps({
  miValidacion: {
    type: Object,
    default: null,
  },
  documento_id: {
    type: [Number, String],
    required: true,
  },
  estaValidado: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['aprobar', 'rechazar'])

//Cuador de dialogo
const dialogoVisible = ref(false) //model dialogo
const accion = ref('aprobar') //Tipo de accion del cuadro de dialogo
const comentario = ref('') //Comentario aprobacion/rechazo
const loadingDialogo = ref(false)

//Funcion abrir cuadro de dialogo
const abrirDialogo = (tipo) => {
  accion.value = tipo
  comentario.value = ''
  loadingDialogo.value = false
  dialogoVisible.value = true
}
//Funcion cerrar cuadro de dialogo
const cerrarDialogo = () => {
  dialogoVisible.value = false
  comentario.value = ''
  loadingDialogo.value = false
}

//Reglas validacion
const reglasComentario = computed(() => {
  if (accion.value === 'rechazar') {
    return [(v) => !!v || 'El motivo de rechazo es obligatorio']
  }
  return []
})

//Habilitar "RECHAZO", cuando se escribe el comentario
const puedeEnviarRechazo = computed(() => {
  if (loadingDialogo.value) return false
  if (accion.value === 'rechazar') {
    return comentario.value.trim().length > 10
  }
  return true
})

// ============================================
// CONFIRMAR ACCIÓN CON CALLBACKS (PROMISE)
// ============================================
const confirmarAccion = async () => {
  loadingDialogo.value = true
  try {
    //Esperar a que el padre llame a onSuccess() o onError()
    await new Promise((resolve, reject) => {
      emit(accion.value, {
        comentario: comentario.value,
        validacionId: props.miValidacion?.validacion_id,
        onSuccess: resolve,
        onError: reject,
      })
    })

    // Éxito → cerrar diálogo
    dialogoVisible.value = false
    comentario.value = ''
  } catch (error) {
    //Error->resetear loading, dialogo sigue abierto
    console.error('Error en la accion', error)
    loadingDialogo.value = false
  }
}

//Metodo para resetear el loading
const resetearLoadingDialogo = () => {
  loadingDialogo.value = false
}

//Exponer metodo
defineExpose({ resetearLoadingDialogo })
</script>
<style scoped>
/* ============================================
   ESTADOS GENERALES
   ============================================ */
.estado-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* Estado: No asignado */
.estado-no-asignado {
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.12);
}

/* Estado: Revisión completada */
.estado-completado {
  background-color: rgba(var(--v-theme-success), 0.06);
  border: 1px solid rgba(var(--v-theme-success), 0.15);
}

.icono-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-success), 0.1);
}

/* ============================================
   TARJETA DE REVISIÓN PENDIENTE
   ============================================ */
.voto-pendiente {
  border-radius: 12px;
}

.card-revision {
  border: 1px solid rgba(var(--v-theme-warning), 0.15);
  background-color: rgba(var(--v-theme-warning), 0.02);
  transition: box-shadow 0.3s ease;
}

.card-revision:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

/* ============================================
   LÍNEA DIVISORA
   ============================================ */
.linea-divisora {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(var(--v-theme-warning), 0.15) 20%,
    rgba(var(--v-theme-warning), 0.15) 80%,
    transparent
  );
  margin: 6px 0;
}

/* ============================================
   ALERTA DE PENDIENTE
   ============================================ */
.alerta-pendiente {
  border-radius: 8px;
  font-size: 0.75rem;
}

/* ============================================
   BOTONES DE ACCIÓN
   ============================================ */
.botones-accion {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.btn-aprobar {
  transition: all 0.2s ease;
}

.btn-aprobar:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-success), 0.3) !important;
}

.btn-rechazar {
  transition: all 0.2s ease;
}

.btn-rechazar:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.3) !important;
}

/* ============================================
   UTILIDADES
   ============================================ */
.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

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
