<!-- ========== ExcelFormulaBar.vue ========== -->
<template>
  <div class="formula-bar">
    <span class="cell-ref">{{ selectedCell || 'A1' }}</span>
    <span class="cell-value">{{ selectedValue || 'Seleccione una celda' }}</span>
  </div>
</template>

<script setup>
defineProps({ selectedCell: String, selectedValue: String })
</script>

<style scoped>
.formula-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  background: #fff;
  border-bottom: 1px solid #c4c7c9;
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
</style>
