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
      <!-- 🏗️ ENCABEZADO -->
      <v-card class="gantt-header-card mb-2" elevation="0" rounded="lg">
        <v-card-text class="pa-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <v-avatar color="primary" size="36" class="mr-2">
                <v-icon icon="mdi-chart-gantt" color="white" size="20" />
              </v-avatar>
            </v-col>
            <v-col>
              <h2 class="text-h6 font-weight-bold mb-0">Cronograma de Proyectos</h2>
              <div class="text-caption text-grey">
                Planificación estratégica · {{ visibleCount }} elementos
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 🎛️ BARRA DE CONTROL -->
      <v-card class="gantt-toolbar mb-2" elevation="0" rounded="lg">
        <v-card-text class="pa-2">
          <v-row dense align="center">
            <v-col cols="3">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Buscar proyectos, actividades o tareas..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                @click:clear="searchQuery = ''"
                bg-color="white"
                class="search-field"
              />
            </v-col>
            <v-divider vertical class="mx-2" />
            <v-col cols="auto">
              <v-btn-toggle
                v-model="currentView"
                density="compact"
                divided
                mandatory
                @update:model-value="cambiarEscala"
                class="scale-toggle"
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
            </v-col>
            <v-divider vertical class="mx-2" />
            <v-col cols="auto">
              <v-btn
                color="success"
                size="x-small"
                variant="tonal"
                @click="expandAll"
                class="text-none"
              >
                <v-icon start size="16">mdi-arrow-expand-all</v-icon>
                Expandir
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="warning"
                size="x-small"
                variant="tonal"
                @click="collapseAll"
                class="text-none"
              >
                <v-icon start size="16">mdi-arrow-collapse-all</v-icon>
                Colapsar
              </v-btn>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-chip
                color="error"
                variant="tonal"
                size="x-small"
                prepend-icon="mdi-calendar-today"
                class="today-chip"
                >{{ todayFormatted }}</v-chip
              >
            </v-col>
            <v-divider vertical class="mx-2" />
            <v-col cols="auto" style="min-width: 180px">
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-slider
                    v-model="ganttHeight"
                    min="200"
                    max="800"
                    step="50"
                    hide-details
                    density="compact"
                    color="success"
                    track-color="green-lighten-4"
                    prepend-icon="mdi-arrow-up-down"
                    v-bind="props"
                  />
                </template>
                <span>Ajustar el Alto</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 📊 Gantt -->
      <v-card class="gantt-chart-card" elevation="0" rounded="lg">
        <div ref="ganttContainer" :style="{ height: ganttHeight + 'px' }"></div>
      </v-card>

      <!-- 📌 PIE -->
      <div class="gantt-footer mt-1">
        <div class="legend-item">
          <span>🏗️</span>
          <span>Proyecto</span>
        </div>
        <div class="legend-item">
          <span>📋</span>
          <span>Actividad</span>
        </div>
        <div class="legend-item">
          <span>🏷️</span>
          <span>Tarea</span>
        </div>
        <v-divider vertical class="mx-2" />
        <span class="text-caption text-grey mr-2">Estados:</span>
        <div class="legend-item">
          <v-icon size="10" color="#64b5f6">mdi-circle</v-icon>
          <span>Planificada</span>
        </div>
        <div class="legend-item">
          <v-icon size="10" color="#ffa726">mdi-circle</v-icon>
          <span>En Ejecución</span>
        </div>
        <div class="legend-item">
          <v-icon size="10" color="#ef5350">mdi-circle</v-icon>
          <span>Retraso</span>
        </div>
        <div class="legend-item">
          <v-icon size="10" color="#4CAF50">mdi-circle</v-icon>
          <span>Finalizado</span>
        </div>
        <v-spacer />
        <span class="text-caption text-grey">💡 Click en una barra para ver detalles</span>
      </div>

      <!-- 📋 MODAL -->
      <v-dialog v-model="showModal" max-width="480" transition="dialog-bottom-transition">
        <v-card rounded="lg" v-if="selectedTask" class="modal-card">
          <v-toolbar
            :color="selectedTask.color || '#1976d2'"
            dark
            density="compact"
            class="modal-toolbar"
          >
            <v-toolbar-title class="text-subtitle-2 font-weight-bold">{{
              selectedTask.text
            }}</v-toolbar-title>
            <v-spacer />
            <v-btn icon="mdi-close" @click="showModal = false" variant="text" size="small" />
          </v-toolbar>
          <v-card-text class="pa-3">
            <v-row dense>
              <v-col cols="6">
                <div class="modal-field">
                  <v-icon size="14" color="primary" class="mr-1">mdi-calendar-start</v-icon>
                  <span class="text-caption text-grey">Inicio</span>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(selectedTask.start_date) }}
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="modal-field">
                  <v-icon size="14" color="primary" class="mr-1">mdi-calendar-end</v-icon>
                  <span class="text-caption text-grey">Fin</span>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(getEndDate(selectedTask)) }}
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="modal-field">
                  <v-icon size="14" color="primary" class="mr-1">mdi-clock-outline</v-icon>
                  <span class="text-caption text-grey">Duración</span>
                  <div class="text-body-2">{{ selectedTask.duration }} días</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="modal-field">
                  <v-icon size="14" color="primary" class="mr-1">mdi-progress-check</v-icon>
                  <span class="text-caption text-grey">Progreso</span>
                  <div class="text-body-2">
                    {{ Math.round((selectedTask.progress || 0) * 100) }}%
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <v-chip size="x-small" :color="selectedTask.color" class="mt-1">{{
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
import {
  VIEWS,
  ESTADO_COLOR,
  ESTADO_LABEL,
  formatDate,
  getEndDate,
  getTodayFormatted,
  getParentName,
  getChildren,
  filterTasks,
  initializeGanttConfig,
  loadGanttData,
  setupGanttEvents,
  changeGanttScale,
  expandAllProjects,
  collapseAllProjects,
} from '@/modules/gantt/utils'

const ganttContainer = ref(null)
const showModal = ref(false)
const selectedTask = ref(null)
const currentView = ref('year')
const searchQuery = ref('')
const ganttHeight = ref(300)
let ganttInitialized = false

const { tasks, loadingGantt, inicializar } = useGanttProyectos()

// Constantes expuestas al template
const views = VIEWS
const estadoLabel = ESTADO_LABEL

const todayFormatted = computed(() => getTodayFormatted())

const filteredTasks = computed(() => filterTasks(searchQuery.value, tasks.value))
const visibleCount = computed(() => filteredTasks.value.length)

// Wrappers para compatibilidad con el template
//eslint-disable-next-line
function getParentNameWrapper(parentId) {
  return getParentName(parentId, tasks.value)
}
//eslint-disable-next-line
function getChildrenWrapper(taskId) {
  return getChildren(taskId, tasks.value)
}

function expandAll() {
  if (ganttInitialized) expandAllProjects(gantt)
}

function collapseAll() {
  if (ganttInitialized) collapseAllProjects(gantt)
}

function cambiarEscala(view) {
  if (ganttInitialized) changeGanttScale(gantt, view)
}

function actualizarGantt() {
  if (!ganttContainer.value || !ganttInitialized) return
  loadGanttData(gantt, filteredTasks.value, ESTADO_COLOR)
}

function handleTaskClick(task) {
  selectedTask.value = tasks.value.find((t) => t.id === task.id) || task
  showModal.value = true
}

watch(searchQuery, () => {
  if (ganttInitialized) actualizarGantt()
})

function initGantt() {
  initializeGanttConfig(gantt)
  gantt.init(ganttContainer.value)
  ganttInitialized = true

  loadGanttData(gantt, tasks.value, ESTADO_COLOR)
  setupGanttEvents(gantt, handleTaskClick)
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
/* ── Contenedor ─────────────────────────── */
.gantt-wrapper {
  padding: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

/* ── Header ─────────────────────────────── */
.gantt-header-card {
  border: 1px solid #dde1e6;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
}

/* ── Toolbar ────────────────────────────── */
.gantt-toolbar {
  border: 1px solid #dde1e6;
  background: white;
}
.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
.today-chip {
  font-weight: 500;
}
.scale-toggle :deep(.v-btn--active) {
  font-weight: 700;
}

/* ── Chart ──────────────────────────────── */
.gantt-chart-card {
  border: 1px solid #dde1e6;
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ── Footer ─────────────────────────────── */
.gantt-footer {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
  border: 1px solid #dde1e6;
  border-radius: 6px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 16px;
  font-size: 11px;
  color: #666;
}

/* ── Modal ──────────────────────────────── */
.modal-card {
  overflow: hidden;
}
.modal-toolbar {
  letter-spacing: 0.3px;
}
.modal-field {
  margin-bottom: 8px;
}

/* ── Grid ────────────────────────────────── */
:deep(.row-project) {
  background-color: #e8f5e9 !important;
}
:deep(.row-actividad) {
  background-color: #e3f2fd !important;
}
:deep(.row-tarea) {
  background-color: #fff3e0 !important;
}

/* ── Gantt ──────────────────────────────── */
:deep(.gantt_task_line) {
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.2s ease;
}
:deep(.gantt_task_line:hover) {
  filter: brightness(1.1);
}
:deep(.gantt_task_progress) {
  border-radius: 4px 0 0 4px;
}
:deep(.gantt_grid_scale),
:deep(.gantt_task_scale) {
  background: #f5f5f5;
  font-weight: 500;
  font-size: 11px;
}
:deep(.gantt_row) {
  border-bottom: 1px solid #f0f0f0;
}
:deep(.gantt_tree_content) {
  font-size: 13px;
}
</style>
