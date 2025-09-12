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
        <p class="text-grey mt-2">Parece que aún no has creado ninguna actividad</p>
        <v-btn color="primary" @click="dialogNuevaActividad = true" class="mt-4">
          <v-icon left>mdi-plus</v-icon>
          Crear primera actividad
        </v-btn>
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
              label="Buscar actividades (por código o descripción)"
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
                  variant="outlined">
                  {{ status.text }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
          <v-divider class="my-4"></v-divider>

          <v-list v-if="!loading" class="py-0">
            <template v-for="(actividad, index) in actividadesPaginadasOrdenadas" :key="`actividad-${actividad.id}-${index}`">
              <v-list-item :value="actividad.id" @click="toggleExpanded(actividad.id)" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(actividad.estado) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  Código: {{ actividad.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip small :color="getStatusColor(actividad.estado)" text-color="white" class="mr-2">
                      {{ getEstadoTexto(actividad.estado) }}
                    </v-chip>
                    <span class="mr-2">Presupuesto: {{ formatCurrency(actividad.presupuesto) }}</span>
                    <span>Fondos: {{ getProcedenciaTexto(actividad.procedencia_fondos) }}</span>
                  </div>
                  <div class="text-caption mt-1">Descripción: {{ actividad.descripcion }}</div>
                  <div class="text-caption mt-1" v-if="actividad.fecha_programada">
                    <strong>Programada:</strong> {{ formatDate(actividad.fecha_programada) }}
                    <span v-if="actividad.duracion"> (Duración: {{ actividad.duracion }} días)</span>
                  </div>
                  <div class="text-caption mt-1" v-if="actividad.fecha_inicio">
                    <strong>Ejecución:</strong> {{ formatDate(actividad.fecha_inicio) }}
                    <span v-if="actividad.fecha_cierre"> a {{ formatDate(actividad.fecha_cierre) }}</span>
                  </div>
                </v-list-item-subtitle>

                <!-- iconos de acciones -->
                <template v-slot:append>
                  <div class="d-flex">
                    <!-- Solicitud de Fondos -->
                    <v-tooltip text="Solicitud de Fondos" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-cash-plus"
                          variant="text"
                          color="primary"
                          size="small"
                          :disabled="getSolicitudFondosInfo(actividad.id)?.bloquearIconosSolFondos || false"
                          :to="`/monitoreo/formulario01/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Reposición -->
                    <v-tooltip text="Solicitud de Reposición" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-cash-refund"
                          variant="text"
                          color="warning"
                          size="small"
                          :to="`/monitoreo/formulario03/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Viaje -->
                    <v-tooltip text="Solicitud de Viaje" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-bag-suitcase"
                          variant="text"
                          color="deep-purple"
                          size="small"
                          :to="`/monitoreo/formulario05/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Pago Directo -->
                    <v-tooltip text="Solicitud de Pago Directo" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-credit-card-check"
                          variant="text"
                          color="teal-lighten-2"
                          size="small"
                          :to="`/monitoreo/formulario08/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Separador visual -->
                    <v-divider vertical inset class="mx-1 my-1"></v-divider>

                    <!-- Rendición de cuentas para ACTIVIDADES-->
                    <v-tooltip :text="getRendicionText(actividad.id)" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 2"
                          :disabled="!getSolicitudFondosInfo(actividad.id,0)?.bloquearIconosSolFondos"
                          v-bind="props"
                          icon="mdi-cash-check"
                          variant="text"
                          color="error"
                          size="small"
                          :to="`/monitoreo/formulario02/${actividad.id}`"
                          @click.stop
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Informe de Actividad -->
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-file-chart"
                          variant="text"
                          color="info"
                          size="small"
                          :to="`/monitoreo/formularioinf/${actividad.id}`"
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
                          <span class="text-subtitle-1">Tareas para {{ actividad.codigo }}</span>
                          <div class="d-flex align-center">
                            <v-btn
                              color="primary"
                              variant="text"
                              @click="openTareaDialog(actividad.id)">
                              <v-icon left>mdi-plus</v-icon>
                              Añadir tarea
                            </v-btn>
                          </div>
                        </div>
                        <v-list density="compact" class="py-0">
                          <v-list-item v-for="tarea in actividad.tareas" :key="`tarea-${actividad.id}-${tarea.id}`" class="mb-1">
                            <v-list-item-title>
                              {{ tarea.titulo || tarea.descripcion || 'Tarea sin título' }}
                            </v-list-item-title>
                            <template v-slot:prepend>
                              <v-icon
                                :color="getStatusColorTarea(tarea.estado)">
                                mdi-checkbox-blank-circle
                              </v-icon>
                            </template>
                            <template v-slot:append>
                              <div class="d-flex">
                                <!-- Solicitud de Fondos para TAREA -->
                                <v-tooltip text="Solicitud de Fondos" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 1"
                                      v-bind="props"
                                      icon="mdi-cash-plus"
                                      variant="text"
                                      color="primary"
                                      size="small"
                                      :disabled="getSolicitudFondosInfo(actividad.id, tarea.id)?.bloquearIconosSolFondos || pruebaBloqueo"
                                      :to="`/monitoreo/formulario01/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Solicitud de Reposición para TAREA -->
                                <v-tooltip text="Solicitud de Reposición" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 1"
                                      v-bind="props"
                                      icon="mdi-cash-refund"
                                      variant="text"
                                      color="warning"
                                      size="small"
                                      :to="`/monitoreo/formulario03/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Solicitud de Viaje para TAREA -->
                                <v-tooltip text="Solicitud de Viaje" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 1"
                                      v-bind="props"
                                      icon="mdi-bag-suitcase"
                                      variant="text"
                                      color="deep-purple"
                                      size="small"
                                      :to="`/monitoreo/formulario05/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Solicitud de Pago Directo para TAREA -->
                                <v-tooltip text="Solicitud de Pago Directo" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 1"
                                      v-bind="props"
                                      icon="mdi-credit-card-check"
                                      variant="text"
                                      color="teal-lighten-2"
                                      size="small"
                                      :to="`/monitoreo/formulario08/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Rendición de cuentas para TAREAS-->
                                <v-tooltip :text="getRendicionText(actividad.id, tarea.id)" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 2"
                                      :disabled="!getSolicitudFondosInfo(actividad.id, tarea.id)?.bloquearIconosSolFondos || getSolicitudFondosInfo(actividad.id, tarea.id)?.bloquearIconoRC"
                                      v-bind="props"
                                      icon="mdi-cash-check"
                                      variant="text"
                                      color="error"
                                      size="small"
                                      :to="`/monitoreo/formulario02/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Informe de Actividad para TAREA -->
                                <v-tooltip text="Informe de Actividad" location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-if="parseInt($route.query.showButton) === 3"
                                      v-bind="props"
                                      icon="mdi-file-chart"
                                      variant="text"
                                      color="info"
                                      size="small"
                                      :to="`/monitoreo/formularioinf/${actividad.id}?tarea_id=${tarea.id}`"
                                      @click.stop
                                    ></v-btn>
                                  </template>
                                </v-tooltip>

                                <!-- Separador visual -->
                                <v-divider vertical inset class="mx-1 my-1"></v-divider>

                                <!-- Acciones de tarea -->
                                <v-tooltip text="Editar tarea" location="top">
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
                                <v-tooltip text="Eliminar tarea" location="top">
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
                          <v-list-item v-if="actividad.tareas.length === 0">
                            <v-list-item-title class="text-grey text-caption">
                              No hay tareas para esta actividad
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
              <v-list-item-subtitle class="text-right"> {{ filteredActividades.length }} </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right"> {{ countByStatus('REPROG') }} </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="light-blue">mdi-calendar-edit</v-icon>
              </template>
              <v-list-item-title>Planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right"> {{ countByStatus('PLAN') }} </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-progress-clock</v-icon>
              </template>
              <v-list-item-title>En Ejecución</v-list-item-title>
              <v-list-item-subtitle class="text-right"> {{ countByStatus('EJEC') }} </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Finalizado</v-list-item-title>
              <v-list-item-subtitle class="text-right"> {{ countByStatus('FIN') }} </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="tareaDialog" max-width="500">
      <v-card>
        <v-toolbar
          color="secondary"
          :title="isEditandoTarea ? 'Editar Tarea' : 'Nueva Tarea'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef" @submit.prevent="saveTarea">
            <v-text-field
              v-model="tareaForm.titulo"
              label="Título de la tarea"
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
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const {
  actividadesTareas,
  actividadTarea: actividadesFromApi,
  actividades,
  crearTareaEnActividad,
  actualizarTareaEnActividad,
  eliminarTareaDeActividad,
} = useActividad()

// const formData = ref({
// const pruebaBloqueo =ref(false)
// const offIconoSF = getSolicitudFondosInfo(actividad.id,0)?.bloquearIconosSolFondos
// })

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)

// --- ESTADOS REACTIVOS ---
const loading = ref(true)
const emptyResponse = ref(false)
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
const procedenciaFilter = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Procedencia de fondos
const procedenciaFondos = [
  { value: 'PROY', text: 'Proyecto' },
  { value: 'PRESP', text: 'Presupuesto' },
  { value: 'NODEF', text: 'No Definido' },
]

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { value: 'PLAN', text: 'Planificación' },
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

// Mapeo de estados del backend al frontend
const mapEstadoBackendToFrontend = (estadoBackend) => {
  const estadoMap = {
    CRD: 'PE',
    PLAN: 'PE',
    RETR: 'PR',
    REPROG: 'PR',
    EJEC: 'PR',
    REP: 'PR',
    FIN: 'CO'
  }

  // Si es un estado de tarea, devolverlo sin cambios
  if (['PEN', 'EPROG', 'COMPL'].includes(estadoBackend)) {
    return estadoBackend
  }

  return estadoMap[estadoBackend] || 'PE'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'PLAN': return 'light-blue'
    case 'RETR': return 'red'
    case 'REPROG': return 'yellow'
    case 'EJEC': return 'orange'
    case 'REP': return 'light-green'
    case 'FIN': return 'green'
    default: return 'grey'
  }
}

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
}

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

// Modificar la función cargar para que también cargue las solicitudes de fondos
const cargar = async () => {
  loading.value = true
  try {
    await Promise.all([
      actividadesTareas(),
      cargarSolicitudesFondos() // Cargar solicitudes de fondos en paralelo
    ])

    // [Procesamiento existente de actividades]
    if (Array.isArray(actividadesFromApi.value)) {
      actividades.value = actividadesFromApi.value.map((actividad) => ({
        ...actividad,
        estadoFrontend: mapEstadoBackendToFrontend(actividad.estado),
        tareas: Array.isArray(actividad.tareas)
          ? actividad.tareas.map(tarea => ({
              ...tarea,
              estadoFrontend: mapEstadoBackendToFrontend(tarea.estado)
            }))
          : [],
      }))
    } else {
      actividades.value = []
    }

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

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    console.log('Cargando solicitudes de fondos con fetch...')

    const response = await fetch('http://127.0.0.1:8000/api/solicitud-fondos/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log('Datos recibidos con fetch:', data)
    solicitudesFondos.value = data

  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
  }
}

// Obtener información de solicitud de fondos para una actividad (y opcionalmente una tarea)
const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null

  // Buscar solicitud que coincida con actividad y tarea (si se proporciona)
  const solicitud = solicitudesFondos.value.find(sf => {
    const matchActividad = sf.actividad === actividadId
    const matchTarea = tareaId ? sf.tarea === tareaId : true
    return matchActividad && matchTarea
  })

  return solicitud || null
}

// Obtener texto para el tooltip de rendición de cuentas
const getRendicionText = (actividadId, tareaId = null) => {
  const solicitud = getSolicitudFondosInfo(actividadId, tareaId)
  if (solicitud && solicitud.numeroFormulario) {
    return `Rendición de Cuentas (${solicitud.numeroFormulario})`
  }
  return 'Rendición de Cuentas - Pendiente solicitud'
}

// Verificar si la solicitud está aprobada para habilitar la rendición
const isSolicitudAprobada = (actividadId, tareaId = null) => {
  const solicitud = getSolicitudFondosInfo(actividadId, tareaId)
  // Asumiendo que tienes un campo 'estado' en la solicitud
  console.log('*********aaaaaaaa', solicitud)
  return solicitud && solicitud.estado === 'APROBADO' // Ajusta según tu modelo de datos
}


// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color
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
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query))
    )
  }
  // Filtrar por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) =>
      statusFilters.value.includes(actividad.estado)
    )
  }
  // Filtrar por procedencia de fondos
  if (procedenciaFilter.value) {
    filtered = filtered.filter((actividad) =>
      actividad.procedencia_fondos === procedenciaFilter.value
    )
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

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  if (isEditandoTarea.value) {
    Object.assign(tareaForm.value, {
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: mapEstadoBackendToFrontend(tarea.estado),
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
    const tareaData = {
      titulo: tareaForm.value.titulo,
      descripcion: tareaForm.value.descripcion,
      estado: tareaForm.value.estado,
    }

    let resultado

    if (isEditandoTarea.value) {
      resultado = await actualizarTareaEnActividad(
        actividadIdParaTarea.value,
        tareaForm.value.id,
        tareaData
      )

      const actividad = actividades.value.find(a => a.id === actividadIdParaTarea.value)
      if (actividad && actividad.tareas) {
        const tareaIndex = actividad.tareas.findIndex(t => t.id === tareaForm.value.id)
        if (tareaIndex !== -1) {
          const tareaActualizada = {
            ...resultado,
            estadoFrontend: mapEstadoBackendToFrontend(resultado.estado)
          }
          actividad.tareas[tareaIndex] = tareaActualizada
        }
      }

      mostrarSnackbar('Tarea actualizada con éxito', 'success')
    } else {
      resultado = await crearTareaEnActividad(actividadIdParaTarea.value, tareaData)

      const actividad = actividades.value.find(a => a.id === actividadIdParaTarea.value)
      if (actividad) {
        if (!actividad.tareas) {
          actividad.tareas = []
        }
        const nuevaTarea = {
          ...resultado,
          estadoFrontend: mapEstadoBackendToFrontend(resultado.estado)
        }
        actividad.tareas.push(nuevaTarea)
      }

      mostrarSnackbar('Tarea creada con éxito', 'success')
    }

  } catch (error) {
    console.error('Error al guardar tarea:', error)
    mostrarSnackbar('Error al guardar tarea: ' + (error.response?.data?.message || error.message || 'Error desconocido'), 'error')
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
    await eliminarTareaDeActividad(actividadIdParaEliminarTarea.value, tareaToDelete.value.id)

    const actividad = actividades.value.find(a => a.id === actividadIdParaEliminarTarea.value)
    if (actividad && actividad.tareas) {
      actividad.tareas = actividad.tareas.filter(t => t.id !== tareaToDelete.value.id)
    }

    mostrarSnackbar('Tarea eliminada con éxito', 'success')

  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    mostrarSnackbar('Error al eliminar tarea: ' + (error.response?.data?.message || error.message || 'Error desconocido'), 'error')
  } finally {
    loading.value = false
    deleteTareaDialog.value = false
  }
}

// Funciones auxiliares
const getTipoIcon = (status) => {
  switch (status) {
    case 'PLAN': return 'mdi-calendar-check-outline'
    case 'RETR': return 'mdi-calendar-alert'
    case 'REPROG': return 'mdi-calendar-refresh'
    case 'EJEC': return 'mdi-calendar-arrow-right'
    case 'REP': return 'mdi-calendar-edit'
    case 'FIN': return 'mdi-calendar-done'
    default: return 'mdi-help-circle'
  }
}

const formatCurrency = (value) => {
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'N/A'
}

const getProcedenciaTexto = (procedencia) => {
  const p = procedenciaFondos.find((p) => p.value === procedencia)
  return p ? p.text : 'Desconocido'
}

const getStatusColorTarea = (status) => {
  switch (status) {
    case 'PEN': return 'grey'
    case 'EPROG': return 'warning'
    case 'COMPL': return 'success'
    default: return 'grey'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const actividadesPaginadasOrdenadas = computed(() => {
  if (!Array.isArray(actividadesPaginadas.value)) return []

  // Ordenar por ID (o fecha de creación si está disponible) de forma descendente
  return [...actividadesPaginadas.value].sort((a, b) => {
    // Si tienes un campo de fecha de creación, úsalo:
    // return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);

    // Si no, ordenar por ID (asumiendo que IDs más altos son más recientes)
    return b.id - a.id;
  });
});
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
