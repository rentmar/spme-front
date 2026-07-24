<!-- ========== aside/AsidePresupuesto.vue ========== -->
<template>
  <div class="aside-content">
    <v-card flat class="mb-4 pa-3 summary-card">
      <div class="text-overline mb-2">Resumen del Proyecto</div>
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
      <div class="text-caption text-right">{{ pct }}% ejecutado</div>
    </v-card>
    <div class="text-caption font-weight-bold mb-2">POR ACTIVIDAD</div>
    <v-list density="compact">
      <v-list-item v-for="act in data" :key="act.id" rounded="lg" class="mb-1" border>
        <v-list-item-title class="text-caption font-weight-bold">{{
          act.codigo
        }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption">{{ act.nombre }}</v-list-item-subtitle>
        <template v-slot:append>
          <div class="text-right">
            <div class="text-caption font-weight-bold">Bs. {{ fmt(act.presupuesto) }}</div>
            <div class="d-flex align-center gap-1 mt-1">
              <v-progress-linear
                :model-value="act.presupuesto ? (act.ejecutado / act.presupuesto) * 100 : 0"
                :color="act.ejecutado > act.presupuesto * 0.8 ? 'red' : 'orange'"
                height="4"
                rounded
                style="width: 40px"
              ></v-progress-linear>
              <span class="text-caption"
                >{{
                  act.presupuesto ? Math.round((act.ejecutado / act.presupuesto) * 100) : 0
                }}%</span
              >
            </div>
          </div>
        </template>
      </v-list-item>
    </v-list>
    <div class="text-caption font-weight-bold mt-4 mb-2">POR FUENTE</div>
    <v-list density="compact">
      <v-list-item v-for="(fuente, i) in fuentesDummy" :key="i" rounded="lg" class="mb-1">
        <template v-slot:prepend
          ><v-icon size="16" :color="fuente.color">mdi-circle</v-icon></template
        >
        <v-list-item-title class="text-caption">{{ fuente.nombre }}</v-list-item-title>
        <template v-slot:append
          ><span class="text-caption font-weight-bold">Bs. {{ fmt(fuente.monto) }}</span></template
        >
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
defineProps({
  data: Array,
  totalPlan: Number,
  totalEjec: Number,
  saldo: Number,
  pct: Number,
  fuentesDummy: Array,
  fmt: Function,
})
</script>

<style scoped>
.aside-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
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
</style>
