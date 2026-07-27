<!-- ExcelToolbar.vue -->
<template>
  <header class="excel-header">
    <div class="header-left">
      <v-menu v-for="(menu, key) in menus" :key="key">
        <template v-slot:activator="{ props }">
          <button v-bind="props" class="btn">{{ key }}</button>
        </template>
        <v-list density="compact">
          <template v-for="(item, i) in menu" :key="i">
            <v-divider v-if="item.type === 'divider'" />
            <v-list-item v-else @click="$emit('ejecutar-accion', item.action, item.arg)">
              <template v-slot:prepend
                ><v-icon size="16">{{ item.icon }}</v-icon></template
              >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <template v-slot:append v-if="item.shortcut">
                <span class="text-caption text-medium-emphasis">{{ item.shortcut }}</span>
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <span class="sep"></span>
      <v-tooltip text="Agregar nueva actividad" location="bottom">
        <template #activator="{ props }">
          <button v-bind="props" class="btn primary" @click="$emit('add-row')">
            + Nueva Actividad
          </button>
        </template>
      </v-tooltip>
      <!-- Botón Nueva Tarea (tab tareas) - AGREGAR AQUÍ -->
      <v-tooltip v-if="gridTab === 'tareas'" text="Agregar nueva tarea" location="bottom">
        <template #activator="{ props }">
          <button v-bind="props" class="btn primary" @click="$emit('add-tarea')">
            + Nueva Subactividad
          </button>
        </template>
      </v-tooltip>
    </div>
    <div class="header-right">
      <v-tooltip text="Explorador de actividad" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            @click="$emit('open-aside', 'explorador')"
            >🌳 Explorador</v-btn
          >
        </template>
      </v-tooltip>
      <v-tooltip text="Mostrar tareas (Debe seleccionar una Actividad primero)" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" size="small" @click="$emit('open-aside', 'tareas')"
            >📋 Tareas</v-btn
          >
        </template>
      </v-tooltip>
      <v-tooltip text="Mostrar estructura" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            @click="$emit('open-aside', 'estructura')"
            >🌳 Estructura</v-btn
          >
        </template>
      </v-tooltip>
      <v-tooltip text="Mostrar presupuesto" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            @click="$emit('open-aside', 'presupuesto')"
            >💰 Presupuesto</v-btn
          >
        </template>
      </v-tooltip>
      <v-tooltip text="Resumen económico" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" size="small" @click="$emit('open-aside', 'resumen')"
            >📊 Resumen</v-btn
          >
        </template>
      </v-tooltip>
      <v-tooltip text="Guardar cambios" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            :color="store.tieneCambiosSinGuardar ? 'primary' : ''"
            @click="$emit('guardar')"
          >
            💾 Guardar
            <v-badge v-if="store.tieneCambiosSinGuardar" color="red" dot inline></v-badge>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="Exportar" location="bottom">
        <template #activator="{ props }">
          <button v-bind="props" class="btn">📤 Exportar</button>
        </template>
      </v-tooltip>
    </div>
  </header>
</template>

<script setup>
import { useExcelMenus } from '../composables/useExcelMenus'
import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore'

defineProps({
  gridTab: String, // prop para la grid de tareas
})

const { menuArchivo, menuEditar, menuVer } = useExcelMenus()
const menus = { Archivo: menuArchivo, Editar: menuEditar, Ver: menuVer }

const store = usePlanificacionExcelStore()

defineEmits(['add-row', 'add-tarea', 'open-aside', 'ejecutar-accion', 'guardar'])
</script>

<style scoped>
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
</style>
