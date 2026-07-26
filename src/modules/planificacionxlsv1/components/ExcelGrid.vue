<!-- ========== ExcelGrid.vue ========== -->
<template>
  <main class="grid-area" ref="gridEl">
    <HotTable
      ref="hotTableRef"
      :beforeChange="beforeChange"
      :language="'es-MX'"
      :data="data"
      :columns="columns"
      :colHeaders="true"
      :rowHeaders="true"
      :height="gridHeight"
      :width="'100%'"
      :licenseKey="'non-commercial-and-evaluation'"
      :rowHeights="30"
      :filters="true"
      :dropdownMenu="dropdownMenuConfig"
      :contextMenu="contextMenuConfig"
      :afterChange="onChange"
      :afterSelection="onSelect"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import HotTable from '@handsontable/vue3'
import { puedeEditar } from '../utils'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps({
  data: Array,
  columns: Array,
  gridHeight: Number,
  contextMenuConfig: [Array, Object],
  dropdownMenuConfig: Object,
})

const emit = defineEmits(['change', 'select'])

const hotTableRef = ref(null)
const { infoMsg } = useSnackbar()

const onChange = (changes, source) => emit('change', changes, source)
const onSelect = (startRow, startCol) => emit('select', startRow, startCol)

const beforeChange = (changes, source) => {
  if (source === 'loadData') return true

  for (let i = 0; i < changes.length; i++) {
    const [row, prop] = changes[i]

    const rowId = hotTableRef.value?.hotInstance?.getDataAtRowProp(row, 'id')
    if (rowId === null || rowId === undefined || rowId === '') {
      infoMsg('No se pueden editar filas vacías')
      return false
    }

    const estado = hotTableRef.value?.hotInstance?.getDataAtRowProp(row, 'estado')
    if (!puedeEditar('actividad', prop, estado)) {
      infoMsg(`No tienes permiso para editar "${prop}"`)
      return false
    }
  }

  return true
}
</script>

<style scoped>
.grid-area {
  flex: 1;
  overflow: hidden;
  background: #fff;
  min-height: 0;
}
</style>
