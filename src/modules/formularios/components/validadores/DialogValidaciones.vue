<template>
  <v-dialog v-model="dialogVisible" max-width="900px" scrollable>
    <v-card class="dialog-validaciones" rounded="lg">
      <!-- Header con estilo consistente al de la vista padre -->
      <v-card-title class="pa-4 d-flex align-center" style="background: #1976d2; color: white">
        <v-icon start dark size="28" class="mr-3">mdi-bell-ring</v-icon>
        <div>
          <h2 class="text-h6 font-weight-bold mb-0">Mis Validaciones</h2>
          <p class="text-caption mb-0" style="color: rgba(255, 255, 255, 0.9)">
            Total: {{ totalValidaciones }} validación(es)
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon dark variant="text" @click="cerrar" class="btn-cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Contenido -->
      <v-card-text class="pa-0">
        <!-- Filtros - estilo consistente con la vista padre -->
        <v-sheet class="pa-4" style="background: #f8f9fa; border-bottom: 1px solid #e0e0e0">
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
                bg-color="white"
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
                bg-color="white"
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
                bg-color="white"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- Resumen de estados - estilo consistente con la vista padre -->
        <v-sheet class="pa-4" style="background: white">
          <v-row>
            <v-col cols="4" class="text-center">
              <div
                class="resumen-card"
                style="background: #fff8e7; border-radius: 8px; padding: 12px"
              >
                <div class="text-h6 font-weight-bold" style="color: #ff9800">
                  {{ resumen.pendientes }}
                </div>
                <div class="text-caption" style="color: #666">Pendientes</div>
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div
                class="resumen-card"
                style="background: #e8f5e9; border-radius: 8px; padding: 12px"
              >
                <div class="text-h6 font-weight-bold" style="color: #4caf50">
                  {{ resumen.aprobados }}
                </div>
                <div class="text-caption" style="color: #666">Aprobados</div>
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div
                class="resumen-card"
                style="background: #ffebee; border-radius: 8px; padding: 12px"
              >
                <div class="text-h6 font-weight-bold" style="color: #f44336">
                  {{ resumen.rechazados }}
                </div>
                <div class="text-caption" style="color: #666">Rechazados</div>
              </div>
            </v-col>
          </v-row>
        </v-sheet>

        <v-divider class="my-0"></v-divider>

        <!-- Lista de validaciones -->
        <v-list lines="three" class="pa-0" style="background: white">
          <template v-if="validacionesFiltradas.length > 0">
            <v-list-item
              v-for="validacion in validacionesPaginadas"
              :key="validacion.id"
              class="validacion-item-dialog"
              :class="`border-left-${validacion.estado.toLowerCase()}`"
            >
              <template v-slot:prepend>
                <v-avatar :color="getAvatarColor(validacion)" size="48" class="mr-3">
                  <span class="text-white font-weight-bold">{{ getIniciales(validacion) }}</span>
                </v-avatar>
              </template>

              <v-list-item-title class="d-flex align-center flex-wrap">
                <span class="font-weight-medium">{{ validacion.informe_numero }}</span>
                <v-chip
                  :color="getEstadoColor(validacion.estado)"
                  size="x-small"
                  class="ml-2"
                  variant="tonal"
                >
                  {{ validacion.estado_display }}
                </v-chip>
                <v-chip
                  :color="validacion.tipo_documento === 'ACTIVIDAD' ? 'primary' : 'success'"
                  size="x-small"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ validacion.tipo_documento === 'ACTIVIDAD' ? 'Actividad' : 'Tarea' }}
                </v-chip>
              </v-list-item-title>

              <v-list-item-subtitle>
                <div class="text-caption">
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <span class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(validacion.fechaAsignacion) }}
                    </span>
                    <span v-if="validacion.fechaResolucion" class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
                      {{ formatDate(validacion.fechaResolucion) }}
                    </span>
                    <span class="d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
                      v{{ validacion.versionDocumento }}
                    </span>
                  </div>
                  <div v-if="validacion.informe_titulo" class="mt-1" style="color: #666">
                    <v-icon size="x-small" class="mr-1">mdi-format-title</v-icon>
                    {{ truncarTexto(validacion.informe_titulo, 80) }}
                  </div>
                  <div
                    v-if="validacion.comentarios && validacion.comentarios !== 'Nueva Entrada'"
                    class="mt-1"
                    style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-comment</v-icon>
                    <span style="color: #666">{{ validacion.comentarios }}</span>
                  </div>
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <v-chip
                    size="x-small"
                    :color="getEstadoColor(validacion.estado)"
                    variant="tonal"
                    class="mb-1"
                  >
                    {{ validacion.codigoSeguimiento }}
                  </v-chip>
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    :to="getRutaInforme(validacion)"
                    target="_blank"
                    class="btn-ver-informe"
                  >
                    <v-icon size="small" class="mr-1">mdi-open-in-new</v-icon>
                    Ver informe
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </template>

          <!-- Empty state -->
          <v-list-item v-else class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-off</v-icon>
            <div class="text-h6" style="color: #666">No hay validaciones</div>
            <div class="text-body-2" style="color: #999">
              No tienes validaciones asignadas en este momento
            </div>
          </v-list-item>
        </v-list>

        <!-- Paginación - estilo consistente con la vista padre -->
        <v-divider v-if="totalPages > 1"></v-divider>
        <v-sheet
          v-if="totalPages > 1"
          class="pa-4 d-flex align-center justify-space-between"
          style="background: white"
        >
          <span class="text-caption" style="color: #666">
            Mostrando {{ startItem }}-{{ endItem }} de {{ validacionesFiltradas.length }}
          </span>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            size="small"
            color="primary"
          ></v-pagination>
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 20, 50]"
            label="Items"
            density="compact"
            style="max-width: 100px"
            variant="outlined"
            hide-details
            bg-color="white"
          ></v-select>
        </v-sheet>
      </v-card-text>

      <!-- Footer - estilo consistente con la vista padre -->
      <v-card-actions class="pa-4" style="background: #f8f9fa; border-top: 1px solid #e0e0e0">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="cerrar" class="btn-cerrar-footer">
          Cerrar
        </v-btn>
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

  if (filtroTipo.value) {
    filtradas = filtradas.filter((v) => v.tipo_documento === filtroTipo.value)
  }

  if (filtroEstado.value) {
    filtradas = filtradas.filter((v) => v.estado === filtroEstado.value)
  }

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
  const colores = ['#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#e91e63']
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
    return `/monitoreo/informe-actividad-validar/${validacion.informe}`
  } else if (validacion.tipo_documento === 'TAREA') {
    return `/monitoreo/informe-subactividad-validar/${validacion.informeTarea}`
  }
  return '#'
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Botón cerrar */
.btn-cerrar {
  transition: all 0.2s ease;
}

.btn-cerrar:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.btn-cerrar-footer {
  transition: all 0.2s ease;
}

.btn-cerrar-footer:hover {
  background-color: rgba(25, 118, 210, 0.1);
  transform: translateY(-1px);
}

/* Items de validación - estilo consistente con la vista padre */
.validacion-item-dialog {
  border-left-width: 4px;
  border-left-style: solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  position: relative;
  top: 0;
  margin-bottom: 2px;
}

.validacion-item-dialog:hover {
  transform: translateX(4px) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12) !important;
  background: #f8f9fa;
  z-index: 5;
}

/* Bordes de estado */
.border-left-pendiente {
  border-left-color: #ff9800 !important;
}

.border-left-aprobado {
  border-left-color: #4caf50 !important;
}

.border-left-rechazado {
  border-left-color: #f44336 !important;
}

/* Botón ver informe */
.btn-ver-informe {
  transition: all 0.2s ease;
}

.btn-ver-informe:hover {
  background-color: rgba(25, 118, 210, 0.1) !important;
  transform: translateY(-1px);
}

/* Tarjetas de resumen */
.resumen-card {
  transition: all 0.2s ease;
  cursor: default;
}

.resumen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Utilidades */
.gap-2 {
  gap: 8px;
}

/* Scroll personalizado */
.v-list::-webkit-scrollbar {
  width: 4px;
}

.v-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.v-list::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.v-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Responsive */
@media (max-width: 960px) {
  .validacion-item-dialog:hover {
    transform: translateX(2px) translateY(-1px);
  }
}

@media (max-width: 600px) {
  .gap-2 {
    gap: 4px;
  }

  .resumen-card {
    padding: 8px !important;
  }

  .validacion-item-dialog {
    padding: 8px !important;
  }
}
</style>
