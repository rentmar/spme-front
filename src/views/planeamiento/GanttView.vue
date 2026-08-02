<template>
  <div style="padding: 20px; height: 600px">
    <!-- 🔍 BUSCADOR + BOTONES -->
    <div
      style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap"
    >
      <!-- Buscador -->
      <div style="flex: 1; max-width: 400px">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar proyecto, actividad o tarea..."
          style="
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
          "
        />
      </div>

      <!-- Contador -->
      <div style="font-size: 14px; color: #666">{{ visibleCount }} tareas visibles</div>

      <!-- Botones Expandir/Colapsar -->
      <button
        @click="expandAll"
        style="
          padding: 8px 16px;
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #4caf50;
          color: white;
          font-weight: 500;
        "
      >
        📂 Expandir
      </button>
      <button
        @click="collapseAll"
        style="
          padding: 8px 16px;
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #ff9800;
          color: white;
          font-weight: 500;
        "
      >
        📁 Colapsar
      </button>
      <button
        @click="clearSearch"
        style="
          padding: 8px 16px;
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f5f5f5;
        "
      >
        ✕ Limpiar
      </button>

      <!-- Separador -->
      <div style="width: 1px; height: 30px; background: #ddd"></div>

      <!-- 🔎 Botones de Escala -->
      <div style="display: flex; gap: 5px; align-items: center">
        <span style="font-size: 13px; color: #666; font-weight: 500; margin-right: 5px"
          >Escala:</span
        >
        <button
          v-for="view in views"
          :key="view.value"
          @click="setView(view.value)"
          :style="{
            padding: '6px 14px',
            cursor: 'pointer',
            border: currentView === view.value ? '2px solid #4CAF50' : '1px solid #ddd',
            borderRadius: '4px',
            background: currentView === view.value ? '#4CAF50' : '#f5f5f5',
            color: currentView === view.value ? 'white' : '#333',
            fontWeight: currentView === view.value ? '600' : '400',
            transition: 'all 0.2s',
          }"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <!-- 📊 Gantt -->
    <div
      ref="ganttContainer"
      style="height: 400px; border: 1px solid #eee; border-radius: 4px"
    ></div>

    <!-- ========================================== -->
    <!-- 📋 MODAL DE INFORMACIÓN -->
    <!-- ========================================== -->
    <div
      v-if="showModal"
      @click.self="closeModal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      "
    >
      <div
        style="
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.3s ease;
        "
      >
        <!-- Cabecera -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
          "
        >
          <h3 style="margin: 0; color: #333">📋 Detalles de la Tarea</h3>
          <button
            @click="closeModal"
            style="
              background: none;
              border: none;
              font-size: 24px;
              cursor: pointer;
              color: #999;
              padding: 0 8px;
            "
          >
            ✕
          </button>
        </div>

        <!-- Información -->
        <div v-if="selectedTask" style="display: flex; flex-direction: column; gap: 12px">
          <!-- Tipo con color -->
          <div
            style="
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              color: white;
              align-self: flex-start;
            "
            :style="{
              background: getTypeColor(selectedTask.type || getTaskType(selectedTask)),
            }"
          >
            {{ getTypeLabel(selectedTask.type || getTaskType(selectedTask)) }}
          </div>

          <!-- Nombre -->
          <div>
            <label
              style="
                font-size: 12px;
                color: #999;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
              >Nombre</label
            >
            <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #222">
              {{ selectedTask.text }}
            </p>
          </div>

          <!-- ID -->
          <div>
            <label
              style="
                font-size: 12px;
                color: #999;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
              >ID</label
            >
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">#{{ selectedTask.id }}</p>
          </div>

          <!-- Fechas -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
            <div>
              <label
                style="
                  font-size: 12px;
                  color: #999;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
                >📅 Inicio</label
              >
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">
                {{ formatDate(selectedTask.start_date) }}
              </p>
            </div>
            <div>
              <label
                style="
                  font-size: 12px;
                  color: #999;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
                >📅 Fin</label
              >
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">
                {{ formatDate(selectedTask.end_date || getEndDate(selectedTask)) }}
              </p>
            </div>
          </div>

          <!-- Duración y Progreso -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
            <div>
              <label
                style="
                  font-size: 12px;
                  color: #999;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
                >⏱️ Duración</label
              >
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">
                {{ selectedTask.duration || 0 }} días
              </p>
            </div>
            <div>
              <label
                style="
                  font-size: 12px;
                  color: #999;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
                >📊 Progreso</label
              >
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">
                {{ Math.round((selectedTask.progress || 0) * 100) }}%
              </p>
            </div>
          </div>

          <!-- Barra de progreso visual -->
          <div style="margin-top: 5px">
            <div
              style="
                width: 100%;
                height: 8px;
                background: #f0f0f0;
                border-radius: 4px;
                overflow: hidden;
              "
            >
              <div
                style="
                  height: 100%;
                  background: linear-gradient(90deg, #4caf50, #8bc34a);
                  border-radius: 4px;
                  transition: width 0.3s ease;
                "
                :style="{ width: Math.round((selectedTask.progress || 0) * 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Padre (si tiene) -->
          <div v-if="selectedTask.parent !== 0">
            <label
              style="
                font-size: 12px;
                color: #999;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
              >👆 Tarea Padre</label
            >
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #555">
              {{ getParentName(selectedTask.parent) || 'N/A' }}
            </p>
          </div>

          <!-- Subtareas (si tiene) -->
          <div v-if="getChildren(selectedTask.id).length > 0">
            <label
              style="
                font-size: 12px;
                color: #999;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
              >📂 Subtareas ({{ getChildren(selectedTask.id).length }})</label
            >
            <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #555; font-size: 14px">
              <li v-for="child in getChildren(selectedTask.id)" :key="child.id">
                {{ child.text }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón cerrar -->
        <div style="margin-top: 20px; text-align: right">
          <button
            @click="closeModal"
            style="
              padding: 10px 24px;
              background: #4caf50;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
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

// Modal
const showModal = ref(false)
const selectedTask = ref(null)

// Escala
const currentView = ref('week')
const views = [
  { label: '📅 Día', value: 'day' },
  { label: '📅 Semana', value: 'week' },
  { label: '📅 Mes', value: 'month' },
  { label: '📅 Año', value: 'year' },
]

// ============================================
// 📊 DATOS
// ============================================
const allTasks = [
  // PROYECTOS (Nivel 0)
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

  // ACTIVIDADES (Nivel 1)
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

  // TAREAS (Nivel 2)
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
  const colors = { project: '#4CAF50', activity: '#2196F3', task: '#FF9800' }
  return colors[type] || '#999'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getEndDate = (task) => {
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

  if (!query) {
    return allTasks
  }

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

  projects.forEach((project) => {
    gantt.open(project.id)
  })

  console.log('📂 Expandido todo')
}

const collapseAll = () => {
  if (!ganttInitialized) return

  const allTasksGantt = gantt.getTaskByTime()
  const projects = allTasksGantt.filter((task) => task.parent === 0)

  projects.forEach((project) => {
    gantt.close(project.id)
  })

  console.log('📁 Colapsado todo')
}

const clearSearch = () => {
  searchQuery.value = ''
}

// ============================================
// 🔎 FUNCIONES DE ESCALA
// ============================================

const setView = (view) => {
  if (!ganttInitialized) return

  currentView.value = view

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

  console.log(`🔎 Escala cambiada a: ${view}`)
}

// ============================================
// 📋 MODAL
// ============================================

const openModal = (task) => {
  const fullTask = allTasks.find((t) => t.id === task.id) || task
  selectedTask.value = fullTask
  showModal.value = true
  console.log('📋 Modal abierto para:', fullTask.text)
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

  // Restaurar la vista después de actualizar
  setView(currentView.value)
}

// ============================================
// 🚀 INICIALIZAR GANTT
// ============================================
const initGantt = () => {
  if (!ganttContainer.value) return

  gantt.config.xml_date = '%Y-%m-%d'

  // Escala inicial: Semana
  gantt.config.scales = [
    { unit: 'week', step: 1, format: 'Semana %W' },
    { unit: 'day', step: 1, format: '%d %M' },
  ]

  // Solo visual
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

  gantt.locale.labels = {
    ...gantt.locale.labels,
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    hour: 'Hora',
    minute: 'Minuto',
  }

  gantt.init(ganttContainer.value)
  ganttInitialized = true

  const data = {
    data: allTasks,
    links: [],
  }
  gantt.parse(data)

  // ==========================================
  // 👆 EVENTO - SOLO PARA CLIC EN LA BARRA
  // ==========================================

  // ✅ Evento principal: clic en la barra
  gantt.attachEvent('onTaskClick', (id, e) => {
    const task = gantt.getTask(id)

    // 🔍 Verificar si el clic fue en la barra (lado derecho)
    const target = e.target || e.srcElement

    // ✅ Detectar si es un icono de colapso/expansión
    const isCollapseIcon =
      target.closest('.gantt_tree_icon') ||
      target.closest('.gantt_folder') ||
      target.closest('.gantt_file') ||
      target.classList.contains('gantt_tree_icon') ||
      target.classList.contains('gantt_folder') ||
      target.classList.contains('gantt_file') ||
      target.closest('.gantt_tree_content') ||
      target.closest('.gantt_row')

    // ✅ Detectar si es la barra
    const isTaskBar =
      target.closest('.gantt_task_content') ||
      target.closest('.gantt_task') ||
      target.classList.contains('gantt_task_content') ||
      target.classList.contains('gantt_task')

    // 🔥 Si es icono de colapso, NO abrir modal y permitir acción
    if (isCollapseIcon) {
      // Dejar que DHTMLX maneje el colapso/expansión
      return true // Retorna true para permitir la acción por defecto
    }

    // Si es la barra, abrir modal
    if (isTaskBar && task) {
      openModal(task)
      return false // Bloquear acciones predeterminadas
    }

    // Otros clics (texto, etc.) - permitir acción por defecto
    return true
  })

  // Bloquear doble clic
  gantt.attachEvent('onTaskDblClick', () => {
    return false
  })

  // Bloquear edición
  gantt.attachEvent('onBeforeTaskAdd', () => {
    return false
  })

  gantt.attachEvent('onBeforeTaskDelete', () => {
    return false
  })

  gantt.attachEvent('onBeforeTaskUpdate', () => {
    return false
  })

  gantt.attachEvent('onBeforeLinkAdd', () => {
    return false
  })

  gantt.attachEvent('onBeforeLinkDelete', () => {
    return false
  })

  gantt.attachEvent('onBeforeTaskDrag', () => {
    return false
  })

  console.log('✅ Gantt visual - Colapso individual funcionando + Modal en barras')
}

// ============================================
// 🎯 WATCHERS
// ============================================
watch(
  filteredTasks,
  () => {
    if (ganttInitialized) {
      updateGantt()
    }
  },
  { deep: true },
)

// ============================================
// 🚀 MONTAJE
// ============================================
onMounted(() => {
  nextTick(() => {
    initGantt()
  })
})
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: scale(0.98);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
