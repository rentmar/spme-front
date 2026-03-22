<template>
  <v-card elevation="2" rounded="lg" class="tarjeta-validaciones sticky-top">
    <!-- Header con título y versión -->
    <v-card-item class="pa-4">
      <template v-slot:prepend>
        <v-avatar :color="avatarColor" size="32">
          <v-icon size="18" color="white">{{ avatarIcon }}</v-icon>
        </v-avatar>
      </template>
      <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
        Validaciones del {{ tipoDocumento === 'actividad' ? 'Informe' : 'Informe de Tarea' }}
      </v-card-title>
      <template v-slot:append>
        <v-chip :color="chipColor" text-color="white" size="small">
          v{{ estadoValidacion?.version_actual || '1' }}
        </v-chip>
      </template>
    </v-card-item>

    <v-card-text class="pa-4 pt-0">
      <!-- Estado de carga -->
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
        <p class="text-caption mt-2">Cargando validaciones...</p>
      </div>

      <!-- Contenido cuando hay datos -->
      <div v-else-if="estadoValidacion">
        <!-- Resumen de validaciones -->
        <div class="resumen-validacion mb-4">
          <div class="d-flex gap-2 mb-3">
            <v-chip size="small" color="warning" variant="tonal" class="flex-grow-1">
              <span class="font-weight-bold mr-1">{{
                estadoValidacion.resumen?.pendientes || 0
              }}</span>
              Pend.
            </v-chip>
            <v-chip size="small" color="success" variant="tonal" class="flex-grow-1">
              <span class="font-weight-bold mr-1">{{
                estadoValidacion.resumen?.aprobados || 0
              }}</span>
              Aprob.
            </v-chip>
            <v-chip size="small" color="error" variant="tonal" class="flex-grow-1">
              <span class="font-weight-bold mr-1">{{
                estadoValidacion.resumen?.rechazados || 0
              }}</span>
              Rech.
            </v-chip>
          </div>

          <div class="d-flex align-center justify-space-between">
            <span class="text-caption font-weight-medium text-grey">ESTADO CONSOLIDADO</span>
            <v-chip :color="getEstadoConsolidadoColor" text-color="white" size="x-small">
              <v-icon left size="12" :icon="getEstadoConsolidadoIcon"></v-icon>
              {{ getEstadoConsolidadoText }}
            </v-chip>
          </div>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Lista de validadores -->
        <div class="text-caption font-weight-medium text-grey mb-2">VALIDADORES ASIGNADOS</div>
        <div class="validadores-lista">
          <v-list density="compact" class="pa-0 bg-transparent">
            <v-list-item
              v-for="val in estadoValidacion.validaciones"
              :key="val.id"
              class="px-0 validacion-item"
            >
              <template v-slot:prepend>
                <v-avatar size="28" :color="getEstadoColor(val.estado) + '-lighten-4'" class="mr-2">
                  <v-icon size="14" :color="getEstadoColor(val.estado)">
                    {{ getIconoEstado(val.estado) }}
                  </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="text-caption d-flex align-center flex-wrap">
                {{ truncarTexto(val.validador_nombre, 18) }}
                <v-chip
                  :color="getEstadoColor(val.estado)"
                  size="x-small"
                  variant="tonal"
                  class="ml-2"
                >
                  {{ val.estado_display }}
                </v-chip>
              </v-list-item-title>

              <v-list-item-subtitle class="text-caption text-grey">
                {{ val.codigoSeguimiento }}
              </v-list-item-subtitle>

              <!-- Fechas de asignación y resolución -->
              <div class="text-caption text-grey mt-1 d-flex flex-wrap gap-2">
                <span class="d-flex align-center">
                  <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
                  Asignado: {{ formatDateCorta(val.fechaAsignacion) }}
                </span>
                <span v-if="val.fechaResolucion" class="d-flex align-center">
                  <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
                  Resuelto: {{ formatDateCorta(val.fechaResolucion) }}
                </span>
              </div>

              <!-- Comentarios del validador (expandible) -->
              <div
                v-if="val.comentarios && val.comentarios !== 'Nueva Entrada'"
                class="text-caption mt-2"
              >
                <v-expansion-panels variant="accordion" flat>
                  <v-expansion-panel class="bg-transparent" density="compact">
                    <v-expansion-panel-title class="text-caption pa-0" style="min-height: 24px">
                      <v-icon size="x-small" class="mr-1">mdi-comment-text-outline</v-icon>
                      Ver comentario
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pa-2 bg-grey-lighten-4 rounded">
                      {{ val.comentarios }}
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Mi validación actual -->
        <div class="text-caption font-weight-medium text-grey mb-2">MI VALIDACIÓN</div>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item v-if="miValidacion" class="px-0 validacion-item">
            <template v-slot:prepend>
              <v-avatar
                size="28"
                :color="getEstadoColor(miValidacion.estado) + '-lighten-4'"
                class="mr-2"
              >
                <v-icon size="14" :color="getEstadoColor(miValidacion.estado)">
                  {{ getIconoEstado(miValidacion.estado) }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-caption d-flex align-center flex-wrap">
              {{ miValidacion.validador_nombre }}
              <v-chip
                :color="getEstadoColor(miValidacion.estado)"
                size="x-small"
                variant="tonal"
                class="ml-2"
              >
                {{ miValidacion.estado_display }}
              </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption text-grey">
              Código: {{ miValidacion.codigoSeguimiento }}
            </v-list-item-subtitle>

            <!-- Fechas para mi validación -->
            <div class="text-caption text-grey mt-1">
              <div class="d-flex flex-wrap gap-2">
                <span class="d-flex align-center">
                  <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
                  Asignado: {{ formatDateCompleta(miValidacion.fechaAsignacion) }}
                </span>
                <span v-if="miValidacion.fechaResolucion" class="d-flex align-center">
                  <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
                  Resuelto: {{ formatDateCompleta(miValidacion.fechaResolucion) }}
                </span>
              </div>
            </div>

            <!-- Comentario de mi validación -->
            <div
              v-if="miValidacion.comentarios && miValidacion.comentarios !== 'Nueva Entrada'"
              class="text-caption mt-2 pa-2 bg-grey-lighten-4 rounded"
            >
              <v-icon size="x-small" class="mr-1">mdi-comment</v-icon>
              {{ miValidacion.comentarios }}
            </div>

            <!-- Mensaje de estado final si ya fue procesado -->
            <div v-if="yaValido" class="mt-3">
              <v-alert
                :type="miValidacion.estado === 'APROBADO' ? 'success' : 'error'"
                variant="tonal"
                density="compact"
                class="mt-2"
              >
                <div class="d-flex align-center">
                  <v-icon
                    :icon="
                      miValidacion.estado === 'APROBADO' ? 'mdi-check-circle' : 'mdi-close-circle'
                    "
                    size="18"
                    class="mr-2"
                  ></v-icon>
                  <span class="text-caption">
                    <strong>
                      Tu validación ha sido {{ miValidacion.estado_display.toLowerCase() }}
                    </strong>
                    <span v-if="miValidacion.fechaResolucion">
                      el {{ formatDateCompleta(miValidacion.fechaResolucion) }}
                    </span>
                  </span>
                </div>
              </v-alert>
            </div>
          </v-list-item>
          <div v-else class="text-center py-2">
            <v-icon size="32" color="grey-lighten-2" class="mb-1">mdi-account-off</v-icon>
            <div class="text-caption text-grey">No tienes validación asignada</div>
          </div>
        </v-list>
      </div>

      <!-- Mensaje de error -->
      <v-alert v-else-if="error" type="error" variant="tonal" density="compact" class="mt-2">
        {{ error }}
      </v-alert>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botón de validación (deshabilitado si ya validó) -->
    <v-card-actions class="pa-3">
      <v-btn
        block
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-check-circle"
        @click="abrirDialogoValidacion"
        class="text-caption"
        :disabled="yaValido"
      >
        {{ yaValido ? 'Ya has validado' : 'Validar documento' }}
      </v-btn>
    </v-card-actions>

    <!-- Diálogo de selección de acción (aprobado/rechazado) -->
    <v-dialog v-model="dialogAccionVisible" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon start dark>mdi-check-circle</v-icon>
            Validar {{ tipoDocumento === 'actividad' ? 'Informe' : 'Informe de Tarea' }}
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <p class="text-body-2 mb-4">Por favor, selecciona el resultado de tu validación:</p>

          <v-radio-group v-model="accionValidacion" class="mb-4">
            <v-radio label="Aprobar documento" value="aprobar" color="success"></v-radio>
            <v-radio
              label="Rechazar documento (solicitar correcciones)"
              value="rechazar"
              color="error"
            ></v-radio>
          </v-radio-group>

          <v-textarea
            v-model="comentarioValidacion"
            :label="
              accionValidacion === 'rechazar' ? 'Motivo del rechazo *' : 'Comentarios (opcional)'
            "
            :placeholder="
              accionValidacion === 'rechazar'
                ? 'Indica las correcciones necesarias...'
                : 'Agrega algún comentario...'
            "
            :rules="accionValidacion === 'rechazar' ? [(v) => !!v || 'El motivo es requerido'] : []"
            variant="outlined"
            rows="4"
            auto-grow
            counter
            maxlength="500"
            class="mt-2"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogoAccion">Cancelar</v-btn>
          <v-btn
            :color="accionValidacion === 'aprobar' ? 'success' : 'error'"
            variant="flat"
            @click="abrirDialogoConfirmacion"
            :disabled="!puedeEnviarValidacion"
          >
            Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación final -->
    <v-dialog v-model="dialogConfirmacionVisible" max-width="400px" persistent>
      <v-card rounded="lg">
        <v-toolbar :color="accionValidacion === 'aprobar' ? 'success' : 'error'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon start dark>mdi-alert</v-icon>
            {{ accionValidacion === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Rechazo' }}
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <div class="text-center py-4">
            <v-icon
              :color="accionValidacion === 'aprobar' ? 'success' : 'error'"
              size="48"
              class="mb-3"
            >
              {{ accionValidacion === 'aprobar' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            <p class="text-body-1 font-weight-medium mb-2">
              ¿Estás seguro de que deseas
              <span :class="accionValidacion === 'aprobar' ? 'text-success' : 'text-error'">
                {{ accionValidacion === 'aprobar' ? 'APROBAR' : 'RECHAZAR' }}
              </span>
              este documento?
            </p>
            <p class="text-caption text-grey">
              Esta acción es <strong>irreversible</strong> y no podrá ser modificada posteriormente.
            </p>

            <!-- Muestra el comentario si existe -->
            <div v-if="comentarioValidacion" class="mt-4">
              <v-divider class="mb-3"></v-divider>
              <div class="text-left">
                <div class="text-caption font-weight-medium text-grey mb-1">
                  {{ accionValidacion === 'rechazar' ? 'Motivo del rechazo:' : 'Comentario:' }}
                </div>
                <div class="text-body-2 pa-3 rounded" style="background-color: #f5f5f5">
                  {{ comentarioValidacion }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogoConfirmacion">Cancelar</v-btn>
          <v-btn
            :color="accionValidacion === 'aprobar' ? 'success' : 'error'"
            variant="flat"
            :loading="enviandoValidacion"
            @click="enviarValidacion"
          >
            <v-icon
              start
              size="16"
              :icon="accionValidacion === 'aprobar' ? 'mdi-check' : 'mdi-close'"
            ></v-icon>
            {{ accionValidacion === 'aprobar' ? 'Sí, Aprobar' : 'Sí, Rechazar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useValidadores } from '../../composables/useValidadores'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps({
  documentoId: {
    type: [Number, String],
    required: true,
  },
  tipoDocumento: {
    type: String,
    required: true,
    validator: (value) => ['actividad', 'tarea'].includes(value),
  },
})

const emit = defineEmits(['validado'])

// Estado
const estadoValidacion = ref(null)
const loading = ref(false)
const error = ref(null)

// Estado de diálogos
const dialogAccionVisible = ref(false)
const dialogConfirmacionVisible = ref(false)
const accionValidacion = ref('aprobar')
const comentarioValidacion = ref('')
const enviandoValidacion = ref(false)

// Composables
const { obtenerEstadoValidacion, evaluacionInformeActividad } = useValidadores()
const { successMsg, errorMsg } = useSnackbar()

// Store
const usuarioStore = useUserStore()
const usuarioId = computed(() => usuarioStore.id)

// Computed properties
const miValidacion = computed(() => {
  if (!estadoValidacion.value?.validaciones) return null
  return estadoValidacion.value.validaciones.find((v) => v.usuarioValidador === usuarioId.value)
})

const validacionId = computed(() => miValidacion.value?.id || null)

const yaValido = computed(() => {
  return miValidacion.value?.estado !== 'PENDIENTE'
})

const puedeEnviarValidacion = computed(() => {
  if (accionValidacion.value === 'rechazar') {
    return comentarioValidacion.value?.trim().length > 0
  }
  return true
})

const avatarColor = computed(() => {
  const pendientes = estadoValidacion.value?.resumen?.pendientes || 0
  if (pendientes > 0) return 'warning'
  if (estadoValidacion.value?.resumen?.rechazados > 0) return 'error'
  if (estadoValidacion.value?.resumen?.aprobados > 0) return 'success'
  return 'grey'
})

const avatarIcon = computed(() => {
  const pendientes = estadoValidacion.value?.resumen?.pendientes || 0
  if (pendientes > 0) return 'mdi-bell-ring'
  if (estadoValidacion.value?.resumen?.rechazados > 0) return 'mdi-alert-circle'
  if (estadoValidacion.value?.resumen?.aprobados > 0) return 'mdi-check-circle'
  return 'mdi-file-check'
})

const chipColor = computed(() => {
  const pendientes = estadoValidacion.value?.resumen?.pendientes || 0
  if (pendientes > 0) return 'warning'
  if (estadoValidacion.value?.resumen?.rechazados > 0) return 'error'
  if (estadoValidacion.value?.resumen?.aprobados > 0) return 'success'
  return 'grey'
})

const getEstadoConsolidadoColor = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    EN_VALIDACION: 'warning',
    PENDIENTE: 'grey',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
})

const getEstadoConsolidadoIcon = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    EN_VALIDACION: 'mdi-clock-outline',
    PENDIENTE: 'mdi-clock',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-help-circle'
})

const getEstadoConsolidadoText = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const textos = {
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO',
    EN_VALIDACION: 'EN VALIDACIÓN',
    PENDIENTE: 'PENDIENTE',
    EN_CORRECCION: 'EN CORRECCIÓN',
  }
  return textos[estado] || 'SIN ESTADO'
})

// Métodos auxiliares
const getEstadoColor = (estado) => {
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    PENDIENTE: 'warning',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
}

const getIconoEstado = (estado) => {
  const iconos = {
    APROBADO: 'mdi-check',
    RECHAZADO: 'mdi-close',
    PENDIENTE: 'mdi-clock-outline',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-circle'
}

const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.substring(0, max) + '...' : texto
}

const formatDateCorta = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatDateCompleta = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const cargarValidaciones = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await obtenerEstadoValidacion(props.documentoId, props.tipoDocumento)
    estadoValidacion.value = data
  } catch (err) {
    console.error('Error cargando validaciones:', err)
    error.value = err.message || 'Error al cargar validaciones'
  } finally {
    loading.value = false
  }
}

// Acciones de diálogos
const abrirDialogoValidacion = () => {
  if (yaValido.value) {
    errorMsg('Ya has realizado tu validación para este documento')
    return
  }
  if (!validacionId.value) {
    errorMsg('No se encontró tu validación para este documento')
    return
  }
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
  dialogAccionVisible.value = true
}

const cerrarDialogoAccion = () => {
  dialogAccionVisible.value = false
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
}

const abrirDialogoConfirmacion = () => {
  if (!puedeEnviarValidacion.value) return
  cerrarDialogoAccion()
  dialogConfirmacionVisible.value = true
}

const cerrarDialogoConfirmacion = () => {
  dialogConfirmacionVisible.value = false
}

const enviarValidacion = async () => {
  if (!validacionId.value) {
    errorMsg('No se encontró la validación para enviar')
    return
  }

  enviandoValidacion.value = true
  try {
    const datosEvaluacion = {
      estado: accionValidacion.value === 'aprobar' ? 'APROBADO' : 'RECHAZADO',
      comentarios: comentarioValidacion.value,
    }

    const respuesta = await evaluacionInformeActividad(validacionId.value, datosEvaluacion)
    console.log('Respuesta Val: ', respuesta)

    successMsg(
      `Documento ${accionValidacion.value === 'aprobar' ? 'aprobado' : 'rechazado'} correctamente`,
    )
    cerrarDialogoConfirmacion()

    // Recargar validaciones
    await cargarValidaciones()

    // Emitir evento para que el padre sepa que se realizó una validación
    emit('validado', {
      documentoId: props.documentoId,
      tipoDocumento: props.tipoDocumento,
      validacionId: validacionId.value,
      estado: accionValidacion.value === 'aprobar' ? 'APROBADO' : 'RECHAZADO',
    })
  } catch (err) {
    errorMsg('Error al enviar la validación: ' + (err.message || 'Error desconocido'))
    console.error('Error:', err)
  } finally {
    enviandoValidacion.value = false
  }
}

// Watch para cambios
watch(
  () => [props.documentoId, props.tipoDocumento],
  () => {
    if (props.documentoId) {
      cargarValidaciones()
    }
  },
  { immediate: true },
)

// Exponer método para recargar desde el padre
defineExpose({
  recargar: cargarValidaciones,
})
</script>

<style scoped>
.tarjeta-validaciones {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.tarjeta-validaciones:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.sticky-top {
  position: sticky;
  top: 20px;
}

.validadores-lista {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.validacion-item {
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 4px 0;
}

.validacion-item:hover {
  background: #f8f9fa;
}

.validadores-lista::-webkit-scrollbar {
  width: 4px;
}

.validadores-lista::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.validadores-lista::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.gap-2 {
  gap: 8px;
}

/* Estilo para expansion panel transparente */
.v-expansion-panel--flat {
  box-shadow: none;
}
</style>
