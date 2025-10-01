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

    <!-- Mensaje cuando no hay actividades -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Lista de Actividades</span>
            <span class="text-caption text-grey">Total: {{ filteredActividades.length }}</span>
          </v-card-title>

          <!-- Buscador y filtros -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar actividades (por código, nombre o descripción)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <div class="d-flex flex-wrap gap-2 mt-2">
              <!-- Filtros por estado -->
              <v-chip-group v-model="statusFilters" multiple column>
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
            </div>
          </v-card-text>
          <v-divider class="my-4"></v-divider>

          <v-list v-if="!loading" class="py-0">
            <template
              v-for="(actividad, index) in actividadesPaginadasOrdenadas"
              :key="`actividad-${actividad.id}-${index}`"
            >
              <v-list-item :value="actividad.id" @click="toggleExpanded(actividad.id)" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ actividad.codigo }} - {{ actividad.nombreCorto }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      small
                      :color="getStatusColor(actividad.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ actividad.estado_display }}
                    </v-chip>
                    <span class="mr-2"
                      >Presupuesto: {{ formatCurrency(actividad.presupuesto) }}</span
                    >
                    <span v-if="actividad.responsable_info" class="mr-2">
                      Responsable: {{ actividad.responsable_info.nombre_completo }}
                    </span>
                  </div>
                  <div class="text-caption mt-1" v-if="actividad.descripcion">
                    {{ actividad.descripcion }}
                  </div>
                  <div
                    class="text-caption mt-1"
                    v-if="actividad.fecha_inicio || actividad.fecha_cierre"
                  >
                    <span v-if="actividad.fecha_inicio">
                      <strong>Inicio:</strong> {{ formatDate(actividad.fecha_inicio) }}
                    </span>
                    <span v-if="actividad.fecha_cierre" class="ml-2">
                      <strong>Cierre:</strong> {{ formatDate(actividad.fecha_cierre) }}
                    </span>
                  </div>
                  <div
                    class="text-caption mt-1"
                    v-if="actividad.tareas && actividad.tareas.length > 0"
                  >
                    <strong>Subactividades:</strong> {{ actividad.tareas.length }}
                  </div>
                </v-list-item-subtitle>

                <!-- iconos de acciones -->
                <template v-slot:append>
                  <div class="d-flex">
                    <!-- Separador visual -->
                    <v-divider vertical inset class="mx-1 my-1"></v-divider>

                    <!-- Informe de Actividad -->
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-outline"
                          variant="text"
                          color="info"
                          size="small"
                          :to="`/monitoreo/informe-actividad/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Informe de Tarea (para la actividad principal) -->
                    <v-tooltip text="Ver Informe de Actividad/Subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-multiple-outline"
                          variant="text"
                          color="cyan"
                          size="small"
                          :to="`/monitoreo/informes-actividad-subactividad/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedActividadId === actividad.id">
                  <v-list-item :value="`detalle-${actividad.id}`" class="mb-2">
                    <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                      <v-card-text class="pt-4">
                        <div class="d-flex justify-space-between align-center mb-4">
                          <span class="text-subtitle-1"
                            >Subactividad de {{ actividad.codigo }}</span
                          >
                          <div class="d-flex align-center">
                            <v-btn
                              color="primary"
                              variant="text"
                              @click="openTareaDialog(actividad.id)"
                            >
                              <v-icon left>mdi-plus</v-icon>
                              Añadir Subactividad
                            </v-btn>
                          </div>
                        </div>
                        <v-list density="compact" class="py-0">
                          <v-list-item
                            v-for="tarea in actividad.tareas"
                            :key="`tarea-${actividad.id}-${tarea.id}`"
                            class="mb-1"
                          >
                            <v-list-item-title>
                              {{ tarea.titulo || tarea.descripcion || 'Subactividad sin título' }}
                            </v-list-item-title>
                            <template v-slot:prepend>
                              <v-icon :color="getStatusColorTarea(tarea.estado)">
                                mdi-checkbox-blank-circle
                              </v-icon>
                            </template>
                            <template v-slot:append>
                              <div class="d-flex">
                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Informe de Actividad para TAREA -->
                                <v-tooltip text="Informe de Subactividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-file-document-outline"
                                      variant="text"
                                      color="info"
                                      size="small"
                                      :to="`/monitoreo/informe-subactividad/${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Acciones de tarea -->
                                <v-tooltip text="Editar subactividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-pencil"
                                      variant="text"
                                      color="warning"
                                      size="small"
                                      @click.stop="openTareaDialog(actividad.id, tarea)"
                                    ></v-btn>
                                  </template>
                                </v-tooltip>
                                <v-tooltip text="Eliminar Subactividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon="mdi-delete"
                                      variant="text"
                                      color="error"
                                      size="small"
                                      @click.stop="confirmDeleteTarea(actividad.id, tarea)"
                                    ></v-btn>
                                  </template>
                                </v-tooltip>
                              </div>
                            </template>
                          </v-list-item>
                          <v-list-item v-if="!actividad.tareas || actividad.tareas.length === 0">
                            <v-list-item-title class="text-grey text-caption">
                              No hay Subactividades para esta actividad
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredActividades.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron actividades</v-list-item-title>
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

      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de estadísticas -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-check</v-icon>
              </template>
              <v-list-item-title>Total actividades</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ filteredActividades.length }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('REPROG') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="light-blue">mdi-calendar-edit</v-icon>
              </template>
              <v-list-item-title>Planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('PLAN') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-progress-clock</v-icon>
              </template>
              <v-list-item-title>En Ejecución</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('EJEC') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Finalizado</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('FIN') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="tareaDialog" max-width="500">
      <v-card>
        <v-toolbar
          color="secondary"
          :title="isEditandoTarea ? 'Editar Tarea' : 'Nueva Subactividad'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef" @submit.prevent="saveTarea">
            <v-text-field
              v-model="tareaForm.titulo"
              label="Título de la subactividad"
              :rules="[(v) => !!v || 'El título es requerido']"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
            <v-textarea
              v-model="tareaForm.descripcion"
              label="Descripción"
              variant="outlined"
              rows="2"
            ></v-textarea>
            <v-select
              v-model="tareaForm.estado"
              :items="availableStatusesTarea"
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

    <v-dialog v-model="deleteTareaDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación de tarea</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la tarea "{{
            tareaToDelete?.titulo || tareaToDelete?.descripcion || 'Sin título'
          }}"?
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
import { useActividadStore } from '@/modules/proyecto/store/useActividadStore'

//Iniciar el store de actividades
const storeActividad = useActividadStore()

// --- ESTADOS REACTIVOS ---
const loading = ref(true)
const emptyResponse = ref(false)
const actividades = ref([])
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const tareaForm = ref({ id: null, titulo: '', descripcion: '', estado: 'PEN' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { value: 'CRD', text: 'Creada' },
  { value: 'PLAN', text: 'Planificada' },
  { value: 'RETR', text: 'Retraso' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

const availableStatusesTarea = [
  { text: 'Pendiente', value: 'PEN' },
  { text: 'En Progreso', value: 'EPROG' },
  { text: 'Completada', value: 'COMPL' },
]

// --- MÉTODOS Y COMPUTADAS ---

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await storeActividad.cargarActividadesTareas()

    // Usar datos dummy
    //actividades.value = dummyData.actividades
    actividades.value = storeActividad.actividadesFiltradas
    emptyResponse.value = actividades.value.length === 0
  } catch (error) {
    console.error('Error al cargar datos:', error)
    actividades.value = []
    emptyResponse.value = true
    mostrarSnackbar('Error al cargar datos: ' + (error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

// Lógica de filtros y paginación
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = [...actividades.value]

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
  // Filtrar por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
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

const countByStatus = (status) => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return filteredActividades.value.filter((a) => a.estado === status).length
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// --- CRUD TAREAS (simulado) ---
const openTareaDialog = (actividadId, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  if (isEditandoTarea.value) {
    Object.assign(tareaForm.value, {
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
    })
  } else {
    Object.assign(tareaForm.value, { id: null, titulo: '', descripcion: '', estado: 'PEN' })
  }
  tareaDialog.value = true
}

const saveTarea = async () => {
  const { valid } = await tareaFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (isEditandoTarea.value) {
      // Actualizar tarea existente
      const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
      if (actividad && actividad.tareas) {
        const tareaIndex = actividad.tareas.findIndex((t) => t.id === tareaForm.value.id)
        if (tareaIndex !== -1) {
          actividad.tareas[tareaIndex] = {
            ...actividad.tareas[tareaIndex],
            ...tareaForm.value,
          }
        }
      }
      mostrarSnackbar('Tarea actualizada con éxito', 'success')
    } else {
      // Crear nueva tarea
      const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
      if (actividad) {
        if (!actividad.tareas) {
          actividad.tareas = []
        }
        const nuevaTarea = {
          id: Date.now(), // ID temporal
          ...tareaForm.value,
          fecha_creacion: new Date().toISOString(),
          fecha_limite: new Date().toISOString().split('T')[0],
          presupuesto: '0.00',
        }
        actividad.tareas.push(nuevaTarea)
      }
      mostrarSnackbar('Tarea creada con éxito', 'success')
    }
  } catch (error) {
    console.error('Error al guardar tarea:', error)
    mostrarSnackbar('Error al guardar tarea', 'error')
  } finally {
    loading.value = false
    tareaDialog.value = false
    await nextTick()
    if (tareaFormRef.value) {
      tareaFormRef.value.reset()
    }
  }
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = async () => {
  loading.value = true
  try {
    // Simular eliminación
    await new Promise((resolve) => setTimeout(resolve, 500))

    const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    }

    mostrarSnackbar('Tarea eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    mostrarSnackbar('Error al eliminar tarea', 'error')
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// Funciones auxiliares
const getStatusColor = (status) => {
  switch (status) {
    case 'CRD':
      return 'grey'
    case 'PLAN':
      return 'light-blue'
    case 'RETR':
      return 'red'
    case 'REPROG':
      return 'yellow'
    case 'EJEC':
      return 'orange'
    case 'REP':
      return 'light-green'
    case 'FIN':
      return 'green'
    default:
      return 'grey'
  }
}

const getTipoIcon = (status) => {
  switch (status) {
    case 'CRD':
      return 'mdi-plus-circle'
    case 'PLAN':
      return 'mdi-calendar-check-outline'
    case 'RETR':
      return 'mdi-calendar-alert'
    case 'REPROG':
      return 'mdi-calendar-refresh'
    case 'EJEC':
      return 'mdi-calendar-arrow-right'
    case 'REP':
      return 'mdi-calendar-edit'
    case 'FIN':
      return 'mdi-calendar-done'
    default:
      return 'mdi-help-circle'
  }
}

const formatCurrency = (value) => {
  if (!value) return 'Bs. 0.00'
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'Bs. 0.00'
}

const getStatusColorTarea = (status) => {
  switch (status) {
    case 'PEN':
      return 'grey'
    case 'EPROG':
      return 'warning'
    case 'COMPL':
      return 'success'
    default:
      return 'grey'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []
  return [...actividadesPaginadas.value].sort((a, b) => b.id - a.id)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
