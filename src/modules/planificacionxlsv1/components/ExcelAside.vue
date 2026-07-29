<!-- ========== ExcelAside.vue ========== -->
<template>
  <v-slide-x-reverse-transition>
    <aside class="side-aside">
      <v-toolbar color="secondary" density="compact" :height="36">
        <v-icon size="16" class="mr-2">{{ icon }}</v-icon>
        <v-toolbar-title class="text-caption">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon size="x-small" variant="text" @click="$emit('close')">
          <v-icon size="16">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- TAREAS -->
      <AsideTareas
        v-if="mode === 'tareas'"
        :actividad="props.actividad"
        :presupuesto-actividad="props.presupuestoActividad"
        :procedencia-fondos="props.procedenciaFondos"
      />

      <!-- ESTRUCTURA -->
      <AsideEstructura
        v-if="mode === 'estructura'"
        :data="data"
        :selected-row-data="selectedRowData"
        :fmt="fmt"
        @select="$emit('select-from-aside', $event)"
      />

      <!-- PRESUPUESTO -->
      <AsidePresupuesto
        v-if="mode === 'presupuesto'"
        :data="data"
        :total-plan="totalPlan"
        :total-ejec="totalEjec"
        :saldo="saldo"
        :pct="pct"
        :fuentes-dummy="fuentesDummy"
        :fmt="fmt"
      />

      <!-- RESUMEN -->
      <AsideResumen
        v-if="mode === 'resumen'"
        :selected-row-data="selectedRowData"
        :tareas-dummy="tareasDummy"
        :fmt="fmt"
      />

      <!-- EXPLORADOR -->
      <AsideExplorador
        v-if="mode === 'explorador'"
        :selected-row-data="selectedRowData"
        :arbol-explorador="arbolExplorador"
        :explorador-abiertos="exploradorAbiertos"
        :estado-color="estadoColor"
        @update:explorador-abiertos="$emit('update:explorador-abiertos', $event)"
      />

      <!--Arbol presupuestario-->
      <AsideArbolPresupuesto
        v-if="mode === 'arbol'"
        @close="$emit('close')"
      ></AsideArbolPresupuesto>

      <div
        v-if="
          (mode === 'tareas' || mode === 'resumen' || mode === 'explorador') && !selectedRowData
        "
        class="aside-empty"
      >
        <v-icon size="40" color="disabled" class="mb-2">mdi-cursor-default-click</v-icon>
        <span>Seleccione una actividad</span>
      </div>
    </aside>
  </v-slide-x-reverse-transition>
</template>

<script setup>
import { computed } from 'vue'
import AsideTareas from './aside/AsideTareas.vue'
import AsideEstructura from './aside/AsideEstructura.vue'
import AsidePresupuesto from './aside/AsidePresupuesto.vue'
import AsideResumen from './aside/AsideResumen.vue'
import AsideExplorador from './aside/AsideExplorador.vue'
import AsideArbolPresupuesto from './aside/AsideArbolPresupuesto.vue'

const props = defineProps({
  mode: String,
  actividad: { type: Object, required: true },
  presupuestoActividad: { type: [Number, String], required: true },
  procedenciaFondos: { type: Array, default: () => [] },
  selectedRowData: Object,
  data: Array,
  tareasDummy: Array,
  totalPlan: Number,
  totalEjec: Number,
  saldo: Number,
  pct: Number,
  fuentesDummy: Array,
  arbolExplorador: Array,
  exploradorAbiertos: Array,
})
defineEmits(['close', 'select-from-aside', 'update:explorador-abiertos'])

const fmt = (n) => (+(n || 0)).toLocaleString('es-BO', { minimumFractionDigits: 2 })
const estadoColor = (e) =>
  ({
    EJEC: 'info',
    PLAN: 'warning',
    FIN: 'success',
    DES: 'error',
    Completado: 'success',
    'En progreso': 'info',
    Pendiente: 'warning',
    APROBADO: 'success',
    PENDIENTE: 'warning',
    RECHAZADO: 'error',
  })[e] || 'default'

const icon = computed(
  () =>
    ({
      tareas: 'mdi-clipboard-text-outline',
      estructura: 'mdi-file-tree',
      presupuesto: 'mdi-cash-multiple',
      resumen: 'mdi-finance',
      explorador: 'mdi-file-tree',
      arbol: 'mdi-chart-tree',
    })[props.mode] || 'mdi-information',
)
const title = computed(
  () =>
    ({
      tareas: 'Subactividad',
      estructura: 'Estructura',
      presupuesto: 'Presupuesto',
      resumen: 'Resumen',
      explorador: 'Explorador',
      arbol: 'Presupuesto',
    })[props.mode] || '',
)
</script>

<style scoped>
.side-aside {
  width: 600px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #c4c7c9;
  overflow-y: auto;
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
</style>
