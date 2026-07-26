<!-- ========== ExcelStatusBar.vue ========== -->
<template>
  <footer class="status-bar">
    <span>{{ dataLength }} act.</span><span class="sep">|</span>
    <span class="highlight-plan">
      Planificado: <b>Bs. {{ fmt(totalPlan) }}</b> </span
    ><span class="sep">|</span>
    <span
      >Ejec: <b class="c-green">Bs. {{ fmt(totalEjec) }}</b></span
    ><span class="sep">|</span>
    <span
      >Saldo: <b :class="saldo < 0 ? 'c-red' : 'c-green'">Bs. {{ fmt(saldo) }}</b></span
    ><span class="sep">|</span>
    <div class="mini-progress"><div class="mini-fill" :style="{ width: pct + '%' }"></div></div>
    <span
      ><b>{{ pct }}%</b></span
    ><span style="flex: 1"></span><span>100%</span>
  </footer>
</template>

<script setup>
defineProps({
  dataLength: Number,
  totalPlan: Number,
  totalEjec: Number,
  saldo: Number,
  pct: Number,
})
const fmt = (n) => (+(n || 0)).toLocaleString('es-BO', { minimumFractionDigits: 2 })
</script>

<style scoped>
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
.highlight-plan {
  background: #1a73e8;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}
.highlight-plan b {
  color: #fff;
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
.c-green {
  color: #0d904f;
}
.c-red {
  color: #d93025;
}
b {
  font-weight: 600;
}
.sep {
  width: 1px;
  height: 14px;
  background: #d0d0d0;
  margin: 0 4px;
}
</style>
