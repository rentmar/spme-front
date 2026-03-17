<!-- components/validaciones/DialogValidaciones.vue -->
<template>
  <v-dialog v-model="dialogVisible" max-width="900px" scrollable>
    <v-card class="dialog-validaciones">
      <!-- Header -->
      <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
        <v-icon start dark size="28" class="mr-3">mdi-bell-ring</v-icon>
        <div>
          <h2 class="text-h6 font-weight-bold mb-0">Mis Validaciones</h2>
          <p class="text-caption text-white text-opacity-90 mb-0">
            Total: {{ totalValidaciones }} validación(es)
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon dark variant="text" @click="cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Contenido -->
      <v-card-text class="pa-0">
        <!-- Filtros -->
        <v-sheet class="pa-4 bg-grey-lighten-4">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroTipo"
                :items="tiposDocumento"
                label="Tipo de documento"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="filtroEstado"
                :items="estadosValidacion"
                label="Estado"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="busqueda"
                label="Buscar"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- Resumen de estados -->
        <v-sheet class="pa-4">
          <v-row>
            <v-col cols="4" class="text-center">
              <v-chip color="warning" variant="tonal" class="pa-3" style="width: 100%">
                <div class="text-h6 font-weight-bold">{{ resumen.pendientes }}</div>
                <div class="text-caption">Pendientes</div>
              </v-chip>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-chip color="success" variant="tonal" class="pa-3" style="width: 100%">
                <div class="text-h6 font-weight-bold">{{ resumen.aprobados }}</div>
                <div class="text-caption">Aprobados</div>
              </v-chip>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-chip color="error" variant="tonal" class="pa-3" style="width: 100%">
                <div class="text-h6 font-weight-bold">{{ resumen.rechazados }}</div>
                <div class="text-caption">Rechazados</div>
              </v-chip>
            </v-col>
          </v-row>
        </v-sheet>

        <v-divider></v-divider>

        <!-- Lista de validaciones -->
        <v-list lines="three" class="pa-0">
          <template v-if="validacionesFiltradas.length > 0">
            <v-list-item
              v-for="validacion in validacionesPaginadas"
              :key="validacion.id"
              class="validacion-item"
              :class="`border-left-${validacion.estado.toLowerCase()}`"
            >
              <template v-slot:prepend>
                <v-avatar :color="getAvatarColor(validacion)" size="48" class="mr-3">
                  <span class="text-white">{{ getIniciales(validacion) }}</span>
                </v-avatar>
              </template>

              <v-list-item-title class="d-flex align-center">
                <span class="font-weight-medium">{{ validacion.informe_numero }}</span>
                <v-chip :color="getEstadoColor(validacion.estado)" size="x-small" class="ml-2">
                  {{ validacion.estado_display }}
                </v-chip>
                <v-chip
                  :color="validacion.tipo_documento === 'ACTIVIDAD' ? 'primary' : 'success'"
                  size="x-small"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ validacion.tipo_documento }}
                </v-chip>
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="text-caption">
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <span>
                      <v-icon size="x-small" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(validacion.fechaAsignacion) }}
                    </span>
                    <span v-if="validacion.fechaResolucion">
                      <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
                      {{ formatDate(validacion.fechaResolucion) }}
                    </span>
                    <span>
                      <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
                      v{{ validacion.versionDocumento }}
                    </span>
                  </div>
                  <div v-if="validacion.informe_titulo" class="mt-1 text-grey">
                    <v-icon size="x-small" class="mr-1">mdi-format-title</v-icon>
                    {{ truncarTexto(validacion.informe_titulo, 80) }}
                  </div>
                  <div
                    v-if="validacion.comentarios && validacion.comentarios !== 'Nueva Entrada'"
                    class="mt-1"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-comment</v-icon>
                    <span class="text-grey">{{ validacion.comentarios }}</span>
                  </div>
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <v-chip size="x-small" :color="getEstadoColor(validacion.estado)" class="mb-1">
                    {{ validacion.codigoSeguimiento }}
                  </v-chip>
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    :to="getRutaInforme(validacion)"
                    target="_blank"
                  >
                    <v-icon size="small">mdi-open-in-new</v-icon>
                    Ver informe
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </template>

          <!-- Empty state -->
          <v-list-item v-else class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-off</v-icon>
            <div class="text-h6 text-grey-darken-1 mb-2">No hay validaciones</div>
            <div class="text-body-2 text-grey">
              No tienes validaciones asignadas en este momento
            </div>
          </v-list-item>
        </v-list>

        <!-- Paginación -->
        <v-divider v-if="totalPages > 1"></v-divider>
        <v-sheet v-if="totalPages > 1" class="pa-4 d-flex align-center justify-space-between">
          <span class="text-caption text-grey">
            Mostrando {{ startItem }}-{{ endItem }} de {{ validacionesFiltradas.length }}
          </span>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            size="small"
          ></v-pagination>
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 20, 50]"
            label="Items"
            density="compact"
            style="max-width: 100px"
            variant="outlined"
            hide-details
          ></v-select>
        </v-sheet>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="cerrar"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  validaciones: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

// Estado del diálogo
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Filtros
const filtroTipo = ref(null)
const filtroEstado = ref(null)
const busqueda = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Opciones de filtro
const tiposDocumento = [
  { title: 'Actividad', value: 'ACTIVIDAD' },
  { title: 'Tarea', value: 'TAREA' },
]

const estadosValidacion = [
  { title: 'Pendiente', value: 'PENDIENTE' },
  { title: 'Aprobado', value: 'APROBADO' },
  { title: 'Rechazado', value: 'RECHAZADO' },
]

// Computed
const validacionesFiltradas = computed(() => {
  if (!props.validaciones || !Array.isArray(props.validaciones)) return []

  let filtradas = [...props.validaciones]

  // Filtrar por tipo
  if (filtroTipo.value) {
    filtradas = filtradas.filter((v) => v.tipo_documento === filtroTipo.value)
  }

  // Filtrar por estado
  if (filtroEstado.value) {
    filtradas = filtradas.filter((v) => v.estado === filtroEstado.value)
  }

  // Filtrar por búsqueda
  if (busqueda.value) {
    const query = busqueda.value.toLowerCase()
    filtradas = filtradas.filter(
      (v) =>
        (v.informe_numero && v.informe_numero.toLowerCase().includes(query)) ||
        (v.informe_titulo && v.informe_titulo.toLowerCase().includes(query)) ||
        (v.codigoSeguimiento && v.codigoSeguimiento.toLowerCase().includes(query)),
    )
  }

  return filtradas
})

const validacionesPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return validacionesFiltradas.value.slice(start, end)
})

const totalValidaciones = computed(() => props.validaciones?.length || 0)

const totalPages = computed(() =>
  Math.ceil(validacionesFiltradas.value.length / itemsPerPage.value),
)

const startItem = computed(() =>
  validacionesFiltradas.value.length > 0 ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0,
)

const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, validacionesFiltradas.value.length),
)

const resumen = computed(() => {
  if (!props.validaciones || !Array.isArray(props.validaciones)) {
    return { pendientes: 0, aprobados: 0, rechazados: 0 }
  }

  return {
    pendientes: props.validaciones.filter((v) => v.estado === 'PENDIENTE').length,
    aprobados: props.validaciones.filter((v) => v.estado === 'APROBADO').length,
    rechazados: props.validaciones.filter((v) => v.estado === 'RECHAZADO').length,
  }
})

// Métodos
const cerrar = () => {
  dialogVisible.value = false
  // Resetear filtros al cerrar
  filtroTipo.value = null
  filtroEstado.value = null
  busqueda.value = ''
  currentPage.value = 1
}

const getEstadoColor = (estado) => {
  const colores = {
    PENDIENTE: 'warning',
    APROBADO: 'success',
    RECHAZADO: 'error',
  }
  return colores[estado] || 'grey'
}

const getAvatarColor = (validacion) => {
  const colores = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63']
  const index = (validacion.id || 0) % colores.length
  return colores[index]
}

const getIniciales = (validacion) => {
  if (validacion.tipo_documento === 'ACTIVIDAD') {
    return 'IA'
  } else {
    return 'IT'
  }
}

const formatDate = (dateStr) => {
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

const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.substring(0, max) + '...' : texto
}

const getRutaInforme = (validacion) => {
  if (validacion.tipo_documento === 'ACTIVIDAD') {
    return `/monitoreo/informe-actividad/${validacion.informe}`
  } else {
    return `/monitoreo/informe-subactividad/${validacion.informeTarea}`
  }
}

// Resetear página cuando cambian filtros
watch([filtroTipo, filtroEstado, busqueda], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.dialog-validaciones {
  border-radius: 12px;
  overflow: hidden;
}

.validacion-item {
  border-left-width: 4px;
  border-left-style: solid;
  transition: background-color 0.2s ease;
}

.validacion-item:hover {
  background-color: #f5f5f5;
}

.border-left-pendiente {
  border-left-color: #ff9800 !important;
}

.border-left-aprobado {
  border-left-color: #4caf50 !important;
}

.border-left-rechazado {
  border-left-color: #f44336 !important;
}

.gap-2 {
  gap: 8px;
}
</style>
