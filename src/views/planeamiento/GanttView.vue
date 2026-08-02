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
          placeholder="🔍 Buscar proyecto o tarea..."
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
    </div>

    <!-- 📊 Gantt -->
    <div
      ref="ganttContainer"
      style="height: 400px; border: 1px solid #eee; border-radius: 4px"
    ></div>
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

// ============================================
// 📊 DATOS - 3 NIVELES
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
    open: true,
  },
  {
    id: 100,
    text: '🏗️ Proyecto: Parque Industrial',
    start_date: '2026-03-01',
    duration: 210,
    progress: 0.1,
    parent: 0,
    open: true,
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
// 🎯 BOTONES - VERSIÓN SIMPLE Y FUNCIONAL
// ============================================

// ✅ Expandir TODO
const expandAll = () => {
  if (!ganttInitialized) return

  // Obtener todos los proyectos (parent === 0)
  const allTasksGantt = gantt.getTaskByTime()
  const projects = allTasksGantt.filter((task) => task.parent === 0)

  // Abrir todos los proyectos
  projects.forEach((project) => {
    gantt.open(project.id)
  })

  console.log('📂 Expandido todo')
}

// ✅ Colapsar TODO (solo proyectos visibles)
const collapseAll = () => {
  if (!ganttInitialized) return

  // Obtener todos los proyectos (parent === 0)
  const allTasksGantt = gantt.getTaskByTime()
  const projects = allTasksGantt.filter((task) => task.parent === 0)

  // Cerrar todos los proyectos
  projects.forEach((project) => {
    gantt.close(project.id)
  })

  console.log('📁 Colapsado todo')
}

// ============================================
// 🎯 ACCIONES
// ============================================
const clearSearch = () => {
  searchQuery.value = ''
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
}

// ============================================
// 🚀 INICIALIZAR GANTT
// ============================================
const initGantt = () => {
  if (!ganttContainer.value) return

  gantt.config.xml_date = '%Y-%m-%d'
  gantt.config.scales = [
    { unit: 'month', step: 1, format: '%F %Y' },
    { unit: 'day', step: 1, format: '%d' },
  ]

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

  gantt.attachEvent('onTaskClick', (id) => {
    const task = gantt.getTask(id)
    console.log('📊 Tarea clickeada:', task)
    return true
  })

  console.log('✅ DHTMLX Gantt inicializado correctamente')
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
</style>
