<!-- ========== ExcelFormulaBar.vue ========== -->
<template>
  <div class="formula-bar">
    <div class="cell-ref">
      <span>{{ columnTitle || 'A1' }}</span>
    </div>
    <div class="cell-content">
      <div class="cell-value" :class="{ 'cell-empty': !selectedValue && selectedValue !== 0 }">
        <template v-if="selectedValue || selectedValue === 0">
          {{ formatValue(selectedValue) }}
        </template>
        <template v-else> Seleccione una celda para ver su contenido </template>
      </div>
    </div>
    <div class="cell-actions" v-if="selectedValue || selectedValue === 0">
      <v-tooltip text="Copiar valor" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-content-copy"
            variant="text"
            size="x-small"
            @click="copiarValor"
          />
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup>
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps({
  selectedCell: String,
  selectedValue: [String, Number, Array, Object],
  columnTitle: String,
})

const { infoMsg } = useSnackbar()

const formatValue = (val) => {
  if (val === null || val === undefined) return ''
  if (Array.isArray(val) && val.length > 0 && val[0].nombre) {
    return val
      .map((item) => `${item.nombre}: Bs ${Number(item.monto || 0).toLocaleString('es-BO')}`)
      .join(' | ')
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]'
    return val.map((item) => (typeof item === 'object' ? JSON.stringify(item) : item)).join(', ')
  }
  if (typeof val === 'object') return JSON.stringify(val)
  if (typeof val === 'number') return val.toLocaleString('es-BO', { minimumFractionDigits: 2 })
  return String(val)
}

const copiarValor = () => {
  navigator.clipboard.writeText(formatValue(props.selectedValue))
  infoMsg('Valor copiado')
}
</script>

<style scoped>
.formula-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.cell-ref {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 65px;
  height: 100%;
  font-weight: 700;
  font-size: 11px;
  color: #1a73e8;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 0 8px;
}

.cell-content {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  gap: 8px;
  overflow: hidden;
}

.cell-label {
  font-size: 10px;
  color: #5f6368;
  font-weight: 600;
  white-space: nowrap;
  padding: 1px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.cell-value {
  font-size: 12px;
  color: #202124;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-empty {
  color: #9e9e9e;
  font-size: 11px;
}

.cell-actions {
  display: flex;
  align-items: center;
  padding-right: 4px;
  border-left: 1px solid #f0f0f0;
}
</style>
