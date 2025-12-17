<template>
  <v-dialog v-model="dialogVisible" max-width="700px" persistent>
    <v-card>
      <!-- Encabezado -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 bg-primary">
        <div class="d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-email</v-icon>
          <span class="text-h6 text-white">Nuevo Mensaje</span>
        </div>
        <v-btn icon color="white" variant="text" @click="cerrar" size="small">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Formulario -->
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formValido" @submit.prevent="enviarMensaje">
          <!-- Remitente (solo lectura) -->
          <div class="mb-4">
            <div class="text-body-2 text-grey mb-1">De:</div>
            <div class="d-flex align-center pa-2 bg-grey-lighten-3 rounded">
              <v-avatar size="32" :color="getAvatarColor(remitenteNombre)" class="mr-2">
                <span class="text-white text-caption">
                  {{ getIniciales(remitenteNombre) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ remitenteNombre }}</div>
                <div class="text-caption text-grey">{{ usuarioStore.email }}</div>
              </div>
            </div>
          </div>

          <!-- Destinatario -->
          <v-autocomplete
            v-model="destinatarioId"
            :items="usuariosDisponibles"
            item-title="nombre_completo"
            item-value="id"
            label="Para"
            placeholder="Buscar destinatario..."
            variant="outlined"
            density="comfortable"
            :rules="[reglas.requerido]"
            class="mb-4"
            multiple
            clearable
            chips
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar :color="getAvatarColor(item.raw.nombre_completo)" size="30">
                    <span class="text-white">
                      {{ getIniciales(item.raw.nombre_completo) }}
                    </span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ item.raw.nombre_completo }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.raw.email || item.raw.username }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <!-- Asunto -->
          <v-text-field
            v-model="formulario.asunto"
            label="Asunto"
            placeholder="Escribe el asunto del mensaje"
            variant="outlined"
            density="comfortable"
            :rules="[reglas.requerido, reglas.maximoCaracteres(200)]"
            class="mb-4"
          ></v-text-field>

          <!-- Tipo y Prioridad -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6">
              <v-select
                v-model="formulario.tipo"
                :items="SELECT_OPTIONS_MENSAJES.tipo"
                label="Tipo de mensaje"
                variant="outlined"
                density="comfortable"
                item-title="title"
                item-value="value"
                :rules="[reglas.requerido]"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :color="getIconoColor(item.value)" class="mr-2">
                        {{ getIconoTipo(item.value) }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formulario.prioridad"
                :items="SELECT_OPTIONS_MENSAJES.prioridad"
                label="Prioridad"
                variant="outlined"
                density="comfortable"
                item-title="title"
                item-value="value"
                :rules="[reglas.requerido]"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :color="getPrioridadColor(item.value)" class="mr-2">
                        {{ getPrioridadIcono(item.value) }}
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon :color="getPrioridadColor(item.value)" size="small" class="mr-2">
                      {{ getPrioridadIcono(item.value) }}
                    </v-icon>
                    {{ item.title }}
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- Contenido con emojis -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-1 font-weight-medium">Mensaje</span>
              <div class="d-flex align-center gap-1">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="mostrarSelectorEmojis = !mostrarSelectorEmojis"
                  :title="mostrarSelectorEmojis ? 'Ocultar emojis' : 'Mostrar emojis'"
                >
                  <v-icon size="18">mdi-emoticon</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="limpiarContenido"
                  title="Limpiar contenido"
                >
                  <v-icon size="18">mdi-close-circle</v-icon>
                </v-btn>
              </div>
            </div>

            <!-- Selector de emojis (expandible) -->
            <v-expand-transition>
              <div v-if="mostrarSelectorEmojis" class="mb-3 pa-3 bg-grey-lighten-4 rounded">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-caption text-grey">Selecciona un emoji:</div>
                  <v-text-field
                    v-model="filtroEmoji"
                    placeholder="Buscar emoji..."
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="filtro-emoji"
                    clearable
                  ></v-text-field>
                </div>
                <div class="emojis-grid">
                  <v-btn
                    v-for="emoji in emojisFiltrados"
                    :key="emoji"
                    icon
                    size="small"
                    variant="text"
                    @click="insertarEmoji(emoji)"
                    class="emoji-btn"
                    :title="emoji"
                  >
                    {{ emoji }}
                  </v-btn>
                </div>
                <div class="text-right text-caption text-grey mt-2">
                  {{ emojisFiltrados.length }} emojis
                </div>
              </div>
            </v-expand-transition>

            <v-textarea
              v-model="formulario.contenido"
              label="Escribe tu mensaje aquí..."
              variant="outlined"
              auto-grow
              rows="6"
              :rules="[reglas.requerido, reglas.maximoCaracteres(5000)]"
              class="mb-2"
              ref="textareaRef"
            ></v-textarea>

            <!-- Contador de caracteres -->
            <div class="text-right text-caption text-grey mb-4">
              {{ formulario.contenido?.length || 0 }} / 5000 caracteres
            </div>
          </div>

          <!-- Mensajes de error/success -->
          <v-alert v-if="mensajeError" type="error" variant="tonal" density="compact" class="mb-4">
            {{ mensajeError }}
          </v-alert>

          <v-alert
            v-if="mensajeSuccess"
            type="success"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ mensajeSuccess }}
          </v-alert>
        </v-form>
      </v-card-text>

      <!-- Acciones -->
      <v-card-actions class="pa-4 border-top">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="cerrar" :disabled="enviando"> Cancelar </v-btn>
        <v-btn
          color="primary"
          @click="enviarMensaje"
          :loading="enviando"
          :disabled="!formValido || !destinatarioId"
        >
          <v-icon start>mdi-send</v-icon>
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// Opciones de selección (como las proporcionaste)
const SELECT_OPTIONS_MENSAJES = {
  tipo: [
    { title: 'PRIVADO', value: 'privado' },
    { title: 'SISTEMA', value: 'sistema' },
    { title: 'ALERTA', value: 'alerta' },
    { title: 'RECORDATORIO', value: 'recordatorio' },
    { title: 'REPROGRAMACION', value: 'reprogramacion' },
    { title: 'RETRASO', value: 'retraso' },
  ],
  prioridad: [
    { title: 'Baja', value: 1 },
    { title: 'Media', value: 3 },
    { title: 'Alta', value: 4 },
  ],
}

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'enviado', 'cancelado'])

// Store
const usuarioStore = useUserStore()

// Referencias
const formRef = ref(null)
const textareaRef = ref(null)

// Estado
const dialogVisible = ref(props.modelValue)
const formValido = ref(false)
const enviando = ref(false)
const destinatarioId = ref(null)
const mostrarSelectorEmojis = ref(false)
const filtroEmoji = ref('')
const mensajeError = ref(null)
const mensajeSuccess = ref(null)

// Formulario
const formulario = ref({
  asunto: '',
  contenido: '',
  tipo: 'privado', // Valor por defecto
  prioridad: 3, // Media por defecto
})

// Emojis disponibles (categorizados)
const categoriasEmojis = ref({
  caritas: ['😊', '😂', '😎', '🥰', '😍', '🤩', '😜', '🤪', '🥳', '😇'],
  emociones: ['😢', '😡', '😮', '😴', '🤢', '😷', '😈', '👻', '💀', '👽'],
  acciones: ['👍', '👏', '🙌', '🤝', '🙏', '✌️', '🤞', '🤟', '💪', '👊'],
  objetos: ['💡', '📅', '📝', '📎', '🔔', '📱', '💻', '📚', '🎯', '🎉'],
  simbolos: ['❤️', '⭐', '🔥', '✨', '💯', '✅', '❌', '⚠️', '🔄', '⏰'],
  naturaleza: ['🌞', '🌙', '⭐', '🌈', '🌺', '🌳', '🐶', '🐱', '🐼', '🦄'],
  comida: ['🍎', '🍕', '🍔', '🍦', '🍩', '☕', '🍷', '🍺', '🥗', '🍣'],
  transporte: ['🚗', '✈️', '🚀', '🚲', '🛵', '🚂', '🚁', '🛸', '🚤', '🛶'],
  banderas: ['🇺🇸', '🇪🇸', '🇲🇽', '🇨🇱', '🇦🇷', '🇨🇴', '🇧🇷', '🇬🇧', '🇫🇷', '🇩🇪'],
  misc: ['🎁', '🏆', '💎', '💰', '💵', '💳', '📈', '📉', '🔒', '🔑'],
})

// Computed
const remitenteNombre = computed(() => {
  return usuarioStore.nombreCompleto || usuarioStore.username || 'Usuario'
})

const usuariosDisponibles = computed(() => {
  if (!usuarioStore.listaUsuarios) return []

  // Excluir al usuario actual
  return usuarioStore.listaUsuarios.filter(
    (usuario) => usuario.id !== usuarioStore.id && usuario.is_active !== false,
  )
})

const emojisDisponibles = computed(() => {
  return Object.values(categoriasEmojis.value).flat()
})

const emojisFiltrados = computed(() => {
  if (!filtroEmoji.value) return emojisDisponibles.value

  const filtro = filtroEmoji.value.toLowerCase()
  return emojisDisponibles.value.filter(
    (emoji) =>
      emoji.toLowerCase().includes(filtro) ||
      getDescripcionEmoji(emoji).toLowerCase().includes(filtro),
  )
})

// Reglas de validación
const reglas = {
  requerido: (value) => !!value || 'Este campo es requerido',
  maximoCaracteres: (max) => (value) => !value || value.length <= max || `Máximo ${max} caracteres`,
}

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      inicializarFormulario()
    }
  },
)

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// Métodos
const inicializarFormulario = async () => {
  // Resetear estados
  mensajeError.value = null
  mensajeSuccess.value = null
  enviando.value = false
  destinatarioId.value = null
  mostrarSelectorEmojis.value = false
  filtroEmoji.value = ''

  // Resetear formulario con valores por defecto
  formulario.value = {
    asunto: '',
    contenido: '',
    tipo: 'privado',
    prioridad: 3, // Media
  }

  // Cargar usuarios si no están cargados
  if (!usuarioStore.listaUsuarios) {
    await cargarUsuarios()
  }
}

const cargarUsuarios = async () => {
  try {
    await usuarioStore.cargarListaUsuarios()
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    mostrarError('No se pudieron cargar los usuarios')
  }
}

const cerrar = () => {
  dialogVisible.value = false
  emit('cancelado')
}

const mostrarError = (mensaje) => {
  mensajeError.value = mensaje
  setTimeout(() => {
    mensajeError.value = null
  }, 5000)
}

const mostrarSuccess = (mensaje) => {
  mensajeSuccess.value = mensaje
  setTimeout(() => {
    mensajeSuccess.value = null
  }, 5000)
}

const limpiarContenido = () => {
  formulario.value.contenido = ''
}

const insertarEmoji = (emoji) => {
  const textarea = textareaRef.value
  if (textarea) {
    const start = textarea.$el.querySelector('textarea').selectionStart
    const end = textarea.$el.querySelector('textarea').selectionEnd

    const texto = formulario.value.contenido
    formulario.value.contenido = texto.substring(0, start) + emoji + texto.substring(end)

    // Enfocar y poner cursor después del emoji
    setTimeout(() => {
      textarea.$el.querySelector('textarea').focus()
      textarea.$el
        .querySelector('textarea')
        .setSelectionRange(start + emoji.length, start + emoji.length)
    }, 10)
  } else {
    formulario.value.contenido += emoji
  }
}

const validarFormulario = async () => {
  if (!formRef.value) return false

  const { valid } = await formRef.value.validate()

  if (!valid) {
    mostrarError('Por favor, complete todos los campos requeridos')
    return false
  }

  if (!destinatarioId.value) {
    mostrarError('Debe seleccionar un destinatario')
    return false
  }

  return true
}

const enviarMensaje = async () => {
  const esValido = await validarFormulario()
  if (!esValido) return

  enviando.value = true
  mensajeError.value = null
  mensajeSuccess.value = null

  try {
    // Preparar datos del mensaje según lo que espera tu API
    const datosMensaje = {
      destinatario_id: destinatarioId.value,
      asunto: formulario.value.asunto.trim(),
      contenido: formulario.value.contenido.trim(),
      tipo: formulario.value.tipo,
      prioridad: formulario.value.prioridad,
    }

    console.log('Enviando mensaje:', datosMensaje)

    // Enviar mensaje (ajusta según tu API)
    const response = await fetch('/api/mensajes/enviar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${usuarioStore.accessToken}`,
      },
      body: JSON.stringify(datosMensaje),
    })

    const data = await response.json()

    //Comprobar el envio

    // if (response.ok && data.success) {
    //   mostrarSuccess('¡Mensaje enviado exitosamente!')

    //   // Limpiar formulario
    //   formulario.value = { asunto: '', contenido: '', tipo: 'privado', prioridad: 3 }
    //   destinatarioId.value = null

    //   // Cerrar diálogo después de 1.5 segundos
    //   setTimeout(() => {
    //     dialogVisible.value = false
    //     emit('enviado', data)
    //   }, 1500)
    // } else {
    //   mostrarError(data.error || 'Error al enviar el mensaje')
    // }
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    mostrarError('Error de conexión. Intenta nuevamente.')
  } finally {
    enviando.value = false
  }
}

// Funciones de utilidad para iconos y colores
const getIconoTipo = (tipo) => {
  const iconos = {
    privado: 'mdi-email',
    sistema: 'mdi-cog',
    alerta: 'mdi-alert',
    recordatorio: 'mdi-bell',
    reprogramacion: 'mdi-calendar-sync',
    retraso: 'mdi-clock-alert',
  }
  return iconos[tipo] || 'mdi-email'
}

const getIconoColor = (tipo) => {
  const colores = {
    privado: 'blue',
    sistema: 'grey',
    alerta: 'red',
    recordatorio: 'amber',
    reprogramacion: 'green',
    retraso: 'orange',
  }
  return colores[tipo] || 'blue'
}

const getPrioridadIcono = (prioridad) => {
  const iconos = {
    1: 'mdi-arrow-down-thin', // Baja
    3: 'mdi-minus', // Media
    4: 'mdi-arrow-up-thin', // Alta
  }
  return iconos[prioridad] || 'mdi-minus'
}

const getPrioridadColor = (prioridad) => {
  const colores = {
    1: 'green', // Baja
    3: 'amber', // Media
    4: 'red', // Alta
  }
  return colores[prioridad] || 'amber'
}

const getDescripcionEmoji = (emoji) => {
  // Descripciones básicas para búsqueda
  const descripciones = {
    '😊': 'cara sonriente',
    '😂': 'cara llorando de risa',
    '❤️': 'corazón rojo',
    '👍': 'pulgar arriba',
    '😎': 'cara con lentes de sol',
    '🎉': 'confeti',
    '🔥': 'fuego',
    '⭐': 'estrella',
    // Agrega más descripciones según necesites
  }
  return descripciones[emoji] || ''
}

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

// Inicialización
onMounted(() => {
  if (dialogVisible.value) {
    inicializarFormulario()
  }
})
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

.emojis-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.emoji-btn {
  font-size: 20px;
  width: 32px;
  height: 32px;
  min-width: 32px !important;
  min-height: 32px !important;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.emoji-btn:hover {
  transform: scale(1.2);
  background-color: rgba(0, 0, 0, 0.1);
}

.filtro-emoji {
  max-width: 200px;
}

/* Scroll personalizado para la grilla de emojis */
.emojis-grid::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.emojis-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.emojis-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.emojis-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 600px) {
  .emojis-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
