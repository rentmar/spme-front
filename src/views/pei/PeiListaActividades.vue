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
                  {{ getTipoTexto(item.tipo) }}: {{ item.codigo }}
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
<!-- icono solicitud -->
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
                          :to="`/pei/formulario01`"
                        ></v-btn>
                      </template>
                    </v-tooltip>
<!-- icono reposicion-->
                    <v-tooltip text="Solicitud de Reposicion" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 1"
                          v-bind="props"
                          icon="mdi-file-document-edit-outline"
                          variant="text"
                          color="warning"
                          :to="`/pei/formulario03`"
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
                          :to="`/pei/formulario02`"
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
                          :to="`/actividad/${item.id}/avances`"
                        ></v-btn>
                      </template>
                    </v-tooltip> -->

                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="parseInt($route.query.showButton) === 3"
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedActividadId === item.id }"
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
              <v-list-item-subtitle class="text-right">{{
                filteredActividades.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-question</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('SPLAN') }}
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
                {{ countByStatus('COMP') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la ACTIVIDAD: "{{ actividadToDelete.codigo }}"?
        </v-card-text>
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
                  <v-text-field
                    v-model="actividad.codigo"
                    label="Código *"
                    :rules="codigoRules"
                    counter="60"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.tipo"
                    :items="tiposActividad"
                    label="Tipo de actividad *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Descripción -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.descripcion"
                    label="Descripción *"
                    rows="3"
                    variant="outlined"
                    :rules="[(v) => !!v || 'La descripción es requerida']"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Segunda fila: Estado y Procedencia de fondos -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.estado"
                    :items="availableStatuses"
                    label="Estado *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="actividad.procedencia_fondos"
                    :items="procedenciaFondos"
                    label="Procedencia de fondos *"
                    item-title="text"
                    item-value="value"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Tercera fila: Presupuestos -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-number-input
                    v-model="actividad.presupuesto"
                    label="Presupuesto"
                    variant="outlined"
                    :precision="2"
                  ></v-number-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-number-input
                    v-model="actividad.presupuesto_pei"
                    label="Presupuesto PEI"
                    variant="outlined"
                    :precision="2"
                  ></v-number-input>
                </v-col>
              </v-row>

              <!-- Cuarta fila: Fechas -->
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha programada"
                    v-model="actividad.fecha_programada"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de inicio"
                    v-model="actividad.fecha_inicio"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de cierre"
                    v-model="actividad.fecha_cierre"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Quinta fila: Duración -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividad.duracion"
                    label="Duración (días)"
                    type="number"
                    min="0"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Sexta fila: Objetivo y evaluación -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.objetivo_de_actividad"
                    label="Objetivo de la actividad"
                    rows="2"
                    variant="outlined"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="actividad.descripcion_evaluacion"
                    label="Descripción de evaluación"
                    rows="2"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog"> Cancelar </v-btn>
          <v-btn
            color="success"
            variant="elevated"
            :disabled="!formValid"
            @click="openConfirmation"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de creación -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar creación</v-card-title>
        <v-card-text> ¿Está seguro que desea crear esta actividad? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="confirmDialog = false"> No </v-btn>
          <v-btn color="primary" variant="elevated" @click="submitActividad"> Sí, crear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Mensaje de confirmación -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utility/formatters'

// Enrutador
const router = useRouter()

// Estado del snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success', // 'success' o 'error'
})

// Estados para los modales CREACION DE ACTIVIDAD
const dialogNuevaActividad = ref(false)
const confirmDialog = ref(false)
const form = ref(null)
const formValid = ref(false)

// Datos de actividades (ahora se cargarán desde la API)
const actividades = ref([])
const loading = ref(true)
const error = ref(null)
const emptyResponse = ref(false)

// Función para cargar actividades desde la API
const fetchActividades = async () => {
  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/actividades_api/obtenerActividadesUsuario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: 1 })
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    actividades.value = data.actividades || []
    emptyResponse.value = actividades.value.length === 0
  } catch (err) {
    console.error('Error al obtener actividades:', err)
    error.value = 'Error al cargar las actividades'
    snackbar.value = {
      show: true,
      text: error.value,
      color: 'error'
    }
    actividades.value = [] // Asegurarse de que actividades es un array
    emptyResponse.value = true
  } finally {
    loading.value = false
  }
}

// Resto del código permanece igual...
const deleteDialog = ref(false)
const actividadToDelete = ref(null)
const expandedActividadId = ref(null)
const searchQuery = ref('')
const activeTab = ref('datos')

// Filtros
const statusFilters = ref([])
const tipoFilter = ref(null)
const procedenciaFilter = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Opciones para selects
const availableStatuses = [
  { text: 'Reprogramación', value: 'SPLAN' },
  { text: 'Planificación', value: 'PLAN' },
  { text: 'En Ejecución', value: 'EJEC' },
  { text: 'En Reporte', value: 'POST' },
  { text: 'Retraso', value: 'CANC' },
  { text: 'Finalizado', value: 'COMP' },
]

const tiposActividad = [
  { text: 'No definido', value: 'NODEF' },
  { text: 'Capacitación', value: 'ACAP' },
  { text: 'Investigación', value: 'PRIN' },
  { text: 'Operativa', value: 'AOP' },
  { text: 'Sensibilización', value: 'CSNS' },
  { text: 'Desarrollo', value: 'PDES' },
  { text: 'Incidencia', value: 'AINC' },
  { text: 'Articulación', value: 'AART' },
]

const procedenciaFondos = [
  { text: 'Fondos de la Institución', value: 'UG' },
  { text: 'Fondos del proyecto', value: 'PROY' },
]

// Computed
const filteredActividades = computed(() => {
  let filtered = actividades.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) =>
        (actividad.codigo && actividad.codigo.toLowerCase().includes(query)) ||
        (actividad.descripcion && actividad.descripcion.toLowerCase().includes(query)),
    )
  }

  // Filtro por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) => statusFilters.value.includes(actividad.estado))
  }

  // Filtro por tipo
  if (tipoFilter.value) {
    filtered = filtered.filter((actividad) => actividad.tipo === tipoFilter.value)
  }

  // Filtro por procedencia de fondos
  if (procedenciaFilter.value) {
    filtered = filtered.filter(
      (actividad) => actividad.procedencia_fondos === procedenciaFilter.value,
    )
  }

  return filtered
})

// Paginación
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

// Cargar actividades al montar el componente
onMounted(() => {
  fetchActividades()
})

// Funciones de ayuda
const getStatusColor = (status) => {
  switch (status) {
    case 'SPLAN':
      return 'yellow'
    case 'PLAN':
      return 'light-blue'
    case 'EJEC':
      return 'orange'
    case 'POST':
      return 'light-green'
    case 'CANC':
      return 'red'
    case 'COMP':
      return 'green'
    default:
      return 'grey'
  }
}

const getEstadoTexto = (estado) => {
  const status = availableStatuses.find((s) => s.value === estado)
  return status ? status.text : estado
}

const getTipoTexto = (tipo) => {
  const tipoObj = tiposActividad.find((t) => t.value === tipo)
  return tipoObj ? tipoObj.text : tipo
}

const getProcedenciaTexto = (procedencia) => {
  const proc = procedenciaFondos.find((p) => p.value === procedencia)
  return proc ? proc.text : procedencia
}

const getTipoIcon = (tipo) => {
  switch (tipo) {
    case 'ACAP':
      return 'mdi-school'
    case 'PRIN':
      return 'mdi-microscope'
    case 'AOP':
      return 'mdi-cog'
    case 'CSNS':
      return 'mdi-bullhorn'
    case 'PDES':
      return 'mdi-home-city'
    case 'AINC':
      return 'mdi-handshake'
    case 'AART':
      return 'mdi-account-group'
    default:
      return 'mdi-calendar'
  }
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(value)
}

// Contador por estado
const countByStatus = (status) => {
  return filteredActividades.value.filter((a) => a.estado === status).length
}

// Acciones
const confirmDelete = (actividad) => {
  actividadToDelete.value = actividad
  deleteDialog.value = true
}

const deleteActividad = async () => {
  try {
    loading.value = true

    // Simulamos la eliminación de la actividad
    actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)

    snackbar.value = {
      show: true,
      text: 'Actividad eliminada exitosamente',
      color: 'success',
    }
  } catch (err) {
    error.value = 'Error al eliminar la actividad: Intente nuevamente más tarde'
    console.error('Error al eliminar actividad', err)
    snackbar.value = {
      show: true,
      text: error.value,
      color: 'error',
    }
  } finally {
    loading.value = false
    deleteDialog.value = false
  }
}

const exportToExcel = () => {
  alert('Función de exportar a Excel simulada')
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// Métodos para el formulario
const openConfirmation = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

const submitActividad = async () => {
  try {
    loading.value = true

    // Simulamos la creación de una nueva actividad
    const newId = Math.max(...actividades.value.map((a) => a.id)) + 1
    const newActividad = {
      id: newId,
      ...actividad,
      datos_actividad: {
        // Datos adicionales según el tipo de actividad
      },
    }

    actividades.value.unshift(newActividad)

    // Mostrar mensaje de éxito
    snackbar.value = {
      show: true,
      text: 'Actividad creada exitosamente',
      color: 'success',
    }

    confirmDialog.value = false
    dialogNuevaActividad.value = false
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

.gap-2 {
  gap: 8px;
}
</style>
