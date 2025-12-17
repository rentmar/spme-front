<template>
  <div class="reportes-actividades-layout">
    <!-- Encabezado -->
    <PaginaTituloIcono :titulo="'Reportes por Actividad'" :icon="'mdi-calendar-check'" />

    <v-breadcrumbs :items="['Reportes', 'Actividades']" class="px-0 mb-2"></v-breadcrumbs>

    <!-- Indicador de carga lineal -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="mb-4"
    ></v-progress-linear>

    <!-- Filtros en la parte superior -->
    <v-card elevation="1" rounded="lg" class="mb-3">
      <v-card-text class="py-3">
        <v-row dense align="center">
          <!-- Buscador general -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar actividades (por código, nombre o descripción)..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              @input="currentPage = 1"
            ></v-text-field>
          </v-col>

          <!-- Filtro por estado -->
          <v-col cols="12" md="3">
            <v-select
              v-model="filtroEstado"
              :items="estadosOptions"
              label="Estado"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:modelValue="aplicarFiltros"
            ></v-select>
          </v-col>

          <!-- Filtro por proyecto -->
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filtroProyecto"
              :items="proyectosOptions"
              item-title="titulo"
              item-value="id"
              label="Proyecto"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:modelValue="aplicarFiltros"
            ></v-autocomplete>
          </v-col>

          <!-- Botón limpiar -->
          <v-col cols="12" md="1" class="text-right">
            <v-btn
              v-if="filtrosActivos"
              @click="limpiarFiltros"
              color="secondary"
              size="small"
              variant="text"
              icon="mdi-close"
              title="Limpiar filtros"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Mensaje cuando no hay actividades -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
        <p class="text-grey mt-2">No se encontraron actividades para mostrar reportes</p>
      </v-card-text>
    </v-card>

    <!-- Contenido principal -->
    <v-card v-else elevation="1" rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center py-3">
        <div>
          <span class="text-h6">Actividades para Reportes</span>
          <span class="text-caption text-medium-emphasis ml-2">
            ({{ filteredActividades.length }} resultados)
          </span>
        </div>

        <!-- Acciones globales -->
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-file-export"
            @click="exportarTodosReportes"
            :disabled="loading || filteredActividades.length === 0 || exportandoTodos"
            :loading="exportandoTodos"
          >
            Exportar Todos
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Filtros por estado con chips -->
        <div class="mb-4">
          <v-chip-group v-model="statusFilters" multiple column>
            <v-chip
              v-for="status in availableStatuses"
              :key="status.value"
              :value="status.value"
              filter
              :color="getStatusColor(status.value)"
              variant="outlined"
              size="small"
            >
              {{ status.text }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Lista de actividades -->
        <v-list v-if="!loading" class="py-0">
          <template v-for="actividad in actividadesPaginadas" :key="actividad.id">
            <v-list-item class="mb-2 actividad-list-item">
              <template v-slot:prepend>
                <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4" size="48">
                  <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold text-h6">
                {{ actividad.codigo }} - {{ actividad.nombreCorto || 'Sin nombre' }}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-2">
                <div class="d-flex align-center flex-wrap gap-2 mb-2">
                  <v-chip small :color="getStatusColor(actividad.estado)" text-color="white">
                    {{ actividad.estado_display || getEstadoDisplay(actividad.estado) }}
                  </v-chip>
                  <span class="text-caption">
                    <v-icon x-small>mdi-cash</v-icon>
                    {{ formatCurrency(actividad.presupuesto) }}
                  </span>
                  <span class="text-caption" v-if="actividad.fecha_inicio">
                    <v-icon x-small>mdi-calendar-start</v-icon>
                    {{ formatDate(actividad.fecha_inicio) }}
                  </span>
                  <span class="text-caption" v-if="actividad.fecha_cierre">
                    <v-icon x-small>mdi-calendar-end</v-icon>
                    {{ formatDate(actividad.fecha_cierre) }}
                  </span>
                  <span class="text-caption" v-if="actividad.responsable_info">
                    <v-icon x-small>mdi-account</v-icon>
                    {{ actividad.responsable_info.nombre_completo }}
                  </span>
                </div>

                <p class="text-body-2 mb-2" v-if="actividad.descripcion">
                  {{ actividad.descripcion }}
                </p>

                <!-- Información del proyecto -->
                <div v-if="actividad.proyecto_info" class="mb-2">
                  <v-chip size="x-small" color="info" variant="outlined" class="mr-1">
                    <v-icon x-small class="mr-1">mdi-briefcase</v-icon>
                    {{ actividad.proyecto_info.titulo }}
                  </v-chip>
                </div>

                <!-- Subactividades -->
                <div v-if="actividad.tareas && actividad.tareas.length > 0" class="mb-2">
                  <v-chip size="x-small" color="secondary" variant="outlined">
                    <v-icon x-small class="mr-1">mdi-playlist-check</v-icon>
                    {{ actividad.tareas.length }} subactividades
                  </v-chip>
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end gap-2">
                  <!-- Acción principal: Descargar Reporte -->
                  <v-tooltip text="Descargar Reporte en Word" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :icon="
                          descargandoReportes[actividad.id] ? 'mdi-loading' : 'mdi-microsoft-word'
                        "
                        variant="outlined"
                        color="primary"
                        :loading="descargandoReportes[actividad.id]"
                        :disabled="descargandoReportes[actividad.id] || exportandoTodos"
                        @click="descargarReporteActividad(actividad.id)"
                        size="small"
                      >
                        <template v-slot:loader>
                          <v-progress-circular
                            indeterminate
                            size="20"
                            width="2"
                          ></v-progress-circular>
                        </template>
                      </v-btn>
                    </template>
                  </v-tooltip>

                  <!-- Información adicional -->
                  <div class="text-right">
                    <div class="text-caption text-grey">ID: {{ actividad.id }}</div>
                    <div
                      v-if="actividad.tareas && actividad.tareas.length > 0"
                      class="text-caption text-info"
                    >
                      <v-icon x-small>mdi-format-list-bulleted</v-icon>
                      Con subactividades
                    </div>
                  </div>
                </div>
              </template>
            </v-list-item>

            <v-divider
              v-if="actividad.id !== actividadesPaginadas[actividadesPaginadas.length - 1]?.id"
            ></v-divider>
          </template>

          <v-list-item v-if="filteredActividades.length === 0 && !loading">
            <v-list-item-title class="text-grey text-center py-4">
              No se encontraron actividades con los filtros aplicados
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- Paginación -->
        <div v-if="filteredActividades.length" class="pagination-section mt-4">
          <div class="d-flex align-center justify-space-between">
            <span class="text-caption text-medium-emphasis">
              Mostrando {{ startItem }}-{{ endItem }} de
              {{ filteredActividades.length }} actividades
            </span>

            <div class="d-flex align-center gap-2">
              <span class="text-caption text-medium-emphasis">Items por página:</span>
              <v-select
                v-model="itemsPerPage"
                :items="[5, 10, 20, 50]"
                density="compact"
                hide-details
                style="max-width: 100px"
                variant="outlined"
              ></v-select>

              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                rounded
                size="small"
              ></v-pagination>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useActividadStore } from '@/modules/proyecto/store/useActividadStore'
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'
import { reportesServicios } from '@/modules/reportes/services/reportesService'

// ==============================================
// ESTADO INICIAL
// ==============================================

// Stores y composables
const storeActividad = useActividadStore()
const { proyectos: listaProyectos, obtenerProyectos } = useProyectoCrud()

// Datos
const actividades = ref([])
const proyectosOptions = ref([])
const loading = ref(true)
const emptyResponse = ref(false)

// Estados y filtros
const searchQuery = ref('')
const filtroEstado = ref(null)
const filtroProyecto = ref(null)
const statusFilters = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Estados para control de descarga de reportes
const descargandoReportes = ref({})
const exportandoTodos = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Opciones de estado
const availableStatuses = [
  { value: 'CRD', text: 'Creada' },
  { value: 'PLAN', text: 'Planificada' },
  { value: 'RETR', text: 'Retraso' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

const estadosOptions = [
  { value: 'CRD', title: 'Creada' },
  { value: 'PLAN', title: 'Planificada' },
  { value: 'RETR', title: 'Retraso' },
  { value: 'REPROG', title: 'Reprogramación' },
  { value: 'EJEC', title: 'En Ejecución' },
  { value: 'REP', title: 'En Reporte' },
  { value: 'FIN', title: 'Finalizado' },
]

// ==============================================
// COMPUTED PROPERTIES
// ==============================================

const filtrosActivos = computed(() => {
  return (
    searchQuery.value ||
    filtroEstado.value ||
    filtroProyecto.value ||
    statusFilters.value.length > 0
  )
})

const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = actividades.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.nombreCorto && actividad.nombreCorto.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)),
    )
  }

  // Filtrar por estado (select)
  if (filtroEstado.value) {
    filtered = filtered.filter((actividad) => actividad.estado === filtroEstado.value)
  }

  // Filtrar por estado (chips)
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }

  // Filtrar por proyecto
  if (filtroProyecto.value) {
    filtered = filtered.filter((actividad) => {
      // Asumiendo que actividad tiene un campo proyecto_id o similar
      return (
        actividad.proyecto_id === filtroProyecto.value ||
        (actividad.proyecto_info && actividad.proyecto_info.id === filtroProyecto.value)
      )
    })
  }

  return filtered
})

const actividadesPaginadas = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return []
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return Math.ceil(filteredActividades.value.length / itemsPerPage.value)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  const end = currentPage.value * itemsPerPage.value
  return end > filteredActividades.value.length ? filteredActividades.value.length : end
})

// ==============================================
// MÉTODOS DE REPORTES
// ==============================================

const descargarReporteActividad = async (idActividad) => {
  // Validar que el ID sea válido
  if (!idActividad) {
    mostrarSnackbar('ID de actividad no válido', 'error')
    return
  }

  // Marcar como descargando
  descargandoReportes.value = {
    ...descargandoReportes.value,
    [idActividad]: true,
  }

  try {
    // Encontrar la actividad para mostrar información relevante
    const actividad = actividades.value.find((a) => a.id === idActividad)
    const nombreActividad = actividad
      ? `${actividad.codigo} - ${actividad.nombreCorto}`
      : `Actividad ${idActividad}`

    mostrarSnackbar(`Generando reporte para "${nombreActividad}"...`, 'info')

    // Llamar al servicio
    await reportesServicios.reporteActividad(idActividad)

    mostrarSnackbar(`Reporte "${nombreActividad}" descargado exitosamente`, 'success')
  } catch (error) {
    console.error('Error al descargar reporte de actividad:', error)

    let mensajeError = 'Error al descargar el reporte'
    if (error.response) {
      // Error de respuesta del servidor
      switch (error.response.status) {
        case 404:
          mensajeError = 'No se encontró la actividad solicitada'
          break
        case 500:
          mensajeError = 'Error interno del servidor al generar el reporte'
          break
        default:
          mensajeError = `Error del servidor: ${error.response.status}`
      }
    } else if (error.request) {
      // Error de red
      mensajeError = 'Error de conexión. Verifique su internet'
    } else {
      // Otros errores
      mensajeError = error.message || 'Error desconocido'
    }

    mostrarSnackbar(mensajeError, 'error')
  } finally {
    // Quitar el estado de descargando
    descargandoReportes.value = {
      ...descargandoReportes.value,
      [idActividad]: false,
    }
  }
}

const exportarTodosReportes = async () => {
  if (!filteredActividades.value.length) {
    mostrarSnackbar('No hay actividades para exportar', 'warning')
    return
  }

  exportandoTodos.value = true

  try {
    mostrarSnackbar(`Iniciando descarga de ${filteredActividades.value.length} reportes...`, 'info')

    let exitosos = 0
    let fallidos = 0

    // Descargar reportes uno por uno
    for (const actividad of filteredActividades.value) {
      try {
        await descargarReporteActividad(actividad.id)
        exitosos++

        // Pequeña pausa entre descargas para no saturar el servidor
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error al descargar reporte de actividad ${actividad.id}:`, error)
        fallidos++
      }
    }

    if (fallidos === 0) {
      mostrarSnackbar(`Todos los ${exitosos} reportes han sido descargados exitosamente`, 'success')
    } else {
      mostrarSnackbar(
        `Descarga completada: ${exitosos} exitosos, ${fallidos} fallidos`,
        fallidos === filteredActividades.value.length ? 'error' : 'warning',
      )
    }
  } catch (error) {
    console.error('Error en exportación masiva:', error)
    mostrarSnackbar('Error en la exportación masiva de reportes', 'error')
  } finally {
    exportandoTodos.value = false
  }
}

// ==============================================
// MÉTODOS DE UTILIDAD
// ==============================================

const getStatusColor = (status) => {
  const colors = {
    CRD: 'grey',
    PLAN: 'light-blue',
    RETR: 'red',
    REPROG: 'yellow',
    EJEC: 'orange',
    REP: 'light-green',
    FIN: 'green',
  }
  return colors[status] || 'grey'
}

const getTipoIcon = (status) => {
  const icons = {
    CRD: 'mdi-plus-circle',
    PLAN: 'mdi-calendar-check-outline',
    RETR: 'mdi-calendar-alert',
    REPROG: 'mdi-calendar-refresh',
    EJEC: 'mdi-calendar-arrow-right',
    REP: 'mdi-calendar-edit',
    FIN: 'mdi-calendar-done',
  }
  return icons[status] || 'mdi-help-circle'
}

const getEstadoDisplay = (status) => {
  const estados = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
  }
  return estados[status] || status
}

const formatCurrency = (value) => {
  if (!value) return 'Bs. 0.00'
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'Bs. 0.00'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'N/A'
  }
}

// ==============================================
// ACCIONES DE FILTROS
// ==============================================

const aplicarFiltros = () => {
  currentPage.value = 1
}

const limpiarFiltros = () => {
  searchQuery.value = ''
  filtroEstado.value = null
  filtroProyecto.value = null
  statusFilters.value = []
  currentPage.value = 1
}

// ==============================================
// ACCIONES DE NOTIFICACIONES
// ==============================================

const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

// ==============================================
// CARGA DE DATOS
// ==============================================

const cargarDatos = async () => {
  loading.value = true
  emptyResponse.value = false
  try {
    // Cargar actividades
    await storeActividad.cargarActividadesTareas()
    actividades.value = storeActividad.actividadesFiltradas || []

    // Cargar proyectos para el filtro
    await obtenerProyectos()
    proyectosOptions.value = listaProyectos.value || []

    emptyResponse.value = actividades.value.length === 0
  } catch (error) {
    console.error('Error al cargar datos:', error)
    actividades.value = []
    emptyResponse.value = true
    mostrarSnackbar('Error al cargar los datos: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

// ==============================================
// HOOKS DE CICLO DE VIDA
// ==============================================

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.reportes-actividades-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.actividad-list-item {
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 16px;
}

.actividad-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-list-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.v-list-item-subtitle {
  opacity: 1;
}

.text-caption {
  font-size: 0.75rem;
}

.gap-2 {
  gap: 8px;
}

.pagination-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
}

/* Estilos para el estado de carga de reportes */
.v-btn--loading .v-icon {
  opacity: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .reportes-actividades-layout {
    padding: 12px;
  }

  .actividad-list-item {
    padding: 12px;
  }
}

@media (max-width: 600px) {
  .actividad-list-item {
    flex-direction: column;
    align-items: stretch;
  }

  .actividad-list-item :deep(.v-list-item__prepend) {
    align-self: center;
    margin-bottom: 12px;
  }

  .actividad-list-item :deep(.v-list-item__append) {
    align-self: stretch;
    margin-top: 12px;
  }

  .d-flex.gap-2 {
    flex-direction: column;
    gap: 8px;
  }

  .pagination-section .d-flex {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}

/* Animaciones */
.actividad-list-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .actividad-list-item {
    animation: none;
  }
}
</style>
