<template>
  <v-container>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="mb-4"
    ></v-progress-linear>

    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-clipboard-list-outline</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Lista de Actividades, Tareas</span>
            <span class="text-caption text-grey">Total: {{ filteredActividades.length }}</span>
          </v-card-title>

          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar actividades por título"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <v-chip-group v-model="statusFilters" multiple column class="mt-2">
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
            <template v-for="actividad in actividadesPaginadas" :key="actividad.id">
              <v-list-item :value="actividad" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                    <v-icon dark>mdi-check-circle-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{
                  actividad.titulo
                }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center">
                    <v-chip small :color="getStatusColor(actividad.estado)" class="mr-2">
                      {{ getEstadoTexto(actividad.estado) }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Editar actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          color="warning"
                          @click="openActividadDialog(actividad)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Eliminar actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          @click="confirmDeleteActividad(actividad)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Mostrar tareas" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(actividad.id)"
                          :class="{ 'rotate-180': expandedActividadId === actividad.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <v-expand-transition>
                <div v-if="expandedActividadId === actividad.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-4">
                        <span class="text-subtitle-1">Tareas de {{ actividad.titulo }}</span>
                        <v-btn
                          color="primary"
                          variant="text"
                          @click="openTareaDialog(actividad.id)"
                        >
                          <v-icon left>mdi-plus</v-icon>
                          Añadir tarea
                        </v-btn>
                      </div>
                      <v-list density="compact" class="py-0">
                        <v-list-item v-for="tarea in actividad.tareas" :key="tarea.id" class="mb-1">
                          <v-list-item-title>{{ tarea.descripcion }}</v-list-item-title>
                          <template v-slot:prepend>
                            <v-icon :color="getStatusColor(tarea.estado)"
                              >mdi-checkbox-blank-circle</v-icon
                            >
                          </template>
                          <template v-slot:append>
                            <v-tooltip text="Editar tarea" location="top">
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon="mdi-pencil"
                                  variant="text"
                                  color="warning"
                                  size="small"
                                  @click="openTareaDialog(actividad.id, tarea)"
                                ></v-btn>
                              </template>
                            </v-tooltip>
                            <v-tooltip text="Eliminar tarea" location="top">
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon="mdi-delete"
                                  variant="text"
                                  color="error"
                                  size="small"
                                  @click="confirmDeleteTarea(actividad.id, tarea)"
                                ></v-btn>
                              </template>
                            </v-tooltip>
                          </template>
                        </v-list-item>
                        <v-list-item v-if="actividad.tareas.length === 0">
                          <v-list-item-title class="text-grey text-caption"
                            >No hay tareas para esta actividad</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredActividades.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron actividades</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          ></v-pagination>

          <div
            v-if="filteredActividades.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredActividades.length }}
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

      <v-col cols="12" md="3">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item
              @click="openActividadDialog()"
              title="Nueva Actividad"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>
          </v-list>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-clipboard-list-outline</v-icon>
              </template>
              <v-list-item-title>Total actividades</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredActividades.length
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="warning">mdi-cog-box</v-icon>
              </template>
              <v-list-item-title>En progreso</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('PR') }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Completadas</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('CO') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="actividadDialog" max-width="600">
      <v-card>
        <v-toolbar
          color="primary"
          :title="isEditandoActividad ? 'Editar Actividad' : 'Nueva Actividad'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="actividadFormRef">
            <v-text-field
              v-model="actividadForm.titulo"
              label="Título"
              :rules="[(v) => !!v || 'El título es requerido']"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
            <v-select
              v-model="actividadForm.estado"
              :items="availableStatuses"
              item-title="text"
              item-value="value"
              label="Estado"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="actividadDialog = false">Cancelar</v-btn>
          <v-btn color="success" @click="saveActividad">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tareaDialog" max-width="500">
      <v-card>
        <v-toolbar
          color="secondary"
          :title="isEditandoTarea ? 'Editar Tarea' : 'Nueva Tarea'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef">
            <v-text-field
              v-model="tareaForm.descripcion"
              label="Descripción de la tarea"
              :rules="[(v) => !!v || 'La descripción es requerida']"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
            <v-select
              v-model="tareaForm.estado"
              :items="availableStatuses"
              item-title="text"
              item-value="value"
              label="Estado"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="tareaDialog = false">Cancelar</v-btn>
          <v-btn color="success" @click="saveTarea">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteActividadDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la actividad "{{ actividadToDelete?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteActividadDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteTareaDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación de tarea</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la tarea "{{ tareaToDelete?.descripcion }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteTareaDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteTarea">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'

// --- DATA DUMMY ---
const dummyData = [
  {
    id: 1,
    titulo: 'Desarrollar módulo de autenticación',
    estado: 'PR',
    tareas: [
      { id: 101, descripcion: 'Crear modelo de usuario', estado: 'CO' },
      { id: 102, descripcion: 'Implementar lógica de login', estado: 'PR' },
      { id: 103, descripcion: 'Diseñar interfaz de registro', estado: 'PE' },
    ],
  },
  {
    id: 2,
    titulo: 'Diseñar la base de datos del proyecto',
    estado: 'CO',
    tareas: [
      { id: 201, descripcion: 'Esquema de tablas', estado: 'CO' },
      { id: 202, descripcion: 'Relaciones entre tablas', estado: 'CO' },
    ],
  },
  {
    id: 3,
    titulo: 'Integración con API de pagos',
    estado: 'PE',
    tareas: [{ id: 301, descripcion: 'Investigar documentación de la API', estado: 'PE' }],
  },
  {
    id: 4,
    titulo: 'Preparar la documentación del usuario',
    estado: 'PR',
    tareas: [],
  },
  {
    id: 5,
    titulo: 'Revisar código de la versión 1.0',
    estado: 'PE',
    tareas: [
      { id: 501, descripcion: 'Corrección de bugs menores', estado: 'PR' },
      { id: 502, descripcion: 'Refactorización de funciones', estado: 'PE' },
    ],
  },
]

// --- ESTADOS REACTIVOS ---
const actividades = ref([])
const loading = ref(true)
const emptyResponse = ref(false)
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Diálogos y formularios de actividades
const actividadDialog = ref(false)
const actividadForm = ref({ id: null, titulo: '', estado: 'PR' })
const isEditandoActividad = ref(false)
const actividadFormRef = ref(null)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const tareaForm = ref({ id: null, descripcion: '', estado: 'PE' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
const deleteActividadDialog = ref(false)
const actividadToDelete = ref(null)
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// --- MÉTODOS Y COMPUTADAS ---

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { text: 'Pendiente', value: 'PE' },
  { text: 'En Progreso', value: 'PR' },
  { text: 'Completada', value: 'CO' },
]

const getStatusColor = (status) => {
  switch (status) {
    case 'PE':
      return 'grey'
    case 'PR':
      return 'warning'
    case 'CO':
      return 'success'
    default:
      return 'grey'
  }
}

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : ''
}

// Carga inicial de datos
onMounted(() => {
  setTimeout(() => {
    actividades.value = dummyData
    loading.value = false
    emptyResponse.value = actividades.value.length === 0
  }, 1000) // Simulación de carga
})

// Lógica de filtros y paginación
const filteredActividades = computed(() => {
  let filtered = actividades.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((actividad) => actividad.titulo.toLowerCase().includes(query))
  }

  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }

  return filtered
})

const actividadesPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredActividades.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredActividades.value.length ? filteredActividades.value.length : end
})

const countByStatus = (status) => {
  return filteredActividades.value.filter((a) => a.estado === status).length
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// --- CRUD ACTIVIDADES ---
const openActividadDialog = (actividad = null) => {
  isEditandoActividad.value = !!actividad
  if (isEditandoActividad.value) {
    Object.assign(actividadForm.value, actividad)
  } else {
    Object.assign(actividadForm.value, { id: null, titulo: '', estado: 'PR' })
  }
  actividadDialog.value = true
}

const saveActividad = async () => {
  const { valid } = await actividadFormRef.value.validate()
  if (!valid) return

  if (isEditandoActividad.value) {
    const index = actividades.value.findIndex((a) => a.id === actividadForm.value.id)
    if (index !== -1) {
      Object.assign(actividades.value[index], actividadForm.value)
      snackbar.value = { show: true, text: 'Actividad editada con éxito', color: 'success' }
    }
  } else {
    const newId = Math.max(...actividades.value.map((a) => a.id), 0) + 1
    actividades.value.push({
      ...actividadForm.value,
      id: newId,
      tareas: [],
    })
    snackbar.value = { show: true, text: 'Actividad creada con éxito', color: 'success' }
  }
  actividadDialog.value = false
  // Limpiar formulario y revalidar para evitar errores en el siguiente uso
  await nextTick()
  actividadFormRef.value.reset()
}

const confirmDeleteActividad = (actividad) => {
  actividadToDelete.value = actividad
  deleteActividadDialog.value = true
}

const deleteActividad = () => {
  actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)
  deleteActividadDialog.value = false
  snackbar.value = { show: true, text: 'Actividad eliminada con éxito', color: 'success' }
}

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  if (isEditandoTarea.value) {
    Object.assign(tareaForm.value, tarea)
  } else {
    Object.assign(tareaForm.value, { id: null, descripcion: '', estado: 'PE' })
  }
  tareaDialog.value = true
}

const saveTarea = async () => {
  const { valid } = await tareaFormRef.value.validate()
  if (!valid) return

  const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
  if (!actividad) return

  if (isEditandoTarea.value) {
    const index = actividad.tareas.findIndex((t) => t.id === tareaForm.value.id)
    if (index !== -1) {
      Object.assign(actividad.tareas[index], tareaForm.value)
      snackbar.value = { show: true, text: 'Tarea editada con éxito', color: 'success' }
    }
  } else {
    const newId = Math.max(...actividad.tareas.map((t) => t.id), 0) + 1
    actividad.tareas.push({ ...tareaForm.value, id: newId })
    snackbar.value = { show: true, text: 'Tarea creada con éxito', color: 'success' }
  }
  tareaDialog.value = false
  await nextTick()
  tareaFormRef.value.reset()
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = () => {
  const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
  if (actividad) {
    actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    snackbar.value = { show: true, text: 'Tarea eliminada con éxito', color: 'success' }
  }
  deleteTareaDialog.value = false
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
