<!-- ========== aside/AsideResumen.vue ========== -->
<template>
  <div class="aside-content" v-if="selectedRowData">
    <v-card flat class="mb-3 pa-3" color="primary" variant="tonal">
      <div class="text-body-2 font-weight-bold">{{ selectedRowData.nombre }}</div>
      <div class="text-caption">{{ selectedRowData.codigo }}</div>
    </v-card>
    <v-card flat class="mb-3 pa-3" border>
      <div class="text-overline mb-2">Presupuesto</div>
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
          :class="selectedRowData.presupuesto - selectedRowData.ejecutado < 0 ? 'c-red' : 'c-green'"
          >Bs. {{ fmt(selectedRowData.presupuesto - selectedRowData.ejecutado) }}</strong
        >
      </div>
      <v-progress-linear
        :model-value="
          selectedRowData.presupuesto
            ? (selectedRowData.ejecutado / selectedRowData.presupuesto) * 100
            : 0
        "
        :color="selectedRowData.ejecutado > selectedRowData.presupuesto * 0.8 ? 'red' : 'orange'"
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
      </div>
    </v-card>
    <v-card flat class="mb-3 pa-3" border>
      <div class="text-overline mb-2">Solicitudes</div>
      <div class="d-flex justify-space-between mb-1"><span>Fondos:</span><span>2</span></div>
      <div class="d-flex justify-space-between mb-1"><span>Viajes:</span><span>1</span></div>
      <div class="d-flex justify-space-between"><span>Reposición:</span><span>1</span></div>
    </v-card>
    <v-card flat class="pa-3" border>
      <div class="text-overline mb-2">Tareas</div>
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
      </div>
    </v-card>
  </div>
</template>

<script setup>
defineProps({ selectedRowData: Object, tareasDummy: Array, fmt: Function })
</script>

<style scoped>
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.c-green {
  color: #0d904f;
}
.c-red {
  color: #d93025;
}
</style>
