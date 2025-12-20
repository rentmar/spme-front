<template>
  <v-dialog v-model="dialogVisible" max-width="800px" persistent scrollable>
    <v-card>
      <!-- Encabezado del diálogo -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 bg-primary">
        <div class="d-flex align-center">
          <v-icon color="white" size="28" class="mr-2">{{ iconoTitulo }}</v-icon>
          <span class="text-h6 text-white">{{ tituloDialogo }}</span>
        </div>
        <v-btn icon color="white" variant="text" @click="cerrar" size="small">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Formulario de mensaje -->
      <v-card-text class="pa-0">
        <v-form
          ref="formRef"
          v-model="formValido"
          @submit.prevent="enviarMensaje"
          class="message-form"
        >
          <!-- Contenido principal -->
          <div class="pa-4">
            <!-- Destinatarios (Múltiple) -->
            <div class="mb-4">
              <div class="d-flex align-center mb-2">
                <span class="text-body-1 font-weight-medium mr-2">Para:</span>
                <v-chip
                  v-for="destinatario in destinatariosSeleccionados"
                  :key="destinatario.id"
                  closable
                  @click:close="removerDestinatario(destinatario)"
                  size="small"
                  class="mr-1 mb-1"
                  color="primary"
                  variant="outlined"
                >
                  <v-avatar
                    size="20"
                    :color="getAvatarColor(destinatario.nombre_completo)"
                    class="mr-1"
                  >
                    <span class="text-white text-caption">
                      {{ getIniciales(destinatario.nombre_completo) }}
                    </span>
                  </v-avatar>
                  {{ destinatario.nombre_completo }}
                </v-chip>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="mostrarSelectorDestinatarios = !mostrarSelectorDestinatarios"
                  class="ml-1"
                >
                  <v-icon size="18">
                    {{ mostrarSelectorDestinatarios ? 'mdi-minus' : 'mdi-plus' }}
                  </v-icon>
                </v-btn>
              </div>

              <!-- Contador de destinatarios -->
              <div class="text-caption text-grey mb-2">
                {{ destinatariosSeleccionados.length }} destinatario(s) seleccionado(s)
              </div>

              <!-- Selector de múltiples destinatarios -->
              <v-expand-transition>
                <div v-if="mostrarSelectorDestinatarios" class="mb-4">
                  <v-autocomplete
                    v-model="destinatarioBusqueda"
                    :items="usuariosFiltrados"
                    :loading="cargandoUsuarios"
                    item-title="nombre_completo"
                    item-value="id"
                    label="Buscar destinatarios..."
                    placeholder="Escribe para buscar usuarios"
                    variant="outlined"
                    density="comfortable"
                    chips
                    multiple
                    clearable
                    class="destinatarios-select"
                  >
                    <template #chip="{ props, item }">
                      <v-chip
                        v-bind="props"
                        :color="getAvatarColor(item.raw.nombre_completo)"
                        variant="outlined"
                      >
                        <v-avatar
                          size="20"
                          :color="getAvatarColor(item.raw.nombre_completo)"
                          class="mr-1"
                        >
                          <span class="text-white text-caption">
                            {{ getIniciales(item.raw.nombre_completo) }}
                          </span>
                        </v-avatar>
                        {{ item.raw.nombre_completo }}
                      </v-chip>
                    </template>
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-checkbox
                            :model-value="
                              destinatariosSeleccionados.some((d) => d.id === item.raw.id)
                            "
                            @click.stop="toggleDestinatario(item.raw)"
                            dense
                            hide-details
                          ></v-checkbox>
                        </template>
                        <template #append>
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
                </div>
              </v-expand-transition>
            </div>

            <!-- Asunto -->
            <v-text-field
              v-model="formulario.asunto"
              label="Asunto"
              placeholder="Escribe el asunto del mensaje"
              variant="outlined"
              density="comfortable"
              :rules="[reglas.requerido, reglas.maximoCaracteres(200)]"
              class="mb-4"
              clearable
            ></v-text-field>

            <!-- Contenido del mensaje -->
            <div class="mb-4">
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-body-1 font-weight-medium">Mensaje</span>
                <div class="d-flex align-center gap-1">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click="insertarEmoji"
                    title="Insertar emoji"
                  >
                    <v-icon size="18">mdi-emoticon</v-icon>
                  </v-btn>
                  <v-btn icon size="small" variant="text" @click="limpiarContenido" title="Limpiar">
                    <v-icon size="18">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-textarea
                v-model="formulario.contenido"
                label="Escribe tu mensaje aquí..."
                variant="outlined"
                auto-grow
                rows="8"
                :rules="[reglas.requerido, reglas.maximoCaracteres(5000)]"
                class="editor-mensaje"
                @keydown.ctrl.enter="enviarMensaje"
              >
                <template #append>
                  <div class="d-flex align-center gap-1">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" color="grey" size="small" class="mr-1">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Ctrl + Enter para enviar</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-textarea>

              <div class="text-right text-caption text-grey mt-1">
                {{ formulario.contenido?.length || 0 }} / 5000 caracteres
              </div>
            </div>

            <!-- Tipo y Prioridad -->
            <div class="mb-4">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formulario.tipo"
                    :items="tiposMensaje"
                    label="Tipo de mensaje"
                    variant="outlined"
                    density="compact"
                    item-title="title"
                    item-value="value"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formulario.prioridad"
                    :items="opcionesPrioridad"
                    label="Prioridad"
                    variant="outlined"
                    density="compact"
                    item-title="title"
                    item-value="value"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </div>

            <!-- Mensajes de estado -->
            <v-alert
              v-if="mensajeConfirmacion"
              :type="tipoMensajeConfirmacion"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ mensajeConfirmacion }}
            </v-alert>

            <v-alert
              v-if="errorMensaje"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ errorMensaje }}
            </v-alert>

            <!-- Resultado del envío (mostrar después de enviar) -->
            <div v-if="resultadoEnvio" class="mb-4">
              <v-alert
                :type="resultadoEnvio.success ? 'success' : 'warning'"
                variant="tonal"
                class="mb-2"
              >
                <!-- <strong>{{ resultadoEnvio.message }}</strong>
                <div class="text-caption mt-1">
                  Total enviados: {{ resultadoEnvio.total_enviados }} | Errores:
                  {{ resultadoEnvio.total_errores }}
                </div> -->
              </v-alert>

              <!-- Detalles del envío -->
              <v-expansion-panels
                v-if="resultadoEnvio.mensajes_creados?.length"
                variant="accordion"
              >
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <template #default="{ expanded }">
                      <v-row no-gutters>
                        <v-col cols="4" class="d-flex align-center">
                          <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                          <span class="ml-2">Detalles del envío</span>
                        </v-col>
                        <v-col cols="8" class="text--secondary text-right">
                          {{ resultadoEnvio.mensajes_creados.length }} mensaje(s) creado(s)
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list density="compact" class="bg-transparent">
                      <v-list-item
                        v-for="mensaje in resultadoEnvio.mensajes_creados"
                        :key="mensaje.message_id"
                      >
                        <template #prepend>
                          <v-icon color="success" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title>
                          {{ mensaje.destinatario_username }}
                        </v-list-item-title>
                        <v-list-item-subtitle> ID: {{ mensaje.message_id }} </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Errores -->
              <v-alert
                v-if="resultadoEnvio.errores?.length"
                type="warning"
                variant="tonal"
                class="mt-2"
              >
                <div class="font-weight-medium mb-1">
                  Algunos destinatarios no recibieron el mensaje:
                </div>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item v-for="error in resultadoEnvio.errores" :key="error.destinatario_id">
                    <template #prepend>
                      <v-icon color="warning" size="small">mdi-alert</v-icon>
                    </template>
                    <v-list-item-title> Usuario ID: {{ error.destinatario_id }} </v-list-item-title>
                    <v-list-item-subtitle> Error: {{ error.error }} </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-alert>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <!-- Acciones del diálogo -->
      <v-card-actions class="pa-4 border-top">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="cerrar" class="mr-2" :disabled="enviando">
          {{ resultadoEnvio ? 'Cerrar' : 'Cancelar' }}
        </v-btn>
        <v-btn
          v-if="!resultadoEnvio"
          color="primary"
          @click="enviarMensaje"
          :loading="enviando"
          :disabled="!formValido || destinatariosSeleccionados.length === 0"
        >
          <v-icon start>mdi-send</v-icon>
          {{ botonEnviarTexto }}
          <template #loader>
            <span class="d-flex align-center">
              Enviando...
              <v-progress-circular
                indeterminate
                size="16"
                width="2"
                class="ml-2"
              ></v-progress-circular>
            </span>
          </template>
        </v-btn>
        <v-btn
          v-if="resultadoEnvio && resultadoEnvio.total_enviados > 0"
          color="secondary"
          @click="enviarOtroMensaje"
          class="mr-2"
        >
          <v-icon start>mdi-plus</v-icon>
          Nuevo mensaje
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para emojis -->
  <v-dialog v-model="mostrarSelectorEmojis" max-width="400px">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">Seleccionar emoji</span>
        <v-btn icon size="small" variant="text" @click="mostrarSelectorEmojis = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="emojis-grid">
          <v-btn
            v-for="emoji in emojisDisponibles"
            :key="emoji"
            icon
            size="large"
            variant="text"
            @click="insertarEmojiSeleccionado(emoji)"
            class="emoji-btn"
          >
            {{ emoji }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificaciones } from '../composables/useNotificaciones'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  modo: {
    type: String,
    default: 'nuevo',
    validator: (value) => ['nuevo', 'responder', 'reenviar', 'editar'].includes(value),
  },
  mensajeOriginal: {
    type: Object,
    default: null,
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'enviado', 'cancelado', 'guardado'])

// Stores
const usuarioStore = useUserStore()

//Iniciar el composable
const { enviarMensajeMultiple } = useNotificaciones()

// Referencias
const formRef = ref(null)

// Estado del diálogo
const dialogVisible = ref(props.modelValue)

// Estados del formulario
const formValido = ref(false)
const formulario = ref({
  asunto: '',
  contenido: '',
  tipo: 'normal', // Tipo por defecto
  prioridad: 2, // Prioridad por defecto (Media)
})

// Estados para destinatarios (ahora múltiples)
const destinatariosSeleccionados = ref([])
const destinatarioBusqueda = ref(null)
const mostrarSelectorDestinatarios = ref(true)

// Estados para emojis
const mostrarSelectorEmojis = ref(false)

// Estados de carga y error
const enviando = ref(false)
const cargandoUsuarios = ref(false)
const errorMensaje = ref(null)
const mensajeConfirmacion = ref(null)
const tipoMensajeConfirmacion = ref('info')

// Resultado del envío
const resultadoEnvio = ref(null)

// Tipos de mensaje
const tiposMensaje = ref([
  { title: 'Normal Mensaje', value: 'privado' },
  { title: 'Sistema', value: 'sistema' },
  { title: 'Alerta', value: 'alerta' },
  { title: 'Recordatorio', value: 'recortatorio' },
  { title: 'Reprogramacion', value: 'reprogramacion' },
  { title: 'Retraso', value: 'retraso' },
])

// Opciones de prioridad - CORREGIDO
const opcionesPrioridad = ref([
  {
    title: 'Baja',
    value: 1,
  },
  {
    title: 'Media',
    value: 2,
  },
  {
    title: 'Alta',
    value: 3,
  },
])

// Computed properties
const tituloDialogo = computed(() => {
  const titulos = {
    nuevo: 'Nuevo Mensaje',
    responder: 'Responder Mensaje',
    reenviar: 'Reenviar Mensaje',
    editar: 'Editar Mensaje',
  }
  return titulos[props.modo] || 'Mensaje'
})

const iconoTitulo = computed(() => {
  const iconos = {
    nuevo: 'mdi-email-plus',
    responder: 'mdi-reply',
    reenviar: 'mdi-share-variant',
    editar: 'mdi-pencil',
  }
  return iconos[props.modo] || 'mdi-email'
})

const botonEnviarTexto = computed(() => {
  const textos = {
    nuevo: `Enviar (${destinatariosSeleccionados.value.length})`,
    responder: `Enviar respuesta (${destinatariosSeleccionados.value.length})`,
    reenviar: `Reenviar (${destinatariosSeleccionados.value.length})`,
    editar: 'Guardar cambios',
  }
  return textos[props.modo] || `Enviar (${destinatariosSeleccionados.value.length})`
})

const usuariosDisponibles = computed(() => {
  if (!usuarioStore.listaUsuarios) return []

  // Filtrar usuario actual
  return usuarioStore.listaUsuarios.filter(
    (usuario) => usuario.id !== usuarioStore.id && usuario.is_active !== false,
  )
})

const usuariosFiltrados = computed(() => {
  const usuariosYaSeleccionados = destinatariosSeleccionados.value.map((d) => d.id)

  let usuarios = usuariosDisponibles.value.filter(
    (usuario) => !usuariosYaSeleccionados.includes(usuario.id),
  )

  if (!destinatarioBusqueda.value) return usuarios

  const query = destinatarioBusqueda.value.toString().toLowerCase()
  return usuarios.filter(
    (usuario) =>
      usuario.nombre_completo?.toLowerCase().includes(query) ||
      usuario.username?.toLowerCase().includes(query) ||
      usuario.email?.toLowerCase().includes(query) ||
      usuario.cargo?.toLowerCase().includes(query),
  )
})

// Emojis disponibles
const emojisDisponibles = ref([
  '😊',
  '😂',
  '❤️',
  '👍',
  '😎',
  '🎉',
  '🔥',
  '⭐',
  '🙏',
  '🤔',
  '😢',
  '😡',
  '🎯',
  '💡',
  '🚀',
  '📈',
  '✅',
  '❌',
  '⚠️',
  '💯',
  '🤝',
  '👏',
  '🙌',
  '🎊',
  '📅',
  '📝',
  '📎',
  '🔔',
  '💬',
  '👥',
  '🏆',
  '✨',
])

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
  resultadoEnvio.value = null
  mensajeConfirmacion.value = null
  errorMensaje.value = null

  // Cargar usuarios si no están cargados
  if (!usuarioStore.listaUsuarios) {
    await cargarUsuarios()
  }

  // Resetear formulario
  formulario.value = {
    asunto: '',
    contenido: '',
    tipo: 'privado',
    prioridad: 2, // Prioridad media por defecto
  }

  destinatariosSeleccionados.value = []
  destinatarioBusqueda.value = null
  mostrarSelectorDestinatarios.value = true
  enviando.value = false

  // Si hay mensaje original, configurar según modo
  if (props.mensajeOriginal) {
    switch (props.modo) {
      case 'responder':
        formulario.value.asunto = `Re: ${props.mensajeOriginal.asunto}`
        formulario.value.contenido = `\n\n--- Mensaje original ---\n${props.mensajeOriginal.contenido}`
        // Seleccionar remitente como destinatario
        if (props.mensajeOriginal.remitente) {
          const remitenteId = props.mensajeOriginal.remitente.id
          const usuario = usuariosDisponibles.value.find((u) => u.id === remitenteId)
          if (usuario) {
            agregarDestinatario(usuario)
          }
        }
        break

      case 'reenviar':
        formulario.value.asunto = `Fw: ${props.mensajeOriginal.asunto}`
        formulario.value.contenido = `\n\n--- Mensaje reenviado ---\n${props.mensajeOriginal.contenido}`
        break

      case 'editar':
        formulario.value.asunto = props.mensajeOriginal.asunto
        formulario.value.contenido = props.mensajeOriginal.contenido
        formulario.value.prioridad = props.mensajeOriginal.prioridad || 2
        formulario.value.tipo = props.mensajeOriginal.tipo || 'normal'

        // Seleccionar destinatario original
        if (props.mensajeOriginal.destinatario) {
          const destinatarioId = props.mensajeOriginal.destinatario.id
          const usuario = usuariosDisponibles.value.find((u) => u.id === destinatarioId)
          if (usuario) {
            agregarDestinatario(usuario)
          }
        }
        break
    }
  }
}

const cargarUsuarios = async () => {
  if (usuarioStore.listaUsuarios) return

  cargandoUsuarios.value = true
  try {
    await usuarioStore.cargarListaUsuarios()
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    mostrarMensajeConfirmacion('No se pudieron cargar los usuarios', 'error')
  } finally {
    cargandoUsuarios.value = false
  }
}

const agregarDestinatario = (usuario) => {
  if (!destinatariosSeleccionados.value.some((d) => d.id === usuario.id)) {
    destinatariosSeleccionados.value.push(usuario)
    destinatarioBusqueda.value = null
    mostrarMensajeConfirmacion(`Destinatario agregado: ${usuario.nombre_completo}`, 'success')
  }
}

const removerDestinatario = (usuario) => {
  destinatariosSeleccionados.value = destinatariosSeleccionados.value.filter(
    (d) => d.id !== usuario.id,
  )
  mostrarMensajeConfirmacion(`Destinatario eliminado: ${usuario.nombre_completo}`, 'info')
}

const toggleDestinatario = (usuario) => {
  const existe = destinatariosSeleccionados.value.some((d) => d.id === usuario.id)
  if (existe) {
    removerDestinatario(usuario)
  } else {
    agregarDestinatario(usuario)
  }
}

const insertarEmoji = () => {
  mostrarSelectorEmojis.value = true
}

const insertarEmojiSeleccionado = (emoji) => {
  if (!formulario.value.contenido) {
    formulario.value.contenido = emoji
  } else {
    formulario.value.contenido += emoji
  }
  mostrarSelectorEmojis.value = false
}

const limpiarContenido = () => {
  formulario.value.contenido = ''
}

const cerrar = () => {
  dialogVisible.value = false
  emit('cancelado')
}

const validarFormulario = async () => {
  if (!formRef.value) return false

  const { valid } = await formRef.value.validate()

  if (!valid) {
    mostrarMensajeConfirmacion('Por favor, complete todos los campos requeridos', 'error')
    return false
  }

  if (destinatariosSeleccionados.value.length === 0) {
    mostrarMensajeConfirmacion('Debe seleccionar al menos un destinatario', 'error')
    return false
  }

  return true
}

const mostrarMensajeConfirmacion = (mensaje, tipo = 'info') => {
  mensajeConfirmacion.value = mensaje
  tipoMensajeConfirmacion.value = tipo

  // Limpiar mensaje después de 5 segundos
  setTimeout(() => {
    if (mensajeConfirmacion.value === mensaje) {
      mensajeConfirmacion.value = null
    }
  }, 5000)
}

const enviarMensaje = async () => {
  const esValido = await validarFormulario()
  if (!esValido) return

  enviando.value = true
  errorMensaje.value = null
  resultadoEnvio.value = null

  try {
    // Preparar datos para enviar según el formato requerido
    const datosMensaje = {
      destinatarios_ids: destinatariosSeleccionados.value.map((d) => d.id),
      asunto: formulario.value.asunto.trim(),
      contenido: formulario.value.contenido.trim(),
      tipo: formulario.value.tipo,
      prioridad: formulario.value.prioridad, // Esto ya es un número (1, 2, o 3)
    }

    // Mostrar mensaje de confirmación de envío
    mostrarMensajeConfirmacion(
      `Enviando mensaje a ${destinatariosSeleccionados.value.length} destinatario(s)...`,
      'info',
    )

    console.log(datosMensaje)

    //Enviar mensaje
    //const response = await enviarMensajeMultiple(datosMensaje, usuarioStore.accessToken)
    // console.log('Respuesta enviar mensaje multiple:', response)

    if (response.success) {
      //Guardar resultado del envio
      resultadoEnvio.value = response.message
      mostrarMensajeConfirmacion(
        `¡Mensaje enviado exitosamente! ${response.total_enviados} destinatario(s) recibieron el mensaje.`,
        'success',
      )
      emit('enviado', response)
      dialogVisible.value = false
    } else {
      //Error del servidor
      errorMensaje.value = response
      mostrarMensajeConfirmacion('Error al enviar el mensaje', 'error')
      throw new Error(response.errores || 'Error desconocido')
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    errorMensaje.value = error.message || 'Error de conexión. Intenta nuevamente.'
    mostrarMensajeConfirmacion(error.message || 'Error de conexión', 'error')
  } finally {
    enviando.value = false
  }
}

const enviarOtroMensaje = () => {
  resultadoEnvio.value = null
  inicializarFormulario()
}

// Funciones de utilidad
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
.message-form {
  max-height: 70vh;
  overflow-y: auto;
}

.destinatarios-select :deep(.v-field) {
  background: #f8f9fa;
}

.editor-mensaje :deep(textarea) {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
}

.emojis-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  justify-items: center;
}

.emoji-btn {
  font-size: 24px;
  width: 40px;
  height: 40px;
  transition: transform 0.2s;
}

.emoji-btn:hover {
  transform: scale(1.2);
}

.border-top {
  border-top: 1px solid #e0e0e0 !important;
}

/* Scroll personalizado */
.message-form::-webkit-scrollbar {
  width: 8px;
}

.message-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.message-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.message-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 600px) {
  .emojis-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
