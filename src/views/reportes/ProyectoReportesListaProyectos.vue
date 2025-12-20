<template>
  <div class="reportes-proyectos-layout">
    <!-- Encabezado -->
    <PaginaTituloIcono :titulo="'Reportes por Proyecto'" :icon="'mdi-briefcase-check'" />

    <v-breadcrumbs :items="['Reportes', 'Proyectos']" class="px-0 mb-2"></v-breadcrumbs>

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
              v-model="search"
              label="Buscar proyectos (por código o título)..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              @update:modelValue="aplicarFiltros"
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

          <!-- Filtro por instancia gestora -->
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filtroInstancia"
              :items="instanciasGestoras"
              item-title="instancia"
              item-value="id"
              label="Instancia Gestora"
              variant="outlined"
              density="compact"
              multiple
              chips
              closable-chips
              clearable
              hide-details
              @update:modelValue="aplicarFiltros"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" variant="outlined" size="small">
                  <span class="font-weight-bold mr-1">{{ item.raw.codigo }}</span>
                </v-chip>
              </template>
            </v-autocomplete>
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

    <!-- Mensaje cuando no hay proyectos -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-briefcase-off</v-icon>
        <h3 class="text-h5 mt-4">No hay proyectos registrados</h3>
        <p class="text-grey mt-2">No se encontraron proyectos para mostrar reportes</p>
        <v-btn color="primary" @click="limpiarFiltros" class="mt-4">
          <v-icon left>mdi-refresh</v-icon>
          Recargar
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Contenido principal -->
    <v-card v-else elevation="1" rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center py-3">
        <div>
          <span class="text-h6">Proyectos para Reportes</span>
          <span class="text-caption text-medium-emphasis ml-2">
            ({{ proyectosFiltrados.length }} resultados)
          </span>
        </div>

        <!-- Acciones globales -->
        <div class="d-flex gap-2">
          <!-- <v-btn
            color="primary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-file-export"
            @click="exportarTodosReportes"
          >
            Exportar Todos
          </v-btn>
          <v-btn
            color="secondary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-chart-box"
            :to="'/reporte/consolidado'"
          >
            Reporte Consolidado
          </v-btn> -->
        </div>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Filtros por estado con chips -->
        <div class="mb-4">
          <v-chip-group v-model="filtrosEstadoChips" multiple column>
            <v-chip
              v-for="status in estadosOptions"
              :key="status.value"
              :value="status.value"
              filter
              :color="getStatusColor(status.value)"
              variant="outlined"
              size="small"
            >
              {{ status.title }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Lista de proyectos -->
        <v-list v-if="!loading" class="py-0">
          <template v-for="proyecto in proyectosFiltradosPagados" :key="proyecto.id">
            <v-list-item class="mb-2 project-list-item">
              <template v-slot:prepend>
                <v-avatar :color="getStatusColor(proyecto.estado)" class="mr-4" size="48">
                  <v-icon dark>mdi-briefcase-check</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold text-h6">
                {{ proyecto.titulo }}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-2">
                <div class="d-flex align-center flex-wrap gap-2 mb-2">
                  <v-chip small :color="getStatusColor(proyecto.estado)" text-color="white">
                    {{ getStatusText(proyecto.estado) }}
                  </v-chip>
                  <span class="text-caption">
                    <v-icon x-small>mdi-identifier</v-icon>
                    {{ proyecto.codigo }}
                  </span>
                  <span class="text-caption">
                    <v-icon x-small>mdi-cash</v-icon>
                    ${{ formatCurrency(proyecto.presupuesto) }}
                  </span>
                  <span class="text-caption">
                    <v-icon x-small>mdi-calendar</v-icon>
                    {{ formatDateShort(proyecto.fecha_creacion) }}
                  </span>
                  <span class="text-caption">
                    <v-icon x-small>mdi-account</v-icon>
                    {{ proyecto.creado_por }}
                  </span>
                </div>

                <p class="text-body-2 mb-2">{{ proyecto.descripcion }}</p>

                <!-- Instancias gestoras -->
                <div
                  v-if="proyecto.instanciasNombres && proyecto.instanciasNombres.length"
                  class="mb-2"
                >
                  <v-chip
                    v-for="(instancia, index) in proyecto.instanciasNombres"
                    :key="index"
                    size="x-small"
                    color="info"
                    variant="outlined"
                    class="mr-1 mb-1"
                  >
                    {{ truncateText(instancia, 25) }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end gap-2">
                  <!-- Acciones principales -->
                  <div class="d-flex gap-1">
                    <v-tooltip text="Reportes principales" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chart-bar"
                          variant="flat"
                          color="primary"
                          :to="`/reporte/proyectos/${proyecto.id}`"
                          size="small"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- <v-tooltip text="Reportes guardados" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-bookmark-multiple"
                          variant="outlined"
                          color="secondary"
                          :to="`/reporte/proyectos/${proyecto.id}/guardados`"
                          size="small"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Exportar reporte" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-export"
                          variant="outlined"
                          color="success"
                          @click="exportarReporte(proyecto)"
                          size="small"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->
                  </div>

                  <!-- Reportes rápidos -->
                  <div class="d-flex flex-wrap gap-1 justify-end">
                    <!-- <v-btn
                      size="x-small"
                      color="primary"
                      variant="text"
                      :to="`/reporte/proyectos/${proyecto.id}/avance`"
                    >
                      Avance
                    </v-btn>
                    <v-btn
                      size="x-small"
                      color="success"
                      variant="text"
                      :to="`/reporte/proyectos/${proyecto.id}/financiero`"
                    >
                      Financiero
                    </v-btn>
                    <v-btn
                      size="x-small"
                      color="info"
                      variant="text"
                      :to="`/reporte/proyectos/${proyecto.id}/indicadores`"
                    >
                      Indicadores
                    </v-btn> -->
                  </div>
                </div>
              </template>
            </v-list-item>

            <v-divider
              v-if="
                proyecto.id !== proyectosFiltradosPagados[proyectosFiltradosPagados.length - 1]?.id
              "
            ></v-divider>
          </template>

          <v-list-item v-if="proyectosFiltrados.length === 0 && !loading">
            <v-list-item-title class="text-grey text-center py-4">
              No se encontraron proyectos con los filtros aplicados
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- Paginación -->
        <div v-if="proyectosFiltrados.length" class="pagination-section mt-4">
          <div class="d-flex align-center justify-space-between">
            <span class="text-caption text-medium-emphasis">
              Mostrando {{ startItem }}-{{ endItem }} de {{ proyectosFiltrados.length }} proyectos
            </span>

            <div class="d-flex align-center gap-2">
              <span class="text-caption text-medium-emphasis">Items por página:</span>
              <v-select
                v-model="itemsPorPagina"
                :items="[5, 10, 20, 50]"
                density="compact"
                hide-details
                style="max-width: 100px"
                variant="outlined"
              ></v-select>

              <v-pagination
                v-model="paginaActual"
                :length="totalPaginas"
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
import { useInstanciaGestora } from '@/modules/instanciaGestora/composables/useInstanciaGestora'
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'

// ==============================================
// ESTADO INICIAL - DATOS VACÍOS (SE LLENARÁN CON API)
// ==============================================

// Datos que vendrán del endpoint único
const instanciasGestoras = ref([])
const proyectos = ref([])
const loading = ref(true)
const error = ref(null)
const emptyResponse = ref(false)

// Estados y filtros
const search = ref('')
const filtroEstado = ref(null)
const filtroInstancia = ref([])
const filtrosEstadoChips = ref([])
const paginaActual = ref(1)
const itemsPorPagina = ref(10)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Opciones de estado
const estadosOptions = [
  { value: 'EP', title: 'En espera' },
  { value: 'EJ', title: 'En ejecución' },
  { value: 'PL', title: 'Planificación' },
  { value: 'CO', title: 'Completado' },
  { value: 'CA', title: 'Cancelado' },
]

// ==============================================
// COMPUTED PROPERTIES
// ==============================================

const filtrosInstanciaSeleccionados = computed(() => {
  return Array.isArray(filtroInstancia.value) ? filtroInstancia.value : [filtroInstancia.value]
})

const filtrosActivos = computed(() => {
  return (
    search.value ||
    filtroEstado.value ||
    filtrosInstanciaSeleccionados.value.length > 0 ||
    filtrosEstadoChips.value.length > 0
  )
})

const proyectosFiltrados = computed(() => {
  return proyectos.value.filter((proyecto) => {
    // Filtro por texto de búsqueda
    if (search.value) {
      const searchLower = search.value.toLowerCase()
      if (
        !(
          proyecto.codigo.toLowerCase().includes(searchLower) ||
          proyecto.titulo.toLowerCase().includes(searchLower) ||
          proyecto.descripcion.toLowerCase().includes(searchLower) ||
          proyecto.creado_por.toLowerCase().includes(searchLower)
        )
      ) {
        return false
      }
    }

    // Filtro por estado (select)
    if (filtroEstado.value && proyecto.estado !== filtroEstado.value) {
      return false
    }

    // Filtro por estado (chips)
    if (
      filtrosEstadoChips.value.length > 0 &&
      !filtrosEstadoChips.value.includes(proyecto.estado)
    ) {
      return false
    }

    // Filtro por instancia gestora
    if (filtrosInstanciaSeleccionados.value.length > 0) {
      const tieneInstancia = proyecto.instancia_gestora.some((id) =>
        filtrosInstanciaSeleccionados.value.includes(id),
      )
      if (!tieneInstancia) return false
    }

    return true
  })
})

// Paginación
const totalPaginas = computed(() => {
  return Math.ceil(proyectosFiltrados.value.length / itemsPorPagina.value)
})

const proyectosFiltradosPagados = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value
  const end = start + itemsPorPagina.value
  return proyectosFiltrados.value.slice(start, end)
})

const startItem = computed(() => (paginaActual.value - 1) * itemsPorPagina.value + 1)
const endItem = computed(() => {
  const end = paginaActual.value * itemsPorPagina.value
  return end > proyectosFiltrados.value.length ? proyectosFiltrados.value.length : end
})

// ==============================================
// MÉTODOS DE UTILIDAD
// ==============================================

const getStatusText = (estado) => {
  const estados = {
    PL: 'Planificación',
    EJ: 'En ejecución',
    EP: 'En espera',
    CO: 'Completado',
    CA: 'Cancelado',
  }
  return estados[estado] || estado
}

const getStatusColor = (estado) => {
  const colores = {
    PL: 'warning',
    EJ: 'success',
    EP: 'info',
    CO: 'primary',
    CA: 'error',
  }
  return colores[estado] || 'grey'
}

const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      year: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('es-ES').format(parseFloat(amount))
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// ==============================================
// ACCIONES DE FILTROS
// ==============================================

const aplicarFiltros = () => {
  paginaActual.value = 1
}

const limpiarFiltros = () => {
  search.value = ''
  filtroEstado.value = null
  filtroInstancia.value = []
  filtrosEstadoChips.value = []
  paginaActual.value = 1
}

// ==============================================
// ACCIONES DE PROYECTOS
// ==============================================

const exportarReporte = (proyecto) => {
  console.log('Exportar reporte:', proyecto)
  mostrarSnackbar(`Exportando reporte de ${proyecto.titulo}`, 'info')
  // Lógica de exportación
}

const exportarTodosReportes = () => {
  console.log('Exportar todos los reportes')
  mostrarSnackbar('Preparando exportación de todos los reportes', 'info')
  // Lógica de exportación masiva
}

const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

// ==============================================
// LLAMADA AL ENDPOINT ÚNICO
// ==============================================

// Inicializar los composables
const { instancias, cargarInstancias } = useInstanciaGestora()
const { proyectos: listaProyectos, obtenerProyectos } = useProyectoCrud()

const cargarDatos = async () => {
  loading.value = true
  error.value = null
  emptyResponse.value = false
  try {
    await obtenerProyectos()
    await cargarInstancias()
    console.log(listaProyectos)
    proyectos.value = listaProyectos.value
    instanciasGestoras.value = instancias.value

    if (proyectos.value.length === 0) {
      emptyResponse.value = true
    }
  } catch (er) {
    console.error(er)
    error.value = er.message
    mostrarSnackbar('Error al cargar los proyectos', 'error')
  } finally {
    loading.value = false
  }
}

// ==============================================
// HOOKS DE CICLO DE VIDA
// ==============================================

onMounted(() => {
  // CARGAR DATOS AL INICIAR EL COMPONENTE
  cargarDatos()
})
</script>

<style scoped>
.reportes-proyectos-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.project-list-item {
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 16px;
}

.project-list-item:hover {
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

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.pagination-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
}

/* Responsive */
@media (max-width: 960px) {
  .reportes-proyectos-layout {
    padding: 12px;
  }

  .project-list-item {
    padding: 12px;
  }
}

@media (max-width: 600px) {
  .project-list-item {
    flex-direction: column;
    align-items: stretch;
  }

  .project-list-item :deep(.v-list-item__prepend) {
    align-self: center;
    margin-bottom: 12px;
  }

  .project-list-item :deep(.v-list-item__append) {
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
.project-list-item {
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
  .project-list-item {
    animation: none;
  }
}
</style>
