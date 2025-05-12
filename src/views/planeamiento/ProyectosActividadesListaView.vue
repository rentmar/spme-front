<template>
  <v-container>
    <!-- Encabezado principal -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold primary--text">
          <v-icon large color="primary" class="mr-2">mdi-calendar-multiple</v-icon>
          Planificación de Actividades
        </h1>
        <!-- <v-breadcrumbs :items="breadcrumbs" class="px-0"></v-breadcrumbs> -->
        <p class="text-subtitle-1 text-grey-darken-1">
          Gestión y seguimiento de actividades asociadas a proyectos y PEI
        </p>
      </v-col>
    </v-row>
    <!-- Indicador de carga lineal -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="mb-4"
    ></v-progress-linear>

    <v-row>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <span>Planificacion de {{ getListTitle() }}</span>
              <v-select
                v-model="listType"
                :items="listTypes"
                density="compact"
                variant="outlined"
                class="ml-4"
                style="max-width: 200px"
                @update:modelValue="handleListTypeChange"
              ></v-select>
            </div>
            <span class="text-caption text-grey">Total: {{ filteredItems.length }}</span>
          </v-card-title>

          <!-- Buscador -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              :label="`Buscar ${getSearchLabel()} (por código o título)`"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <!-- Filtros por estado (solo para proyectos) -->
            <v-chip-group
              v-model="statusFilters"
              multiple
              column
              class="mt-2"
              v-if="showStatusFilters"
            >
              <v-chip
                v-for="status in availableStatuses"
                :key="status.value"
                :value="status.value"
                filter
                :color="getStatusColor(status.value)"
                variant="outlined"
              >
                {{ status.text }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="item in paginatedItems" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getItemColor(item)" class="mr-4">
                    <v-icon dark>{{ getItemIcon(item) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small :color="getItemColor(item)" text-color="white" class="mr-2">
                      {{ getItemStatus(item) }}
                    </v-chip>
                    <span>Código: {{ item.codigo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <!-- Botón de Gantt (para todos los items) -->
                    <v-tooltip text="Diagrama de Gantt" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chart-gantt"
                          variant="text"
                          color="indigo"
                          @click="openGantt(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Botón de Agregar Actividad (solo para proyectos) -->
                    <v-tooltip v-if="isProyecto(item)" text="Agregar actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-plus-box"
                          variant="text"
                          color="teal"
                          @click="addActivity(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Botón de Editar (para actividades PEI) -->
                    <v-tooltip v-if="!isProyecto(item)" text="Editar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          color="warning"
                          @click="editActivity(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Ver detalles" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eye-outline"
                          variant="text"
                          color="primary"
                          :to="getDetailRoute(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Vista rápida" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedItemId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedItemId === item.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-card-text class="pt-4">
                      <v-row>
                        <v-col cols="12" md="6">
                          <p><strong>Descripción:</strong> {{ item.descripcion }}</p>
                          <p><strong>Estado:</strong> {{ getItemStatus(item) }}</p>
                          <p><strong>Código:</strong> {{ item.codigo }}</p>
                          <p v-if="isProyecto(item)">
                            <strong>Instancia gestora:</strong> {{ item.instancia_gestora }}
                          </p>
                        </v-col>
                        <v-col cols="12" md="6">
                          <p>
                            <strong>Fecha de creación:</strong>
                            {{ formatDate(item.fecha_creacion) }}
                          </p>
                          <p><strong>Creado por:</strong> {{ item.creado_por }}</p>
                          <p v-if="item.fecha_inicio">
                            <strong>Fecha inicio:</strong> {{ formatDate(item.fecha_inicio) }}
                          </p>
                          <p v-if="item.fecha_finalizacion">
                            <strong>Fecha finalización:</strong>
                            {{ formatDate(item.fecha_finalizacion) }}
                          </p>
                        </v-col>
                      </v-row>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="getDetailRoute(item)"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredItems.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron items</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Paginación -->
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          ></v-pagination>

          <div
            v-if="filteredItems.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredItems.length }}
            </span>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50]"
              label="Items por página"
              density="compact"
              style="max-width: 150px"
              variant="outlined"
            ></v-select>
          </div>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de acciones -->
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            PEI
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item
              v-if="showProyectoActions"
              to="/planificacion/pei/1/actividad"
              title="Agregar Actividad PEI"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <!-- <v-list-item
              title="Exportar lista"
              prepend-icon="mdi-file-export"
              @click="exportToExcel"
            ></v-list-item> -->
          </v-list>
        </v-card>

        <!-- Tarjeta de estadísticas -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-file-document-multiple</v-icon>
              </template>
              <v-list-item-title>Total items</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredItems.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <template v-if="showProyectoStats">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-cog-box</v-icon>
                </template>
                <v-list-item-title>En Estructuración</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByStatus('ES') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-play-circle</v-icon>
                </template>
                <v-list-item-title>En ejecución</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByStatus('EJ') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="info">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Completados</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByStatus('CO') }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <v-list-item v-if="showActividadStats">
              <template v-slot:prepend>
                <v-icon color="teal">mdi-checkbox-marked-circle</v-icon>
              </template>
              <v-list-item-title>Actividades completadas</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countActividadesByStatus('completada') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de Gantt -->
    <v-dialog v-model="ganttDialog" max-width="900">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left>mdi-chart-gantt</v-icon>
          Diagrama de Gantt - {{ selectedItem?.titulo }}
        </v-card-title>
        <v-card-text>
          <!-- Aquí iría el componente de Gantt -->
          <div class="gantt-placeholder pa-10 text-center">
            <v-icon size="100" color="grey-lighten-2">mdi-chart-gantt</v-icon>
            <p class="text-grey">Visualización del diagrama de Gantt</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="ganttDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar "{{ itemToDelete?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteItem">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '@/utility/formatters'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos dummy
const proyectos = ref([
  {
    id: 1,
    tipo: 'proyecto',
    codigo: 'PROY-2023-001',
    titulo: 'Implementación de Sistema de Gestión',
    descripcion: 'Proyecto para implementar un nuevo sistema de gestión empresarial',
    estado: 'EJ',
    instancia_gestora: 'Departamento de TI',
    fecha_creacion: '2023-01-15',
    creado_por: 'Admin',
    fecha_inicio: '2023-02-01',
    fecha_finalizacion: '2023-12-31',
  },
  {
    id: 2,
    tipo: 'proyecto',
    codigo: 'PROY-2023-002',
    titulo: 'Capacitación de Personal',
    descripcion: 'Programa de capacitación para empleados',
    estado: 'ES',
    instancia_gestora: 'RRHH',
    fecha_creacion: '2023-02-10',
    creado_por: 'Admin',
    fecha_inicio: null,
    fecha_finalizacion: null,
  },
  {
    id: 3,
    tipo: 'proyecto',
    codigo: 'PROY-2023-003',
    titulo: 'Renovación de Infraestructura',
    descripcion: 'Actualización de equipos y mobiliario',
    estado: 'CO',
    instancia_gestora: 'Logística',
    fecha_creacion: '2022-11-05',
    creado_por: 'Admin',
    fecha_inicio: '2022-12-01',
    fecha_finalizacion: '2023-05-30',
  },
])

const actividadesPEI = ref([
  {
    id: 101,
    tipo: 'actividad',
    codigo: 'ACT-2023-001',
    titulo: 'Reunión de planificación estratégica',
    descripcion: 'Reunión para definir objetivos anuales',
    estado: 'completada',
    fecha_creacion: '2023-01-05',
    creado_por: 'Jefe de Planeación',
    fecha_inicio: '2023-01-10',
    fecha_finalizacion: '2023-01-10',
    proyecto_id: null,
  },
  {
    id: 102,
    tipo: 'actividad',
    codigo: 'ACT-2023-002',
    titulo: 'Elaboración de informe anual',
    descripcion: 'Preparación del informe de gestión anual',
    estado: 'en_progreso',
    fecha_creacion: '2023-11-15',
    creado_por: 'Analista',
    fecha_inicio: '2023-11-20',
    fecha_finalizacion: '2023-12-15',
    proyecto_id: null,
  },
  {
    id: 103,
    tipo: 'actividad',
    codigo: 'ACT-2023-003',
    titulo: 'Evaluación de proveedores',
    descripcion: 'Análisis y evaluación de proveedores estratégicos',
    estado: 'pendiente',
    fecha_creacion: '2023-02-20',
    creado_por: 'Compras',
    fecha_inicio: '2023-03-01',
    fecha_finalizacion: '2023-03-15',
    proyecto_id: 1,
  },
])

// Estados
const loading = ref(false)
const error = ref(null)
const deleteDialog = ref(false)
const itemToDelete = ref(null)
const expandedItemId = ref(null)
const searchQuery = ref('')
const ganttDialog = ref(false)
const selectedItem = ref(null)

// Configuración de listado
const listType = ref('proyectos') // 'proyectos', 'actividades', 'ambos'
const listTypes = ref([
  { title: 'Proyectos', value: 'proyectos' },
  { title: 'Actividades PEI', value: 'actividades' },
  { title: 'Todos', value: 'ambos' },
])

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filtros
const statusFilters = ref([])
const availableStatuses = [
  { text: 'En Estructuración', value: 'ES' },
  { text: 'En Ejecución', value: 'EJ' },
  { text: 'Completado', value: 'CO' },
  { text: 'Suspendido', value: 'SU' },
]

// Computed
const showStatusFilters = computed(() => {
  return listType.value === 'proyectos' || listType.value === 'ambos'
})

const showProyectoActions = computed(() => {
  return listType.value === 'proyectos' || listType.value === 'ambos'
})

/*
const showActividadActions = computed(() => {
  return listType.value === 'actividades' || listType.value === 'ambos'
})*/

const showProyectoStats = computed(() => {
  return listType.value === 'proyectos' || listType.value === 'ambos'
})

const showActividadStats = computed(() => {
  return listType.value === 'actividades' || listType.value === 'ambos'
})

const combinedItems = computed(() => {
  let items = []

  if (listType.value === 'proyectos') {
    items = [...proyectos.value]
  } else if (listType.value === 'actividades') {
    items = [...actividadesPEI.value]
  } else {
    items = [...proyectos.value, ...actividadesPEI.value]
  }

  return items
})

const filteredItems = computed(() => {
  let filtered = combinedItems.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.codigo.toLowerCase().includes(query) || item.titulo.toLowerCase().includes(query),
    )
  }

  // Filtro por estado (solo para proyectos)
  if (statusFilters.value.length > 0 && showStatusFilters.value) {
    filtered = filtered.filter((item) => {
      if (item.tipo === 'proyecto') {
        return statusFilters.value.includes(item.estado)
      }
      return true // Mantener actividades si no es filtro de proyectos
    })
  }

  return filtered
})

// Paginación
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredItems.value.length ? filteredItems.value.length : end
})

// Métodos

const getListTitle = () => {
  switch (listType.value) {
    case 'proyectos':
      return 'Proyectos y sus Actividades'
    case 'actividades':
      return 'Actividades PEI'
    default:
      return 'Proyectos y Actividades PEI'
  }
}

const getSearchLabel = () => {
  switch (listType.value) {
    case 'proyectos':
      return 'proyectos'
    case 'actividades':
      return 'actividades'
    default:
      return 'items'
  }
}

const isProyecto = (item) => {
  return item.tipo === 'proyecto'
}

const getItemColor = (item) => {
  if (isProyecto(item)) {
    return getStatusColor(item.estado)
  } else {
    switch (item.estado) {
      case 'completada':
        return 'success'
      case 'en_progreso':
        return 'warning'
      default:
        return 'grey'
    }
  }
}

const getItemIcon = (item) => {
  return isProyecto(item) ? 'mdi-notebook' : 'mdi-checkbox-marked-circle-outline'
}

const getItemStatus = (item) => {
  if (isProyecto(item)) {
    switch (item.estado) {
      case 'ES':
        return 'En Estructuración'
      case 'EJ':
        return 'En Ejecución'
      case 'CO':
        return 'Completado'
      case 'SU':
        return 'Suspendido'
      default:
        return item.estado
    }
  } else {
    switch (item.estado) {
      case 'completada':
        return 'Completada'
      case 'en_progreso':
        return 'En progreso'
      case 'pendiente':
        return 'Pendiente'
      default:
        return item.estado
    }
  }
}

const getDetailRoute = (item) => {
  return isProyecto(item) ? `/proyecto/${item.id}/detalle` : `/actividad/${item.id}/detalle`
}

const getStatusColor = (status) => {
  switch (status) {
    case 'ES':
      return 'warning'
    case 'EJ':
      return 'success'
    case 'CO':
      return 'info'
    case 'SU':
      return 'error'
    default:
      return 'grey'
  }
}

const handleListTypeChange = () => {
  currentPage.value = 1
  statusFilters.value = []
}

const countByStatus = (status) => {
  return filteredItems.value.filter((item) => isProyecto(item) && item.estado === status).length
}

const countActividadesByStatus = (status) => {
  return filteredItems.value.filter((item) => !isProyecto(item) && item.estado === status).length
}

const toggleExpanded = (id) => {
  expandedItemId.value = expandedItemId.value === id ? null : id
}

const openGantt = (item) => {
  selectedItem.value = item
  ganttDialog.value = true
}

const addActivity = (proyecto) => {
  //alert(`Agregar actividad al proyecto: ${proyecto.titulo}`)
  //Navegar a formulario de nueva actividad
  //router.push(`/planificacion/proyecto/${proyecto.id}/actividad`)
  router.push('/planificacion/proyecto/' + proyecto.id + '/actividad')
}

const editActivity = (actividad) => {
  alert(`Editar actividad: ${actividad.titulo}`)
  // En implementación real: navegar a formulario de edición
  // router.push(`/actividad/${actividad.id}/editar`)
}

/*
const confirmDelete = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
}*/

const deleteItem = async () => {
  try {
    loading.value = true
    // Simular eliminación
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (isProyecto(itemToDelete.value)) {
      proyectos.value = proyectos.value.filter((p) => p.id !== itemToDelete.value.id)
    } else {
      actividadesPEI.value = actividadesPEI.value.filter((a) => a.id !== itemToDelete.value.id)
    }

    deleteDialog.value = false
  } catch (err) {
    error.value = 'Error al eliminar: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al eliminar', err)
  } finally {
    loading.value = false
  }
}

/*
const exportToExcel = () => {
  alert('Exportar a Excel')
}*/

// Agregar en la sección de estados (ref)
/*const breadcrumbs = ref([
  {
    title: 'Inicio',
    disabled: false,
    to: '/',
  },
  {
    title: 'Planificación',
    disabled: false,
    to: '/planificacion',
  },
  {
    title: 'Actividades',
    disabled: true,
    to: '/planificacion/actividades',
  },
])*/
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.v-pagination {
  justify-content: center;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.gantt-placeholder {
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
