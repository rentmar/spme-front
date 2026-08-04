<template>
  <div class="gantt-wrapper">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="loadingGantt"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <v-progress-circular indeterminate color="primary" size="64" width="6" />
      <p class="mt-3 text-white">Cargando cronograma...</p>
    </v-overlay>

    <div v-if="!loadingGantt">
      <!-- 🎛️ BARRA DE CONTROL -->
      <div class="gantt-controls mb-2">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="Buscar..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @click:clear="searchQuery = ''"
          bg-color="white"
          style="max-width: 250px"
        />
        <v-divider vertical class="mx-2" />
        <v-btn-toggle
          v-model="currentView"
          density="compact"
          divided
          mandatory
          @update:model-value="cambiarEscala"
        >
          <v-btn
            v-for="view in views"
            :key="view.value"
            :value="view.value"
            size="x-small"
            :prepend-icon="view.icon"
            :text="view.label"
          />
        </v-btn-toggle>
        <v-divider vertical class="mx-2" />
        <v-btn-group density="compact" variant="tonal" divided>
          <v-btn
            color="success"
            size="x-small"
            prepend-icon="mdi-arrow-expand-all"
            @click="expandAll"
            >Expandir</v-btn
          >
          <v-btn
            color="warning"
            size="x-small"
            prepend-icon="mdi-arrow-collapse-all"
            @click="collapseAll"
            >Colapsar</v-btn
          >
        </v-btn-group>
        <v-spacer />
        <v-chip color="error" variant="outlined" size="x-small" prepend-icon="mdi-calendar-today">{{
          todayFormatted
        }}</v-chip>
        <span class="text-caption text-grey ml-2">{{ visibleCount }} tareas</span>
      </div>

      <div ref="ganttContainer" class="gantt-chart"></div>

      <!-- 📋 MODAL -->
      <v-dialog v-model="showModal" max-width="480" transition="dialog-bottom-transition">
        <v-card rounded="lg" v-if="selectedTask">
          <v-toolbar :color="selectedTask.color || '#1976d2'" dark density="compact">
            <v-toolbar-title class="text-subtitle-2 font-weight-bold">{{
              selectedTask.text
            }}</v-toolbar-title>
            <v-spacer />
            <v-btn icon="mdi-close" @click="showModal = false" variant="text" size="small" />
          </v-toolbar>
          <v-card-text class="pa-3">
            <v-row dense>
              <v-col cols="6">
                <span class="text-caption text-grey">📅 Inicio</span>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(selectedTask.start_date) }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-caption text-grey">📅 Fin</span>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(getEndDate(selectedTask)) }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-caption text-grey">⏱️ Duración</span>
                <div class="text-body-2">{{ selectedTask.duration }} días</div>
              </v-col>
              <v-col cols="6">
                <span class="text-caption text-grey">📊 Progreso</span>
                <div class="text-body-2">{{ Math.round((selectedTask.progress || 0) * 100) }}%</div>
              </v-col>
              <v-col cols="12">
                <span class="text-caption text-grey">🏷️ Estado</span>
                <v-chip size="x-small" :color="selectedTask.color" class="ml-1">{{
                  estadoLabel[selectedTask.estado]
                }}</v-chip>
              </v-col>
            </v-row>
            <v-progress-linear
              :model-value="Math.round((selectedTask.progress || 0) * 100)"
              :color="selectedTask.color"
              height="6"
              rounded
              class="my-2"
            />
            <div v-if="selectedTask.parent !== 0" class="text-caption text-grey mt-1">
              👆 Padre: {{ getParentName(selectedTask.parent) }}
            </div>
            <div v-if="getChildren(selectedTask.id).length > 0" class="text-caption text-grey mt-1">
              📂 Subtareas: {{ getChildren(selectedTask.id).length }}
            </div>
          </v-card-text>
          <v-card-actions class="pa-2 pt-0">
            <v-spacer />
            <v-btn color="primary" variant="flat" size="small" @click="showModal = false"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { useGanttProyectos } from '@/modules/gantt/composables/useGanttProyectos'

const ganttContainer = ref(null)
const showModal = ref(false)
const selectedTask = ref(null)
const currentView = ref('year')
const searchQuery = ref('')
let ganttInitialized = false

const todayFormatted = computed(() =>
  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
)

const views = [
  { label: 'Día', value: 'day', icon: 'mdi-calendar-day' },
  { label: 'Semana', value: 'week', icon: 'mdi-calendar-week' },
  { label: 'Mes', value: 'month', icon: 'mdi-calendar-month' },
  { label: 'Año', value: 'year', icon: 'mdi-calendar' },
  { label: 'Lustro', value: 'lustro', icon: 'mdi-calendar-multiselect' },
]

const estadoColor = {
  ES: '#42A5F5',
  EP: '#FFA726',
  CRD: '#BDBDBD',
  PLAN: '#64b5f6',
  RETR: '#ff0000',
  REPROG: '#ffd54f',
  EJEC: '#ffa726',
  REP: '#81c784',
  FIN: '#003CFF',
}
const estadoLabel = {
  ES: 'Estructuración',
  EP: 'En Planificación',
  CRD: 'Creada',
  PLAN: 'Planificada',
  RETR: 'Retraso',
  REPROG: 'Reprogramación',
  EJEC: 'En Ejecución',
  REP: 'En Reporte',
  FIN: 'Finalizado',
}
const { tasks, loadingGantt, inicializar } = useGanttProyectos()

function getAncestors(taskId) {
  const ancestors = []
  let current = tasks.value.find((t) => t.id === taskId)
  while (current && current.parent !== 0) {
    const parent = tasks.value.find((t) => t.id === current.parent)
    if (parent) {
      ancestors.push(parent)
      current = parent
    } else break
  }
  return ancestors
}

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return tasks.value
  const matched = tasks.value.filter((task) => task.text.toLowerCase().includes(query))
  const parentIds = new Set()
  matched.forEach((task) => getAncestors(task.id).forEach((a) => parentIds.add(a.id)))
  const idsToShow = new Set()
  matched.forEach((t) => idsToShow.add(t.id))
  parentIds.forEach((id) => idsToShow.add(id))
  return tasks.value.filter((task) => idsToShow.has(task.id))
})
const visibleCount = computed(() => filteredTasks.value.length)

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
function getEndDate(task) {
  if (!task) return 'N/A'
  const start = new Date(task.start_date)
  start.setDate(start.getDate() + (task.duration || 0))
  return start.toISOString().split('T')[0]
}
function getParentName(parentId) {
  return tasks.value.find((t) => t.id === parentId)?.text || 'N/A'
}
function getChildren(taskId) {
  return tasks.value.filter((t) => t.parent === taskId)
}

function expandAll() {
  if (ganttInitialized)
    gantt.eachTask((task) => {
      if (task.parent === 0) gantt.open(task.id)
    })
}
function collapseAll() {
  if (ganttInitialized)
    gantt.eachTask((task) => {
      if (task.parent === 0) gantt.close(task.id)
    })
}

function cambiarEscala(view) {
  if (!ganttInitialized) return
  const escalas = {
    day: [
      { unit: 'month', step: 1, format: '%F %Y' },
      { unit: 'day', step: 1, format: '%d %M' },
      { unit: 'hour', step: 2, format: '%H:%i' },
    ],
    week: [
      { unit: 'month', step: 1, format: '%F %Y' },
      { unit: 'week', step: 1, format: 'Sem. %W' },
      { unit: 'day', step: 1, format: '%D %d' },
    ],
    month: [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'month', step: 1, format: '%F' },
      { unit: 'day', step: 1, format: '%d' },
    ],
    year: [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'month', step: 1, format: '%M' },
    ],
    lustro: [
      { unit: 'year', step: 5, format: '%Y' },
      { unit: 'year', step: 1, format: '%Y' },
    ],
  }
  gantt.config.scales = escalas[view] || escalas.year
  gantt.render()
}

function actualizarGantt() {
  if (!ganttContainer.value || !ganttInitialized) return
  gantt.clearAll()
  gantt.parse({
    data: filteredTasks.value.map((t) => ({
      ...t,
      color: estadoColor[t.estado] || '#BDBDBD',
      duration: t.duration || 1,
      progress: t.progress || 0,
      open: t.open !== undefined ? t.open : true,
    })),
  })
}

watch(searchQuery, () => {
  if (ganttInitialized) actualizarGantt()
})

function initGantt() {
  gantt.config.date_format = '%d/%m/%Y'
  gantt.config.scales = [
    { unit: 'year', step: 1, format: '%Y' },
    { unit: 'month', step: 1, format: '%M' },
  ]
  gantt.config.readonly = true

  gantt.init(ganttContainer.value)
  ganttInitialized = true

  const tasksWithColors = tasks.value.map((t) => ({
    ...t,
    color: estadoColor[t.estado] || '#BDBDBD',
    duration: t.duration || 1,
    progress: t.progress || 0,
  }))

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const marcaHoy = {
    text: `📅 Hoy`,
    start_date: todayStr,
    duration: 1,
    type: 'task',
    parent: 0,
    color: '#E53935',
    readonly: true,
  }

  tasksWithColors.unshift({ id: 998, ...marcaHoy })
  tasksWithColors.push({ id: 999, ...marcaHoy })

  gantt.parse({ data: tasksWithColors })

  gantt.attachEvent('onTaskClick', (id, e) => {
    const task = gantt.getTask(id)
    const target = e.target || e.srcElement
    if (target.closest('.gantt_tree_icon,.gantt_folder,.gantt_file,.gantt_tree_content,.gantt_row'))
      return true
    if (task.id === 998 || task.id === 999) return true
    if (target.closest('.gantt_task_content,.gantt_task')) {
      selectedTask.value = tasks.value.find((t) => t.id === task.id) || task
      showModal.value = true
      return false
    }
    return true
  })
}

onMounted(async () => {
  await inicializar()
})

watch(loadingGantt, async (val) => {
  if (!val && !ganttInitialized) {
    await nextTick()
    initGantt()
  }
})
</script>

<style scoped>
.gantt-wrapper {
  padding: 16px;
  background: #fafafa;
}
.gantt-controls {
  display: flex;
  align-items: center;
}
.gantt-chart {
  height: 400px;
  margin-top: 8px;
}
:deep(.gantt_task_line) {
  border-radius: 4px;
  cursor: pointer;
}
:deep(.gantt_task_line:hover) {
  filter: brightness(1.15);
}
:deep(.gantt_task_progress) {
  border-radius: 4px 0 0 4px;
}
</style>
