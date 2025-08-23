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

              <!-- Filtro por procedencia de fondos -->
              <v-select
                v-model="procedenciaFilter"
                :items="procedenciaFondos"
                item-value="value"
                item-title="text"
                label="Procedencia fondos"
                clearable
                variant="outlined"
                density="compact"
                style="min-width: 200px"
              ></v-select>
            </div>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="actividad in actividadesPaginadas" :key="actividad.id">
              <v-list-item :value="actividad" @click="toggleExpanded(actividad.id)" class="mb-2">
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
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="primary"
                          :to="`/pei/formulario01/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Reposición -->
                    <v-tooltip text="Solicitud de Reposición" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="warning"
                          :to="`/pei/formulario03/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Rendición de cuentas -->
                    <v-tooltip text="Rendición de Cuentas" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 2"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="error"
                          :to="`/pei/formulario02/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Viaje -->
                    <v-tooltip text="Solicitud de Viaje" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="deep-purple"
                          :to="`/pei/formulario05/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Solicitud de Pago Directo -->
                    <v-tooltip text="Solicitud de Pago Directo" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="teal-lighten-2"
                          :to="`/pei/formulario08/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Informe de Actividad -->
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="info"
                          :to="`/pei/formularioinf/${actividad.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Mostrar tareas -->
                    <!-- <v-tooltip text="Mostrar tareas" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click.stop="toggleExpanded(actividad.id)"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedActividadId === actividad.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-card-text class="pt-4">
                      <div class="d-flex justify-space-between align-center mb-4">
                        <span class="text-subtitle-1">Tareas para {{ actividad.codigo }}</span>
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
                          <v-list-item-title class="text-grey text-caption">
                            No hay tareas para esta actividad
                          </v-list-item-title>
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

    <!-- Diálogo de confirmación de eliminación -->
    <!-- <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text> ¿Estás seguro de que deseas eliminar la ACTIVIDAD: "{{ actividadToDelete?.codigo }}"? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- Diálogo para nueva actividad -->

    <!--*************************************** -->
    <!-- <v-dialog v-model="dialogNuevaActividad" max-width="800" persistent>
      <v-card>
        <v-toolbar color="primary" title="Nueva Actividad"></v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="openConfirmation">
            <v-container> -->
              <!-- Primera fila: Código y Tipo -->
              <!-- <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="actividad.codigo" label="Código" :rules="codigoRules" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.tipo"
                    :items="tiposActividad"
                    item-title="text"
                    item-value="value"
                    label="Tipo de actividad"
                    required
                  ></v-select>
                </v-col>
              </v-row> -->
              <!-- Segunda fila: Fechas -->
              <!-- <v-row>
                 <v-col cols="12" md="4">
                  <v-text-field
                    v-model="actividad.fecha_programada"
                    label="Fecha Programada"
                    type="date"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="actividad.duracion" label="Duración (días)" type="number"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="actividad.fecha_inicio" label="Fecha Inicio" type="date"></v-text-field>
                </v-col>
              </v-row> -->
              <!-- Tercera fila: Descripción y presupuesto -->
              <!-- <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.descripcion"
                    label="Descripción de la actividad"
                    rows="3"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.presupuesto"
                    label="Presupuesto"
                    type="number"
                    prefix="Bs."
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.presupuesto_pei"
                    label="Presupuesto PEI"
                    type="number"
                    prefix="Bs."
                  ></v-text-field>
                </v-col>
              </v-row> -->
              <!-- Cuarta fila: Procedencia de fondos y objetivo -->
              <!-- <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.procedencia_fondos"
                    :items="procedenciaFondos"
                    item-title="text"
                    item-value="value"
                    label="Procedencia de fondos"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.objetivo_de_actividad"
                    label="Objetivo de la actividad"
                  ></v-text-field>
                </v-col>
              </v-row> -->
              <!-- Quinta fila: Justificación de modificación y evaluación -->
              <!-- <v-row>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="actividad.justificacion_modificacion"
                    label="Justificación de modificación"
                    rows="2"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="actividad.descripcion_evaluacion"
                    label="Descripción de evaluación"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <div class="d-flex justify-end mt-4">
              <v-btn color="primary" type="submit" :disabled="!formValid" class="mr-2">Crear</v-btn>
              <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="tareaDialog = false">Cancelar</v-btn>
          <v-btn color="success" @click="saveTarea">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
<!-- **********************************************************-->
    <v-dialog v-model="tareaDialog" max-width="500">
      <v-card>
        <v-toolbar
          color="secondary"
          :title="isEditandoTarea ? 'Editar Tarea' : 'Nueva Tarea'"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="tareaFormRef">
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

    <!-- <v-dialog v-model="confirmationDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Creación</v-card-title>
        <v-card-text> ¿Estás seguro de que los datos son correctos? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn color="secondary" @click="confirmationDialog = false">
            Editar
          </v-btn>
           <v-btn color="grey" @click="deleteActividadDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad">Eliminar</v-btn>
           <v-btn color="primary" @click="createActividad">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->





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
  {{ actividadesPaginadas }}
  {{ '******************' }}
  {{ actividadesFromApi }}
    {{ '******************' }}
    {{ expandedActividadId }}

  {{ '*********************************************************************************************************' }}
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useTareas } from '@/modules/proyecto/composables/useTareas.js';

const { actividadesTareas, actividadTarea: actividadesFromApi } = useActividad()
const {
  load,
  eerror,
  tareas,
  tarea,
  cargarTareas,
  cargarTareaPorId,
  crearTarea,
  updateTarea,
  delTarea,
} = useTareas();

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
//const actividadDialog = ref(false)
//const actividadForm = ref({ id: null, nombreCorto: '', estado: 'PR' })
//const isEditandoActividad = ref(false)
//const actividadFormRef = ref(null)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const tareaForm = ref({ id: null, titulo: '', descripcion: '', estado: 'PE' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
//const deleteActividadDialog = ref(false)
//const actividadToDelete = ref(null)
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)

const procedenciaFilter = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Formulario de nueva actividad
//const formValid = ref(false)
const dialogNuevaActividad = ref(false)
//const confirmationDialog = ref(false)
//const deleteDialog = ref(false)

// Datos de formulario
// const actividad = ref({
//   codigo: '',
//   tipo: '',
//   fecha_programada: '',
//   duracion: 0,
//   fecha_inicio: '',
//   descripcion: '',
//   presupuesto: 0,
//   presupuesto_pei: 0,
//   procedencia_fondos: '',
//   objetivo_de_actividad: '',
//   justificacion_modificacion: '',
//   descripcion_evaluacion: ''
// })

// Reglas de validación
// const codigoRules = [
//   v => !!v || 'El código es requerido',
//   v => (v && v.length >= 3) || 'El código debe tener al menos 3 caracteres'
// ]

// Tipos de actividad
// const tiposActividad = [
//   { text: 'Actividad', value: 'A' },
//   { text: 'Tarea', value: 'T' }
// ]

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
    CRD: 'PE', // Creada -> Pendiente
    PLAN: 'PE', // Planificada -> Pendiente
    RETR: 'PR', // Retraso -> En Progreso
    REPROG: 'PR', // Reprogramacion -> En Progreso
    EJEC: 'PR', // En Ejecucion -> En Progreso
    REP: 'PR', // En Reporte -> En Progreso
    PEN: 'PE', // Pendiente -> Pendiente
    EPROG: 'PR', // En Progreso -> En Progreso
    FIN: 'CO', // Completada -> Completada
  }
  return estadoMap[estadoBackend] || 'PE'
}

const getStatusColor = (status) => {
  switch (status) {
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

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
}

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    await actividadesTareas()

    // Procesar los datos de la API
    if (Array.isArray(actividadesFromApi.value)) {
      actividades.value = actividadesFromApi.value.map((actividad) => ({
        ...actividad,
        estadoFrontend: mapEstadoBackendToFrontend(actividad.estado),
        // Asegurar que tareas siempre sea un array
        tareas: Array.isArray(actividad.tareas) ? actividad.tareas : [],
      }))
    } else {
      actividades.value = []
    }

    emptyResponse.value = actividades.value.length === 0
  } catch (error) {
    console.error('Error al cargar actividades:', error)
    actividades.value = []
    emptyResponse.value = true
  } finally {
    loading.value = false
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

// --- CRUD ACTIVIDADES ---
// const openActividadDialog = (actividad = null) => {
//   isEditandoActividad.value = !!actividad
//   if (isEditandoActividad.value) {
//     Object.assign(actividadForm.value, {
//       id: actividad.id,
//       nombreCorto: actividad.nombreCorto,
//       estado: actividad.estadoFrontend,
//     })
//   } else {
//     Object.assign(actividadForm.value, { id: null, nombreCorto: '', estado: 'PR' })
//   }
//   actividadDialog.value = true
// }

// const saveActividad = async () => {
//   const { valid } = await actividadFormRef.value.validate()
//   if (!valid) return

//   if (isEditandoActividad.value) {
//     const index = actividades.value.findIndex((a) => a.id === actividadForm.value.id)
//     if (index !== -1) {
//       actividades.value[index].nombreCorto = actividadForm.value.nombreCorto
//       actividades.value[index].estadoFrontend = actividadForm.value.estado
//       snackbar.value = { show: true, text: 'Actividad editada con éxito', color: 'success' }
//     }
//   } else {
//     const newId = Math.max(...actividades.value.map((a) => a.id), 0) + 1
//     actividades.value.push({
//       id: newId,
//       nombreCorto: actividadForm.value.nombreCorto,
//       estado: 'CRD', // Estado por defecto del backend
//       estadoFrontend: actividadForm.value.estado,
//       tareas: [],
//     })
//     snackbar.value = { show: true, text: 'Actividad creada con éxito', color: 'success' }
//   }
//   actividadDialog.value = false
//   await nextTick()
//   actividadFormRef.value.reset()
// }

// const confirmDeleteActividad = (actividad) => {
//   actividadToDelete.value = actividad
//   deleteActividadDialog.value = true
// }

// const deleteActividad = () => {
//   actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)
//   deleteActividadDialog.value = false
//   snackbar.value = { show: true, text: 'Actividad eliminada con éxito', color: 'success' }
// }

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
    Object.assign(tareaForm.value, { id: null, titulo: '', descripcion: '', estado: 'PE' })
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
       Object.assign(actividad.tareas[index], {
         titulo: tareaForm.value.titulo,
         descripcion: tareaForm.value.descripcion,
         estado:
           tareaForm.value.estado === 'PE'
             ? 'PEN'
             : tareaForm.value.estado === 'PR'
               ? 'EPROG'
               : 'COMPL',
       })
       snackbar.value = { show: true, text: 'Tarea editada con éxito', color: 'success' }
     }
   } else {
     const newId = Math.max(...actividad.tareas.map((t) => t.id), 0) + 1
     actividad.tareas.push({
       id: newId,
       titulo: tareaForm.value.titulo,
       descripcion: tareaForm.value.descripcion,
       estado:
         tareaForm.value.estado === 'PE'
           ? 'PEN'
           : tareaForm.value.estado === 'PR'
             ? 'EPROG'
             : 'COMPL',
       fecha_creacion: new Date().toISOString(),
       fecha_limite: null,
       presupuesto: null,
     })
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

// Funciones auxiliares
// const getTipoIcon = (tipo) => {
//   switch (tipo) {
//     case 'A':
//       return 'mdi-calendar-month'
//     case 'T':
//       return 'mdi-list-box'
//     default:
//       return 'mdi-help-circle'
//   }
// }
const getTipoIcon = (status) => {
  switch (status) {
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
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'N/A'
}

const getProcedenciaTexto = (procedencia) => {
  const p = procedenciaFondos.find((p) => p.value === procedencia)
  return p ? p.text : 'Desconocido'
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

// const openConfirmation = () => {
//   confirmationDialog.value = true
// }

// const closeDialog = () => {
//   dialogNuevaActividad.value = false
//   confirmationDialog.value = false
//   // Limpiar formulario
//   actividad.value = {
//     codigo: '',
//     tipo: '',
//     fecha_programada: '',
//     duracion: 0,
//     fecha_inicio: '',
//     descripcion: '',
//     presupuesto: 0,
//     presupuesto_pei: 0,
//     procedencia_fondos: '',
//     objetivo_de_actividad: '',
//     justificacion_modificacion: '',
//     descripcion_evaluacion: ''
//   }
// }

// const createActividad = () => {
//   // Lógica para crear la actividad
//   console.log('Creando actividad:', actividad.value)
//   confirmationDialog.value = false
//   dialogNuevaActividad.value = false
//   snackbar.value = { show: true, text: 'Actividad creada con éxito', color: 'success' }
// }
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
