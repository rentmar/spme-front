<!-- PlanificacionProyectoActividadesV3.vue -->
<template>
  <div class="excel-app">
    <!-- TOOLBAR -->
    <header class="excel-header">
      <div class="header-left">
        <v-menu>
          <template v-slot:activator="{ props }"
            ><button v-bind="props" class="btn">Archivo</button></template
          >
          <v-list density="compact">
            <template v-for="(item, i) in menuArchivo" :key="i">
              <v-divider v-if="item.type === 'divider'" />
              <v-list-item v-else @click="ejecutarAccion(item.action, item.arg)">
                <template v-slot:prepend
                  ><v-icon size="16">{{ item.icon }}</v-icon></template
                >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <template v-slot:append v-if="item.shortcut"
                  ><span class="text-caption text-medium-emphasis">{{
                    item.shortcut
                  }}</span></template
                >
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-menu>
          <template v-slot:activator="{ props }"
            ><button v-bind="props" class="btn">Editar</button></template
          >
          <v-list density="compact">
            <template v-for="(item, i) in menuEditar" :key="i">
              <v-divider v-if="item.type === 'divider'" />
              <v-list-item v-else @click="ejecutarAccion(item.action, item.arg)">
                <template v-slot:prepend
                  ><v-icon size="16">{{ item.icon }}</v-icon></template
                >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <template v-slot:append v-if="item.shortcut"
                  ><span class="text-caption text-medium-emphasis">{{
                    item.shortcut
                  }}</span></template
                >
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-menu>
          <template v-slot:activator="{ props }"
            ><button v-bind="props" class="btn">Ver</button></template
          >
          <v-list density="compact">
            <template v-for="(item, i) in menuVer" :key="i">
              <v-divider v-if="item.type === 'divider'" />
              <v-list-item v-else @click="ejecutarAccion(item.action, item.arg)">
                <template v-slot:prepend
                  ><v-icon size="16">{{ item.icon }}</v-icon></template
                >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <span class="sep"></span>
        <v-tooltip text="Agregar nueva actividad" location="bottom">
          <template #activator="{ props }"
            ><button v-bind="props" class="btn primary" @click="addRow">
              + Nueva Actividad
            </button></template
          >
        </v-tooltip>
      </div>
      <div class="header-right">
        <v-tooltip text="Explorador de actividad" location="bottom"
          ><template #activator="{ props }"
            ><v-btn v-bind="props" variant="text" size="small" @click="openAside('explorador')"
              >🌳 Explorador</v-btn
            ></template
          ></v-tooltip
        >
        <v-tooltip text="Mostrar tareas" location="bottom"
          ><template #activator="{ props }"
            ><v-btn v-bind="props" variant="text" size="small" @click="openAside('tareas')"
              >📋 Tareas</v-btn
            ></template
          ></v-tooltip
        >
        <v-tooltip text="Mostrar estructura" location="bottom"
          ><template #activator="{ props }"
            ><v-btn v-bind="props" variant="text" size="small" @click="openAside('estructura')"
              >🌳 Estructura</v-btn
            ></template
          ></v-tooltip
        >
        <v-tooltip text="Mostrar presupuesto" location="bottom"
          ><template #activator="{ props }"
            ><v-btn v-bind="props" variant="text" size="small" @click="openAside('presupuesto')"
              >💰 Presupuesto</v-btn
            ></template
          ></v-tooltip
        >
        <v-tooltip text="Resumen económico" location="bottom"
          ><template #activator="{ props }"
            ><v-btn v-bind="props" variant="text" size="small" @click="openAside('resumen')"
              >📊 Resumen</v-btn
            ></template
          ></v-tooltip
        >
        <v-tooltip text="Guardar" location="bottom"
          ><template #activator="{ props }"
            ><button v-bind="props" class="btn">💾 Guardar</button></template
          ></v-tooltip
        >
        <v-tooltip text="Exportar" location="bottom"
          ><template #activator="{ props }"
            ><button v-bind="props" class="btn">📤 Exportar</button></template
          ></v-tooltip
        >
      </div>
    </header>

    <!-- BARRA DE FÓRMULAS -->
    <div class="formula-bar">
      <span class="cell-ref">{{ selectedCell || 'A1' }}</span
      ><span class="cell-value">{{ selectedValue || 'Seleccione una celda' }}</span>
    </div>

    <div class="excel-body">
      <main class="grid-area" ref="gridRef">
        <v-tabs v-model="gridTab" density="compact" color="primary" class="grid-tabs">
          <v-tab value="actividades" size="small">📋 Actividades</v-tab>
          <v-tab value="tareas" size="small"
            >📄 Tareas<v-chip
              v-if="actividadSeleccionada"
              size="x-small"
              class="ml-1"
              color="primary"
              label
              >{{ actividadSeleccionada.codigo }}</v-chip
            ></v-tab
          >
        </v-tabs>
        <v-tabs-window v-model="gridTab" class="grid-window">
          <v-tabs-window-item value="actividades">
            <HotTable
              ref="hotTable"
              :data="data"
              :columns="columns"
              :colHeaders="true"
              :rowHeaders="true"
              :height="gridHeight - 36"
              :width="'100%'"
              :licenseKey="'non-commercial-and-evaluation'"
              :rowHeights="30"
              :filters="true"
              :dropdownMenu="dropdownMenuConfig"
              :contextMenu="contextMenuConfig"
              :afterChange="onChange"
              :afterSelection="onSelect"
            />
          </v-tabs-window-item>
          <v-tabs-window-item value="tareas">
            <div
              v-if="!actividadSeleccionada"
              class="d-flex align-center justify-center h-100 text-caption text-medium-emphasis"
            >
              Clic derecho en una actividad → "Ver Tareas"
            </div>
            <HotTable
              v-else
              ref="tareasTable"
              :data="tareasFiltradas"
              :columns="tareasColumns"
              :colHeaders="true"
              :rowHeaders="true"
              :height="gridHeight - 36"
              :width="'100%'"
              :licenseKey="'non-commercial-and-evaluation'"
              :rowHeights="30"
              :filters="true"
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </main>

      <v-slide-x-reverse-transition>
        <aside v-if="showAside" class="side-aside">
          <v-toolbar color="secondary" density="compact" :height="36">
            <v-icon size="16" class="mr-2">{{ asideIcon }}</v-icon>
            <v-toolbar-title class="text-caption">{{ asideTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon size="x-small" variant="text" @click="showAside = false"
              ><v-icon size="16">mdi-close</v-icon></v-btn
            >
          </v-toolbar>

          <div class="aside-content" v-if="asideMode === 'tareas' && selectedRowData">
            <v-card flat class="mb-3 pa-2" color="secondary" variant="tonal"
              ><div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
              <div class="d-flex gap-2 mt-1">
                <v-chip size="x-small" color="primary" label>{{ selectedRowData.estado }}</v-chip
                ><v-chip size="x-small" label>Bs. {{ fmt(selectedRowData.presupuesto) }}</v-chip>
              </div></v-card
            >
            <v-list density="compact" lines="two"
              ><v-list-item
                v-for="(tarea, i) in tareasDummy"
                :key="i"
                rounded="lg"
                class="mb-1"
                border
                ><template v-slot:prepend
                  ><v-avatar size="28" color="secondary" variant="tonal"
                    ><v-icon size="16">mdi-file-document-outline</v-icon></v-avatar
                  ></template
                ><v-list-item-title class="text-body-2">{{ tarea.nombre }}</v-list-item-title
                ><v-list-item-subtitle>Bs. {{ fmt(tarea.presupuesto) }}</v-list-item-subtitle
                ><template v-slot:append
                  ><v-chip
                    size="x-small"
                    :color="
                      tarea.estado === 'Completado'
                        ? 'success'
                        : tarea.estado === 'En progreso'
                          ? 'info'
                          : 'warning'
                    "
                    label
                    variant="tonal"
                    >{{ tarea.estado }}</v-chip
                  ></template
                ></v-list-item
              ></v-list
            >
          </div>
          <div class="aside-content" v-if="asideMode === 'estructura'">
            <v-list density="compact"
              ><v-list-group value="actividades"
                ><template v-slot:activator="{ props }"
                  ><v-list-item
                    v-bind="props"
                    title="Actividades"
                    prepend-icon="mdi-clipboard-text-outline"
                    :subtitle="data.length + ' actividades'"
                  ></v-list-item></template
                ><v-list-item
                  v-for="act in data"
                  :key="act.id"
                  :title="act.codigo"
                  :subtitle="act.nombre"
                  @click="selectFromAside(act)"
                  rounded="lg"
                  class="mb-1"
                  ><template v-slot:prepend
                    ><v-chip
                      size="x-small"
                      :color="
                        act.estado === 'EJEC'
                          ? 'info'
                          : act.estado === 'PLAN'
                            ? 'warning'
                            : act.estado === 'FIN'
                              ? 'success'
                              : 'default'
                      "
                      label
                      >{{ act.estado }}</v-chip
                    ></template
                  ><template v-slot:append
                    ><span class="text-caption">Bs. {{ fmt(act.presupuesto) }}</span></template
                  ></v-list-item
                ></v-list-group
              ></v-list
            >
          </div>
          <div class="aside-content" v-if="asideMode === 'presupuesto'">
            <v-card flat class="mb-4 pa-3 summary-card"
              ><div class="text-overline mb-2">Resumen del Proyecto</div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Planificado:</span
                ><strong class="text-caption">Bs. {{ fmt(totalPlan) }}</strong>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Ejecutado:</span
                ><strong class="text-caption c-green">Bs. {{ fmt(totalEjec) }}</strong>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption font-weight-bold">Saldo:</span
                ><strong class="text-caption" :class="saldo < 0 ? 'c-red' : 'c-green'"
                  >Bs. {{ fmt(saldo) }}</strong
                >
              </div>
              <v-progress-linear
                :model-value="pct"
                :color="pct > 80 ? 'red' : pct > 50 ? 'orange' : 'green'"
                height="10"
                rounded
                class="mb-1"
              ></v-progress-linear>
              <div class="text-caption text-right">{{ pct }}% ejecutado</div></v-card
            >
            <div class="text-caption font-weight-bold mb-2">POR ACTIVIDAD</div>
            <v-list density="compact"
              ><v-list-item v-for="act in data" :key="act.id" rounded="lg" class="mb-1" border
                ><v-list-item-title class="text-caption font-weight-bold">{{
                  act.codigo
                }}</v-list-item-title
                ><v-list-item-subtitle class="text-caption">{{ act.nombre }}</v-list-item-subtitle
                ><template v-slot:append
                  ><div class="text-right">
                    <div class="text-caption font-weight-bold">Bs. {{ fmt(act.presupuesto) }}</div>
                    <div class="d-flex align-center gap-1 mt-1">
                      <v-progress-linear
                        :model-value="act.presupuesto ? (act.ejecutado / act.presupuesto) * 100 : 0"
                        :color="act.ejecutado > act.presupuesto * 0.8 ? 'red' : 'orange'"
                        height="4"
                        rounded
                        style="width: 40px"
                      ></v-progress-linear
                      ><span class="text-caption"
                        >{{
                          act.presupuesto ? Math.round((act.ejecutado / act.presupuesto) * 100) : 0
                        }}%</span
                      >
                    </div>
                  </div></template
                ></v-list-item
              ></v-list
            >
            <div class="text-caption font-weight-bold mt-4 mb-2">POR FUENTE</div>
            <v-list density="compact"
              ><v-list-item v-for="(fuente, i) in fuentesDummy" :key="i" rounded="lg" class="mb-1"
                ><template v-slot:prepend
                  ><v-icon size="16" :color="fuente.color">mdi-circle</v-icon></template
                ><v-list-item-title class="text-caption">{{ fuente.nombre }}</v-list-item-title
                ><template v-slot:append
                  ><span class="text-caption font-weight-bold"
                    >Bs. {{ fmt(fuente.monto) }}</span
                  ></template
                ></v-list-item
              ></v-list
            >
          </div>
          <div class="aside-content" v-if="asideMode === 'resumen' && selectedRowData">
            <v-card flat class="mb-3 pa-3" color="primary" variant="tonal"
              ><div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
              <div class="text-caption">{{ selectedRowData.codigo }}</div></v-card
            >
            <v-card flat class="mb-3 pa-3" border
              ><div class="text-overline mb-2">Presupuesto</div>
              <div class="d-flex justify-space-between mb-2">
                <span>Planificado:</span><strong>Bs. {{ fmt(selectedRowData.presupuesto) }}</strong>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Ejecutado:</span
                ><strong class="c-green">Bs. {{ fmt(selectedRowData.ejecutado) }}</strong>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between mb-2">
                <span class="font-weight-bold">Saldo:</span
                ><strong
                  :class="
                    selectedRowData.presupuesto - selectedRowData.ejecutado < 0
                      ? 'c-red'
                      : 'c-green'
                  "
                  >Bs. {{ fmt(selectedRowData.presupuesto - selectedRowData.ejecutado) }}</strong
                >
              </div>
              <v-progress-linear
                :model-value="
                  selectedRowData.presupuesto
                    ? (selectedRowData.ejecutado / selectedRowData.presupuesto) * 100
                    : 0
                "
                :color="
                  selectedRowData.ejecutado > selectedRowData.presupuesto * 0.8 ? 'red' : 'orange'
                "
                height="8"
                rounded
                class="mb-1"
              ></v-progress-linear>
              <div class="text-caption text-right">
                {{
                  selectedRowData.presupuesto
                    ? Math.round((selectedRowData.ejecutado / selectedRowData.presupuesto) * 100)
                    : 0
                }}%
              </div></v-card
            >
            <v-card flat class="mb-3 pa-3" border
              ><div class="text-overline mb-2">Solicitudes</div>
              <div class="d-flex justify-space-between mb-1">
                <span>Fondos:</span><span>2</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span>Viajes:</span><span>1</span>
              </div>
              <div class="d-flex justify-space-between">
                <span>Reposición:</span><span>1</span>
              </div></v-card
            >
            <v-card flat class="pa-3" border
              ><div class="text-overline mb-2">Tareas</div>
              <div class="d-flex justify-space-between mb-1">
                <span>Total:</span><span>{{ tareasDummy.length }}</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="c-green">Completadas:</span
                ><span>{{ tareasDummy.filter((t) => t.estado === 'Completado').length }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span style="color: #e65100">Pendientes:</span
                ><span>{{ tareasDummy.filter((t) => t.estado === 'Pendiente').length }}</span>
              </div></v-card
            >
          </div>
          <div class="aside-content" v-if="asideMode === 'explorador' && selectedRowData">
            <v-card flat class="mb-3 pa-2" color="primary" variant="tonal"
              ><div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
              <div class="text-caption">{{ selectedRowData.codigo }}</div></v-card
            >
            <v-treeview
              :items="arbolExplorador"
              density="compact"
              activatable
              open-on-click
              :opened="exploradorAbiertos"
              @update:opened="exploradorAbiertos = $event"
              ><template v-slot:title="{ item }"
                ><div class="d-flex align-center w-100">
                  <v-icon size="16" class="mr-1" :color="item.color">{{ item.icon }}</v-icon
                  ><span class="text-caption">{{ item.title }}</span
                  ><v-spacer></v-spacer
                  ><v-chip
                    v-if="item.estado"
                    size="x-small"
                    :color="estadoColor(item.estado)"
                    label
                    class="ml-1"
                    >{{ item.estado }}</v-chip
                  >
                </div></template
              ></v-treeview
            >
          </div>
          <div
            v-if="
              (asideMode === 'tareas' || asideMode === 'resumen' || asideMode === 'explorador') &&
              !selectedRowData
            "
            class="aside-empty"
          >
            <v-icon size="40" color="disabled" class="mb-2">mdi-cursor-default-click</v-icon
            ><span>Seleccione una actividad</span>
          </div>
        </aside>
      </v-slide-x-reverse-transition>
    </div>

    <footer class="status-bar">
      <span>{{ data.length }} act.</span><span class="sep">|</span
      ><span
        >Planif: <b>Bs. {{ fmt(totalPlan) }}</b></span
      ><span class="sep">|</span
      ><span
        >Ejec: <b class="c-green">Bs. {{ fmt(totalEjec) }}</b></span
      ><span class="sep">|</span
      ><span
        >Saldo: <b :class="saldo < 0 ? 'c-red' : 'c-green'">Bs. {{ fmt(saldo) }}</b></span
      ><span class="sep">|</span>
      <div class="mini-progress"><div class="mini-fill" :style="{ width: pct + '%' }"></div></div>
      <span
        ><b>{{ pct }}%</b></span
      ><span style="flex: 1"></span><span>100%</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
registerAllModules()

const menuArchivo = [
  {
    type: 'item',
    title: 'Guardar Planificación',
    icon: 'mdi-content-save',
    action: 'guardar',
    shortcut: 'Ctrl+G',
  },
  { type: 'item', title: 'Importar Actividades', icon: 'mdi-file-import', action: 'importar' },
  { type: 'item', title: 'Exportar Excel', icon: 'mdi-microsoft-excel', action: 'exportarExcel' },
  { type: 'item', title: 'Exportar PDF', icon: 'mdi-file-pdf-box', action: 'exportarPDF' },
  { type: 'divider' },
  { type: 'item', title: 'Cerrar', icon: 'mdi-close', action: 'cerrar' },
]
const menuEditar = [
  {
    type: 'item',
    title: 'Agregar Actividad',
    icon: 'mdi-plus-box',
    action: 'addRow',
    shortcut: 'Ctrl+N',
  },
  { type: 'item', title: 'Agregar Tarea', icon: 'mdi-plus-circle', action: 'agregarTarea' },
  { type: 'item', title: 'Eliminar Fila', icon: 'mdi-delete', action: 'eliminarFila' },
  { type: 'divider' },
  {
    type: 'item',
    title: 'Ajustar Presupuesto',
    icon: 'mdi-cash-edit',
    action: 'ajustarPresupuesto',
  },
  { type: 'item', title: 'Buscar', icon: 'mdi-magnify', action: 'buscar', shortcut: 'Ctrl+B' },
]
const menuVer = [
  {
    type: 'item',
    title: 'Panel de Tareas',
    icon: 'mdi-view-agenda',
    action: 'toggleAside',
    arg: 'tareas',
  },
  {
    type: 'item',
    title: 'Explorador',
    icon: 'mdi-file-tree',
    action: 'toggleAside',
    arg: 'explorador',
  },
  {
    type: 'item',
    title: 'Presupuesto',
    icon: 'mdi-cash-multiple',
    action: 'toggleAside',
    arg: 'presupuesto',
  },
  { type: 'item', title: 'Resumen', icon: 'mdi-finance', action: 'toggleAside', arg: 'resumen' },
  { type: 'divider' },
  {
    type: 'item',
    title: 'Estructura PEI',
    icon: 'mdi-chart-tree',
    action: 'toggleAside',
    arg: 'estructura',
  },
]

const ejecutarAccion = (action, arg) => {
  const acciones = {
    guardar: () => alert('Guardar'),
    importar: () => alert('Importar'),
    exportarExcel: () => alert('Exportar Excel'),
    exportarPDF: () => alert('Exportar PDF'),
    cerrar: () => alert('Cerrar'),
    addRow: () => addRow(),
    agregarTarea: () => alert('Agregar Tarea'),
    eliminarFila: () => alert('Eliminar'),
    ajustarPresupuesto: () => alert('Presupuesto'),
    buscar: () => alert('Buscar'),
    toggleAside: (mode) => {
      if (showAside.value && asideMode.value === mode) showAside.value = false
      else {
        asideMode.value = mode
        showAside.value = true
      }
    },
  }
  if (acciones[action]) acciones[action](arg)
}

const asideIcon = computed(
  () =>
    ({
      tareas: 'mdi-clipboard-text-outline',
      estructura: 'mdi-file-tree',
      presupuesto: 'mdi-cash-multiple',
      resumen: 'mdi-finance',
      explorador: 'mdi-file-tree',
    })[asideMode.value] || 'mdi-information',
)
const asideTitle = computed(
  () =>
    ({
      tareas: 'Tareas',
      estructura: 'Estructura',
      presupuesto: 'Presupuesto',
      resumen: 'Resumen',
      explorador: 'Explorador',
    })[asideMode.value] || '',
)

const init = [
  {
    id: 1,
    codigo: 'ACT001',
    nombre: 'Seminario Video',
    tipo: 'Capacitacion',
    resp: 'jperez',
    inicio: '2026-01-15',
    cierre: '2026-06-30',
    presupuesto: 15000,
    ejecutado: 8500,
    saldo: 6500,
    estado: 'EJEC',
    area: 'Educación',
    fuente: 'TGN',
    prioridad: 'Alta',
    observaciones: 'En curso',
  },
  {
    id: 2,
    codigo: 'ACT002',
    nombre: 'Reunion Asociados',
    tipo: 'Articulacion',
    resp: 'mlopez',
    inicio: '2026-02-01',
    cierre: '2026-04-15',
    presupuesto: 20000,
    ejecutado: 12000,
    saldo: 8000,
    estado: 'EJEC',
    area: 'Social',
    fuente: 'IDH',
    prioridad: 'Media',
    observaciones: '',
  },
  {
    id: 3,
    codigo: 'ACT003',
    nombre: 'Captacion Org',
    tipo: 'Operativa',
    resp: 'cruiz',
    inicio: '2026-03-01',
    cierre: '2026-12-31',
    presupuesto: 25000,
    ejecutado: 0,
    saldo: 25000,
    estado: 'PLAN',
    area: 'Desarrollo',
    fuente: 'Propios',
    prioridad: 'Alta',
    observaciones: 'Pendiente',
  },
  {
    id: 4,
    codigo: 'ACT004',
    nombre: 'Seminario Actualizacion',
    tipo: 'Capacitacion',
    resp: 'atorres',
    inicio: '2026-01-01',
    cierre: '2026-03-30',
    presupuesto: 10000,
    ejecutado: 10000,
    saldo: 0,
    estado: 'FIN',
    area: 'Educación',
    fuente: 'TGN',
    prioridad: 'Baja',
    observaciones: 'Completado',
  },
]

const data = ref(init.map((r) => ({ ...r })))
const selectedCell = ref('A1'),
  selectedValue = ref(''),
  selectedRowData = ref(null),
  actividadSeleccionada = ref(null)
const hotTable = ref(null),
  gridRef = ref(null),
  gridHeight = ref(400)
const showAside = ref(false),
  asideMode = ref('tareas'),
  gridTab = ref('actividades')
const exploradorAbiertos = ref(['tareas-group', 'solicitudes-group'])

const tareasDummy = [
  { nombre: 'Preparar material audiovisual', presupuesto: 3000, estado: 'Completado' },
  { nombre: 'Grabar sesiones de capacitación', presupuesto: 5000, estado: 'En progreso' },
  { nombre: 'Editar video final', presupuesto: 7000, estado: 'Pendiente' },
]
const tareasGridData = ref([
  {
    id: 1,
    codigo: 'TAR-001',
    actividad: 'ACT001 - Seminario Video',
    nombre: 'Preparar material',
    inicio: '2026-01-15',
    cierre: '2026-01-30',
    presupuesto: 3000,
    estado: 'Completado',
  },
  {
    id: 2,
    codigo: 'TAR-002',
    actividad: 'ACT001 - Seminario Video',
    nombre: 'Grabar sesiones',
    inicio: '2026-02-01',
    cierre: '2026-03-15',
    presupuesto: 5000,
    estado: 'En progreso',
  },
  {
    id: 3,
    codigo: 'TAR-003',
    actividad: 'ACT001 - Seminario Video',
    nombre: 'Editar video',
    inicio: '2026-03-16',
    cierre: '2026-04-30',
    presupuesto: 7000,
    estado: 'Pendiente',
  },
])
const tareasFiltradas = computed(() =>
  actividadSeleccionada.value
    ? tareasGridData.value.filter((t) => t.actividad.includes(actividadSeleccionada.value.codigo))
    : [],
)
const tareasColumns = ref([
  { data: 'id', title: '#', type: 'numeric', width: 40 },
  { data: 'codigo', title: 'Código', width: 90 },
  { data: 'actividad', title: 'Actividad', width: 220 },
  { data: 'nombre', title: 'Tarea', width: 180 },
  { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  {
    data: 'presupuesto',
    title: 'Presupuesto',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  { data: 'estado', title: 'Estado', width: 100 },
])
const fuentesDummy = [
  { nombre: 'TGN', monto: 150000, color: '#1a73e8' },
  { nombre: 'IDH', monto: 95000, color: '#0d904f' },
  { nombre: 'Propios', monto: 63000, color: '#e65100' },
  { nombre: 'MISEREOR', monto: 42000, color: '#5c2d91' },
]
const columns = ref([
  { data: 'id', title: '#', type: 'numeric', width: 40 },
  { data: 'codigo', title: 'Código', width: 90 },
  { data: 'nombre', title: 'Nombre', width: 180 },
  { data: 'tipo', title: 'Tipo', width: 120 },
  { data: 'area', title: 'Área', width: 110 },
  { data: 'resp', title: 'Resp.', width: 80 },
  { data: 'inicio', title: 'Inicio', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  { data: 'cierre', title: 'Cierre', type: 'date', width: 100, dateFormat: 'YYYY-MM-DD' },
  {
    data: 'presupuesto',
    title: 'Presupuesto',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  {
    data: 'ejecutado',
    title: 'Ejecutado',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  {
    data: 'saldo',
    title: 'Saldo',
    type: 'numeric',
    width: 110,
    numericFormat: { pattern: '0,0.00' },
  },
  { data: 'fuente', title: 'Fuente', width: 90 },
  { data: 'prioridad', title: 'Prioridad', width: 80 },
  { data: 'estado', title: 'Estado', width: 70 },
  { data: 'observaciones', title: 'Observaciones', width: 180 },
])

const totalPlan = computed(() => data.value.reduce((s, r) => s + (+r.presupuesto || 0), 0))
const totalEjec = computed(() => data.value.reduce((s, r) => s + (+r.ejecutado || 0), 0))
const saldo = computed(() => totalPlan.value - totalEjec.value)
const pct = computed(() =>
  totalPlan.value ? +((totalEjec.value / totalPlan.value) * 100).toFixed(1) : 0,
)
const fmt = (n) => (+n).toLocaleString('es-BO', { minimumFractionDigits: 2 })
const estadoColor = (e) =>
  ({
    EJEC: 'info',
    PLAN: 'warning',
    FIN: 'success',
    Completado: 'success',
    'En progreso': 'info',
    Pendiente: 'warning',
    APROBADO: 'success',
    PENDIENTE: 'warning',
    RECHAZADO: 'error',
  })[e] || 'default'
const arbolExplorador = computed(() =>
  selectedRowData.value
    ? [
        {
          id: 'tareas-group',
          title: 'Tareas',
          icon: 'mdi-folder-outline',
          color: 'secondary',
          children: tareasDummy.map((t, i) => ({
            id: `tarea-${i}`,
            title: t.nombre,
            icon: 'mdi-file-document-outline',
            color: 'secondary',
            estado: t.estado,
          })),
        },
        {
          id: 'solicitudes-group',
          title: 'Solicitudes',
          icon: 'mdi-folder-outline',
          color: 'info',
          children: [
            {
              id: 'sol-1',
              title: 'SF-001 Fondos',
              icon: 'mdi-cash-multiple',
              color: 'info',
              estado: 'APROBADO',
            },
            {
              id: 'sol-2',
              title: 'SV-001 Viaje',
              icon: 'mdi-airplane',
              color: 'info',
              estado: 'PENDIENTE',
            },
            {
              id: 'sol-3',
              title: 'SR-001 Reposición',
              icon: 'mdi-recycle',
              color: 'info',
              estado: 'RECHAZADO',
            },
          ],
        },
        {
          id: 'rendiciones-group',
          title: 'Rendiciones',
          icon: 'mdi-folder-outline',
          color: 'success',
          children: [
            {
              id: 'rend-1',
              title: 'RC-001 Rendición',
              icon: 'mdi-clipboard-check-outline',
              color: 'success',
              estado: 'PENDIENTE',
            },
          ],
        },
      ]
    : [],
)

const calcularAltura = () => {
  nextTick(() => {
    if (gridRef.value) gridHeight.value = gridRef.value.clientHeight
  })
}
let resizeObserver = null
onMounted(() => {
  calcularAltura()
  resizeObserver = new ResizeObserver(calcularAltura)
  if (gridRef.value) resizeObserver.observe(gridRef.value)
})
onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

const onChange = (changes, source) => {
  if (source === 'loadData') return
  changes.forEach(([row, prop, , val]) => {
    if (row < data.value.length) {
      data.value[row][prop] = prop === 'presupuesto' || prop === 'ejecutado' ? +val || 0 : val
      if (prop === 'presupuesto' || prop === 'ejecutado')
        data.value[row].saldo =
          (+data.value[row].presupuesto || 0) - (+data.value[row].ejecutado || 0)
    }
  })
}
const onSelect = (startRow, startCol) => {
  const h = hotTable.value?.hotInstance
  if (h) {
    selectedCell.value = h.getColHeader(startCol) + (startRow + 1)
    selectedValue.value = h.getDataAtCell(startRow, startCol)
    const row = h.getDataAtRow(startRow)
    const obj = {}
    columns.value.forEach((c, i) => {
      if (c.data) obj[c.data] = row[i]
    })
    selectedRowData.value = obj
  }
}
const verTareasDeActividad = () => {
  if (selectedRowData.value) {
    actividadSeleccionada.value = selectedRowData.value
    console.log('Actividad seleccionada:', actividadSeleccionada.value)
    console.log('Tareas filtradas:', tareasFiltradas.value)
    gridTab.value = 'tareas'
  }
}
const addRow = () => {
  const newId = data.value.length > 0 ? Math.max(...data.value.map((r) => r.id)) + 1 : 1
  data.value.push({
    id: newId,
    codigo: '',
    nombre: '',
    tipo: '',
    area: '',
    resp: '',
    inicio: '',
    cierre: '',
    presupuesto: 0,
    ejecutado: 0,
    saldo: 0,
    fuente: '',
    prioridad: 'Media',
    estado: 'PLAN',
    observaciones: '',
  })
}
const openAside = (mode) => {
  asideMode.value = mode
  showAside.value = true
}
const selectFromAside = (act) => {
  selectedRowData.value = act
  asideMode.value = 'tareas'
}
const contextMenuConfig = computed(() => [
  {
    key: 'verTareas',
    name: '📋 Ver Tareas',
    callback: () => verTareasDeActividad(),
    disabled: () => !selectedRowData.value,
  },
  {
    key: 'verExplorador',
    name: '🌳 Abrir Explorador',
    callback: () => openAside('explorador'),
    disabled: () => !selectedRowData.value,
  },
  '---------',
  { key: 'exportar', name: '📤 Exportar a Excel' },
])
const columnasConFiltros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const dropdownMenuConfig = {
  items: {
    filter_by_condition: {
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || !columnasConFiltros.includes(r.to.col)
      },
    },
    filter_by_value: {
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || !columnasConFiltros.includes(r.to.col)
      },
    },
    filter_action_bar: {
      hidden: function () {
        const r = this.getSelectedRangeLast()
        return !r || !columnasConFiltros.includes(r.to.col)
      },
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.excel-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  color: #202124;
  background: #f1f3f4;
}
.excel-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 38px;
  padding: 0 10px;
  background: #f1f3f4;
  border-bottom: 1px solid #c4c7c9;
}
.formula-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  background: #fff;
  border-bottom: 1px solid #c4c7c9;
}
.excel-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}
.grid-area {
  flex: 1;
  overflow: hidden;
  background: #fff;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.grid-tabs {
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.grid-window {
  flex: 1;
  overflow: hidden;
}
.grid-window :deep(.v-window__container) {
  height: 100%;
}
.grid-window :deep(.v-window-item) {
  height: 100%;
}
.status-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  background: #f1f3f4;
  border-top: 1px solid #c4c7c9;
  font-size: 11px;
  color: #5f6368;
  gap: 8px;
}
.side-aside {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #c4c7c9;
  overflow-y: auto;
}
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.aside-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9aa0a6;
  font-size: 13px;
}
.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 2px;
}
.btn {
  padding: 5px 12px;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #444;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #d3d6da;
}
.btn.primary {
  color: #1a73e8;
  font-weight: 600;
}
.sep {
  width: 1px;
  height: 18px;
  background: #c4c7c9;
  margin: 0 6px;
}
.cell-ref {
  width: 65px;
  text-align: center;
  font-weight: 700;
  font-size: 11px;
  color: #5f6368;
  border-right: 1px solid #c4c7c9;
}
.cell-value {
  flex: 1;
  padding: 0 10px;
  font-size: 12px;
}
.mini-progress {
  width: 50px;
  height: 6px;
  background: #dadce0;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}
.mini-fill {
  height: 100%;
  background: #1a73e8;
  border-radius: 3px;
  transition: width 0.3s;
}
.summary-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border: 1px solid #dee2e6;
}
.c-green {
  color: #0d904f;
}
.c-red {
  color: #d93025;
}
b {
  font-weight: 600;
}
</style>
