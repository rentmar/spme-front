<!-- components/SelectorValidadores.vue -->
<template>
  <div class="selector-validadores-component">
    <!-- Overlay de carga inicial -->
    <v-overlay
      v-model="cargandoInicial"
      class="align-center justify-center"
      persistent
      scrim="white"
    >
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      <div class="mt-4 text-primary font-weight-medium">Cargando validadores...</div>
    </v-overlay>

    <!-- Cabecera con título -->
    <div class="header-section mb-6">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <h3 class="text-h6 mb-0">
            <v-icon :icon="documentoIcono" class="mr-2" color="primary"></v-icon>
            {{ tituloSeccion }}
          </h3>
        </div>

        <v-chip :color="tieneValidadores ? 'primary' : 'grey'" variant="outlined" class="ml-2">
          <v-icon
            :icon="tieneValidadores ? 'mdi-check-circle' : 'mdi-close-circle'"
            size="small"
            class="mr-1"
          ></v-icon>
          {{ validadoresSeleccionados.length }} validador(es)
        </v-chip>
      </div>

      <!-- Mensaje de estado según permisos -->
      <v-alert :type="tipoAlerta" density="compact" class="mt-4" variant="tonal">
        <v-icon :icon="iconoAlerta" class="mr-2"></v-icon>
        {{ mensajeEstado }}
      </v-alert>

      <!-- Información del usuario actual -->
      <v-card variant="outlined" class="mt-4 usuario-actual-card">
        <v-card-text class="d-flex align-center">
          <v-avatar :color="getAvatarColor(usuarioActual?.nombre_completo)" size="40" class="mr-3">
            <span class="text-white">{{ usuarioActual?.nombre_completo?.charAt(0) || 'U' }}</span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-2 font-weight-medium">
              {{ usuarioActual?.nombre_completo }}
              <v-chip size="x-small" :color="getRolColor(usuarioActual?.rol)" class="ml-2">
                {{ usuarioActual?.rol || 'Sin rol' }}
              </v-chip>
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ usuarioActual?.email || 'Sin email' }} | @{{ usuarioActual?.username }}
            </div>
          </div>
          <v-chip color="primary" variant="tonal" size="small">
            <v-icon icon="mdi-account" size="small" class="mr-1"></v-icon>
            Redactor
          </v-chip>
        </v-card-text>
      </v-card>
    </div>

    <!-- Contenido de la sección -->
    <v-slide-y-transition>
      <div v-if="!cargandoInicial">
        <!-- Información del documento (si existe) -->
        <v-card
          v-if="documentoInfo?.documento_numero"
          variant="outlined"
          class="mb-6 documento-info-card"
        >
          <v-card-text class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar
                :color="documentoInfo.tipo_documento === 'ACTIVIDAD' ? 'primary' : 'success'"
                size="40"
                class="mr-3"
              >
                <v-icon :icon="documentoIcono" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-medium">
                  {{ documentoInfo.documento_numero }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{
                    documentoInfo.tipo_documento === 'ACTIVIDAD'
                      ? 'Informe de Actividad'
                      : 'Informe de Tarea'
                  }}
                </div>
              </div>
            </div>
            <div class="d-flex align-center">
              <v-chip
                :color="
                  documentoInfo.estado_consolidado === 'APROBADO'
                    ? 'success'
                    : documentoInfo.estado_consolidado === 'RECHAZADO'
                      ? 'error'
                      : documentoInfo.estado_consolidado === 'EN_VALIDACION'
                        ? 'warning'
                        : 'info'
                "
                size="small"
                class="mr-2"
              >
                <v-icon :icon="estadoConsolidadoIcono" size="small" class="mr-1"></v-icon>
                {{ documentoInfo.estado_consolidado }}
              </v-chip>
              <v-chip variant="outlined" size="small"> v{{ documentoInfo.version_actual }} </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Selector de validadores -->
        <div class="selector-section">
          <div class="sub-header-section mb-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h4 class="text-subtitle-1 mb-1">{{ tituloSelector }}</h4>
                <div class="text-caption text-medium-emphasis">
                  <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
                  Total de validadores disponibles: {{ totalValidadores }}
                </div>
              </div>
            </div>
          </div>

          <!-- Autocomplete con filtros por rol -->
          <div class="autocomplete-container mb-6">
            <v-autocomplete
              v-model="validadorSeleccionado"
              :items="usuariosFiltrados"
              :loading="cargandoUsuarios"
              v-model:search-input="busqueda"
              item-title="nombre_completo"
              item-value="id"
              :filter="customFilter"
              return-object
              clearable
              chips
              :label="placeholderBusqueda"
              variant="outlined"
              bg-color="white"
              density="comfortable"
              class="autocomplete-field"
              hide-details="auto"
              :disabled="!puedeModificar || cargandoUsuarios"
            >
              <!-- Template para cada opción -->
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar :color="getAvatarColor(item.raw.nombre_completo)" size="32">
                      <span class="text-white">{{
                        item.raw.nombre_completo?.charAt(0) || '?'
                      }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-subtitle>
                    <span
                      class="rol-badge"
                      :class="`rol-${item.raw.rol?.toLowerCase() || 'usuario'}`"
                    >
                      {{ item.raw.rol || 'usuario' }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>

              <!-- No hay resultados -->
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>No se encontraron usuarios</v-list-item-title>
                  <v-list-item-subtitle
                    >Intenta con otros términos de búsqueda</v-list-item-subtitle
                  >
                </v-list-item>
              </template>
            </v-autocomplete>

            <!-- Filtros rápidos por rol -->
            <div class="filtros-rapidos mt-3">
              <span class="filtros-label text-caption text-medium-emphasis mr-2"
                >Filtrar por rol:</span
              >
              <v-chip
                v-for="rol in rolesDisponibles"
                :key="rol"
                :color="filtroRol === rol ? 'primary' : 'grey'"
                :variant="filtroRol === rol ? 'flat' : 'outlined'"
                size="small"
                class="mr-1 mb-1"
                @click="toggleFiltroRol(rol)"
                :disabled="cargandoUsuarios"
              >
                <v-icon :icon="rolIcono(rol)" size="small" class="mr-1"></v-icon>
                {{ getRolDisplay(rol) }}
              </v-chip>
              <v-chip
                v-if="filtroRol"
                variant="text"
                size="small"
                class="ml-1"
                @click="limpiarFiltroRol"
                :disabled="cargandoUsuarios"
              >
                <v-icon icon="mdi-close" size="small" class="mr-1"></v-icon>
                Limpiar
              </v-chip>
            </div>
          </div>

          <!-- Lista de validadores actuales -->
          <div class="validadores-list">
            <div class="d-flex align-center justify-space-between mb-4">
              <h4 class="text-subtitle-1">
                <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                Validadores Asignados ({{ validadoresSeleccionados.length }})
              </h4>
              <div class="d-flex align-center">
                <v-tooltip text="Aprobados">
                  <v-chip color="success" size="x-small" variant="tonal" class="mr-1">
                    <v-icon icon="mdi-check-circle" size="small" class="mr-1"></v-icon>
                    {{ resumen.aprobados }}
                  </v-chip>
                </v-tooltip>
                <v-tooltip text="Rechazados">
                  <v-chip color="error" size="x-small" variant="tonal" class="mr-1">
                    <v-icon icon="mdi-close-circle" size="small" class="mr-1"></v-icon>
                    {{ resumen.rechazados }}
                  </v-chip>
                </v-tooltip>
                <v-tooltip text="Pendientes">
                  <v-chip color="warning" size="x-small" variant="tonal">
                    <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                    {{ resumen.pendientes }}
                  </v-chip>
                </v-tooltip>
              </div>
            </div>

            <v-list lines="three" variant="outlined" class="validador-list">
              <TransitionGroup name="list">
                <v-list-item
                  v-for="validador in validadoresSeleccionados"
                  :key="validador.id"
                  class="validador-list-item mb-2"
                  :class="{
                    'border-left-success': validador.estado === 'APROBADO',
                    'border-left-error': validador.estado === 'RECHAZADO',
                    'border-left-warning': validador.estado === 'PENDIENTE',
                  }"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="getAvatarColor(validador.nombre_completo)" size="48">
                      <span class="text-h6 text-white">
                        {{ validador.nombre_completo?.charAt(0) || '?' }}
                      </span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ validador.nombre_completo }}
                    <v-chip :color="obtenerEstadoClass(validador)" size="x-small" class="ml-2">
                      <v-icon
                        :icon="estadoIcono(obtenerEstado(validador))"
                        size="x-small"
                        class="mr-1"
                      ></v-icon>
                      {{ obtenerEstadoDisplay(validador) }}
                    </v-chip>
                    <v-chip
                      v-if="esValidadorNuevo(validador)"
                      color="primary"
                      size="x-small"
                      variant="tonal"
                      class="ml-2"
                    >
                      <v-icon icon="mdi-plus-circle" size="x-small" class="mr-1"></v-icon>
                      Nuevo
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="mt-1">
                    <div class="d-flex flex-wrap gap-2">
                      <span class="text-caption">
                        <v-icon icon="mdi-tag" size="x-small" class="mr-1 text-grey"></v-icon>
                        {{ validador.rol || 'Sin rol' }}
                      </span>
                      <span class="text-caption">
                        <v-icon icon="mdi-account" size="x-small" class="mr-1 text-grey"></v-icon>
                        @{{ validador.username }}
                      </span>
                      <span v-if="validador.email" class="text-caption">
                        <v-icon icon="mdi-email" size="x-small" class="mr-1 text-grey"></v-icon>
                        {{ validador.email }}
                      </span>
                    </div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                      v-if="puedeEliminar(validador)"
                      icon
                      size="small"
                      color="error"
                      variant="text"
                      @click="eliminarValidador(validador)"
                    >
                      <v-icon icon="mdi-delete"></v-icon>
                      <v-tooltip activator="parent" location="start">Eliminar validador</v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </TransitionGroup>
            </v-list>

            <!-- Empty state -->
            <v-card
              v-if="validadoresSeleccionados.length === 0"
              variant="outlined"
              class="empty-state-card pa-8"
            >
              <div class="text-center">
                <v-icon
                  icon="mdi-account-off"
                  size="48"
                  color="grey-lighten-1"
                  class="mb-4"
                ></v-icon>
                <div class="text-h6 text-grey-darken-1 mb-2">No hay validadores asignados</div>
                <div class="text-body-2 text-grey mb-4">
                  {{ mensajeEmptyState }}
                </div>
                <v-btn
                  v-if="puedeModificar"
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-account-plus"
                  @click="enfocarBuscador"
                >
                  Agregar validador
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-slide-y-transition>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      <v-icon :icon="snackbar.icon" class="mr-2"></v-icon>
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn icon variant="text" @click="snackbar.show = false">
          <v-icon icon="mdi-close"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useValidadores } from '../../composables/useValidadores'

// Props
const props = defineProps({
  tipoDocumento: {
    type: String,
    required: true,
    validator: (value) => ['actividad', 'tarea'].includes(value),
  },
  validadoresActualesActividad: {
    type: Object,
    default: null,
  },
  validadoresActualesTarea: {
    type: Object,
    default: null,
  },
  usuarioRol: {
    type: String,
    default: 'usuario',
  },
  // Para v-model - sincronización automática
  modelValue: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'error'])

// ============================================================
// ESTADO
// ============================================================
const cargandoInicial = ref(true)
const cargandoUsuarios = ref(false)
const busqueda = ref('')
const validadorSeleccionado = ref(null)
const filtroRol = ref('')

// Datos de la API
const usuarioActual = ref(null)
const totalValidadores = ref(0)
const usuariosDisponibles = ref([])

// Datos del documento
const documentoInfo = ref(null)
const validadoresSeleccionados = ref([])

// Composables
const snackbar = ref({
  show: false,
  text: '',
  color: 'info',
  icon: 'mdi-information',
})

const { listarValidadores } = useValidadores()

// ============================================================
// COMPUTADAS
// ============================================================
const tituloSeccion = computed(() => {
  return props.tipoDocumento === 'actividad'
    ? 'Validadores del Informe de Actividad'
    : 'Validadores del Informe de Subactividad'
})

const tituloSelector = computed(() => {
  return props.tipoDocumento === 'actividad'
    ? 'Agregar validador para el informe de actividad'
    : 'Agregar validador para el informe de subactividad'
})

const documentoIcono = computed(() => {
  return props.tipoDocumento === 'actividad' ? 'mdi-file-document-outline' : 'mdi-file-tree'
})

const puedeModificar = computed(() => {
  return (
    !documentoInfo.value?.documento_id ||
    ['admin', 'coordinador'].includes(props.usuarioRol?.toLowerCase())
  )
})

const tipoAlerta = computed(() => {
  if (!puedeModificar.value) return 'warning'
  if (validadoresSeleccionados.value.length === 0) return 'info'
  return 'success'
})

const iconoAlerta = computed(() => {
  if (!puedeModificar.value) return 'mdi-lock'
  if (validadoresSeleccionados.value.length === 0) return 'mdi-information'
  return 'mdi-check-circle'
})

const mensajeEstado = computed(() => {
  if (!puedeModificar.value) {
    return 'Modo solo lectura - Solo administradores y coordinadores pueden modificar validadores en documentos existentes.'
  }
  if (validadoresSeleccionados.value.length === 0) {
    return 'No hay validadores asignados. Utilice el buscador para agregar validadores.'
  }
  return `Hay ${validadoresSeleccionados.value.length} validador(es) asignado(s).`
})

const mensajeEmptyState = computed(() => {
  if (puedeModificar.value) {
    return 'Agrega validadores usando el buscador superior para comenzar.'
  }
  return 'Contacta a un administrador o coordinador para asignar validadores en este documento.'
})

const tieneValidadores = computed(() => {
  return validadoresSeleccionados.value.length > 0
})

const placeholderBusqueda = computed(() => {
  return tituloSelector.value
})

const resumen = computed(() => {
  const stats = {
    aprobados: 0,
    rechazados: 0,
    pendientes: 0,
  }

  validadoresSeleccionados.value.forEach((v) => {
    const estado = v.estado || 'PENDIENTE'
    if (estado === 'APROBADO') stats.aprobados++
    else if (estado === 'RECHAZADO') stats.rechazados++
    else stats.pendientes++
  })

  return stats
})

const usuariosFiltrados = computed(() => {
  let filtrados = usuariosDisponibles.value

  // Excluir usuarios ya asignados
  const idsAsignados = validadoresSeleccionados.value.map((v) => v.id)
  filtrados = filtrados.filter((u) => !idsAsignados.includes(u.id))

  // Filtrar por rol si está seleccionado
  if (filtroRol.value) {
    filtrados = filtrados.filter((u) => u.rol?.toLowerCase() === filtroRol.value.toLowerCase())
  }

  return filtrados
})

const rolesDisponibles = computed(() => {
  const ordenRoles = ['admin', 'coordinador', 'contable', 'tecnico', 'usuario']
  const rolesSet = new Set(usuariosDisponibles.value.map((u) => u.rol?.toLowerCase()))
  return ordenRoles.filter((rol) => rolesSet.has(rol))
})

const estadoConsolidadoIcono = computed(() => {
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    EN_VALIDACION: 'mdi-clock-outline',
    SIN_VALIDACIONES: 'mdi-account-off',
    NUEVO: 'mdi-plus-circle',
  }
  return iconos[documentoInfo.value?.estado_consolidado] || 'mdi-circle'
})

// ============================================================
// MÉTODOS DE API
// ============================================================

const cargarUsuarios = async () => {
  cargandoUsuarios.value = true

  try {
    const response = await listarValidadores()

    // ✅ Procesar la respuesta de la API
    // La respuesta tiene: success, total_validadores, usuarioActual, validadores
    if (response.success) {
      totalValidadores.value = response.total_validadores || 0

      // Guardar información del usuario actual
      usuarioActual.value = response.usuarioActual || null

      // Mapear los validadores al formato que necesita el componente
      usuariosDisponibles.value = (response.validadores || [])
        .filter((u) => {
          const rol = u.rol?.toLowerCase()
          return rol !== 'contable' && rol !== 'tecnico'
        })
        .map((u) => ({
          id: u.id,
          nombre_completo: u.nombre_completo || `Usuario ${u.username}`,
          email: u.email || '',
          rol: u.rol?.toLowerCase() || 'usuario',
          username: u.username,
        }))

      console.log('Validadores cargados:', usuariosDisponibles.value.length)
    }
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    mostrarNotificacion('Error al cargar usuarios', 'error')
    emit('error', error.message)
  } finally {
    cargandoUsuarios.value = false
  }
}

/**
 * Carga los datos iniciales del componente
 */
const inicializarDatos = async () => {
  cargandoInicial.value = true

  try {
    // 1. Cargar usuarios disponibles
    await cargarUsuarios()

    // 2. Cargar datos del documento desde props
    if (props.tipoDocumento === 'actividad' && props.validadoresActualesActividad) {
      documentoInfo.value = { ...props.validadoresActualesActividad }
      validadoresSeleccionados.value = [...(props.validadoresActualesActividad.validaciones || [])]
    } else if (props.tipoDocumento === 'tarea' && props.validadoresActualesTarea) {
      documentoInfo.value = { ...props.validadoresActualesTarea }
      validadoresSeleccionados.value = [...(props.validadoresActualesTarea.validaciones || [])]
    } else if (props.modelValue && props.modelValue.length > 0) {
      validadoresSeleccionados.value = [...props.modelValue]
      documentoInfo.value = {
        tipo_documento: props.tipoDocumento.toUpperCase(),
        documento_id: null,
        documento_numero: null,
        estado_consolidado: 'NUEVO',
        version_actual: '1',
        validaciones: props.modelValue,
      }
    } else {
      documentoInfo.value = {
        tipo_documento: props.tipoDocumento.toUpperCase(),
        documento_id: null,
        documento_numero: null,
        estado_consolidado: 'NUEVO',
        version_actual: '1',
        validaciones: [],
      }
      validadoresSeleccionados.value = []
    }

    emit('update:modelValue', validadoresSeleccionados.value)
  } catch (error) {
    console.error('Error inicializando:', error)
    mostrarNotificacion('Error al cargar datos', 'error')
    emit('error', error.message)
    cargandoInicial.value = false
  } finally {
    cargandoInicial.value = false
  }
}

// ============================================================
// MÉTODOS DE UI
// ============================================================

const customFilter = (item, queryText, itemTitle) => {
  if (!queryText) return true
  const searchText = queryText.toLowerCase()
  return (
    item.raw.nombre_completo?.toLowerCase().includes(searchText) ||
    item.raw.email?.toLowerCase().includes(searchText) ||
    (item.raw.rol && item.raw.rol.toLowerCase().includes(searchText)) ||
    (item.raw.username && item.raw.username.toLowerCase().includes(searchText))
  )
}

const toggleFiltroRol = (rol) => {
  filtroRol.value = filtroRol.value === rol ? '' : rol
}

const limpiarFiltroRol = () => {
  filtroRol.value = ''
}

const rolIcono = (rol) => {
  const iconos = {
    admin: 'mdi-calendar',
    coordinador: 'mdi-account-group',
    contable: 'mdi-calculator',
    tecnico: 'mdi-wrench',
    usuario: 'mdi-account',
  }
  return iconos[rol?.toLowerCase()] || 'mdi-account'
}

const getRolColor = (rol) => {
  const colores = {
    admin: 'amber',
    coordinador: 'blue',
    contable: 'green',
    tecnico: 'purple',
    usuario: 'grey',
  }
  return colores[rol?.toLowerCase()] || 'grey'
}

const getAvatarColor = (nombre) => {
  const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4', '#795548']
  const index = (nombre?.length || 0) % colors.length
  return colors[index]
}

const estadoIcono = (estado) => {
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    PENDIENTE: 'mdi-clock-outline',
    NUEVO: 'mdi-plus-circle',
  }
  return iconos[estado] || 'mdi-circle'
}

const obtenerEstado = (validador) => {
  return validador.estado || 'PENDIENTE'
}

const obtenerEstadoDisplay = (validador) => {
  return validador.estado_display || validador.estado || 'Pendiente'
}

const obtenerEstadoClass = (validador) => {
  const estado = (validador.estado || 'PENDIENTE').toLowerCase()
  const colores = {
    aprobado: 'success',
    rechazado: 'error',
    pendiente: 'warning',
  }
  return colores[estado] || 'grey'
}

const esValidadorNuevo = (validador) => {
  return !validador.codigoSeguimiento && validador.id > 1000 // IDs temporales
}

const puedeEliminar = (validador) => {
  if (!puedeModificar.value) return false
  if (!documentoInfo.value?.documento_id) return true
  return (validador.estado || 'PENDIENTE') === 'PENDIENTE'
}

const formatFecha = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const enfocarBuscador = () => {
  busqueda.value = ''
  nextTick(() => {
    const input = document.querySelector('.v-autocomplete input')
    if (input) input.focus()
  })
}

const eliminarValidador = (validador) => {
  if (!validador) return

  validadoresSeleccionados.value = validadoresSeleccionados.value.filter(
    (v) => v.id !== validador.id,
  )

  emit('update:modelValue', validadoresSeleccionados.value)

  mostrarNotificacion(`Validador eliminado: ${validador.nombre_completo}`, 'info')
}

const mostrarNotificacion = (texto, tipo = 'info') => {
  const config = {
    success: { color: 'success', icon: 'mdi-check-circle' },
    error: { color: 'error', icon: 'mdi-alert-circle' },
    warning: { color: 'warning', icon: 'mdi-alert' },
    info: { color: 'info', icon: 'mdi-information' },
  }

  snackbar.value = {
    show: true,
    text: texto,
    color: config[tipo].color,
    icon: config[tipo].icon,
  }
}

// ═══════════════════════════════════════════════════════════
// DISPLAY DE ROLES
// ═══════════════════════════════════════════════════════════
const getRolDisplay = (rol) => {
  if (rol?.toLowerCase() === 'admin') return 'Planificacion y Monitoreo'
  return rol
}

// ============================================================
// WATCHERS
// ============================================================

watch(validadorSeleccionado, (nuevoValidador) => {
  if (nuevoValidador && puedeModificar.value) {
    // Crear nueva validación con estructura consistente
    const nuevaValidacion = {
      id: nuevoValidador.id, // ID temporal
      nombre_completo: nuevoValidador.nombre_completo,
      email: nuevoValidador.email,
      rol: nuevoValidador.rol,
      username: nuevoValidador.username,
      estado: 'PENDIENTE',
      estado_display: 'Pendiente',
      fechaAsignacion: new Date().toISOString(),
    }

    validadoresSeleccionados.value.push(nuevaValidacion)
    validadorSeleccionado.value = null
    busqueda.value = ''

    emit('update:modelValue', validadoresSeleccionados.value)
    mostrarNotificacion(`Validador agregado: ${nuevoValidador.nombre_completo}`, 'success')
  }
})

watch(
  () => props.modelValue,
  (nuevoValor) => {
    if (
      nuevoValor &&
      JSON.stringify(nuevoValor) !== JSON.stringify(validadoresSeleccionados.value)
    ) {
      validadoresSeleccionados.value = [...nuevoValor]
    }
  },
  { deep: true },
)

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(async () => {
  await inicializarDatos()
})
</script>

<style scoped>
.selector-validadores-component {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  position: relative;
  min-height: 400px;
}

.header-section {
  margin-bottom: 16px;
}

.sub-header-section {
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
}

.documento-info-card {
  border-left: 4px solid;
  border-left-color: v-bind('props.tipoDocumento === "actividad" ? "#1976d2" : "#4caf50"');
}

.usuario-actual-card {
  background: linear-gradient(to right, #f5f5f5, #ffffff);
  border-left: 4px solid #1976d2;
}

.selector-section {
  width: 100%;
}

.autocomplete-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
}

.filtros-rapidos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.filtros-label {
  font-size: 0.875rem;
}

.validador-list {
  background-color: transparent !important;
}

.validador-list-item {
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border-left-width: 4px;
  border-left-style: solid;
}

.validador-list-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.border-left-success {
  border-left-color: #4caf50 !important;
}

.border-left-error {
  border-left-color: #f44336 !important;
}

.border-left-warning {
  border-left-color: #ff9800 !important;
}

.rol-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 8px;
  white-space: nowrap;
}

.rol-admin {
  background: #ffeb3b;
  color: #000;
}

.rol-coordinador {
  background: #2196f3;
  color: white;
}

.rol-contable {
  background: #4caf50;
  color: white;
}

.rol-tecnico {
  background: #9c27b0;
  color: white;
}

.rol-usuario {
  background: #9e9e9e;
  color: white;
}

.email-text {
  color: #666;
  font-size: 0.8rem;
}

.empty-state-card {
  background-color: #f5f5f5 !important;
  border-style: dashed !important;
}

/* Animaciones */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 600px) {
  .selector-validadores-component {
    padding: 12px;
  }

  .filtros-rapidos {
    justify-content: center;
  }
}
</style>
