<template>
  <div class="notification-container">
    <!-- Botón de campana -->
    <v-btn
      icon
      variant="text"
      @click="toggleDropdown"
      :loading="loading || bellStore.loading"
      :disabled="loading || bellStore.loading"
      class="notification-bell-btn"
      :title="titleText"
    >
      <!-- Icono dinámico según prioridad -->
      <v-icon
        :class="{
          'notification-bell-icon': true,
          'has-notifications': tieneNotificaciones,
          'urgent-notifications': tienePrioridad3,
          'normal-notifications': tieneNotificaciones && !tienePrioridad3,
          'pulse-animation': tieneNotificaciones && !dialogoVisible,
        }"
      >
        {{ tienePrioridad3 ? 'mdi-bell-alert' : 'mdi-bell' }}
      </v-icon>

      <!-- Badge visible solo si hay notificaciones -->
      <div v-if="tieneNotificaciones" class="notification-badge" :class="badgeClass">
        <span class="badge-count">
          {{ badgeTexto }}
        </span>
      </div>
    </v-btn>

    <!-- Diálogo de notificaciones -->
    <v-dialog v-model="dialogoVisible" max-width="600px" scrollable>
      <v-card>
        <!-- Encabezado -->
        <v-card-title class="d-flex align-center justify-space-between bg-primary">
          <div class="d-flex align-center">
            <v-icon color="white" class="mr-2">mdi-bell</v-icon>
            <span class="text-h6 text-white">Notificaciones</span>
          </div>
          <v-btn icon color="white" variant="text" @click="dialogoVisible = false" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <!-- Contador y acciones -->
          <div class="d-flex align-center justify-space-between pa-4 border-bottom">
            <div class="text-body-1 font-weight-medium">
              <v-icon :color="tienePrioridad3 ? 'error' : 'primary'" size="small" class="mr-1">
                {{ tienePrioridad3 ? 'mdi-alert' : 'mdi-bell' }}
              </v-icon>
              Tienes {{ contadorNoLeidos }} notificación(es)
              <span v-if="tienePrioridad3" class="text-error ml-2">
                ({{ contarMensajesPorPrioridad(3) }} urgente{{
                  contarMensajesPorPrioridad(3) !== 1 ? 's' : ''
                }})
              </span>
            </div>
            <v-btn
              v-if="tieneNotificaciones"
              size="small"
              variant="outlined"
              @click="marcarTodasComoLeidas"
              :loading="marcarTodas"
              :disabled="marcarTodas || !tieneNotificaciones"
            >
              <v-icon start size="small">mdi-check-all</v-icon>
              Marcar todas como leidas
            </v-btn>
          </div>

          <!-- Lista de notificaciones -->
          <div v-if="tieneNotificaciones" class="notifications-list">
            <v-list lines="three" density="compact">
              <template
                v-for="(mensaje, index) in bellStore.listaMensajesFiltrada"
                :key="mensaje.id"
              >
                <v-list-item
                  :class="{
                    'notification-unread': !mensaje.es_leido,
                    'notification-urgent': mensaje.prioridad === 3,
                    'notification-medium': mensaje.prioridad === 2,
                    'notification-low': mensaje.prioridad === 1,
                  }"
                  @click="verMensaje(mensaje)"
                >
                  <template #prepend>
                    <v-avatar :color="getPrioridadColor(mensaje.prioridad)" size="36">
                      <v-icon color="white" size="small">
                        {{ getPrioridadIcono(mensaje.prioridad) }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium d-flex align-center">
                    <span class="text-truncate">{{ mensaje.asunto || 'Sin asunto' }}</span>
                    <div class="ml-2 d-flex align-center">
                      <v-chip
                        v-if="!mensaje.es_leido"
                        size="x-small"
                        color="primary"
                        class="mr-1"
                        label
                      >
                        Nuevo
                      </v-chip>
                      <v-chip v-if="mensaje.prioridad === 3" size="x-small" color="error" label>
                        <v-icon start size="x-small">mdi-alert</v-icon>
                        Urgente
                      </v-chip>
                      <v-chip
                        v-else-if="mensaje.prioridad === 2"
                        size="x-small"
                        color="warning"
                        label
                      >
                        <v-icon start size="x-small">mdi-exclamation</v-icon>
                        Media
                      </v-chip>
                    </div>
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-caption">
                    <div class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-account</v-icon>
                      <span class="text-truncate">
                        {{ mensaje.remitente?.nombre_completo || 'Sistema' }}
                      </span>
                    </div>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="x-small" class="mr-1">mdi-clock</v-icon>
                      {{ formatFecha(mensaje.fecha_envio) }}
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click.stop="marcarComoLeida(mensaje)"
                      :loading="marcandoNotificacionId === mensaje.id"
                      :disabled="marcandoNotificacionId === mensaje.id || mensaje.es_leido"
                    >
                      <v-icon :color="mensaje.es_leido ? 'success' : 'grey'">
                        {{ mensaje.es_leido ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-list-item>

                <v-divider v-if="index < bellStore.listaMensajesFiltrada.length - 1"></v-divider>
              </template>
            </v-list>
          </div>

          <!-- Sin notificaciones -->
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-off</v-icon>
            <div class="text-h6 text-grey mb-2">No hay notificaciones nuevas</div>
            <div class="text-body-2 text-grey">Todos los mensajes están leídos</div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 border-top">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="dialogoVisible = false">Cerrar</v-btn>
          <v-btn variant="outlined" :to="'/notificaciones'">Ir a la Bandeja</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para ver mensaje completo -->
    <v-dialog v-model="dialogoMensajeVisible" max-width="800px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between bg-primary">
          <div class="d-flex align-center">
            <v-icon color="white" class="mr-2">
              {{ getTipoIcono(mensajeSeleccionado?.tipo) }}
            </v-icon>
            <span class="text-h6 text-white">Mensaje: {{ mensajeSeleccionado?.asunto }}</span>
          </div>
          <v-btn icon color="white" variant="text" @click="dialogoMensajeVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Información del mensaje -->
          <div v-if="mensajeSeleccionado" class="message-details">
            <!-- Asunto destacado -->
            <div class="asunto-section mb-6">
              <div class="text-subtitle-1 text-grey mb-1">ASUNTO</div>
              <div class="asunto-content pa-3 bg-blue-lighten-5 rounded">
                <h2 class="text-h5 font-weight-bold text-primary">
                  {{ mensajeSeleccionado.asunto || 'Sin asunto' }}
                </h2>
                <div class="d-flex align-center mt-2">
                  <v-chip
                    v-if="!mensajeSeleccionado.es_leido"
                    color="primary"
                    size="small"
                    class="mr-2"
                  >
                    <v-icon start size="small">mdi-email</v-icon>
                    Nuevo
                  </v-chip>
                  <v-chip
                    v-if="mensajeSeleccionado.prioridad === 3"
                    color="error"
                    size="small"
                    class="mr-2"
                  >
                    <v-icon start size="small">mdi-alert</v-icon>
                    Urgente
                  </v-chip>
                  <v-chip v-if="mensajeSeleccionado.prioridad === 2" color="warning" size="small">
                    <v-icon start size="small">mdi-exclamation</v-icon>
                    Media
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Información del remitente y fecha -->
            <div class="d-flex align-center justify-space-between mb-6">
              <div class="d-flex align-center">
                <v-avatar
                  :color="getAvatarColor(mensajeSeleccionado.remitente?.nombre_completo)"
                  size="50"
                  class="mr-3 shadow-sm"
                >
                  <span class="text-white text-subtitle-1 font-weight-bold">
                    {{ getIniciales(mensajeSeleccionado.remitente?.nombre_completo) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="text-body-1 font-weight-medium">
                    {{ mensajeSeleccionado.remitente?.nombre_completo || 'Sistema' }}
                  </div>
                  <div class="text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
                    Remitente
                  </div>
                </div>
              </div>

              <div class="d-flex flex-column align-end">
                <div class="text-body-2 font-weight-medium mb-1">
                  <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                  {{ formatFechaCompleta(mensajeSeleccionado.fecha_envio) }}
                </div>
                <div class="d-flex gap-1">
                  <v-chip
                    :color="getPrioridadColor(mensajeSeleccionado.prioridad)"
                    size="small"
                    class="text-white"
                  >
                    <v-icon start size="small">{{
                      getPrioridadIcono(mensajeSeleccionado.prioridad)
                    }}</v-icon>
                    {{ getPrioridadTexto(mensajeSeleccionado.prioridad) }}
                  </v-chip>
                  <v-chip
                    :color="getTipoColor(mensajeSeleccionado.tipo)"
                    size="small"
                    class="text-white"
                  >
                    <v-icon start size="small">{{ getTipoIcono(mensajeSeleccionado.tipo) }}</v-icon>
                    {{ mensajeSeleccionado.tipo_display }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Contenido del mensaje -->
            <div class="message-content-section mb-6">
              <div class="text-subtitle-1 font-weight-medium text-grey mb-2">CONTENIDO</div>
              <div class="message-content pa-4 border rounded bg-grey-lighten-5">
                <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6">
                  {{ mensajeSeleccionado.contenido }}
                </div>
              </div>
            </div>

            <!-- Metadata si existe -->
            <div
              v-if="
                mensajeSeleccionado.metadata && Object.keys(mensajeSeleccionado.metadata).length > 0
              "
              class="metadata-section"
            >
              <div class="text-subtitle-1 font-weight-medium text-grey mb-2">
                <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
                INFORMACIÓN ADICIONAL
              </div>
              <div class="metadata-content pa-3 bg-grey-lighten-4 rounded">
                <pre class="text-caption ma-0" style="font-family: 'Roboto Mono', monospace"
                  >{{ formatMetadata(mensajeSeleccionado.metadata) }}
                </pre>
              </div>
            </div>

            <!-- Información del estado -->
            <div class="estado-section mt-6 pt-4 border-top">
              <div class="text-subtitle-1 font-weight-medium text-grey mb-2">
                ESTADO DEL MENSAJE
              </div>
              <div class="d-flex align-center">
                <v-chip
                  :color="mensajeSeleccionado.es_leido ? 'success' : 'primary'"
                  size="small"
                  class="mr-2"
                >
                  <v-icon start size="small">
                    {{ mensajeSeleccionado.es_leido ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                  </v-icon>
                  {{ mensajeSeleccionado.es_leido ? 'Leído' : 'No leído' }}
                </v-chip>
                <span class="text-caption text-grey">
                  {{
                    mensajeSeleccionado.es_leido
                      ? 'Leído el ' + formatFecha(mensajeSeleccionado.fecha_leido)
                      : 'Pendiente de lectura'
                  }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 border-top">
          <v-spacer></v-spacer>
          <v-btn
            v-if="mensajeSeleccionado && !mensajeSeleccionado.es_leido"
            color="primary"
            @click="marcarComoLeida(mensajeSeleccionado)"
            :loading="marcandoNotificacionId === mensajeSeleccionado?.id"
            :disabled="marcandoNotificacionId === mensajeSeleccionado?.id"
          >
            <v-icon start>mdi-check</v-icon>
            Marcar como leído
          </v-btn>
          <v-btn variant="outlined" @click="dialogoMensajeVisible = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificacionesBellStore } from '../store/useNotificacionesBellStore'

// Store
const bellStore = useNotificacionesBellStore()

// Estados
const loading = ref(true)
const dialogoVisible = ref(false)
const dialogoMensajeVisible = ref(false)
const marcarTodas = ref(false)
const marcandoNotificacionId = ref(null)
const mensajeSeleccionado = ref(null)

//Constantes
const tiempoRecarga = 10 * 60 * 100

// Computed properties
const tieneNotificaciones = computed(() => {
  return bellStore.listaMensajesFiltrada.length > 0
})

const tienePrioridad3 = computed(() => {
  return bellStore.listaMensajesFiltrada.some((m) => m.prioridad === 3)
})

const tienePrioridad2 = computed(() => {
  return bellStore.listaMensajesFiltrada.some((m) => m.prioridad === 2)
})

const contadorNoLeidos = computed(() => {
  return bellStore.obtenerConteoNoLeidos()
})

const titleText = computed(() => {
  if (!tieneNotificaciones.value) return 'No hay notificaciones'
  return `${contadorNoLeidos.value} notificación${contadorNoLeidos.value !== 1 ? 'es' : ''} no leída${contadorNoLeidos.value !== 1 ? 's' : ''}`
})

const badgeTexto = computed(() => {
  const count = contadorNoLeidos.value
  return count > 99 ? '99+' : count.toString()
})

const badgeClass = computed(() => ({
  'badge-urgent': tienePrioridad3.value,
  'badge-medium': tienePrioridad2.value && !tienePrioridad3.value,
  'badge-low': !tienePrioridad3.value && !tienePrioridad2.value,
}))

// Métodos de ayuda
const contarMensajesPorPrioridad = (prioridad) => {
  return bellStore.listaMensajesFiltrada.filter((m) => m.prioridad === prioridad).length
}

const toggleDropdown = async () => {
  dialogoVisible.value = !dialogoVisible.value
  if (dialogoVisible.value) {
    await cargarDatos()
  }
}

const cargarDatos = async () => {
  loading.value = true
  try {
    await bellStore.cargarBandejaMensajes()
  } catch (error) {
    console.error('Error al cargar la información de la bandeja', error)
  } finally {
    loading.value = false
  }
}

const verMensaje = (mensaje) => {
  mensajeSeleccionado.value = mensaje
  dialogoMensajeVisible.value = true
}

const marcarComoLeida = async (mensaje) => {
  if (mensaje.es_leido) return // No hacer nada si ya está leído

  marcandoNotificacionId.value = mensaje.id
  try {
    await bellStore.mensajeAEstadoLeido(mensaje.id)
    await cargarDatos()
    // Cerrar el diálogo del mensaje si está abierto
    if (dialogoMensajeVisible.value && mensajeSeleccionado.value?.id === mensaje.id) {
      dialogoMensajeVisible.value = false
    }
  } catch (error) {
    console.error('Error al marcar como leído:', error)
    // Podrías mostrar un mensaje de error al usuario aquí
  } finally {
    marcandoNotificacionId.value = null
  }
}

const marcarTodasComoLeidas = async () => {
  if (!tieneNotificaciones.value) return

  marcarTodas.value = true
  const mensajes = bellStore.listaMensajesFiltrada
  console.log('Mensajes a marcar: ', mensajes)
  const ids = bellStore.listaMensajesFiltrada.map((mensaje) => mensaje.id)
  console.log('IDs: ', ids)
  try {
    //await bellStore.marcarTodosComoLeidos()
    await bellStore.marcarTodosALeidos(ids)
    await cargarDatos()
    dialogoVisible.value = false
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error)
  } finally {
    marcarTodas.value = false
  }
}

// Funciones de formato y utilidad
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
  })
}

const formatMetadata = (metadata) => {
  return JSON.stringify(metadata, null, 2)
}

const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case 3:
      return 'error'
    case 2:
      return 'warning'
    case 1:
      return 'success'
    default:
      return 'grey'
  }
}

const getPrioridadIcono = (prioridad) => {
  switch (prioridad) {
    case 3:
      return 'mdi-alert'
    case 2:
      return 'mdi-exclamation'
    case 1:
      return 'mdi-arrow-down'
    default:
      return 'mdi-help'
  }
}

const getPrioridadTexto = (prioridad) => {
  switch (prioridad) {
    case 3:
      return 'Alta'
    case 2:
      return 'Media'
    case 1:
      return 'Baja'
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
  }
  return iconos[tipo] || 'mdi-help-circle'
}

const getAvatarColor = (nombre) => {
  if (!nombre) return 'grey'
  const colores = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  const indice = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colores[indice % colores.length]
}

const getIniciales = (nombre) => {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Cargar datos al montar
onMounted(() => {
  cargarDatos()
})

// Recargar periódicamente
let intervaloRecarga
onMounted(() => {
  intervaloRecarga = setInterval(() => {
    if (!dialogoVisible.value) {
      cargarDatos()
    }
  }, tiempoRecarga) // Recargar cada 30 segundos
})

onUnmounted(() => {
  if (intervaloRecarga) {
    clearInterval(intervaloRecarga)
  }
  document.removeEventListener('visibilitychange', cargarDatos)
})
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
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.notification-bell-icon.has-notifications {
  color: #2196f3;
}

.notification-bell-icon.urgent-notifications {
  color: #f44336;
}

.notification-bell-icon.normal-notifications {
  color: #ff9800;
}

.notification-bell-icon.pulse-animation {
  animation: pulse 2s infinite;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(25%, -25%);
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.badge-urgent {
  background-color: #f44336 !important;
}

.badge-medium {
  background-color: #ff9800 !important;
}

.badge-low {
  background-color: #2196f3 !important;
}

.badge-count {
  color: white;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  padding: 0 2px;
}

.notification-urgent {
  border-left: 4px solid #f44336;
}

.notification-medium {
  border-left: 4px solid #ff9800;
}

.notification-low {
  border-left: 4px solid #2196f3;
}

.notification-unread {
  background-color: rgba(33, 150, 243, 0.05);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

/* Estilos específicos para el modal de mensaje */
.asunto-section .asunto-content {
  border-left: 4px solid #1976d2;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.message-content {
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 1rem;
  line-height: 1.8;
}

.metadata-content {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  max-height: 250px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.estado-section {
  border-top: 2px dashed #e0e0e0;
}

.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0 !important;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-details {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 600px) {
  .notification-bell-btn {
    width: 40px;
    height: 40px;
  }

  .notification-bell-icon {
    font-size: 20px;
  }

  .notification-badge {
    min-width: 16px;
    height: 16px;
  }

  .badge-count {
    font-size: 9px;
  }

  .text-truncate {
    max-width: 150px;
  }

  .asunto-content h2 {
    font-size: 1.25rem;
  }

  .message-content {
    font-size: 0.9rem;
    max-height: 300px;
  }
}

/* Scrollbars personalizados */
.message-content::-webkit-scrollbar,
.metadata-content::-webkit-scrollbar {
  width: 8px;
}

.message-content::-webkit-scrollbar-track,
.metadata-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.message-content::-webkit-scrollbar-thumb,
.metadata-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.message-content::-webkit-scrollbar-thumb:hover,
.metadata-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
