<template>
  <v-container fluid class="pa-4" style="height: 600px">
    <!-- 🔍 BARRA DE HERRAMIENTAS -->
    <v-row class="mb-3 align-center">
      <!-- Buscador -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Buscar proyecto, actividad o tarea..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @click:clear="clearSearch"
          bg-color="white"
        />
      </v-col>

      <!-- Contador -->
      <v-col cols="auto" class="d-none d-md-flex">
        <v-chip variant="tonal" color="primary" size="small" label>
          {{ visibleCount }} tareas visibles
        </v-chip>
      </v-col>

      <v-spacer />

      <!-- Botones Expandir/Colapsar -->
      <v-col cols="auto">
        <v-btn-group density="compact" variant="elevated" divided>
          <v-btn
            color="success"
            prepend-icon="mdi-arrow-expand-all"
            @click="expandAll"
            text="Expandir"
          />
          <v-btn
            color="warning"
            prepend-icon="mdi-arrow-collapse-all"
            @click="collapseAll"
            text="Colapsar"
          />
        </v-btn-group>
      </v-col>

      <!-- Escala -->
      <v-col cols="auto" class="ml-2">
        <v-btn-toggle
          v-model="currentView"
          density="compact"
          divided
          mandatory
          @update:model-value="setView"
        >
          <v-btn
            v-for="view in views"
            :key="view.value"
            :value="view.value"
            :prepend-icon="view.icon"
            size="small"
          >
            {{ view.label }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- 📊 Gantt -->
    <v-card variant="outlined" class="gantt-card">
      <div ref="ganttContainer" style="height: 400px"></div>
    </v-card>

    <!-- 📋 MODAL DE INFORMACIÓN -->
    <v-dialog v-model="showModal" max-width="500" transition="dialog-bottom-transition">
      <v-card rounded="lg">
        <v-toolbar :color="getTypeColor(selectedTask?.type || getTaskType(selectedTask))" dark>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            📋 Detalles de la Tarea
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" @click="closeModal" variant="text" />
        </v-toolbar>

        <v-card-text class="pa-4" v-if="selectedTask">
          <div class="d-flex flex-column gap-3">
            <!-- Tipo -->
            <v-chip
              :color="getTypeColor(selectedTask.type || getTaskType(selectedTask))"
              class="align-self-start"
              size="small"
              label
            >
              {{ getTypeLabel(selectedTask.type || getTaskType(selectedTask)) }}
            </v-chip>

            <!-- Nombre -->
            <div>
              <div class="text-caption text-grey font-weight-bold text-uppercase">Nombre</div>
              <div class="text-h6 font-weight-bold mt-1">{{ selectedTask.text }}</div>
            </div>

            <!-- ID -->
            <div>
              <div class="text-caption text-grey font-weight-bold text-uppercase">ID</div>
              <div class="text-body-1 mt-1">#{{ selectedTask.id }}</div>
            </div>

            <!-- Fechas -->
            <v-row>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold text-uppercase">📅 Inicio</div>
                <div class="text-body-2 mt-1">{{ formatDate(selectedTask.start_date) }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold text-uppercase">📅 Fin</div>
                <div class="text-body-2 mt-1">
                  {{ formatDate(selectedTask.end_date || getEndDate(selectedTask)) }}
                </div>
              </v-col>
            </v-row>

            <!-- Duración y Progreso -->
            <v-row>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold text-uppercase">
                  ⏱️ Duración
                </div>
                <div class="text-body-2 mt-1">{{ selectedTask.duration || 0 }} días</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold text-uppercase">
                  📊 Progreso
                </div>
                <div class="text-body-2 mt-1">
                  {{ Math.round((selectedTask.progress || 0) * 100) }}%
                </div>
              </v-col>
            </v-row>

            <!-- Barra de progreso -->
            <v-progress-linear
              :model-value="Math.round((selectedTask.progress || 0) * 100)"
              color="success"
              height="10"
              rounded
            />

            <!-- Padre -->
            <div v-if="selectedTask.parent !== 0">
              <div class="text-caption text-grey font-weight-bold text-uppercase">
                👆 Tarea Padre
              </div>
              <div class="text-body-2 mt-1">{{ getParentName(selectedTask.parent) || 'N/A' }}</div>
            </div>

            <!-- Subtareas -->
            <div v-if="getChildren(selectedTask.id).length > 0">
              <div class="text-caption text-grey font-weight-bold text-uppercase">
                📂 Subtareas ({{ getChildren(selectedTask.id).length }})
              </div>
              <v-list density="compact" class="mt-1 pa-0">
                <v-list-item
                  v-for="child in getChildren(selectedTask.id)"
                  :key="child.id"
                  :title="child.text"
                  class="text-body-2"
                />
              </v-list>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="success" variant="elevated" @click="closeModal" text="Cerrar" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

// ============================================
// 📊 ESTADO
// ============================================
const ganttContainer = ref(null)
const searchQuery = ref('')
let ganttInitialized = false

const showModal = ref(false)
const selectedTask = ref(null)

const currentView = ref('week')
const views = [
  { label: 'Día', value: 'day', icon: 'mdi-calendar-day' },
  { label: 'Semana', value: 'week', icon: 'mdi-calendar-week' },
  { label: 'Mes', value: 'month', icon: 'mdi-calendar-month' },
  { label: 'Año', value: 'year', icon: 'mdi-calendar' },
]

// ============================================
// 📊 DATOS
// ============================================
const allTasks = [
  {
    id: 1,
    text: '🏗️ Proyecto: Edificio Corporativo',
    start_date: '2026-01-01',
    duration: 180,
    progress: 0.35,
    parent: 0,
    open: false,
  },
  {
    id: 100,
    text: '🏗️ Proyecto: Parque Industrial',
    start_date: '2026-03-01',
    duration: 210,
    progress: 0.1,
    parent: 0,
    open: false,
  },
  {
    id: 2,
    text: '  📋 Planificación',
    start_date: '2026-01-01',
    duration: 45,
    progress: 0.9,
    parent: 1,
    open: true,
  },
  {
    id: 3,
    text: '  🔨 Construcción',
    start_date: '2026-02-01',
    duration: 105,
    progress: 0.3,
    parent: 1,
    open: true,
  },
  {
    id: 4,
    text: '  🧪 Pruebas y Control',
    start_date: '2026-05-01',
    duration: 60,
    progress: 0,
    parent: 1,
    open: true,
  },
  {
    id: 101,
    text: '  📋 Estudio de Suelo',
    start_date: '2026-03-01',
    duration: 45,
    progress: 0.6,
    parent: 100,
    open: true,
  },
  {
    id: 102,
    text: '  🏗️ Movimiento de Tierras',
    start_date: '2026-04-01',
    duration: 90,
    progress: 0.2,
    parent: 100,
    open: true,
  },
  {
    id: 5,
    text: '    📝 Requisitos y Alcance',
    start_date: '2026-01-01',
    duration: 10,
    progress: 1,
    parent: 2,
    open: true,
  },
  {
    id: 6,
    text: '    🎨 Diseño Arquitectónico',
    start_date: '2026-01-08',
    duration: 13,
    progress: 1,
    parent: 2,
    open: true,
  },
  {
    id: 7,
    text: '    📑 Permisos y Licencias',
    start_date: '2026-01-21',
    duration: 26,
    progress: 0.8,
    parent: 2,
    open: true,
  },
  {
    id: 8,
    text: '    🏗️ Cimentación',
    start_date: '2026-02-01',
    duration: 43,
    progress: 0.6,
    parent: 3,
    open: true,
  },
  {
    id: 9,
    text: '    🧱 Estructura',
    start_date: '2026-03-01',
    duration: 60,
    progress: 0.25,
    parent: 3,
    open: true,
  },
  {
    id: 10,
    text: '    🔌 Instalaciones',
    start_date: '2026-04-01',
    duration: 45,
    progress: 0.1,
    parent: 3,
    open: true,
  },
  {
    id: 11,
    text: '    ✅ Pruebas de Calidad',
    start_date: '2026-05-01',
    duration: 30,
    progress: 0,
    parent: 4,
    open: true,
  },
  {
    id: 12,
    text: '    📋 Inspección Final',
    start_date: '2026-06-01',
    duration: 15,
    progress: 0,
    parent: 4,
    open: true,
  },
  {
    id: 103,
    text: '    📊 Estudio Geotécnico',
    start_date: '2026-03-01',
    duration: 30,
    progress: 0.8,
    parent: 101,
    open: true,
  },
  {
    id: 104,
    text: '    📋 Informe de Suelo',
    start_date: '2026-04-01',
    duration: 15,
    progress: 0.4,
    parent: 101,
    open: true,
  },
  {
    id: 105,
    text: '    🚜 Excavación',
    start_date: '2026-04-01',
    duration: 45,
    progress: 0.3,
    parent: 102,
    open: true,
  },
  {
    id: 106,
    text: '    🏗️ Nivelación',
    start_date: '2026-05-16',
    duration: 45,
    progress: 0.1,
    parent: 102,
    open: true,
  },
]

// ============================================
// 🛠️ FUNCIONES DE AYUDA
// ============================================
const getTaskType = (task) => {
  if (!task) return 'task'
  if (task.parent === 0) return 'project'
  const parent = allTasks.find((t) => t.id === task.parent)
  if (parent && parent.parent === 0) return 'activity'
  return 'task'
}

const getTypeLabel = (type) => {
  const labels = { project: '📊 Proyecto', activity: '📋 Actividad', task: '📄 Tarea' }
  return labels[type] || 'Tarea'
}

const getTypeColor = (type) => {
  const colors = { project: 'green', activity: 'blue', task: 'orange' }
  return colors[type] || 'grey'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getEndDate = (task) => {
  if (!task) return 'N/A'
  if (task.end_date) return task.end_date
  const start = new Date(task.start_date)
  start.setDate(start.getDate() + (task.duration || 0))
  return start.toISOString().split('T')[0]
}

const getParentName = (parentId) => {
  const parent = allTasks.find((t) => t.id === parentId)
  return parent ? parent.text : null
}

const getChildren = (taskId) => {
  return allTasks.filter((t) => t.parent === taskId)
}

// ============================================
// 🔍 BUSCADOR
// ============================================
const getAncestors = (taskId) => {
  const ancestors = []
  let current = allTasks.find((t) => t.id === taskId)
  while (current && current.parent !== 0) {
    const parent = allTasks.find((t) => t.id === current.parent)
    if (parent) {
      ancestors.push(parent)
      current = parent
    } else {
      break
    }
  }
  return ancestors
}

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return allTasks

  const matched = allTasks.filter((task) => task.text.toLowerCase().includes(query))
  const parentIds = new Set()
  matched.forEach((task) => {
    const ancestors = getAncestors(task.id)
    ancestors.forEach((a) => parentIds.add(a.id))
  })
  const idsToShow = new Set()
  matched.forEach((t) => idsToShow.add(t.id))
  parentIds.forEach((id) => idsToShow.add(id))

  return allTasks.filter((task) => idsToShow.has(task.id))
})

const visibleCount = computed(() => filteredTasks.value.length)

// ============================================
// 🎯 BOTONES
// ============================================
const expandAll = () => {
  if (!ganttInitialized) return
  const allTasksGantt = gantt.getTaskByTime()
  const projects = allTasksGantt.filter((task) => task.parent === 0)
  projects.forEach((project) => gantt.open(project.id))
}

const collapseAll = () => {
  if (!ganttInitialized) return
  const allTasksGantt = gantt.getTaskByTime()
  const projects = allTasksGantt.filter((task) => task.parent === 0)
  projects.forEach((project) => gantt.close(project.id))
}

const clearSearch = () => {
  searchQuery.value = ''
}

// ============================================
// 🔎 FUNCIONES DE ESCALA
// ============================================
const setView = (view) => {
  if (!ganttInitialized) return

  let scales = []
  switch (view) {
    case 'day':
      scales = [
        { unit: 'day', step: 1, format: '%d %M' },
        { unit: 'hour', step: 1, format: '%H' },
      ]
      break
    case 'week':
      scales = [
        { unit: 'week', step: 1, format: 'Semana %W' },
        { unit: 'day', step: 1, format: '%d %M' },
      ]
      break
    case 'month':
      scales = [
        { unit: 'month', step: 1, format: '%F %Y' },
        { unit: 'day', step: 1, format: '%d' },
      ]
      break
    case 'year':
      scales = [
        { unit: 'year', step: 1, format: '%Y' },
        { unit: 'month', step: 1, format: '%M' },
      ]
      break
    default:
      scales = [
        { unit: 'month', step: 1, format: '%F %Y' },
        { unit: 'day', step: 1, format: '%d' },
      ]
  }

  gantt.config.scales = scales
  gantt.render()
}

// ============================================
// 📋 MODAL
// ============================================
const openModal = (task) => {
  const fullTask = allTasks.find((t) => t.id === task.id) || task
  selectedTask.value = fullTask
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTask.value = null
}

// ============================================
// 📦 ACTUALIZAR GANTT
// ============================================
const updateGantt = () => {
  if (!ganttContainer.value || !ganttInitialized) return

  const data = {
    data: filteredTasks.value.map((task) => ({
      ...task,
      duration: task.duration || 1,
      progress: task.progress || 0,
      parent: task.parent || 0,
      open: task.open !== undefined ? task.open : true,
    })),
    links: [],
  }

  gantt.clearAll()
  gantt.parse(data)
  setView(currentView.value)
}

// ============================================
// 🌐 CONFIGURAR IDIOMA ESPAÑOL
// ============================================
const setSpanishLocale = () => {
  gantt.locale = {
    date: {
      month_full: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      month_short: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      day_full: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      day_short: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    },
    labels: {
      hour: 'Hora',
      hours: 'Horas',
      day: 'Día',
      days: 'Días',
      week: 'Semana',
      weeks: 'Semanas',
      month: 'Mes',
      months: 'Meses',
      year: 'Año',
      years: 'Años',
      task: 'Tarea',
      start_date: 'Fecha de inicio',
      duration: 'Duración',
      progress: 'Progreso',
      text: 'Texto',
      details: 'Detalles',
      resource: 'Recurso',
      resources: 'Recursos',
      link: 'Enlace',
      links: 'Enlaces',
      add_link: 'Añadir enlace',
      remove_link: 'Eliminar enlace',
      no_links: 'Sin enlaces',
      no_data: 'Sin datos',
      no_resources: 'Sin recursos',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      add: 'Añadir',
      edit: 'Editar',
      close: 'Cerrar',
      confirm: 'Confirmar',
      delete_task: 'Eliminar tarea',
      delete_link: 'Eliminar enlace',
      delete_item: 'Eliminar elemento',
      day_view: 'Día',
      week_view: 'Semana',
      month_view: 'Mes',
      year_view: 'Año',
      Unit: 'Unidad',
      Value: 'Valor',
      'Add task': 'Añadir tarea',
      'Add resource': 'Añadir recurso',
      'Remove resource': 'Eliminar recurso',
      'No resources assigned': 'Sin recursos asignados',
    },
  }
  gantt.config.date_format = '%d/%m/%Y'
  gantt.config.xml_date = '%d/%m/%Y'
  gantt.config.week_start = 1
}

// ============================================
// 🚀 INICIALIZAR GANTT
// ============================================
const initGantt = () => {
  if (!ganttContainer.value) return

  setSpanishLocale()

  gantt.config.scales = [
    { unit: 'week', step: 1, format: 'Semana %W' },
    { unit: 'day', step: 1, format: '%d %M' },
  ]

  gantt.config.readonly = true
  gantt.config.drag_project = false
  gantt.config.drag_progress = false
  gantt.config.drag_resize = false
  gantt.config.drag_links = false
  gantt.config.drag_mode = false
  gantt.config.details_on_create = false
  gantt.config.details_on_dblclick = false
  gantt.config.show_editor = false
  gantt.config.show_links = false

  gantt.init(ganttContainer.value)
  ganttInitialized = true

  const data = { data: allTasks, links: [] }
  gantt.parse(data)

  gantt.attachEvent('onTaskClick', (id, e) => {
    const task = gantt.getTask(id)
    const target = e.target || e.srcElement

    const isCollapseIcon =
      target.closest('.gantt_tree_icon') ||
      target.closest('.gantt_folder') ||
      target.closest('.gantt_file') ||
      target.classList.contains('gantt_tree_icon') ||
      target.classList.contains('gantt_folder') ||
      target.classList.contains('gantt_file') ||
      target.closest('.gantt_tree_content') ||
      target.closest('.gantt_row')

    const isTaskBar =
      target.closest('.gantt_task_content') ||
      target.closest('.gantt_task') ||
      target.classList.contains('gantt_task_content') ||
      target.classList.contains('gantt_task')

    if (isCollapseIcon) return true
    if (isTaskBar && task) {
      openModal(task)
      return false
    }
    return true
  })

  gantt.attachEvent('onTaskDblClick', () => false)
  gantt.attachEvent('onBeforeTaskAdd', () => false)
  gantt.attachEvent('onBeforeTaskDelete', () => false)
  gantt.attachEvent('onBeforeTaskUpdate', () => false)
  gantt.attachEvent('onBeforeLinkAdd', () => false)
  gantt.attachEvent('onBeforeLinkDelete', () => false)
  gantt.attachEvent('onBeforeTaskDrag', () => false)
}

// ============================================
// 🎯 WATCHERS
// ============================================
watch(
  filteredTasks,
  () => {
    if (ganttInitialized) updateGantt()
  },
  { deep: true },
)

// ============================================
// 🚀 MONTAJE
// ============================================
onMounted(() => {
  nextTick(() => initGantt())
})
</script>

<style scoped>
.gantt-card {
  border-radius: 8px;
  overflow: hidden;
}

.gap-3 {
  gap: 12px;
}
</style>
