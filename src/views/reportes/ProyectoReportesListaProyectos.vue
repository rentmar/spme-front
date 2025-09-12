<template>
  <div class="proyectos-layout">
    <!-- Encabezado -->
    <PaginaTituloIcono :titulo="'Reportes por Proyecto'" :icon="'mdi-briefcase-check'" />

    <v-breadcrumbs :items="['Reportes', 'Proyectos']" class="px-0 mb-2"></v-breadcrumbs>

    <!-- Filtros en la parte superior -->
    <v-card elevation="1" rounded="lg" class="mb-3">
      <v-card-text class="py-3">
        <v-row dense align="center">
          <!-- Buscador general -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Buscar proyectos..."
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

    <!-- Contenido principal - Lista de proyectos -->
    <v-card elevation="1" rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center py-3">
        <div>
          <span class="text-h6">Proyectos</span>
          <span class="text-caption text-medium-emphasis ml-2">
            ({{ proyectosFiltrados.length }} resultados)
          </span>
        </div>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- Grid de proyectos compactos -->
        <v-row v-if="proyectosFiltrados.length" dense>
          <v-col
            v-for="proyecto in proyectosFiltradosPagados"
            :key="proyecto.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="project-card compact" elevation="1" hover>
              <!-- Header de la card -->
              <div class="card-header" :class="getStatusClass(proyecto.estado)">
                <div class="status-badge">
                  {{ getStatusText(proyecto.estado) }}
                </div>
                <h3 class="project-title">{{ proyecto.titulo }}</h3>
                <span class="project-code">{{ proyecto.codigo }}</span>
              </div>

              <!-- Body de la card -->
              <v-card-text class="card-body">
                <p class="project-description">{{ truncateText(proyecto.descripcion, 80) }}</p>

                <div class="project-details">
                  <div class="detail-item">
                    <v-icon x-small>mdi-cash</v-icon>
                    <span>${{ formatCurrency(proyecto.presupuesto) }}</span>
                  </div>
                  <div class="detail-item">
                    <v-icon x-small>mdi-account</v-icon>
                    <span>{{ proyecto.creado_por }}</span>
                  </div>
                </div>

                <!-- Instancias gestoras -->
                <div
                  class="instancias-section"
                  v-if="proyecto.instanciasNombres && proyecto.instanciasNombres.length"
                >
                  <div class="instancias-tags">
                    <v-chip
                      v-for="(instancia, index) in proyecto.instanciasNombres.slice(0, 2)"
                      :key="index"
                      size="x-small"
                      color="info"
                      variant="outlined"
                      class="mr-1 mb-1"
                    >
                      {{ truncateText(instancia, 15) }}
                    </v-chip>
                    <v-chip
                      v-if="proyecto.instanciasNombres.length > 2"
                      size="x-small"
                      color="secondary"
                      variant="outlined"
                    >
                      +{{ proyecto.instanciasNombres.length - 2 }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>

              <!-- Footer de la card -->
              <v-card-actions class="card-actions">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="x-small"
                      color="primary"
                      variant="text"
                      icon="mdi-eye"
                      :to="`/reporte/proyectos/${proyecto.id}`"
                    ></v-btn>
                  </template>
                  <span>Reportes</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="x-small"
                      color="primary"
                      variant="text"
                      icon="mdi-bookmark-multiple"
                      :to="`/reporte/proyectos/${proyecto.id}`"
                    ></v-btn>
                  </template>
                  <span>Reportes guardados</span>
                </v-tooltip>

                <v-spacer></v-spacer>

                <span class="text-caption text-medium-emphasis">
                  {{ formatDateShort(proyecto.fecha_creacion) }}
                </span>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Estado vacío -->
        <div v-else class="empty-state text-center py-8">
          <v-icon color="grey-lighten-1" size="48">mdi-briefcase-off</v-icon>
          <p class="text-grey mt-2">No se encontraron proyectos</p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="limpiarFiltros"
            size="small"
            class="mt-2"
          >
            Limpiar filtros
          </v-btn>
        </div>

        <!-- Paginación -->
        <div v-if="proyectosFiltrados.length" class="pagination-section mt-4">
          <div class="text-center">
            <v-pagination
              v-model="paginaActual"
              :length="totalPaginas"
              :total-visible="5"
              rounded
              size="small"
            ></v-pagination>
          </div>
        </div>
      </v-card-text>
    </v-card>
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

// Estados y filtros
const search = ref('')
const filtroEstado = ref(null)
const filtroInstancia = ref([])
const paginaActual = ref(1)
const itemsPorPagina = ref(12)

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
  return search.value || filtroEstado.value || filtrosInstanciaSeleccionados.value.length > 0
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

    // Filtro por estado
    if (filtroEstado.value && proyecto.estado !== filtroEstado.value) {
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

const getStatusClass = (estado) => {
  const clases = {
    PL: 'status-planning',
    EJ: 'status-executing',
    EP: 'status-pending',
    CO: 'status-completed',
    CA: 'status-cancelled',
  }
  return clases[estado] || 'status-unknown'
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
  paginaActual.value = 1
}

// ==============================================
// ACCIONES DE PROYECTOS
// ==============================================

const nuevoProyecto = () => {
  console.log('Nuevo proyecto')
}

const verDetalles = (proyecto) => {
  console.log('Ver detalles:', proyecto)
}

const editarProyecto = (proyecto) => {
  console.log('Editar proyecto:', proyecto)
}

// ==============================================
// LLAMADA AL ENDPOINT ÚNICO
// ==============================================
//Inicializar los composables
const { instancias, cargarInstancias } = useInstanciaGestora()
const { proyectos: listaProyectos, obtenerProyectos } = useProyectoCrud()

const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    await obtenerProyectos()
    await cargarInstancias()
    console.log(listaProyectos)
    proyectos.value = listaProyectos.value
    instanciasGestoras.value = instancias.value
  } catch (er) {
    console.error(er)
    throw error
  } finally {
    loading.value = false
  }
  // try {
  //   loading.value = true
  //   error.value = null
  //   // ✅ ESTA ES LA LLAMADA AL ENDPOINT ÚNICO
  //   const response = await fetch('/api/proyectos-con-instancias')
  //   if (!response.ok) {
  //     throw new Error(`Error ${response.status}: ${response.statusText}`)
  //   }
  //   const data = await response.json()
  //   // ✅ INSERTAR LOS DATOS DEL ENDPOINT AQUÍ
  //   proyectos.value = data.proyectos || []
  //   instanciasGestoras.value = data.instancias_gestoras || []
  // } catch (err) {
  //   error.value = err.message
  //   console.error('Error cargando datos:', err)
  // } finally {
  //   loading.value = false
  // }
}

// ==============================================
// HOOKS DE CICLO DE VIDA
// ==============================================

onMounted(() => {
  // ✅ CARGAR DATOS AL INICIAR EL COMPONENTE
  cargarDatos()
})
</script>

<style scoped>
.proyectos-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

/* Tarjetas compactas */
.project-card.compact {
  height: 220px;
  display: flex;
  flex-direction: column;
}

.project-card.compact .card-header {
  padding: 12px;
  min-height: 60px;
}

.project-card.compact .status-badge {
  top: 8px;
  right: 8px;
  font-size: 9px;
  padding: 1px 6px;
}

.project-card.compact .project-title {
  font-size: 0.9rem;
  line-height: 1.2;
  margin-bottom: 2px;
}

.project-card.compact .project-code {
  font-size: 0.7rem;
}

.project-card.compact .card-body {
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.project-card.compact .project-description {
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 8px;
  flex-grow: 1;
}

.project-card.compact .project-details {
  margin-bottom: 8px;
}

.project-card.compact .detail-item {
  font-size: 0.75rem;
  gap: 4px;
}

.project-card.compact .instancias-section {
  margin-top: auto;
  padding-top: 8px;
}

.project-card.compact .card-actions {
  padding: 6px 12px;
  min-height: auto;
}

/* Estados de tarjetas */
.card-header.status-planning {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}
.card-header.status-executing {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}
.card-header.status-pending {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}
.card-header.status-completed {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}
.card-header.status-cancelled {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}
.card-header.status-unknown {
  background: linear-gradient(135deg, #607d8b 0%, #455a64 100%);
}

/* Responsive */
@media (max-width: 960px) {
  .proyectos-layout {
    padding: 12px;
  }

  .project-card.compact {
    height: 200px;
  }
}

@media (max-width: 600px) {
  .project-card.compact {
    height: 180px;
  }

  .project-card.compact .card-header {
    padding: 8px;
    min-height: 50px;
  }

  .project-card.compact .project-title {
    font-size: 0.8rem;
  }
}
</style>
