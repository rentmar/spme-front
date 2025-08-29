<template>
  <v-container class="programas-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando datos...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!loading">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono
            :titulo="'GESTIÓN DE PROGRAMAS Y ÁREAS'"
            :icon="'mdi-folder-multiple'"
          />

          <!-- Tarjetas resumen -->
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="summary-card" color="primary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Áreas</div>
                      <div class="text-h4 mt-2">{{ summary.areas }}</div>
                    </div>
                    <v-icon size="48">mdi-domain</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="secondary" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Programas</div>
                      <div class="text-h4 mt-2">{{ summary.programas }}</div>
                    </div>
                    <v-icon size="48">mdi-folder-multiple-outline</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="summary-card" color="success" variant="tonal">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-h6">Proyectos Asociados</div>
                      <div class="text-h4 mt-2">{{ summary.proyectosAsociados }}</div>
                    </div>
                    <v-icon size="48">mdi-briefcase-check</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pestañas principales -->
          <v-tabs v-model="tab" color="primary" grow>
            <v-tab value="areas">Áreas</v-tab>
            <v-tab value="programas">Programas</v-tab>
            <v-tab value="asignacion">Asignación de Proyectos</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- Pestaña Áreas -->
            <v-window-item value="areas">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <v-text-field
                    v-model="searchArea"
                    label="Buscar áreas"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    style="max-width: 300px"
                  ></v-text-field>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openAreaDialog">
                    Nueva Área
                  </v-btn>
                </div>

                <v-data-table
                  :headers="areaHeaders"
                  :items="filteredAreas"
                  :search="searchArea"
                  :loading="tableLoading"
                  loading-text="Cargando áreas..."
                  no-data-text="No hay áreas registradas"
                  :items-per-page="10"
                >
                  <!-- Estado -->
                  <template v-slot:item.esta_activa="{ item }">
                    <v-chip :color="item.esta_activa ? 'success' : 'error'" size="small">
                      {{ item.esta_activa ? 'Activa' : 'Inactiva' }}
                    </v-chip>
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_creacion="{ item }">
                    {{ formatDate(item.fecha_creacion) }}
                  </template>

                  <!-- Programas asociados -->
                  <template v-slot:item.programas_count="{ item }">
                    <v-chip color="info" size="small">
                      {{ item.programas_count }} programas
                    </v-chip>
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editArea(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDeleteArea(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewAreaDetails(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- Pestaña Programas -->
            <v-window-item value="programas">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <div class="d-flex align-center" style="width: 100%">
                    <v-select
                      v-model="programaFilters.area"
                      :items="areasOptions"
                      item-title="nombre"
                      item-value="id"
                      label="Filtrar por área"
                      density="compact"
                      variant="outlined"
                      clearable
                      style="max-width: 250px; margin-right: 16px"
                    ></v-select>
                    <v-text-field
                      v-model="searchPrograma"
                      label="Buscar programas"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      style="max-width: 300px"
                    ></v-text-field>
                  </div>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openProgramaDialog">
                    Nuevo Programa
                  </v-btn>
                </div>

                <v-data-table
                  :headers="programaHeaders"
                  :items="filteredProgramas"
                  :search="searchPrograma"
                  :loading="tableLoading"
                  loading-text="Cargando programas..."
                  no-data-text="No hay programas registrados"
                  :items-per-page="10"
                >
                  <!-- Estado -->
                  <template v-slot:item.esta_activo="{ item }">
                    <v-chip :color="item.esta_activo ? 'success' : 'error'" size="small">
                      {{ item.esta_activo ? 'Activo' : 'Inactivo' }}
                    </v-chip>
                  </template>

                  <!-- Área -->
                  <template v-slot:item.area="{ item }">
                    {{ getAreaNombre(item.area) }}
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_creacion="{ item }">
                    {{ formatDate(item.fecha_creacion) }}
                  </template>

                  <!-- Proyectos asociados -->
                  <template v-slot:item.proyectos_count="{ item }">
                    <v-chip color="info" size="small">
                      {{ item.proyectos_count }} proyectos
                    </v-chip>
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        @click="editPrograma(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmDeletePrograma(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="info"
                        variant="text"
                        @click="viewProgramaDetails(item)"
                        class="ml-1"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>

            <!-- Pestaña Asignación de Proyectos -->
            <v-window-item value="asignacion">
              <v-card variant="outlined" class="mt-4">
                <div class="d-flex justify-space-between align-center pa-4">
                  <div class="d-flex align-center" style="width: 100%">
                    <v-select
                      v-model="asignacionFilters.programa"
                      :items="programasOptions"
                      item-title="nombre"
                      item-value="id"
                      label="Filtrar por programa"
                      density="compact"
                      variant="outlined"
                      clearable
                      style="max-width: 250px; margin-right: 16px"
                    ></v-select>
                    <v-text-field
                      v-model="searchProyectoAsignacion"
                      label="Buscar proyectos"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      style="max-width: 300px"
                    ></v-text-field>
                  </div>
                  <v-btn color="primary" prepend-icon="mdi-link" @click="openAsignacionDialog">
                    Asignar Proyectos
                  </v-btn>
                </div>

                <v-data-table
                  :headers="asignacionHeaders"
                  :items="filteredProyectosAsignacion"
                  :loading="tableLoading"
                  loading-text="Cargando proyectos..."
                  no-data-text="No hay proyectos asignados"
                  :items-per-page="10"
                >
                  <!-- Programa -->
                  <template v-slot:item.programa="{ item }">
                    {{ getProgramaNombre(item.programa) }}
                  </template>

                  <!-- Área -->
                  <template v-slot:item.area="{ item }">
                    {{ getAreaNombreFromPrograma(item.programa) }}
                  </template>

                  <!-- Estado del proyecto -->
                  <template v-slot:item.estado="{ item }">
                    <v-chip :color="getEstadoColor(item.estado)" size="small">
                      {{ getEstadoText(item.estado) }}
                    </v-chip>
                  </template>

                  <!-- Fechas -->
                  <template v-slot:item.fecha_inicio="{ item }">
                    {{ formatDate(item.fecha_inicio) }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex">
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmRemoveAsignacion(item)"
                      >
                        <v-icon>mdi-link-off</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogos -->
    <!-- Diálogo Área -->
    <v-dialog v-model="areaDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ isEditingArea ? 'Editar Área' : 'Nueva Área' }}</v-card-title>
        <v-card-text>
          <v-form ref="areaForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentArea.codigo"
                  label="Código"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="currentArea.esta_activa"
                  label="¿Está activa?"
                  color="primary"
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentArea.nombre"
                  label="Nombre del área"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentArea.descripcion"
                  label="Descripción"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="areaDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveArea" :loading="savingArea">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Programa -->
    <v-dialog v-model="programaDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>{{ isEditingPrograma ? 'Editar Programa' : 'Nuevo Programa' }}</v-card-title>
        <v-card-text>
          <v-form ref="programaForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentPrograma.codigo"
                  label="Código"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="currentPrograma.esta_activo"
                  label="¿Está activo?"
                  color="primary"
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentPrograma.nombre"
                  label="Nombre del programa"
                  :rules="[required]"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentPrograma.descripcion"
                  label="Descripción"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="currentPrograma.area"
                  :items="areasOptions"
                  item-title="nombre"
                  item-value="id"
                  label="Área asociada"
                  :rules="[required]"
                  variant="outlined"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentPrograma.objetivo_estrategico"
                  label="Objetivo estratégico"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="programaDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="savePrograma" :loading="savingPrograma">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Asignación de Proyectos -->
    <v-dialog v-model="asignacionDialog" max-width="1000" persistent>
      <v-card>
        <v-card-title>Asignar Proyectos a Programa</v-card-title>
        <v-card-text>
          <v-form ref="asignacionForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentAsignacion.programa"
                  :items="programasOptions"
                  item-title="nombre"
                  item-value="id"
                  label="Seleccionar programa"
                  :rules="[required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="currentAsignacion.proyectos"
                  :items="proyectosDisponibles"
                  item-title="titulo"
                  item-value="id"
                  label="Seleccionar proyectos"
                  multiple
                  chips
                  variant="outlined"
                  :rules="[required]"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="asignacionDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveAsignacion" :loading="savingAsignacion">Asignar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogos de confirmación de eliminación -->
    <ConfirmDeleteDialog
      v-model="confirmDeleteAreaDialog"
      :item="areaToDelete"
      title="Confirmar eliminación de área"
      message="¿Está seguro que desea eliminar esta área?"
      @confirm="deleteArea"
      :loading="deletingArea"
    />

    <ConfirmDeleteDialog
      v-model="confirmDeleteProgramaDialog"
      :item="programaToDelete"
      title="Confirmar eliminación de programa"
      message="¿Está seguro que desea eliminar este programa?"
      @confirm="deletePrograma"
      :loading="deletingPrograma"
    />

    <ConfirmDeleteDialog
      v-model="confirmRemoveAsignacionDialog"
      :item="asignacionToRemove"
      title="Confirmar remoción de asignación"
      message="¿Está seguro que desea remover este proyecto del programa?"
      @confirm="removeAsignacion"
      :loading="removingAsignacion"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog.vue'

const { successMsg, errorMsg } = useSnackbar()

// Datos y estado
const loading = ref(true)
const tableLoading = ref(false)
const tab = ref('areas')

// Resumen
const summary = ref({
  areas: 0,
  programas: 0,
  proyectosAsociados: 0,
})

// Áreas
const areas = ref([])
const searchArea = ref('')
const areaDialog = ref(false)
const isEditingArea = ref(false)
const currentArea = ref({
  codigo: '',
  nombre: '',
  descripcion: '',
  esta_activa: true,
})
const areaToDelete = ref(null)
const confirmDeleteAreaDialog = ref(false)
const deletingArea = ref(false)
const savingArea = ref(false)

const areaHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Estado', key: 'esta_activa' },
  { title: 'Programas', key: 'programas_count' },
  { title: 'Creado', key: 'fecha_creacion' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '150px' },
]

// Programas
const programas = ref([])
const searchPrograma = ref('')
const programaDialog = ref(false)
const isEditingPrograma = ref(false)
const currentPrograma = ref({
  codigo: '',
  nombre: '',
  descripcion: '',
  esta_activo: true,
  area: null,
  objetivo_estrategico: '',
})
const programaToDelete = ref(null)
const confirmDeleteProgramaDialog = ref(false)
const deletingPrograma = ref(false)
const savingPrograma = ref(false)
const programaFilters = ref({
  area: null,
})

const programaHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Área', key: 'area' },
  { title: 'Estado', key: 'esta_activo' },
  { title: 'Proyectos', key: 'proyectos_count' },
  { title: 'Creado', key: 'fecha_creacion' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '150px' },
]

// Asignación de proyectos
const proyectosAsignacion = ref([])
const searchProyectoAsignacion = ref('')
const asignacionDialog = ref(false)
const currentAsignacion = ref({
  programa: null,
  proyectos: [],
})
const asignacionToRemove = ref(null)
const confirmRemoveAsignacionDialog = ref(false)
const removingAsignacion = ref(false)
const savingAsignacion = ref(false)
const asignacionFilters = ref({
  programa: null,
})

const asignacionHeaders = [
  { title: 'Código', key: 'codigo' },
  { title: 'Proyecto', key: 'titulo' },
  { title: 'Programa', key: 'programa' },
  { title: 'Área', key: 'area' },
  { title: 'Estado', key: 'estado' },
  { title: 'Inicio', key: 'fecha_inicio' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '100px' },
]

// Datos dummy
const listaAreas = [
  {
    id: 1,
    codigo: 'AREA-001',
    nombre: 'Desarrollo Institucional',
    descripcion: 'Área encargada del desarrollo y crecimiento institucional',
    esta_activa: true,
    fecha_creacion: '2023-01-15T08:00:00Z',
    programas_count: 3,
  },
  {
    id: 2,
    codigo: 'AREA-002',
    nombre: 'Investigación y Desarrollo',
    descripcion: 'Área dedicada a la investigación e innovación',
    esta_activa: true,
    fecha_creacion: '2023-02-10T10:30:00Z',
    programas_count: 2,
  },
  {
    id: 3,
    codigo: 'AREA-003',
    nombre: 'Responsabilidad Social',
    descripcion: 'Área de proyectos sociales y comunitarios',
    esta_activa: false,
    fecha_creacion: '2022-09-05T14:20:00Z',
    programas_count: 1,
  },
]

const listaProgramas = [
  {
    id: 1,
    codigo: 'PROG-001',
    nombre: 'Modernización Tecnológica',
    descripcion: 'Programa de modernización de infraestructura tecnológica',
    esta_activo: true,
    area: 1,
    objetivo_estrategico: 'Implementar tecnologías modernas para mejorar la eficiencia',
    fecha_creacion: '2023-03-01T09:00:00Z',
    proyectos_count: 5,
  },
  {
    id: 2,
    codigo: 'PROG-002',
    nombre: 'Capacitación Continua',
    descripcion: 'Programa de desarrollo de capacidades del personal',
    esta_activo: true,
    area: 1,
    objetivo_estrategico: 'Fortalecer las competencias del capital humano',
    fecha_creacion: '2023-03-15T11:30:00Z',
    proyectos_count: 3,
  },
  {
    id: 3,
    codigo: 'PROG-003',
    nombre: 'Innovación en Investigación',
    descripcion: 'Programa de apoyo a proyectos de investigación innovadores',
    esta_activo: true,
    area: 2,
    objetivo_estrategico: 'Promover la investigación de vanguardia',
    fecha_creacion: '2023-04-01T08:45:00Z',
    proyectos_count: 4,
  },
]

const listaProyectosAsignacion = [
  {
    id: 1,
    codigo: 'PROJ-2023-001',
    titulo: 'Modernización de Sistemas Informáticos',
    programa: 1,
    estado: 'PL',
    fecha_inicio: '2023-03-01',
  },
  {
    id: 2,
    codigo: 'PROJ-2023-002',
    titulo: 'Capacitación Docente',
    programa: 2,
    estado: 'EP',
    fecha_inicio: '2023-05-01',
  },
  {
    id: 3,
    codigo: 'PROJ-2022-015',
    titulo: 'Infraestructura Educativa',
    programa: 3,
    estado: 'ES',
    fecha_inicio: '2023-01-15',
  },
]

const listaProyectosDisponibles = [
  {
    id: 1,
    codigo: 'PROJ-2023-001',
    titulo: 'Modernización de Sistemas Informáticos',
    estado: 'PL',
  },
  {
    id: 2,
    codigo: 'PROJ-2023-002',
    titulo: 'Capacitación Docente',
    estado: 'EP',
  },
  {
    id: 3,
    codigo: 'PROJ-2022-015',
    titulo: 'Infraestructura Educativa',
    estado: 'ES',
  },
  {
    id: 4,
    codigo: 'PROJ-2023-003',
    titulo: 'Investigación en IA',
    estado: 'PL',
  },
  {
    id: 5,
    codigo: 'PROJ-2023-004',
    titulo: 'Desarrollo de Software',
    estado: 'EP',
  },
]

// Computed
const filteredAreas = computed(() => {
  return areas.value.filter(
    (area) =>
      area.codigo.toLowerCase().includes(searchArea.value.toLowerCase()) ||
      area.nombre.toLowerCase().includes(searchArea.value.toLowerCase()),
  )
})

const filteredProgramas = computed(() => {
  return programas.value.filter((programa) => {
    // Filtro por área
    if (programaFilters.value.area && programa.area !== programaFilters.value.area) return false

    // Filtro por búsqueda
    if (
      searchPrograma.value &&
      !programa.codigo.toLowerCase().includes(searchPrograma.value.toLowerCase()) &&
      !programa.nombre.toLowerCase().includes(searchPrograma.value.toLowerCase())
    ) {
      return false
    }

    return true
  })
})

const filteredProyectosAsignacion = computed(() => {
  return proyectosAsignacion.value.filter((proyecto) => {
    // Filtro por programa
    if (asignacionFilters.value.programa && proyecto.programa !== asignacionFilters.value.programa)
      return false

    // Filtro por búsqueda
    if (
      searchProyectoAsignacion.value &&
      !proyecto.codigo.toLowerCase().includes(searchProyectoAsignacion.value.toLowerCase()) &&
      !proyecto.titulo.toLowerCase().includes(searchProyectoAsignacion.value.toLowerCase())
    ) {
      return false
    }

    return true
  })
})

const areasOptions = computed(() => {
  return areas.value.map((area) => ({
    id: area.id,
    nombre: area.nombre,
    codigo: area.codigo,
  }))
})

const programasOptions = computed(() => {
  return programas.value.map((programa) => ({
    id: programa.id,
    nombre: programa.nombre,
    codigo: programa.codigo,
    area: programa.area,
  }))
})

const proyectosDisponibles = computed(() => {
  return listaProyectosDisponibles.filter(
    (proyecto) => !proyectosAsignacion.value.some((pa) => pa.id === proyecto.id),
  )
})

// Métodos
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const getAreaNombre = (areaId) => {
  const area = areas.value.find((a) => a.id === areaId)
  return area ? area.nombre : 'Sin área'
}

const getProgramaNombre = (programaId) => {
  const programa = programas.value.find((p) => p.id === programaId)
  return programa ? programa.nombre : 'Sin programa'
}

const getAreaNombreFromPrograma = (programaId) => {
  const programa = programas.value.find((p) => p.id === programaId)
  if (!programa) return 'Sin área'
  const area = areas.value.find((a) => a.id === programa.area)
  return area ? area.nombre : 'Sin área'
}

const getEstadoColor = (estado) => {
  const colors = {
    ES: 'warning',
    EP: 'info',
    PL: 'success',
  }
  return colors[estado] || 'primary'
}

const getEstadoText = (estado) => {
  const texts = {
    ES: 'Estructuración',
    EP: 'En Planificación',
    PL: 'Planificado',
  }
  return texts[estado] || estado
}

// Área methods
const openAreaDialog = () => {
  currentArea.value = {
    codigo: '',
    nombre: '',
    descripcion: '',
    esta_activa: true,
  }
  isEditingArea.value = false
  areaDialog.value = true
}

const editArea = (area) => {
  currentArea.value = { ...area }
  isEditingArea.value = true
  areaDialog.value = true
}

const saveArea = async () => {
  try {
    savingArea.value = true

    if (isEditingArea.value) {
      const index = areas.value.findIndex((a) => a.id === currentArea.value.id)
      if (index !== -1) {
        areas.value[index] = { ...currentArea.value }
      }
      successMsg('Área actualizada correctamente')
    } else {
      const newArea = {
        ...currentArea.value,
        id: areas.value.length + 1,
        fecha_creacion: new Date().toISOString(),
        programas_count: 0,
      }
      areas.value.unshift(newArea)
      successMsg('Área creada correctamente')
    }

    areaDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar área')
    console.error('Error saving area:', error)
  } finally {
    savingArea.value = false
  }
}

const confirmDeleteArea = (area) => {
  areaToDelete.value = area
  confirmDeleteAreaDialog.value = true
}

const deleteArea = async () => {
  try {
    deletingArea.value = true
    areas.value = areas.value.filter((a) => a.id !== areaToDelete.value.id)
    successMsg('Área eliminada correctamente')
    confirmDeleteAreaDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar área')
    console.error('Error deleting area:', error)
  } finally {
    deletingArea.value = false
  }
}

// Programa methods
const openProgramaDialog = () => {
  currentPrograma.value = {
    codigo: '',
    nombre: '',
    descripcion: '',
    esta_activo: true,
    area: null,
    objetivo_estrategico: '',
  }
  isEditingPrograma.value = false
  programaDialog.value = true
}

const editPrograma = (programa) => {
  currentPrograma.value = { ...programa }
  isEditingPrograma.value = true
  programaDialog.value = true
}

const savePrograma = async () => {
  try {
    savingPrograma.value = true

    if (isEditingPrograma.value) {
      const index = programas.value.findIndex((p) => p.id === currentPrograma.value.id)
      if (index !== -1) {
        programas.value[index] = { ...currentPrograma.value }
      }
      successMsg('Programa actualizado correctamente')
    } else {
      const newPrograma = {
        ...currentPrograma.value,
        id: programas.value.length + 1,
        fecha_creacion: new Date().toISOString(),
        proyectos_count: 0,
      }
      programas.value.unshift(newPrograma)
      successMsg('Programa creado correctamente')
    }

    programaDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar programa')
    console.error('Error saving programa:', error)
  } finally {
    savingPrograma.value = false
  }
}

const confirmDeletePrograma = (programa) => {
  programaToDelete.value = programa
  confirmDeleteProgramaDialog.value = true
}

const deletePrograma = async () => {
  try {
    deletingPrograma.value = true
    programas.value = programas.value.filter((p) => p.id !== programaToDelete.value.id)
    successMsg('Programa eliminado correctamente')
    confirmDeleteProgramaDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar programa')
    console.error('Error deleting programa:', error)
  } finally {
    deletingPrograma.value = false
  }
}

// Asignación methods
const openAsignacionDialog = () => {
  currentAsignacion.value = {
    programa: null,
    proyectos: [],
  }
  asignacionDialog.value = true
}

const saveAsignacion = async () => {
  try {
    savingAsignacion.value = true

    const programa = programas.value.find((p) => p.id === currentAsignacion.value.programa)
    if (programa) {
      programa.proyectos_count += currentAsignacion.value.proyectos.length
    }

    // Agregar proyectos asignados
    currentAsignacion.value.proyectos.forEach((proyectoId) => {
      const proyecto = listaProyectosDisponibles.find((p) => p.id === proyectoId)
      if (proyecto) {
        proyectosAsignacion.value.push({
          ...proyecto,
          programa: currentAsignacion.value.programa,
        })
      }
    })

    successMsg('Proyectos asignados correctamente')
    asignacionDialog.value = false
  } catch (error) {
    errorMsg('Error al asignar proyectos')
    console.error('Error saving asignacion:', error)
  } finally {
    savingAsignacion.value = false
  }
}

const confirmRemoveAsignacion = (proyecto) => {
  asignacionToRemove.value = proyecto
  confirmRemoveAsignacionDialog.value = true
}

const removeAsignacion = async () => {
  try {
    removingAsignacion.value = true

    // Decrementar contador en programa
    const programa = programas.value.find((p) => p.id === asignacionToRemove.value.programa)
    if (programa && programa.proyectos_count > 0) {
      programa.proyectos_count--
    }

    proyectosAsignacion.value = proyectosAsignacion.value.filter(
      (p) => p.id !== asignacionToRemove.value.id,
    )

    successMsg('Proyecto removido del programa')
    confirmRemoveAsignacionDialog.value = false
  } catch (error) {
    errorMsg('Error al remover proyecto')
    console.error('Error removing asignacion:', error)
  } finally {
    removingAsignacion.value = false
  }
}

// Cargar datos iniciales
const loadInitialData = () => {
  areas.value = [...listaAreas]
  programas.value = [...listaProgramas]
  proyectosAsignacion.value = [...listaProyectosAsignacion]

  // Actualizar resumen
  summary.value.areas = areas.value.length
  summary.value.programas = programas.value.length
  summary.value.proyectosAsociados = proyectosAsignacion.value.length

  loading.value = false
}

// Ciclo de vida
onMounted(() => {
  loadInitialData()
})

// Reglas de validación
const required = (v) => !!v || 'Campo requerido'
</script>

<style scoped>
.programas-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.summary-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .programas-container {
    padding: 16px 12px;
  }
}
</style>
