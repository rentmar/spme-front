<template>
  <v-container>
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
            <span>Lista de Proyectos</span>
            <span class="text-caption text-grey">Total: {{ filteredProyectos.length }}</span>
          </v-card-title>

          <!-- Buscador -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar proyectos (por código o título)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="item in proyectosPaginados" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(item.estado)" class="mr-4">
                    <v-icon dark>mdi-notebook</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip
                      small
                      :color="getStatusColor(item.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getEstadoTexto(item.estado) }}
                    </v-chip>
                    <span>Código: {{ item.codigo }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Ver detalles" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eye-outline"
                          variant="text"
                          color="primary"
                          :to="`/proyecto/${item.id}/detalle`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Editar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          color="warning"
                          :to="`/proyecto/${item.id}/editar`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Eliminar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          @click="confirmDelete(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Marco Lógico" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-sitemap"
                          variant="text"
                          color="secondary"
                          :to="`/proyecto/${item.id}/marco-logico`"
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
                          :class="{ 'rotate-180': expandedProyectoId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable con Tabs -->
              <v-expand-transition>
                <div v-if="expandedProyectoId === item.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-tabs v-model="activeTab" color="primary" grow>
                      <v-tab value="datos">
                        <v-icon left>mdi-information</v-icon>
                        Datos
                      </v-tab>
                      <v-tab value="objetivos">
                        <v-icon left>mdi-target</v-icon>
                        Objetivos
                      </v-tab>
                      <v-tab value="resultados">
                        <v-icon left>mdi-check-all</v-icon>
                        Resultados
                      </v-tab>
                      <v-tab value="productos">
                        <v-icon left>mdi-package-variant</v-icon>
                        Productos
                      </v-tab>
                      <v-tab value="indicadores">
                        <v-icon left>mdi-chart-bar</v-icon>
                        Indicadores
                      </v-tab>
                    </v-tabs>

                    <v-card-text class="pt-4">
                      <v-window v-model="activeTab">
                        <!-- Tab Datos del Proyecto -->
                        <v-window-item value="datos">
                          <v-row>
                            <v-col cols="12" md="6">
                              <p><strong>Descripción:</strong> {{ item.descripcion }}</p>
                              <p><strong>Estado:</strong> {{ getEstadoTexto(item.estado) }}</p>
                              <p><strong>Código:</strong> {{ item.codigo }}</p>
                              <p>
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
                        </v-window-item>

                        <!-- Tab Objetivos -->
                        <v-window-item value="objetivos">
                          <v-alert type="info" variant="tonal">
                            Información de objetivos disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <!-- Tab Resultados -->
                        <v-window-item value="resultados">
                          <v-alert type="info" variant="tonal">
                            Información de resultados disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <!-- Tab Productos -->
                        <v-window-item value="productos">
                          <v-alert type="info" variant="tonal">
                            Información de productos disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <!-- Tab Indicadores -->
                        <v-window-item value="indicadores">
                          <v-alert type="info" variant="tonal">
                            Información de indicadores disponible en la vista completa
                          </v-alert>
                        </v-window-item>
                      </v-window>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="`/proyecto/${item.id}/detalle`"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredProyectos.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron proyectos</v-list-item-title>
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
            v-if="filteredProyectos.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredProyectos.length }}
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
            Acciones
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item
              to="/proyecto/nuevo"
              title="Nuevo Proyecto"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <v-list-item
              title="Exportar lista"
              prepend-icon="mdi-file-export"
              @click="exportToExcel"
            ></v-list-item>
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
              <v-list-item-title>Total proyectos</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredProyectos.length
              }}</v-list-item-subtitle>
            </v-list-item>

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
              <v-list-item-title>En ejecucion</v-list-item-title>
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

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="error">mdi-pause-octagon</v-icon>
              </template>
              <v-list-item-title>Suspendido</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('SU') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el proyecto "{{ proyectoToDelete?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProyecto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { formatDate, getStatusColor, getEstadoTexto } from '@/utility/formatters'

// El store de los proyectos
const proyectoStore = useProyectoStore()

// Estados
const loading = ref(false)
const error = ref(null)
const deleteDialog = ref(false)
const proyectoToDelete = ref(null)
const expandedProyectoId = ref(null)
const searchQuery = ref('')
const activeTab = ref('datos')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Obtener proyectos al montar el componente
onMounted(async () => {
  await cargarProyectos()
})

// Computed
const proyectos = computed(() => proyectoStore.proyectos)

// Filtrado de proyectos
const filteredProyectos = computed(() => {
  if (!searchQuery.value) return proyectos.value

  const query = searchQuery.value.toLowerCase()
  return proyectos.value.filter(
    (proyecto) =>
      proyecto.codigo.toLowerCase().includes(query) ||
      proyecto.titulo.toLowerCase().includes(query),
  )
})

// Paginación
const proyectosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProyectos.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProyectos.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredProyectos.value.length ? filteredProyectos.value.length : end
})

// Rutina de carga de proyectos
const cargarProyectos = async () => {
  try {
    loading.value = true
    error.value = null
    await proyectoStore.obtenerProyectos()
  } catch (err) {
    error.value =
      'Error al cargar los proyectos: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al cargar los proyectos', err)
  } finally {
    loading.value = false
  }
}

// Contador por estado
const countByStatus = (status) => {
  return filteredProyectos.value.filter((p) => p.estado === status).length
}

const confirmDelete = (proyecto) => {
  proyectoToDelete.value = proyecto
  deleteDialog.value = true
}

const deleteProyecto = async () => {
  try {
    loading.value = true
    await proyectoStore.eliminarProyecto(proyectoToDelete.value.id)
    await cargarProyectos()
  } catch (err) {
    error.value =
      'Error al eliminar el proyecto: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al eliminar proyecto', err)
  } finally {
    loading.value = false
    deleteDialog.value = false
  }
}

const exportToExcel = () => {
  alert('Exportar a Excel')
}

const toggleExpanded = (id) => {
  expandedProyectoId.value = expandedProyectoId.value === id ? null : id
}
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

.v-tab {
  font-size: 0.75rem;
  min-width: 0;
}
</style>
