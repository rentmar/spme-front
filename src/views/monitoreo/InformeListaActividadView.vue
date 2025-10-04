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
                            >Subactividades de {{ actividad.codigo }}</span
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

                        <!-- Lista de subactividades mejorada -->
                        <v-list density="compact" class="py-0">
                          <v-list-item
                            v-for="tarea in actividad.tareasOrdenadas"
                            :key="`tarea-${actividad.id}-${tarea.id}`"
                            class="mb-2 pa-3"
                          >
                            <template v-slot:prepend>
                              <v-badge
                                :color="getStatusColorTarea(tarea.estado)"
                                dot
                                location="bottom end"
                                offset-x="-5"
                                offset-y="-5"
                              >
                                <v-avatar
                                  size="40"
                                  :color="getStatusColorTarea(tarea.estado) + ' lighten-4'"
                                >
                                  <v-icon :color="getStatusColorTarea(tarea.estado)">
                                    {{ getTareaIcon(tarea.estado) }}
                                  </v-icon>
                                </v-avatar>
                              </v-badge>
                            </template>

                            <v-list-item-title class="font-weight-medium mb-1">
                              {{ tarea.titulo || tarea.descripcion || 'Subactividad sin título' }}
                              <v-chip
                                v-if="tarea.codigo"
                                small
                                color="primary"
                                variant="outlined"
                                class="ml-2"
                              >
                                {{ tarea.codigo }}
                              </v-chip>
                            </v-list-item-title>

                            <v-list-item-subtitle>
                              <div class="d-flex flex-wrap align-center gap-2 mt-1">
                                <!-- Estado -->
                                <v-chip
                                  small
                                  :color="getStatusColorTarea(tarea.estado)"
                                  text-color="white"
                                  class="text-caption"
                                >
                                  {{ getEstadoTareaDisplay(tarea.estado) }}
                                </v-chip>

                                <!-- Presupuesto -->
                                <span class="text-caption">
                                  <v-icon small class="mr-1">mdi-cash</v-icon>
                                  {{ formatCurrency(tarea.presupuesto) }}
                                </span>

                                <!-- Fechas -->
                                <span v-if="tarea.fecha_creacion" class="text-caption">
                                  <v-icon small class="mr-1">mdi-calendar-start</v-icon>
                                  {{ formatDate(tarea.fecha_creacion) }}
                                </span>

                                <span v-if="tarea.fecha_limite" class="text-caption">
                                  <v-icon small class="mr-1">mdi-calendar-end</v-icon>
                                  {{ formatDate(tarea.fecha_limite) }}
                                </span>

                                <!-- Días restantes -->
                                <span
                                  v-if="tarea.fecha_limite"
                                  class="text-caption"
                                  :class="getDiasRestantesColor(tarea.fecha_limite)"
                                >
                                  <v-icon small class="mr-1">mdi-clock</v-icon>
                                  {{ calcularDiasRestantes(tarea.fecha_limite) }}
                                </span>
                              </div>

                              <!-- Descripción -->
                              <div v-if="tarea.descripcion" class="text-caption mt-1 text-grey">
                                {{ tarea.descripcion }}
                              </div>
                            </v-list-item-subtitle>

                            <template v-slot:append>
                              <div class="d-flex flex-column align-end gap-1">
                                <!-- Acciones principales -->
                                <div class="d-flex">
                                  <!-- Informe de Subactividad -->
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

                                  <!-- Editar -->
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

                                  <!-- Eliminar -->
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

                                <!-- Información adicional -->
                                <div class="text-right">
                                  <div class="text-caption text-grey">ID: {{ tarea.id }}</div>
                                  <div
                                    v-if="tarea.presupuestoDesglose"
                                    class="text-caption text-info"
                                  >
                                    <v-icon x-small>mdi-format-list-bulleted</v-icon>
                                    Con desglose
                                  </div>
                                </div>
                              </div>
                            </template>
                          </v-list-item>

                          <v-list-item v-if="!actividad.tareas || actividad.tareas.length === 0">
                            <v-list-item-title class="text-grey text-caption text-center py-4">
                              <v-icon size="48" color="grey lighten-1" class="mb-2"
                                >mdi-playlist-remove</v-icon
                              >
                              <div>No hay Subactividades para esta actividad</div>
                              <v-btn
                                color="primary"
                                variant="text"
                                size="small"
                                @click="openTareaDialog(actividad.id)"
                                class="mt-2"
                              >
                                <v-icon left>mdi-plus</v-icon>
                                Crear la primera subactividad
                              </v-btn>
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
                <v-icon color="primary">mdi-playlist-check</v-icon>
              </template>
              <v-list-item-title>Total subactividades</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ totalSubactividades }}
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

    <!-- Diálogo de Tarea/Subactividad (Componente Reutilizable) -->
    <DialogTarea
      v-model="tareaDialog"
      :actividad="actividadSeleccionada"
      :tarea="tareaSeleccionada"
      :cargando="cargandoTarea"
      @guardar="guardarTarea"
      @cancelar="cancelarTarea"
    />

    <v-dialog v-model="deleteTareaDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la subactividad "{{
            tareaToDelete?.titulo || tareaToDelete?.descripcion || 'Sin título'
          }}"?
          <v-alert v-if="tareaToDelete?.codigo" type="warning" density="compact" class="mt-2">
            Código: {{ tareaToDelete.codigo }}
          </v-alert>
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
import { ref, onMounted, computed } from 'vue'
import { useActividadStore } from '@/modules/proyecto/store/useActividadStore'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import DialogTarea from '@/modules/actividades/components/DialogTarea.vue'

// Iniciar el store de actividades
const storeActividad = useActividadStore()

//Iniciar el composable de Subactividades
const {
  //loading: loadingTareas,
  //error: errorTareas,
  crearUnaTarea,
  actualizarUnaTarea,
  eliminarUnaTarea,
} = useTareaSubactividad()

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
const actividadSeleccionada = ref(null)
const tareaSeleccionada = ref(null)
const cargandoTarea = ref(false)

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

// --- MÉTODOS Y COMPUTADAS ---

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    await storeActividad.cargarActividadesTareas()
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

// Computed mejoradas para las actividades
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = actividades.value.map((actividad) => ({
    ...actividad,
    // Agregar computed property para tareas ordenadas
    tareasOrdenadas: [...(actividad.tareas || [])].sort((a, b) => {
      // Ordenar por ID descendente (más recientes primero)
      return b.id - a.id
    }),
  }))

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.nombreCorto && actividad.nombreCorto.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)) ||
        (actividad.tareas &&
          actividad.tareas.some(
            (tarea) =>
              (tarea.titulo && tarea.titulo.toLowerCase().includes(query)) ||
              (tarea.descripcion && tarea.descripcion.toLowerCase().includes(query)) ||
              (tarea.codigo && tarea.codigo.toLowerCase().includes(query)),
          )),
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

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []
  return [...actividadesPaginadas.value].sort((a, b) => b.id - a.id)
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return Math.ceil(filteredActividades.value.length / itemsPerPage.value)
})

const totalSubactividades = computed(() => {
  return filteredActividades.value.reduce((total, actividad) => {
    return total + (actividad.tareas ? actividad.tareas.length : 0)
  }, 0)
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

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  actividadSeleccionada.value = actividades.value.find((a) => a.id === actividadId)
  tareaSeleccionada.value = tarea
  tareaDialog.value = true
}

const guardarTarea = async (datosTarea) => {
  cargandoTarea.value = true
  try {
    if (tareaSeleccionada.value) {
      //Actualizar la tarea en la rest api
      const response = await actualizarUnaTarea(datosTarea.id, datosTarea)

      //Actualizar en el estado local
      const actividad = actividades.value.find((a) => a.id === actividadSeleccionada.value.id)
      if (actividad && actividad.tareas) {
        const tareaIndex = actividad.tareas.findIndex((t) => t.id === datosTarea.id)
        if (tareaIndex !== -1) {
          actividad.tareas[tareaIndex] = {
            ...actividad.tareas[tareaIndex],
            ...response, // Usar los datos actualizados del servidor
          }
        }
      }

      mostrarSnackbar('Subactividad actualizada con éxito', 'success')
    } else {
      //Crear nueva tarea
      const response = await crearUnaTarea(datosTarea)

      //Agregar al estado local
      const actividad = actividades.value.find((a) => a.id === actividadSeleccionada.value.id)
      if (actividad) {
        if (!actividad.tareas) {
          actividad.tareas = []
        }
        //Insertar la respuesta
        actividad.tareas.push(response)
      }
      mostrarSnackbar('Subactividad creada con éxito', 'success')
    }
  } catch (err) {
    console.error('Error al guardar subactividad', err)
    mostrarSnackbar('Error al guardarSUbactividad', 'error')
  } finally {
    cargandoTarea.value = false
    tareaDialog.value = false
    //Limpiar las selecciones
    actividadSeleccionada.value = null
    tareaSeleccionada.value = null
  }
}

const cancelarTarea = () => {
  tareaDialog.value = false
  actividadSeleccionada.value = null
  tareaSeleccionada.value = null
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    await eliminarUnaTarea(tareaToDelete.value.id)

    const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    }

    mostrarSnackbar('Subactividad eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar Subactividad:', error)
    mostrarSnackbar('Error al eliminar Subactividad', 'error')
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// Funciones auxiliares mejoradas
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

const getStatusColorTarea = (status) => {
  const colors = {
    PEN: 'grey',
    EPROG: 'orange',
    COMPL: 'green',
  }
  return colors[status] || 'grey'
}

const getTareaIcon = (status) => {
  const icons = {
    PEN: 'mdi-clock-outline',
    EPROG: 'mdi-progress-clock',
    COMPL: 'mdi-check-circle',
  }
  return icons[status] || 'mdi-help-circle'
}

const getEstadoTareaDisplay = (status) => {
  const estados = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return estados[status] || status
}

const calcularDiasRestantes = (fechaLimite) => {
  if (!fechaLimite) return 'Sin fecha'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return '1 día'
  if (diffDays > 0) return `${diffDays} días`
  return `Hace ${Math.abs(diffDays)} días`
}

const getDiasRestantesColor = (fechaLimite) => {
  if (!fechaLimite) return 'text-grey'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-error'
  if (diffDays <= 3) return 'text-warning'
  if (diffDays <= 7) return 'text-info'
  return 'text-success'
}

const formatCurrency = (value) => {
  if (!value) return 'Bs. 0.00'
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'Bs. 0.00'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.gap-2 {
  gap: 8px;
}

.text-error {
  color: #f44336;
}

.text-warning {
  color: #ff9800;
}

.text-info {
  color: #2196f3;
}

.text-success {
  color: #4caf50;
}
</style>
