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
    <!-- Mensaje cuando no hay proyectos -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-database-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay proyectos registrados</h3>
        <p class="text-grey mt-2">Parece que aún no has creado ningún proyecto</p>
        <v-btn color="primary" @click="dialogNuevoProyecto = true" class="mt-4">
          <v-icon left>mdi-plus</v-icon>
          Crear primer proyecto
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-else>
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

            <!-- Filtros por estado -->
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

                    <v-tooltip text="Estructura" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-cog"
                          variant="text"
                          color="secondary"
                          :to="`/proyecto/${item.id}/estructura`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Cargar documentos" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-upload"
                          variant="text"
                          color="teal"
                          @click="openUploadDialog(item)"
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
              @click="dialogNuevoProyecto = true"
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
          ¿Estás seguro de que deseas eliminar el PROYECTO: "{{ proyectoToDelete.titulo }}", con
          CODIGO:"{{ proyectoToDelete.codigo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProyecto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <!-- Diálogo de carga de documentos -->
  <v-dialog v-model="uploadDialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">
        <v-icon left>mdi-upload</v-icon>
        Cargar documentos
      </v-card-title>
      <v-card-subtitle> Proyecto: {{ proyectoSeleccionado?.titulo }} </v-card-subtitle>

      <v-card-text>
        <v-file-input
          v-model="filesToUpload"
          multiple
          label="Seleccionar archivos"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :rules="fileRules"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        ></v-file-input>

        <v-alert v-if="uploadError" type="error" variant="tonal" class="mt-3">
          {{ uploadError }}
        </v-alert>

        <v-progress-linear
          v-if="uploadProgress > 0 && uploadProgress < 100"
          :model-value="uploadProgress"
          height="20"
          color="light-blue"
          class="mt-3"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="closeUploadDialog">Cancelar</v-btn>
        <v-btn
          color="primary"
          @click="uploadFiles"
          :disabled="!filesToUpload || filesToUpload.length === 0"
        >
          Subir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="text-center pa-4">
    <v-dialog v-model="dialogNuevoProyecto" max-width="800" persistent>
      <v-card>
        <v-toolbar color="primary" title="Nuevo Proyecto"></v-toolbar>

        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="openConfirmation">
            <v-container>
              <!-- Primera fila: Código y Título -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="proyecto.codigo"
                    label="Código *"
                    :rules="codigoRules"
                    counter="20"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="proyecto.titulo"
                    label="Título *"
                    :rules="tituloRules"
                    counter="200"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Descripción -->
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="proyecto.descripcion"
                    label="Descripción"
                    rows="3"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Segunda fila: PEI e Instancia Gestora -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    variant="outlined"
                    v-model="seleccionPei"
                    :items="peiOpciones"
                    item-title="pei"
                    item-value="idpei"
                    label="Pertenece a"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    variant="outlined"
                    v-model="proyecto.instancia_gestora"
                    label="Instancia gestora*"
                    :items="instanciaOpciones"
                    :rules="[(v) => !!v || 'La instancia gestora es requerida']"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Tercera fila: Creado por -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="proyecto.creado_por"
                    label="Creado por"
                    counter="150"
                    variant="outlined"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-number-input
                    :reverse="false"
                    v-model="proyecto.presupuesto"
                    controlVariant="default"
                    label="Presupuesto"
                    :hideInput="false"
                    :inset="false"
                    variant="outlined"
                    :precision="2"
                  ></v-number-input>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Cuarta fila: Fechas -->
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de creación"
                    v-model="proyecto.fecha_creacion"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de inicio"
                    v-model="proyecto.fecha_inicio"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Fecha de finalización"
                    v-model="proyecto.fecha_finalizacion"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
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

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar creación</v-card-title>
        <v-card-text> ¿Está seguro que desea crear este proyecto? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="confirmDialog = false"> No </v-btn>
          <v-btn color="primary" variant="elevated" @click="submitProyecto"> Sí, crear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <!--Mensaje de confirmacion-->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { formatDate, getStatusColor, getEstadoTexto } from '@/utility/formatters'
import { useRouter } from 'vue-router'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'

//Enrutador
const router = useRouter()

//Estado del snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success', // 'success' o 'error'
})

//Estados para los modales CREACION DE PROYECTO
const dialogNuevoProyecto = ref(false)
const confirmDialog = ref(false)
const form = ref(null)
const formValid = ref(false)
const seleccionPei = ref(1)
const peiOpciones = [{ idpei: 1, pei: 'PEI 2024 - 2027' }]

const instanciaOpciones = [
  'Direccion ejecutiva',
  'Comunicacion',
  'Planificacion, monitoreo y evaluacion',
  'Desarrollo de redes',
  'Programa urbano',
  'Programa Nina',
  'Programa defensores',
  'Administracion',
]

// Datos del proyecto
const proyecto = reactive({
  codigo: '',
  titulo: '',
  descripcion: '',
  pei: 1,
  estado: 'ES',
  instancia_gestora: '',
  creado_por: 'Admin',
  fecha_inicio: null,
  fecha_finalizacion: null,
  presupuesto: null,
})
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
//Estado: no datos de la api
const emptyResponse = ref(false)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Obtener proyectos al montar el componente
onMounted(async () => {
  await cargarProyectos()
})

// Computed
const proyectos = computed(() => proyectoStore.proyectos)

const filteredProyectos = computed(() => {
  if (emptyResponse.value) return []

  let filtered = proyectos.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (proyecto) =>
        proyecto.codigo.toLowerCase().includes(query) ||
        proyecto.titulo.toLowerCase().includes(query),
    )
  }

  // Filtro por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((proyecto) => statusFilters.value.includes(proyecto.estado))
  }

  return filtered
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
    emptyResponse.value = false
    await proyectoStore.obtenerProyectos()
    if (proyectoStore.proyectos.length === 0) {
      emptyResponse.value = true
    }
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
    console.log('Borrar')
    console.log(proyectoToDelete.value.id)
    await proyectoServicios.eliminar(proyectoToDelete.value.id)
    snackbar.value = {
      show: true,
      text: 'Proyecto eliminado exitosamente',
      color: 'success',
    }

    await cargarProyectos()
  } catch (err) {
    error.value =
      'Error al eliminar el proyecto: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al eliminar proyecto', err)
    snackbar.value = {
      show: true,
      text: error.value.response?.data?.message || 'Error al crear el proyecto',
      color: 'error',
    }
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

//Filtro adicional
// Agrega esto en la sección de estados (ref)
const statusFilters = ref([])
const availableStatuses = [
  { text: 'En Estructuración', value: 'ES' },
  { text: 'En Ejecución', value: 'EJ' },
  { text: 'Completado', value: 'CO' },
  { text: 'Suspendido', value: 'SU' },
]

//Estados adicionales
// Estados adicionales
const uploadDialog = ref(false)
const proyectoSeleccionado = ref(null)
const filesToUpload = ref([])
const uploadProgress = ref(0)
const uploadError = ref(null)

// Reglas de validación de archivos
const fileRules = [
  (value) => {
    if (!value || value.length === 0) return true
    const maxSize = 10 * 1024 * 1024 // 10MB
    for (const file of value) {
      if (file.size > maxSize) {
        return 'El tamaño máximo por archivo es 10MB'
      }
    }
    return true
  },
]

// Métodos
const openUploadDialog = (proyecto) => {
  proyectoSeleccionado.value = proyecto
  uploadDialog.value = true
  filesToUpload.value = []
  uploadProgress.value = 0
  uploadError.value = null
}

const closeUploadDialog = () => {
  uploadDialog.value = false
  filesToUpload.value = []
  uploadProgress.value = 0
  uploadError.value = null
}

const uploadFiles = async () => {
  if (!filesToUpload.value || filesToUpload.value.length === 0) return

  try {
    uploadError.value = null
    uploadProgress.value = 0

    // Simulamos el progreso de carga (en una implementación real usarías axios o similar)
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          closeUploadDialog()
          // Aquí podrías actualizar la lista de documentos del proyecto
          alert('Documentos subidos exitosamente')
        }, 500)
      }
    }, 300)

    // En una implementación real:
    // const formData = new FormData()
    // filesToUpload.value.forEach(file => {
    //   formData.append('files', file)
    // })
    // await proyectoStore.subirDocumentos(proyectoSeleccionado.value.id, formData, {
    //   onUploadProgress: (progressEvent) => {
    //     uploadProgress.value = Math.round(
    //       (progressEvent.loaded * 100) / progressEvent.total
    //     )
    //   }
    // })
  } catch (error) {
    uploadError.value = 'Error al subir los documentos: ' + (error.message || 'Intente nuevamente')
    console.error('Error al subir documentos', error)
  }
}

/*
const resetForm = () => {
  proyecto.value = {
    codigo: '',
    titulo: '',
    descripcion: '',
    pei: null,
    estado: 'ES',
    instancia_gestora: '',
    creado_por: '',
    fecha_inicio: null,
    fecha_finalizacion: null
  }
}*/
//Metodos de los dialog
// Opciones para selects

// Reglas de validación
const codigoRules = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length <= 20) || 'Máximo 20 caracteres',
  (v) => /^[A-Z0-9-]+$/.test(v) || 'Solo mayúsculas, números y guiones',
]

const tituloRules = [
  (v) => !!v || 'El título es requerido',
  (v) => (v && v.length <= 200) || 'Máximo 200 caracteres',
  (v) => /^[\w\sáéíóúÁÉÍÓÚñÑ.,;:¿?¡!()-]+$/.test(v) || 'Caracteres no válidos',
]

// Métodos

const openConfirmation = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

//Funcion para crear Proyectos
const submitProyecto = async () => {
  //Rutina de creacion
  try {
    const response = await proyectoServicios.crear(proyecto)
    if (!response?.data?.id) {
      throw new Error('No se recibió un ID válido')
    }
    const proyectoID = response.data.id

    // Mostrar mensaje de éxito
    snackbar.value = {
      show: true,
      text: 'Proyecto creado exitosamente',
      color: 'success',
    }
    setTimeout(() => {
      router.push(`/proyecto/${proyectoID}/estructura/`)
    }, 1500)
    confirmDialog.value = false
    dialogNuevoProyecto.value = false
  } catch (error) {
    console.error('Error al crear proyecto:', error)
    // Mostrar mensaje de error
    snackbar.value = {
      show: true,
      text: error.response?.data?.message || 'Error al crear el proyecto',
      color: 'error',
    }
  }

  /* try {
    const payload = {
      ...proyecto.value,
      pei: proyecto.value.pei,
    }

    // Limpiar campos no requeridos si están vacíos
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '' || payload[key] === null) {
        delete payload[key]
      }
    })

    //const response = await axios.post('/api/proyectos/', payload)
    //const proyectoId = response.data.id

    // Redirigir a la vista de edición
    //router.push(`/proyecto/${proyectoId}/editar`)

    // Cerrar y resetear
    confirmDialog.value = false
    dialogNuevoProyecto.value = false
    resetForm()
  } catch (error) {
    console.error('Error al crear proyecto:', error)
    // Aquí podrías mostrar un snackbar/alert con el error
  } */
}

const resetForm = () => {
  proyecto.reactive = {
    codigo: '',
    titulo: '',
    descripcion: '',
    pei: 1,
    estado: 'ES',
    instancia_gestora: '',
    creado_por: 'Admin',
    fecha_creacion: null,
    fecha_inicio: null,
    fecha_finalizacion: null,
    presupuesto: null,
  }
}

const closeDialog = () => {
  //dialog.value = false
  dialogNuevoProyecto.value = false
  resetForm()
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

/* Upload de files */
.v-file-input .v-input__details {
  display: none;
}

.v-file-input .v-input__control {
  min-height: 56px;
}
</style>
