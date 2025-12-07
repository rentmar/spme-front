<template>
  <div class="notification-container">
    <!-- Botón de campana con badge mejorado -->
    <v-btn
      icon
      variant="text"
      @click="abrirNotificaciones"
      :loading="cargando"
      :disabled="cargando"
      class="notification-bell-btn"
    >
      <!-- Icono de campana con color dinámico -->
      <v-icon
        :class="{
          'notification-bell-icon': true,
          'has-notifications': notificacionesNoLeidas > 0,
          'urgent-notifications': notificacionesUrgentes > 0,
        }"
      >
        {{ notificacionesUrgentes > 0 ? 'mdi-bell-alert' : 'mdi-bell' }}
      </v-icon>

      <!-- Badge con contador - posición absoluta -->
      <div v-if="notificacionesNoLeidas > 0" class="notification-badge">
        <span class="badge-count">
          {{ notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas }}
        </span>
      </div>
    </v-btn>

    <!-- Diálogo de notificaciones -->
    <v-dialog v-model="dialogoVisible" max-width="600px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between bg-primary">
          <div class="d-flex align-center">
            <v-icon color="white" class="mr-2">mdi-bell-alert</v-icon>
            <span class="text-h6 text-white">Notificaciones Urgentes</span>
          </div>
          <v-btn icon color="white" variant="text" @click="dialogoVisible = false" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <!-- Contador y acciones -->
          <div class="d-flex align-center justify-space-between pa-4 border-bottom">
            <div class="text-body-1 font-weight-medium">
              <v-icon color="error" size="small" class="mr-1">mdi-alert</v-icon>
              Tienes {{ notificacionesNoLeidas }} notificación(es) urgente(s)
              <span v-if="notificacionesUrgentes > 0" class="text-error ml-2">
                ({{ notificacionesUrgentes }} alta prioridad)
              </span>
            </div>
            <v-btn
              v-if="notificacionesNoLeidas > 0"
              size="small"
              variant="outlined"
              @click="marcarTodasComoLeidas"
              :loading="marcarTodas"
            >
              <v-icon start size="small">mdi-check-all</v-icon>
              Marcar todas como leídas
            </v-btn>
          </div>

          <!-- Lista de notificaciones -->
          <div v-if="notificaciones.length > 0" class="notifications-list">
            <v-list lines="three" density="compact">
              <template v-for="(notificacion, index) in notificaciones" :key="notificacion.id">
                <v-list-item
                  :class="{
                    'notification-unread': !notificacion.leido,
                    'notification-urgent': notificacion.prioridad === 3,
                  }"
                  @click="verMensaje(notificacion)"
                >
                  <template #prepend>
                    <v-avatar :color="getPrioridadColor(notificacion.prioridad)" size="36">
                      <v-icon color="white" size="small">
                        {{ getPrioridadIcono(notificacion.prioridad) }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium d-flex align-center">
                    <span>{{ notificacion.asunto }}</span>
                    <div class="ml-2 d-flex align-center">
                      <v-chip
                        v-if="!notificacion.leido"
                        size="x-small"
                        color="primary"
                        class="mr-1"
                        label
                      >
                        Nuevo
                      </v-chip>
                      <v-chip
                        v-if="notificacion.prioridad === 3"
                        size="x-small"
                        color="error"
                        label
                      >
                        <v-icon start size="x-small">mdi-alert</v-icon>
                        Urgente
                      </v-chip>
                    </div>
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-caption">
                    <div class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-account</v-icon>
                      {{ notificacion.remitente_nombre || 'Sistema' }}
                    </div>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="x-small" class="mr-1">mdi-clock</v-icon>
                      {{ formatFecha(notificacion.fecha_creacion) }}
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click.stop="marcarComoLeida(notificacion)"
                      :loading="notificacion.id === notificacionMarcando"
                    >
                      <v-icon :color="notificacion.leido ? 'success' : 'grey'">
                        {{ notificacion.leido ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-list-item>

                <v-divider v-if="index < notificaciones.length - 1"></v-divider>
              </template>
            </v-list>
          </div>

          <!-- Sin notificaciones -->
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-off</v-icon>
            <div class="text-h6 text-grey mb-2">No hay notificaciones</div>
            <div class="text-body-2 text-grey">No tienes notificaciones urgentes pendientes</div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 border-top">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="dialogoVisible = false">Cerrar</v-btn>
          <v-btn
            v-if="notificaciones.length > 0"
            color="primary"
            @click="irABandeja"
            variant="flat"
          >
            <v-icon start>mdi-inbox</v-icon>
            Ver todos los mensajes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para ver mensaje completo - AGRAANDADO -->
    <v-dialog v-model="dialogoMensajeVisible" max-width="1200px" fullscreen>
      <v-card class="fullscreen-message-dialog">
        <!-- Header fijo -->
        <v-card-title
          class="d-flex align-center justify-space-between bg-primary pa-4 sticky-header"
        >
          <div class="d-flex align-center">
            <v-avatar
              :color="getPrioridadColor(mensajeSeleccionado.prioridad)"
              size="40"
              class="mr-3"
            >
              <v-icon color="white" size="small">
                {{ getPrioridadIcono(mensajeSeleccionado.prioridad) }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 text-white font-weight-bold">
                {{ mensajeSeleccionado.asunto }}
              </div>
              <div class="text-caption text-white mt-1">
                <v-icon size="small" class="mr-1">mdi-account</v-icon>
                {{ mensajeSeleccionado.remitente_nombre || 'Sistema' }}
                <span class="mx-2">•</span>
                <v-icon size="small" class="mr-1">mdi-clock</v-icon>
                {{ formatFechaCompleta(mensajeSeleccionado.fecha_creacion) }}
              </div>
            </div>
          </div>
          <v-btn
            icon
            color="white"
            variant="text"
            @click="dialogoMensajeVisible = false"
            size="large"
            class="close-btn"
          >
            <v-icon size="28">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Contenido principal -->
        <v-card-text class="pa-0 message-content-container">
          <!-- Panel de información lateral -->
          <div class="d-flex message-layout">
            <!-- Panel lateral con información -->
            <div class="message-sidebar pa-4">
              <div class="mb-6">
                <div class="text-subtitle-1 font-weight-bold mb-2">Detalles del mensaje</div>
                <v-divider class="mb-3"></v-divider>

                <div class="mb-3">
                  <div class="text-caption text-grey mb-1">Prioridad:</div>
                  <v-chip
                    :color="getPrioridadColor(mensajeSeleccionado.prioridad)"
                    size="large"
                    class="w-100 justify-start"
                    :class="`priority-${mensajeSeleccionado.prioridad}`"
                  >
                    <v-icon start size="medium">{{
                      getPrioridadIcono(mensajeSeleccionado.prioridad)
                    }}</v-icon>
                    <span class="font-weight-bold">{{
                      getPrioridadTexto(mensajeSeleccionado.prioridad)
                    }}</span>
                  </v-chip>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-grey mb-1">Tipo:</div>
                  <div class="text-body-1 font-weight-medium d-flex align-center">
                    <v-icon
                      :color="getTipoColor(mensajeSeleccionado.tipo)"
                      size="small"
                      class="mr-2"
                    >
                      {{ getTipoIcono(mensajeSeleccionado.tipo) }}
                    </v-icon>
                    {{ getTipoTexto(mensajeSeleccionado.tipo) }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-grey mb-1">Fecha de envío:</div>
                  <div class="text-body-1">
                    {{ formatFechaCompleta(mensajeSeleccionado.fecha_creacion) }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-grey mb-1">Remitente:</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ mensajeSeleccionado.remitente_nombre || 'Sistema' }}
                  </div>
                  <div v-if="mensajeSeleccionado.remitente_email" class="text-caption text-grey">
                    {{ mensajeSeleccionado.remitente_email }}
                  </div>
                </div>

                <div class="mb-3">
                  <div class="text-caption text-grey mb-1">ID del mensaje:</div>
                  <div class="text-body-2 font-weight-regular font-monospace">
                    {{ mensajeSeleccionado.id || 'N/A' }}
                  </div>
                </div>
              </div>

              <!-- Acciones rápidas -->
              <div class="mt-6">
                <div class="text-subtitle-1 font-weight-bold mb-3">Acciones</div>
                <v-divider class="mb-3"></v-divider>

                <div class="d-flex flex-column gap-2">
                  <v-btn
                    color="primary"
                    variant="flat"
                    @click="responderMensaje"
                    :disabled="!mensajeSeleccionado.remitente_id"
                    block
                    size="large"
                    class="mb-2"
                  >
                    <v-icon start>mdi-reply</v-icon>
                    Responder
                  </v-btn>

                  <v-btn
                    color="secondary"
                    variant="outlined"
                    @click="reenviarMensaje"
                    block
                    size="large"
                    class="mb-2"
                  >
                    <v-icon start>mdi-share-variant</v-icon>
                    Reenviar
                  </v-btn>

                  <v-btn
                    color="warning"
                    variant="outlined"
                    @click="archivarMensaje"
                    block
                    size="large"
                  >
                    <v-icon start>mdi-archive</v-icon>
                    Archivar
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Contenido del mensaje -->
            <div class="message-main-content pa-6">
              <!-- Encabezado del contenido -->
              <div class="mb-4">
                <div class="text-h6 font-weight-bold mb-2">Contenido del mensaje</div>
                <v-divider></v-divider>
              </div>

              <!-- Área de texto del mensaje -->
              <div class="message-text-container pa-5 bg-grey-lighten-5 rounded-lg">
                <div
                  class="text-body-1 message-text"
                  style="white-space: pre-wrap; line-height: 1.8"
                >
                  {{ mensajeSeleccionado.contenido }}
                </div>

                <!-- Información adicional si existe -->
                <div v-if="mensajeSeleccionado.metadata" class="mt-6 pt-4 border-top">
                  <div class="text-subtitle-2 font-weight-bold mb-2">Información adicional:</div>
                  <div class="text-body-2">
                    <pre class="metadata-content">{{
                      JSON.stringify(mensajeSeleccionado.metadata, null, 2)
                    }}</pre>
                  </div>
                </div>
              </div>

              <!-- Acciones del contenido -->
              <div class="mt-6 pt-4 border-top d-flex justify-end gap-2">
                <v-btn
                  variant="outlined"
                  @click="dialogoMensajeVisible = false"
                  size="large"
                  class="mr-2"
                >
                  <v-icon start>mdi-close</v-icon>
                  Cerrar
                </v-btn>
                <v-btn
                  color="primary"
                  @click="responderMensaje"
                  :disabled="!mensajeSeleccionado.remitente_id"
                  size="large"
                >
                  <v-icon start>mdi-reply</v-icon>
                  Responder
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificacionesStore } from '../store/useNotificacionesStore'

// Props
const props = defineProps({
  // Opcional: puedes pasar configuraciones específicas
})

// Emits
const emit = defineEmits(['ver-mensaje', 'responder-mensaje', 'ir-bandeja', 'reenviar-mensaje'])

// Stores
const usuarioStore = useUserStore()
const notificacionesStore = useNotificacionesStore()

// Estados
const dialogoVisible = ref(false)
const dialogoMensajeVisible = ref(false)
const cargando = ref(false)
const marcarTodas = ref(false)
const notificacionMarcando = ref(null)
const notificaciones = ref([])
const mensajeSeleccionado = ref(null)

// Computed
const notificacionesNoLeidas = computed(() => {
  return notificaciones.value.filter((n) => !n.leido && n.prioridad === 3).length
})

const notificacionesUrgentes = computed(() => {
  return notificaciones.value.filter((n) => n.prioridad === 3).length
})

// Ciclo de vida
onMounted(() => {
  cargarNotificaciones()
  // Configurar polling cada 60 segundos
  const intervalo = setInterval(cargarNotificaciones, 60000)

  onUnmounted(() => {
    clearInterval(intervalo)
  })
})

// Métodos
const cargarNotificaciones = async () => {
  if (cargando.value) return

  cargando.value = true
  try {
    await notificacionesStore.cargarNotificaciones()
    notificaciones.value = notificacionesStore.notificaciones
  } catch (error) {
    console.error('Error cargando notificaciones:', error)
  } finally {
    cargando.value = false
  }
}

const abrirNotificaciones = () => {
  dialogoVisible.value = true
  cargarNotificaciones()
}

const verMensaje = async (notificacion) => {
  mensajeSeleccionado.value = notificacion
  dialogoMensajeVisible.value = true

  // Si no está leído, marcarlo como leído automáticamente
  if (!notificacion.leido) {
    await marcarComoLeida(notificacion)
  }

  emit('ver-mensaje', notificacion)
}

const marcarComoLeida = async (notificacion) => {
  notificacionMarcando.value = notificacion.id

  try {
    const token = usuarioStore.accessToken
    const response = await fetch(`/api/mensajes/${notificacion.id}/leer/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      notificacion.leido = true
    }
  } catch (error) {
    console.error('Error marcando como leído:', error)
  } finally {
    notificacionMarcando.value = null
  }
}

const marcarTodasComoLeidas = async () => {
  marcarTodas.value = true

  try {
    const token = usuarioStore.accessToken
    const response = await fetch('/api/mensajes/marcar-todos-leidos/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      notificaciones.value.forEach((n) => (n.leido = true))
    }
  } catch (error) {
    console.error('Error marcando todas como leídas:', error)
  } finally {
    marcarTodas.value = false
  }
}

const responderMensaje = () => {
  if (mensajeSeleccionado.value) {
    dialogoMensajeVisible.value = false
    emit('responder-mensaje', mensajeSeleccionado.value)
  }
}

const reenviarMensaje = () => {
  if (mensajeSeleccionado.value) {
    dialogoMensajeVisible.value = false
    emit('reenviar-mensaje', mensajeSeleccionado.value)
  }
}

const archivarMensaje = async () => {
  if (!mensajeSeleccionado.value) return

  try {
    const token = usuarioStore.accessToken
    const response = await fetch(`/api/mensajes/${mensajeSeleccionado.value.id}/archivar/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      // Actualizar la notificación en la lista
      const index = notificaciones.value.findIndex((n) => n.id === mensajeSeleccionado.value.id)
      if (index !== -1) {
        notificaciones.value.splice(index, 1)
      }
      dialogoMensajeVisible.value = false
    }
  } catch (error) {
    console.error('Error archivando mensaje:', error)
  }
}

const irABandeja = () => {
  dialogoVisible.value = false
  emit('ir-bandeja')
}

// Funciones de utilidad
const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'error'
    default:
      return 'grey'
  }
}

const getPrioridadIcono = (prioridad) => {
  switch (prioridad) {
    case 1:
      return 'mdi-arrow-down'
    case 2:
      return 'mdi-minus'
    case 3:
      return 'mdi-alert'
    default:
      return 'mdi-help'
  }
}

const getPrioridadTexto = (prioridad) => {
  switch (prioridad) {
    case 1:
      return 'Baja'
    case 2:
      return 'Media'
    case 3:
      return 'Alta'
    default:
      return 'Sin prioridad'
  }
}

const getTipoColor = (tipo) => {
  const colores = {
    privado: 'primary',
    sistema: 'info',
    alerta: 'error',
    recordatorio: 'warning',
    reprogramacion: 'secondary',
    retraso: 'deep-orange',
  }
  return colores[tipo] || 'grey'
}

const getTipoIcono = (tipo) => {
  const iconos = {
    privado: 'mdi-email',
    sistema: 'mdi-cog',
    alerta: 'mdi-alert-circle',
    recordatorio: 'mdi-bell-ring',
    reprogramacion: 'mdi-calendar-sync',
    retraso: 'mdi-clock-alert',
  }
  return iconos[tipo] || 'mdi-help-circle'
}

const getTipoTexto = (tipo) => {
  const tipos = {
    privado: 'Mensaje Privado',
    sistema: 'Sistema',
    alerta: 'Alerta',
    recordatorio: 'Recordatorio',
    reprogramacion: 'Reprogramación',
    retraso: 'Retraso',
  }
  return tipos[tipo] || tipo
}

const formatFecha = (fechaString) => {
  if (!fechaString) return ''

  const fecha = new Date(fechaString)
  const ahora = new Date()
  const diferencia = ahora - fecha

  // Si es hoy, mostrar hora
  if (diferencia < 24 * 60 * 60 * 1000) {
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  // Si es de esta semana, mostrar día
  if (diferencia < 7 * 24 * 60 * 60 * 1000) {
    return fecha.toLocaleDateString('es-ES', { weekday: 'short' })
  }

  // Mostrar fecha completa
  return fecha.toLocaleDateString('es-ES')
}

const formatFechaCompleta = (fechaString) => {
  if (!fechaString) return ''

  const fecha = new Date(fechaString)
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

.notification-bell-btn {
  position: relative;
  width: 48px;
  height: 48px;
  margin: 0 4px;
}

.notification-bell-icon {
  font-size: 24px;
  color: white;
  transition: all 0.3s ease;
}

.notification-bell-icon.has-notifications {
  color: #ff9800;
  animation: pulse 2s infinite;
}

.notification-bell-icon.urgent-notifications {
  color: #f44336;
  animation: shake 0.5s ease-in-out infinite alternate;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f44336;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(25%, -25%);
  border: 2px solid #1976d2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.badge-count {
  color: white;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
}

/* Diálogo de mensaje agrandado */
.fullscreen-message-dialog {
  height: 90vh;
  max-height: 90vh;
  overflow: hidden;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  transform: scale(1.1);
}

.message-content-container {
  height: calc(90vh - 80px);
  overflow-y: auto;
}

.message-layout {
  height: 100%;
  min-height: 600px;
}

.message-sidebar {
  width: 320px;
  min-width: 320px;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  overflow-y: auto;
  height: calc(90vh - 80px);
}

.message-main-content {
  flex: 1;
  overflow-y: auto;
  height: calc(90vh - 80px);
}

.message-text-container {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

.message-text {
  font-size: 1.1rem;
  line-height: 1.8;
}

.metadata-content {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

/* Estilos para prioridades */
.priority-1 {
  background-color: #e8f5e9 !important;
  color: #2e7d32 !important;
}

.priority-2 {
  background-color: #fff3e0 !important;
  color: #ef6c00 !important;
}

.priority-3 {
  background-color: #ffebee !important;
  color: #c62828 !important;
}

/* Scrollbars personalizados */
.message-sidebar::-webkit-scrollbar,
.message-main-content::-webkit-scrollbar,
.message-text-container::-webkit-scrollbar,
.metadata-content::-webkit-scrollbar {
  width: 8px;
}

.message-sidebar::-webkit-scrollbar-track,
.message-main-content::-webkit-scrollbar-track,
.message-text-container::-webkit-scrollbar-track,
.metadata-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.message-sidebar::-webkit-scrollbar-thumb,
.message-main-content::-webkit-scrollbar-thumb,
.message-text-container::-webkit-scrollbar-thumb,
.metadata-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.message-sidebar::-webkit-scrollbar-thumb:hover,
.message-main-content::-webkit-scrollbar-thumb:hover,
.message-text-container::-webkit-scrollbar-thumb:hover,
.metadata-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 1200px) {
  .message-layout {
    flex-direction: column;
  }

  .message-sidebar {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .message-main-content {
    height: auto;
  }
}

/* Animaciones */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-2px) rotate(-5deg);
  }
  75% {
    transform: translateX(2px) rotate(5deg);
  }
  100% {
    transform: translateX(0) rotate(0);
  }
}

/* Utilidades */
.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0 !important;
}

.font-monospace {
  font-family: 'Courier New', monospace;
}

.w-100 {
  width: 100%;
}
</style>
