<template>
  <!-- Modal/Dialog para leer mensajes -->
  <v-dialog
    v-model="dialogVisible"
    :fullscreen="$vuetify.display.mobile"
    :max-width="dialogMaxWidth"
    :width="dialogWidth"
    persistent
    scrollable
    class="message-reader-dialog"
  >
    <v-card class="message-reader-card" :style="{ height: dialogHeight }">
      <!-- Encabezado del diálogo -->
      <v-toolbar color="primary" density="compact" class="message-reader-toolbar">
        <v-btn icon @click="closeDialog" size="small" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title class="text-body-1 font-weight-medium">
          <v-icon start size="18" :color="getPriorityColor(message?.prioridad)">
            {{ getPriorityIcon(message?.prioridad) }}
          </v-icon>
          {{ message?.asunto || 'Mensaje' }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Acciones rápidas en el encabezado -->
        <div class="d-flex align-center gap-1">
          <!--  <v-btn
            v-if="!message?.es_leido"
            icon
            size="small"
            @click="marcarComoLeida"
            title="Marcar como leída"
            variant="text"
          >
            <v-icon size="20">mdi-check</v-icon>
          </v-btn> -->

          <!-- <v-btn
            icon
            size="small"
            @click="toggleArchivar"
            :title="message?.estado === 'archivado' ? 'Desarchivar' : 'Archivar'"
            variant="text"
          >
            <v-icon size="20">
              {{ message?.estado === 'archivado' ? 'mdi-archive-arrow-up' : 'mdi-archive' }}
            </v-icon>
          </v-btn> -->

          <!-- <v-btn
            icon
            size="small"
            @click="toggleDestacar"
            :title="message?.destacado ? 'Quitar destacado' : 'Destacar'"
            variant="text"
            :color="message?.destacado ? 'warning' : undefined"
          >
            <v-icon size="20">
              {{ message?.destacado ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </v-btn> -->
          <!--
          <v-btn
            icon
            size="small"
            @click="eliminarMensaje"
            :title="message?.estado === 'eliminado' ? 'Recuperar' : 'Eliminar'"
            variant="text"
            color="error"
          >
            <v-icon size="20">
              {{ message?.estado === 'eliminado' ? 'mdi-delete-restore' : 'mdi-delete' }}
            </v-icon>
          </v-btn> -->

          <v-btn icon size="small" @click="closeDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <!-- Contenido del mensaje -->
      <v-card-text class="pa-0 message-content" :style="{ height: contentHeight }">
        <div v-if="loading" class="d-flex justify-center align-center py-12">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="message" class="message-details">
          <!-- Encabezado del mensaje -->
          <div class="message-header pa-4 border-bottom">
            <div class="d-flex justify-space-between align-start mb-3">
              <div class="d-flex align-center gap-3">
                <!-- Avatar del remitente -->
                <v-avatar
                  :color="getAvatarColor(message.remitente?.nombre_completo)"
                  size="56"
                  class="message-avatar"
                >
                  <span class="text-white text-h6">
                    {{ getIniciales(message.remitente?.nombre_completo) }}
                  </span>
                </v-avatar>

                <!-- Información del remitente -->
                <div>
                  <div class="d-flex align-center gap-2 mb-1">
                    <span class="text-h6 font-weight-bold">
                      {{ message.remitente?.nombre_completo || 'Sistema' }}
                    </span>
                    <v-chip
                      :color="getTipoColor(message.tipo)"
                      size="small"
                      density="comfortable"
                      class="type-chip"
                    >
                      {{ getTipoTexto(message.tipo) }}
                    </v-chip>
                  </div>

                  <div class="d-flex align-center gap-2 text-body-2 text-grey">
                    <v-icon size="16">mdi-email</v-icon>
                    <span>{{ message.remitente?.email || 'sistema@empresa.com' }}</span>
                    <v-divider vertical class="mx-2"></v-divider>
                    <v-icon size="16">mdi-account</v-icon>
                    <span>{{ message.remitente?.cargo || 'Sistema' }}</span>
                  </div>
                </div>
              </div>

              <!-- Información de fecha y estado -->
              <div class="text-right">
                <div class="text-body-2 text-grey mb-1">
                  <v-icon size="16" start>mdi-clock-outline</v-icon>
                  {{ formatDateTime(message.fecha_envio) }}
                </div>
                <div class="d-flex align-center justify-end gap-1">
                  <v-chip
                    v-if="message.prioridad >= 4"
                    color="error"
                    size="x-small"
                    density="compact"
                    class="priority-badge"
                  >
                    <v-icon size="12" start>mdi-alert</v-icon>
                    Urgente
                  </v-chip>
                  <v-chip v-if="!message.es_leido" color="primary" size="x-small" density="compact">
                    No leído
                  </v-chip>
                  <v-chip
                    v-if="message.estado === 'archivado'"
                    color="warning"
                    size="x-small"
                    density="compact"
                  >
                    <v-icon size="12" start>mdi-archive</v-icon>
                    Archivado
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Destinatarios (si los hay) -->
            <div v-if="message.destinatarios?.length > 0" class="mt-3">
              <div class="text-caption text-grey mb-1">
                <v-icon size="14" start>mdi-account-multiple</v-icon>
                Destinatarios:
              </div>
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="dest in message.destinatarios"
                  :key="dest.id"
                  size="x-small"
                  variant="outlined"
                  density="compact"
                  class="recipient-chip"
                >
                  {{ dest.nombre_completo }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Contenido principal del mensaje -->
          <div class="message-body pa-4">
            <!-- Asunto -->
            <div class="text-h5 font-weight-bold mb-4 message-subject">
              {{ message.asunto || 'Sin asunto' }}
            </div>

            <!-- Contenido del mensaje -->
            <div class="message-text mb-6" v-html="formatMessageContent(message.contenido)"></div>

            <!-- Archivos adjuntos -->
            <div v-if="message.adjuntos?.length > 0" class="attachments-section mb-6">
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex align-center gap-2 mb-3">
                <v-icon color="primary">mdi-paperclip</v-icon>
                <span class="text-body-1 font-weight-medium">Archivos adjuntos</span>
                <span class="text-caption text-grey">({{ message.adjuntos.length }})</span>
              </div>
              <div class="attachments-grid">
                <div
                  v-for="adjunto in message.adjuntos"
                  :key="adjunto.id"
                  class="attachment-item"
                  @click="descargarAdjunto(adjunto)"
                >
                  <v-card variant="outlined" class="attachment-card" hover>
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center gap-3">
                        <v-avatar
                          :color="getFileColor(adjunto.tipo)"
                          size="48"
                          rounded="0"
                          class="attachment-icon"
                        >
                          <v-icon color="white">
                            {{ getFileIcon(adjunto.tipo) }}
                          </v-icon>
                        </v-avatar>
                        <div class="flex-grow-1 min-width-0">
                          <div class="text-body-2 font-weight-medium text-truncate">
                            {{ adjunto.nombre }}
                          </div>
                          <div class="text-caption text-grey">
                            {{ formatFileSize(adjunto.tamano) }}
                            <v-divider vertical class="mx-2 d-inline"></v-divider>
                            {{ adjunto.tipo }}
                          </div>
                        </div>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          @click.stop="descargarAdjunto(adjunto)"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </div>

            <!-- Enlaces de acción -->
            <div v-if="message.accion_url" class="actions-section mb-6">
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex align-center gap-2 mb-3">
                <v-icon color="success">mdi-link-variant</v-icon>
                <span class="text-body-1 font-weight-medium">Acciones disponibles</span>
              </div>
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  :href="message.accion_url"
                  target="_blank"
                  prepend-icon="mdi-open-in-new"
                  variant="tonal"
                >
                  Ver acción relacionada
                </v-btn>
                <v-btn
                  v-if="message.tiene_accion"
                  color="success"
                  @click="marcarAccionCompletada"
                  prepend-icon="mdi-check"
                  variant="tonal"
                >
                  Marcar como completado
                </v-btn>
              </div>
            </div>

            <!-- Metadatos del mensaje -->
            <div class="metadata-section">
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex flex-wrap gap-4 text-caption text-grey">
                <div class="d-flex align-center gap-1">
                  <v-icon size="14">mdi-identifier</v-icon>
                  <span>ID: {{ message.id }}</span>
                </div>
                <div v-if="message.actividad_id" class="d-flex align-center gap-1">
                  <v-icon size="14">mdi-tasks</v-icon>
                  <span>Actividad: {{ message.actividad_id }}</span>
                </div>
                <div v-if="message.proyecto_id" class="d-flex align-center gap-1">
                  <v-icon size="14">mdi-briefcase</v-icon>
                  <span>Proyecto: {{ message.proyecto_id }}</span>
                </div>
                <div class="d-flex align-center gap-1">
                  <v-icon size="14">mdi-shield-check</v-icon>
                  <span>{{ message.es_urgente ? 'Urgente' : 'Normal' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío/error -->
        <div v-else class="text-center py-12">
          <v-icon size="96" color="grey-lighten-3">mdi-email-off</v-icon>
          <p class="text-h6 text-grey mt-4">No se pudo cargar el mensaje</p>
          <p class="text-body-1 text-grey mt-2">
            El mensaje solicitado no existe o no tienes permisos para verlo.
          </p>
          <v-btn color="primary" class="mt-4" @click="closeDialog"> Volver a la bandeja </v-btn>
        </div>
      </v-card-text>

      <!-- Pie del diálogo con acciones -->
      <v-card-actions class="pa-4 border-top message-actions">
        <div class="d-flex justify-space-between align-center w-100">
          <!-- Navegación entre mensajes -->
          <div class="d-flex align-center gap-2">
            <v-btn
              :disabled="!tieneAnterior"
              @click="mensajeAnterior"
              variant="text"
              prepend-icon="mdi-chevron-left"
              size="small"
            >
              Anterior
            </v-btn>
            <v-divider vertical></v-divider>
            <v-btn
              :disabled="!tieneSiguiente"
              @click="mensajeSiguiente"
              variant="text"
              append-icon="mdi-chevron-right"
              size="small"
            >
              Siguiente
            </v-btn>
          </div>

          <!-- Acciones principales -->
          <div class="d-flex align-center gap-2">
            <!--  <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-reply"
              size="small"
              @click="responderMensaje"
            >
              Responder
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-reply-all"
              size="small"
              @click="responderATodos"
            >
              Responder a todos
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-forward"
              size="small"
              @click="reenviarMensaje"
            >
              Reenviar
            </v-btn> -->
          </div>

          <!-- Acciones secundarias -->
          <div class="d-flex align-center gap-1">
            <v-btn icon size="small" variant="text" @click="imprimirMensaje" title="Imprimir">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" @click="copiarEnlace" title="Copiar enlace">
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" @click="exportarMensaje" title="Exportar">
              <v-icon>mdi-export</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNotificacionesStore } from '@/modules/notificacion/store/useNotificacionesStore'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  // Mensaje seleccionado para mostrar
  message: {
    type: Object,
    default: null,
  },

  // Lista de mensajes para navegación
  messages: {
    type: Array,
    default: () => [],
  },

  // Mostrar diálogo
  visible: {
    type: Boolean,
    default: false,
  },

  // Tamaño del diálogo
  maxWidth: {
    type: [String, Number],
    default: 900,
  },

  // Ancho del diálogo
  width: {
    type: [String, Number],
    default: '90%',
  },

  // Altura del diálogo
  height: {
    type: [String, Number],
    default: '85vh',
  },
})

const emit = defineEmits([
  'update:visible',
  'close',
  'mark-read',
  'archive',
  'delete',
  'reply',
  'reply-all',
  'forward',
  'previous',
  'next',
  'star',
  'action-completed',
])

// Estado
const dialogVisible = ref(props.visible)
const loading = ref(false)
const mensajesStore = useNotificacionesStore()
const { copy } = useClipboard()

// Computed properties
const tieneAnterior = computed(() => {
  if (!props.message || !props.messages.length) return false
  const index = props.messages.findIndex((m) => m.id === props.message.id)
  return index > 0
})

const tieneSiguiente = computed(() => {
  if (!props.message || !props.messages.length) return false
  const index = props.messages.findIndex((m) => m.id === props.message.id)
  return index < props.messages.length - 1
})

const dialogMaxWidth = computed(() => {
  if (typeof props.maxWidth === 'number') return `${props.maxWidth}px`
  return props.maxWidth
})

const dialogWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})

const dialogHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

const contentHeight = computed(() => {
  const height = dialogHeight.value
  if (typeof height === 'string' && height.includes('vh')) {
    const vh = parseInt(height)
    return `calc(${vh}vh - 120px)`
  }
  return `calc(${height} - 120px)`
})

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal && props.message) {
      marcarComoLeidaAutomaticamente()
    }
  },
)

watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit('update:visible', false)
    emit('close')
  }
})

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      marcarComoLeidaAutomaticamente()
    }
  },
)

// Métodos de utilidad
const getAvatarColor = (name) => {
  if (!name) return 'grey'
  const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

const getIniciales = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getTipoTexto = (tipo) => {
  if (!tipo) return 'General'

  const map = {
    reunion: 'Reunión',
    recordatorio: 'Recordatorio',
    social: 'Social',
    sistema: 'Sistema',
    administrativo: 'Administrativo',
    feedback: 'Feedback',
    comentario: 'Comentario',
    capacitacion: 'Capacitación',
    privado: 'Privado',
  }
  return map[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)
}

const getTipoColor = (tipo) => {
  const map = {
    reunion: 'blue',
    recordatorio: 'orange',
    social: 'pink',
    sistema: 'red',
    administrativo: 'grey',
    feedback: 'green',
    comentario: 'teal',
    capacitacion: 'purple',
    privado: 'indigo',
  }
  return map[tipo] || 'grey'
}

const getPriorityIcon = (prioridad) => {
  if (prioridad >= 4) return 'mdi-alert-circle'
  if (prioridad === 3) return 'mdi-alert'
  return 'mdi-information'
}

const getPriorityColor = (prioridad) => {
  if (prioridad >= 4) return 'error'
  if (prioridad === 3) return 'warning'
  return 'info'
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Fecha desconocida'

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Hoy a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays === 1) {
    return `Ayer a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: 'long' })} a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

const formatMessageContent = (content) => {
  if (!content) return '<p class="text-grey">Este mensaje no tiene contenido.</p>'

  // Convertir saltos de línea a <br>
  let formatted = content.replace(/\n/g, '<br>')

  // Convertir URLs a enlaces
  const urlRegex = /(https?:\/\/[^\s]+)/g
  formatted = formatted.replace(
    urlRegex,
    '<a href="$1" target="_blank" class="message-link">$1</a>',
  )

  // Asegurar que esté envuelto en párrafos
  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`
  }

  return formatted
}

const getFileIcon = (fileType) => {
  if (!fileType) return 'mdi-file'

  const type = fileType.toLowerCase()
  if (type.includes('pdf')) return 'mdi-file-pdf'
  if (type.includes('word') || type.includes('doc')) return 'mdi-file-word'
  if (type.includes('excel') || type.includes('xls')) return 'mdi-file-excel'
  if (type.includes('powerpoint') || type.includes('ppt')) return 'mdi-file-powerpoint'
  if (type.includes('image')) return 'mdi-file-image'
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'mdi-zip-box'
  if (type.includes('video')) return 'mdi-file-video'
  if (type.includes('audio')) return 'mdi-file-music'

  return 'mdi-file'
}

const getFileColor = (fileType) => {
  if (!fileType) return 'grey'

  const type = fileType.toLowerCase()
  if (type.includes('pdf')) return 'red'
  if (type.includes('word') || type.includes('doc')) return 'blue'
  if (type.includes('excel') || type.includes('xls')) return 'green'
  if (type.includes('powerpoint') || type.includes('ppt')) return 'orange'
  if (type.includes('image')) return 'purple'
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'amber'

  return 'grey'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// Acciones del mensaje
const closeDialog = () => {
  dialogVisible.value = false
}

const marcarComoLeidaAutomaticamente = () => {
  if (props.message && !props.message.es_leido) {
    setTimeout(() => {
      marcarComoLeida()
    }, 1000)
  }
}

const marcarComoLeida = async () => {
  if (!props.message) return

  try {
    await mensajesStore.marcarComoLeida(props.message.id)
    emit('mark-read', props.message.id)
  } catch (error) {
    console.error('Error al marcar como leída:', error)
  }
}

const toggleArchivar = async () => {
  if (!props.message) return

  try {
    if (props.message.estado === 'archivado') {
      await mensajesStore.restaurarNotificacion(props.message.id)
      emit('archive', { id: props.message.id, archived: false })
    } else {
      await mensajesStore.archivarNotificacion(props.message.id)
      emit('archive', { id: props.message.id, archived: true })
    }
  } catch (error) {
    console.error('Error al archivar/desarchivar:', error)
  }
}

// const toggleDestacar = async () => {
//   if (!props.message) return

//   try {
//     const destacado = !props.message.destacado
//     // Aquí deberías implementar la lógica para marcar como destacado
//     emit('star', { id: props.message.id, starred: destacado })
//   } catch (error) {
//     console.error('Error al destacar:', error)
//   }
// }

const eliminarMensaje = async () => {
  if (!props.message) return

  try {
    if (props.message.estado === 'eliminado') {
      await mensajesStore.restaurarNotificacion(props.message.id)
      emit('delete', { id: props.message.id, deleted: false })
    } else {
      await mensajesStore.eliminarNotificacion(props.message.id)
      emit('delete', { id: props.message.id, deleted: true })
    }
  } catch (error) {
    console.error('Error al eliminar/restaurar:', error)
  }
}

const responderMensaje = () => {
  if (!props.message) return
  emit('reply', props.message)
  closeDialog()
}

const responderATodos = () => {
  if (!props.message) return
  emit('reply-all', props.message)
  closeDialog()
}

const reenviarMensaje = () => {
  if (!props.message) return
  emit('forward', props.message)
  closeDialog()
}

const mensajeAnterior = () => {
  if (!tieneAnterior.value) return

  const index = props.messages.findIndex((m) => m.id === props.message.id)
  const previousMessage = props.messages[index - 1]
  emit('previous', previousMessage)
}

const mensajeSiguiente = () => {
  if (!tieneSiguiente.value) return

  const index = props.messages.findIndex((m) => m.id === props.message.id)
  const nextMessage = props.messages[index + 1]
  emit('next', nextMessage)
}

const descargarAdjunto = async (adjunto) => {
  try {
    // Aquí deberías implementar la lógica de descarga
    console.log('Descargando adjunto:', adjunto)
    // Simular descarga
    const link = document.createElement('a')
    link.href = adjunto.url || '#'
    link.download = adjunto.nombre
    link.click()
  } catch (error) {
    console.error('Error al descargar adjunto:', error)
  }
}

const marcarAccionCompletada = () => {
  if (!props.message) return
  emit('action-completed', props.message.id)
}

const imprimirMensaje = () => {
  window.print()
}

const copiarEnlace = async () => {
  try {
    const enlace = `${window.location.origin}/mensajes/${props.message.id}`
    await copy(enlace)
    // Mostrar notificación de éxito
    console.log('Enlace copiado al portapapeles')
  } catch (error) {
    console.error('Error al copiar enlace:', error)
  }
}

const exportarMensaje = () => {
  if (!props.message) return

  const mensajeData = {
    asunto: props.message.asunto,
    remitente: props.message.remitente?.nombre_completo,
    fecha: props.message.fecha_envio,
    contenido: props.message.contenido,
    tipo: props.message.tipo,
    prioridad: props.message.prioridad,
  }

  const blob = new Blob([JSON.stringify(mensajeData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mensaje-${props.message.id}.json`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.message-reader-dialog {
  z-index: 2500;
}

.message-reader-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-reader-toolbar {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.message-content {
  flex: 1;
  overflow-y: auto;
  background: #fafafa;
}

.message-details {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.message-header {
  background: white;
  flex-shrink: 0;
}

.message-body {
  flex: 1;
  overflow-y: auto;
}

.message-actions {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.message-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.type-chip {
  border-radius: 20px;
  font-weight: 500;
}

.priority-badge {
  border-radius: 12px;
}

.recipient-chip {
  border-radius: 12px;
}

.message-subject {
  color: #1976d2;
  line-height: 1.3;
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
  color: #424242;
}

.message-text :deep(.message-link) {
  color: #1976d2;
  text-decoration: none;
  border-bottom: 1px dotted #1976d2;
}

.message-text :deep(.message-link:hover) {
  text-decoration: underline;
}

.attachments-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.attachment-item {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.attachment-item:hover {
  transform: translateY(-2px);
}

.attachment-card {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.attachment-icon {
  border-radius: 8px;
}

.metadata-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

/* Responsive */
@media (max-width: 960px) {
  .message-reader-card {
    height: 100vh !important;
  }

  .message-content {
    height: calc(100vh - 112px) !important;
  }

  .attachments-grid {
    grid-template-columns: 1fr;
  }

  .message-actions > div {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .message-actions > div > div {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .message-header {
    padding: 16px !important;
  }

  .message-body {
    padding: 16px !important;
  }

  .message-subject {
    font-size: 18px !important;
  }

  .message-text {
    font-size: 14px;
  }

  .actions-section .d-flex {
    flex-direction: column;
    gap: 8px;
  }

  .actions-section .v-btn {
    width: 100%;
  }
}
</style>
