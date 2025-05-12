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
            <span>Lista de PEIs</span>
            <span class="text-caption text-grey">Total: {{ filteredPeis.length }}</span>
          </v-card-title>

          <!-- Buscador -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar PEIs (por título o descripción)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <!-- Filtros por vigencia -->
            <v-chip-group v-model="vigenciaFilters" multiple column class="mt-2">
              <v-chip
                v-for="vigencia in availableVigencias"
                :key="vigencia.value"
                :value="vigencia.value"
                filter
                :color="getVigenciaColor(vigencia.value)"
                variant="outlined"
              >
                {{ vigencia.text }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="item in peisPaginados" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getVigenciaColor(item.esta_vigente)" class="mr-4">
                    <v-icon dark>mdi-notebook-edit</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip
                      small
                      :color="getVigenciaColor(item.esta_vigente)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ item.esta_vigente ? 'Vigente' : 'No vigente' }}
                    </v-chip>
                    <span
                      >{{ formatDate(item.fecha_inicio) }} - {{ formatDate(item.fecha_fin) }}</span
                    >
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
                          :to="`/pei/${item.id}/detalle`"
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
                          :to="`/pei/${item.id}/editar`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Objetivos" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-target"
                          variant="text"
                          color="secondary"
                          :to="`/pei/${item.id}/objetivos`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Indicadores" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chart-bar"
                          variant="text"
                          color="teal"
                          :to="`/pei/${item.id}/indicadores`"
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

                    <v-tooltip text="Vista rápida" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedPeiId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable con Tabs -->
              <v-expand-transition>
                <div v-if="expandedPeiId === item.id">
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
                      <v-tab value="indicadores">
                        <v-icon left>mdi-chart-bar</v-icon>
                        Indicadores
                      </v-tab>
                      <v-tab value="proyectos">
                        <v-icon left>mdi-notebook-multiple</v-icon>
                        Proyectos
                      </v-tab>
                    </v-tabs>

                    <v-card-text class="pt-4">
                      <v-window v-model="activeTab">
                        <!-- Tab Datos del PEI -->
                        <v-window-item value="datos">
                          <v-row>
                            <v-col cols="12" md="6">
                              <p><strong>Descripción:</strong> {{ item.descripcion }}</p>
                              <p>
                                <strong>Vigencia:</strong>
                                {{ item.esta_vigente ? 'Vigente' : 'No vigente' }}
                              </p>
                              <p>
                                <strong>Fecha de creación:</strong> {{ formatDate(item.creado_el) }}
                              </p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <p>
                                <strong>Fecha inicio:</strong> {{ formatDate(item.fecha_inicio) }}
                              </p>
                              <p><strong>Fecha fin:</strong> {{ formatDate(item.fecha_fin) }}</p>
                              <p>
                                <strong>Última modificación:</strong>
                                {{ formatDate(item.modificado_el) }}
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

                        <!-- Tab Indicadores -->
                        <v-window-item value="indicadores">
                          <v-alert type="info" variant="tonal">
                            Información de indicadores disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <!-- Tab Proyectos -->
                        <v-window-item value="proyectos">
                          <v-alert type="info" variant="tonal">
                            Información de proyectos asociados disponible en la vista completa
                          </v-alert>
                        </v-window-item>
                      </v-window>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="`/pei/${item.id}/detalle`"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredPeis.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron PEIs</v-list-item-title>
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
            v-if="filteredPeis.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredPeis.length }}
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
              to="/pei/nuevo"
              title="Nuevo PEI"
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
              <v-list-item-title>Total PEIs</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredPeis.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Vigentes</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByVigencia(true) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="grey">mdi-close-circle</v-icon>
              </template>
              <v-list-item-title>No vigentes</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByVigencia(false) }}
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
          ¿Estás seguro de que deseas eliminar el PEI "{{ peiToDelete?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deletePei">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePeiStore } from '@/modules/pei/store/peiStore'
import { formatDate } from '@/utility/formatters'

// Router y store
const router = useRouter()
const peiStore = usePeiStore()

// Estados
const loading = ref(false)
const error = ref(null)
const deleteDialog = ref(false)
const peiToDelete = ref(null)
const expandedPeiId = ref(null)
const searchQuery = ref('')
const activeTab = ref('datos')

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filtros
const vigenciaFilters = ref([])
const availableVigencias = [
  { text: 'Vigentes', value: true },
  { text: 'No vigentes', value: false },
]

// Obtener PEIs al montar el componente
onMounted(async () => {
  await cargarPeis()
})

// Computed
const peis = computed(() => peiStore.peis)

const filteredPeis = computed(() => {
  let filtered = peis.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (pei) =>
        pei.titulo.toLowerCase().includes(query) ||
        (pei.descripcion && pei.descripcion.toLowerCase().includes(query)),
    )
  }

  // Filtro por vigencia
  if (vigenciaFilters.value.length > 0) {
    filtered = filtered.filter((pei) => vigenciaFilters.value.includes(pei.esta_vigente))
  }

  return filtered
})

// Paginación
const peisPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPeis.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredPeis.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredPeis.value.length ? filteredPeis.value.length : end
})

// Rutina de carga de PEIs
const cargarPeis = async () => {
  try {
    loading.value = true
    error.value = null
    await peiStore.obtenerPeis()
  } catch (err) {
    error.value = 'Error al cargar los PEIs: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al cargar los PEIs', err)
  } finally {
    loading.value = false
  }
}

// Contador por vigencia
const countByVigencia = (vigente) => {
  return filteredPeis.value.filter((p) => p.esta_vigente === vigente).length
}

// Color por vigencia
const getVigenciaColor = (vigente) => {
  return vigente ? 'success' : 'grey'
}

const confirmDelete = (pei) => {
  peiToDelete.value = pei
  deleteDialog.value = true
}

const deletePei = async () => {
  try {
    loading.value = true
    await peiStore.eliminarPei(peiToDelete.value.id)
    await cargarPeis()
  } catch (err) {
    error.value = 'Error al eliminar el PEI: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al eliminar PEI', err)
  } finally {
    loading.value = false
    deleteDialog.value = false
  }
}

const exportToExcel = () => {
  alert('Exportar a Excel')
}

const toggleExpanded = (id) => {
  expandedPeiId.value = expandedPeiId.value === id ? null : id
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
