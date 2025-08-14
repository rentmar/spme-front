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
                  variant="outlined"
                >
                  {{ status.text }}
                </v-chip>
              </v-chip-group>

              <!-- Filtro por tipo de actividad -->
              <v-select
                v-model="tipoFilter"
                :items="tiposActividad"
                item-value="value"
                item-title="text"
                label="Tipo de actividad"
                clearable
                variant="outlined"
                density="compact"
                style="min-width: 200px"
              ></v-select>

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
<!--***************************************************************************************************-->
          <v-list v-if="!loading" class="py-0">
            <template v-for="item in actividadesPaginadas" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(item.estado)" class="mr-4">
                    <v-icon dark>{{ getTipoIcon(item.tipo) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  Codigo: {{ item.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      small
                      :color="getStatusColor(item.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getEstadoTexto(item.estado) }}
                    </v-chip>
                    <span class="mr-2">Presupuesto: {{ formatCurrency(item.presupuesto) }}</span>
                    <span>Fondos: {{ getProcedenciaTexto(item.procedencia_fondos) }}</span>
                    <span>Descripcion: {{ item.descripcion }}</span>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                  <div class="text-caption mt-1" v-if="item.fecha_programada">
                    <strong>Programada:</strong> {{ formatDate(item.fecha_programada) }}
                    <span v-if="item.duracion"> (Duración: {{ item.duracion }} días)</span>
                  </div>
                  <div class="text-caption mt-1" v-if="item.fecha_inicio">
                    <strong>Ejecución:</strong> {{ formatDate(item.fecha_inicio) }}
                    <span v-if="item.fecha_cierre">a {{ formatDate(item.fecha_cierre) }}</span>
                  </div>
                </v-list-item-subtitle>
<!-- icono solicitud de Fondos -->
                  <template v-slot:append>
                  <div class="d-flex">
                    <v-tooltip text="Solicitud de Fondos" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="primary"
                          :to="`/pei/formulario01/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
<!-- icono Solicitud de Reposicion -->
                    <v-tooltip text="Solicitud de Reposicion" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="warning"
                          :to="`/pei/formulario03/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
<!-- icono rendicion de cuentas-->
                    <v-tooltip text="Rendicion de Cuentas" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 2"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="error"
                          :to="`/pei/formulario02/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
<!-- icono Solicitud de Viaje -->
                    <v-tooltip text="Solicitud de Viaje" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="deep-purple"
                          :to="`/pei/formulario05/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
<!-- icono Solicitud de Pago Directo -->
                    <v-tooltip text="Solicitud de Pago Directo" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="teal-lighten-2"
                          :to="`/pei/formulario08/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- <v-tooltip text="Avances" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-progress-check"
                          variant="text"
                          color="teal"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedActividadId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->

                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="info"
                          :to="`/pei/formularioinf/${item.id}`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable -->
              <v-expand-transition>
                <div v-if="expandedActividadId === item.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-tabs v-model="activeTab" color="primary" grow>
                      <v-tab value="datos">
                        <v-icon left>mdi-information</v-icon>
                        Datos
                      </v-tab>
                      <v-tab value="objetivo">
                        <v-icon left>mdi-target</v-icon>
                        Objetivo
                      </v-tab>
                      <v-tab value="evaluacion">
                        <v-icon left>mdi-clipboard-text</v-icon>
                        Evaluación
                      </v-tab>
                    </v-tabs>

                    <v-card-text class="pt-4">
                      <v-window v-model="activeTab">
                        <!-- Tab Datos de la Actividad -->
                        <v-window-item value="datos">
                          <v-row>
                            <v-col cols="12" md="6">
                              <p><strong>Tipo:</strong> {{ getTipoTexto(item.tipo) }}</p>
                              <p><strong>Estado:</strong> {{ getEstadoTexto(item.estado) }}</p>
                              <p><strong>Código:</strong> {{ item.codigo }}</p>
                              <p><strong>Presupuesto:</strong> {{ formatCurrency(item.presupuesto) }}</p>
                              <p><strong>Presupuesto PEI:</strong> {{ formatCurrency(item.presupuesto_pei) }}</p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <p><strong>Fondos:</strong> {{ getProcedenciaTexto(item.procedencia_fondos) }}</p>
                              <p v-if="item.fecha_programada"><strong>Fecha programada:</strong> {{ formatDate(item.fecha_programada) }}</p>
                              <p v-if="item.duracion"><strong>Duración:</strong> {{ item.duracion }} días </p>
                              <p v-if="item.fecha_inicio"><strong>Fecha inicio:</strong> {{ formatDate(item.fecha_inicio) }} </p>
                              <p v-if="item.fecha_cierre"><strong>Fecha cierre:</strong> {{ formatDate(item.fecha_cierre) }} </p>
                            </v-col>
                          </v-row>
                        </v-window-item>

                        <!-- Tab Objetivo -->
                        <v-window-item value="objetivo">
                          <p><strong>Objetivo:</strong></p>
                          <p>{{ item.objetivo_de_actividad || 'No se ha definido un objetivo' }}</p>
                        </v-window-item>

                        <!-- Tab Evaluación -->
                        <v-window-item value="evaluacion">
                          <p><strong>Descripción de evaluación:</strong></p>
                          <p> {{ item.descripcion_evaluacion || 'No se ha definido una evaluación' }} </p>
                          <p v-if="item.justificacion_modificacion" class="mt-2">
                            <strong>Justificación de modificación:</strong><br />
                            {{ item.justificacion_modificacion }}
                          </p>
                        </v-window-item>
                      </v-window>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="`/actividad/${item.id}/detalle`"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
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
        <!-- Tarjeta de acciones -->
        <!-- <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item
              @click="dialogNuevaActividad = true"
              title="Nueva Actividad"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <v-list-item
              title="Exportar lista"
              prepend-icon="mdi-file-export"
              @click="exportToExcel"
            ></v-list-item>
          </v-list>
        </v-card> -->

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
              <v-list-item-subtitle class="text-right">{{ filteredActividades.length }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right"> {{ countByStatus('SPLAN') }} </v-list-item-subtitle>
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
              <v-list-item-subtitle class="text-right"> {{ countByStatus('COMP') }} </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text> ¿Estás seguro de que deseas eliminar la ACTIVIDAD: "{{ actividadToDelete.codigo }}"? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteActividad">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Diálogo para nueva actividad -->
    <v-dialog v-model="dialogNuevaActividad" max-width="800" persistent>
      <v-card>
        <v-toolbar color="primary" title="Nueva Actividad"></v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="openConfirmation">
            <v-container>
              <!-- Primera fila: Código y Tipo -->
              <v-row>
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
              </v-row>
              <!-- Segunda fila: Fechas -->
              <v-row>
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
              </v-row>
              <!-- Tercera fila: Descripción y presupuesto -->
              <v-row>
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
              </v-row>
              <!-- Cuarta fila: Procedencia de fondos y objetivo -->
              <v-row>
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
              </v-row>
              <!-- Quinta fila: Justificación de modificación y evaluación -->
              <v-row>
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
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmationDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Creación</v-card-title>
        <v-card-text> ¿Estás seguro de que los datos son correctos? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="confirmationDialog = false">
            Editar
          </v-btn>
          <v-btn color="primary" @click="createActividad">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  {{ actividades }}
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad.js'

// Usamos el composable
const {
  loading,
  error,
  actividades,
  actividad,
  cargarActividades,
  crearActividad,
} = useActividad()

// Estado del formulario
const formValid = ref(false)
const dialogNuevaActividad = ref(false)
const confirmationDialog = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: '',
})

// Paginación y búsqueda
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const statusFilters = ref([])
const tipoFilter = ref(null)
const procedenciaFilter = ref(null)
const expandedActividadId = ref(null)

const availableStatuses = [
  { value: 'SPLAN', text: 'Reprogramación' },
  { value: 'PLAN', text: 'Planificación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'COMP', text: 'Finalizado' },
  { value: 'NODEF', text: 'No Definido' },
]

const tiposActividad = [
  { value: 'A', text: 'Actividad' },
  { value: 'T', text: 'Tarea' },
  { value: 'NODEF', text: 'No Definido' },
]

const procedenciaFondos = [
  { value: 'PROY', text: 'Proyecto' },
  { value: 'PRESP', text: 'Presupuesto' },
  { value: 'NODEF', text: 'No Definido' },
]

// Cargar actividades al montar el componente
onMounted(async () => {
  await fetchActividades()
})

// Funciones del componente
async function fetchActividades() {
  try {
    await cargarActividades()
  } catch (err) {
    console.error('Error al cargar actividades:', err)
  }
}

// Lógica de paginación y filtros
const filteredActividades = computed(() => {
  let filtered = actividades.value
    ? actividades.value.filter(
        (act) =>
          (searchQuery.value === null ||
            searchQuery.value === '' ||
            act.codigo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            act.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
          (statusFilters.value.length === 0 || statusFilters.value.includes(act.estado)) &&
          (tipoFilter.value === null || tipoFilter.value === act.tipo) &&
          (procedenciaFilter.value === null || procedenciaFilter.value === act.procedencia_fondos)
      )
    : []
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredActividades.value.length / itemsPerPage.value))

const actividadesPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const emptyResponse = computed(() => filteredActividades.value.length === 0 && !loading.value)

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredActividades.value.length)
)

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// Funciones de utilidad
const getStatusColor = (status) => {
  switch (status) {
    case 'PLAN':
      return 'light-blue'
    case 'EJEC':
      return 'orange'
    case 'COMP':
      return 'green'
    case 'SPLAN':
      return 'yellow'
    default:
      return 'grey'
  }
}

const getEstadoTexto = (status) => {
  const s = availableStatuses.find((s) => s.value === status)
  return s ? s.text : 'Desconocido'
}

const getTipoIcon = (tipo) => {
  switch (tipo) {
    case 'A':
      return 'mdi-calendar-month'
    case 'T':
      return 'mdi-list-box'
    default:
      return 'mdi-help-circle'
  }
}

const getTipoTexto = (tipo) => {
  const t = tiposActividad.find((t) => t.value === tipo)
  return t ? t.text : 'Desconocido'
}

const getProcedenciaTexto = (procedencia) => {
  const p = procedenciaFondos.find((p) => p.value === procedencia)
  return p ? p.text : 'Desconocido'
}

const formatCurrency = (value) => {
  return value ? `Bs. ${value.toFixed(2)}` : 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const countByStatus = (status) => {
  return filteredActividades.value.filter((act) => act.estado === status).length
}

const resetForm = () => {
  Object.assign(actividad, {
    codigo: '',
    descripcion: '',
    tipo: 'NODEF',
    fecha_programada: null,
    duracion: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    presupuesto_pei: null,
    estado: 'SPLAN',
    procedencia_fondos: 'PROY',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    justificacion_modificacion: '',
    datos_actividad: null,
  })
}

const closeDialog = () => {
  resetForm()
  dialogNuevaActividad.value = false
}

// Reglas de validación
const codigoRules = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length <= 60) || 'Máximo 60 caracteres',
]

const openConfirmation = () => {
  confirmationDialog.value = true
}

const createActividad = async () => {
  confirmationDialog.value = false
  try {
    loading.value = true
    await crearActividad(actividad)
    snackbar.value = {
      show: true,
      text: 'Actividad creada con éxito',
      color: 'success',
    }
    resetForm()
  } catch (error) {
    console.error('Error al crear actividad:', error)
    // Mostrar mensaje de error
    snackbar.value = {
      show: true,
      text: 'Error al crear la actividad',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.actividad-container {
  max-width: 1200px;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
