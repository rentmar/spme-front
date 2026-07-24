<!-- ========== ExcelGrid.vue ========== -->
<template>
  <main class="grid-area" ref="gridEl">
    <v-tabs v-model="localTab" density="compact" color="primary" class="grid-tabs">
      <v-tab value="actividades" size="small">📋 Actividades</v-tab>
      <v-tab value="tareas" size="small">
        📄 Subactividad
        <v-chip v-if="actividadSeleccionada" size="x-small" class="ml-1" color="primary" label>{{
          actividadSeleccionada.codigo
        }}</v-chip>
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="localTab" class="grid-window">
      <v-tabs-window-item value="actividades">
        <HotTable
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
          <v-icon size="40" color="disabled" class="mb-2">mdi-cursor-default-click</v-icon>
          <span>Clic derecho en una actividad → "Ver Tareas"</span>
        </div>
        <div
          v-else-if="tareasFiltradas.length === 0"
          class="d-flex flex-column align-center justify-center h-100 text-caption text-medium-emphasis"
        >
          <v-icon size="40" color="disabled" class="mb-2">mdi-file-document-remove-outline</v-icon>
          <span>{{ actividadSeleccionada.codigo }} no tiene subactividades</span>
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
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import HotTable from '@handsontable/vue3'

const props = defineProps({
  gridTab: String,
  data: Array,
  columns: Array,
  gridHeight: Number,
  actividadSeleccionada: Object,
  tareasFiltradas: Array,
  tareasColumns: Array,
  contextMenuConfig: [Array, Object],
  dropdownMenuConfig: Object,
})
const emit = defineEmits(['update:gridTab', 'change', 'select'])

//referncias
const tareasTable = ref(null)

const localTab = ref(props.gridTab || 'actividades')
watch(
  () => props.gridTab,
  (v) => {
    if (v) localTab.value = v
  },
)
watch(localTab, (v) => emit('update:gridTab', v))

const onChange = (changes, source) => emit('change', changes, source)
const onSelect = (startRow, startCol) => emit('select', startRow, startCol)

const recargarTareas = (data) => {
  if (tareasTable.value?.hotInstance) {
    tareasTable.value.hotInstance.loadData(data)
  }
}

defineExpose({ recargarTareas, tareasTable })
</script>

<style scoped>
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
</style>
