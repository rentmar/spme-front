<!-- components/usuario/MisSolicitudesTabs.vue -->
<template>
  <v-tabs
    :model-value="modelValue"
    color="primary"
    slider-color="#f78166"
    height="56"
    class="px-2"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- TODAS -->
    <v-tab value="todas" class="text-none">
      <v-icon start size="20">mdi-view-list</v-icon>
      <span>Todas</span>
      <v-badge :content="totalSolicitudes" color="primary" inline class="ml-2" />
    </v-tab>

    <!-- FONDOS -->
    <v-tab value="fondos" class="text-none">
      <v-icon start size="20" color="success">mdi-cash-multiple</v-icon>
      <span>Fondos</span>
      <v-badge :content="countFondos" color="success" inline class="ml-2" />
    </v-tab>

    <!-- VIAJES -->
    <v-tab value="viajes" class="text-none">
      <v-icon start size="20" color="info">mdi-airplane</v-icon>
      <span>Viajes</span>
      <v-badge :content="countViajes" color="info" inline class="ml-2" />
    </v-tab>

    <!-- PAGO DIRECTO -->
    <v-tab value="pago_directo" class="text-none">
      <v-icon start size="20" color="warning">mdi-credit-card</v-icon>
      <span>Pago Directo</span>
      <v-badge :content="countPagoDirecto" color="warning" inline class="ml-2" />
    </v-tab>

    <!-- REPOSICIÓN -->
    <v-tab value="reposicion" class="text-none">
      <v-icon start size="20" color="secondary">mdi-cash-refund</v-icon>
      <span>Reposición</span>
      <v-badge :content="countReposicion" color="secondary" inline class="ml-2" />
    </v-tab>

    <!-- RENDICIÓN -->
    <v-tab value="rendicion" class="text-none">
      <v-icon start size="20" color="deep-purple">mdi-file-document-check</v-icon>
      <span>Rendición</span>
      <v-badge :content="countRendicion" color="deep-purple" inline class="ml-2" />
    </v-tab>

    <!-- TODAS LAS REVISIONES - Línea siempre visible -->
    <v-tooltip :text="revisionesTooltip" location="bottom">
      <template #activator="{ props }">
        <v-tab
          value="revisiones"
          class="text-none revisiones-tab"
          :class="{ 'revisiones-activas': countRevisiones > 0 }"
          v-bind="props"
        >
          <v-icon start size="20" :color="countRevisiones > 0 ? 'teal' : ''">
            mdi-check-all
          </v-icon>
          <span :class="countRevisiones > 0 ? 'text-teal font-weight-bold' : ''"> Revisiones </span>
          <v-badge
            :content="countRevisiones || 0"
            :color="countRevisiones > 0 ? 'teal' : 'grey'"
            inline
            class="ml-2"
          />
        </v-tab>
      </template>
    </v-tooltip>

    <!-- PARA REVISAR - Línea solo cuando hay pendientes -->
    <v-tooltip :text="pendientesTooltip" location="bottom">
      <template #activator="{ props }">
        <v-tab
          value="pendientes"
          class="text-none pendientes-tab"
          :class="{ 'pendientes-activas': countPendientes > 0 }"
          v-bind="props"
        >
          <v-icon start size="20" :color="countPendientes > 0 ? 'warning' : ''">
            mdi-clipboard-alert
          </v-icon>
          <span :class="countPendientes > 0 ? 'text-warning font-weight-bold' : ''">
            Para Revisar
          </span>
          <v-badge
            v-if="countPendientes > 0"
            :content="countPendientes"
            color="error"
            inline
            class="ml-2 badge-pulse"
          />
        </v-tab>
      </template>
    </v-tooltip>
  </v-tabs>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  totalSolicitudes: { type: Number, default: 0 },
  countFondos: { type: Number, default: 0 },
  countViajes: { type: Number, default: 0 },
  countPagoDirecto: { type: Number, default: 0 },
  countReposicion: { type: Number, default: 0 },
  countRendicion: { type: Number, default: 0 },
  countRevisiones: { type: Number, default: 0 },
  countPendientes: { type: Number, default: 0 },
})

defineEmits(['update:modelValue'])

// Tooltips dinámicos
const revisionesTooltip = computed(() => {
  const count = props.countRevisiones || 0
  return count > 0 ? `${count} solicitudes revisadas o por revisar` : 'No hay asignaciones'
})

const pendientesTooltip = computed(() => {
  const count = props.countPendientes || 0
  return count > 0 ? `⚠️ ${count} solicitudes para revisión por revisar` : 'No Hay revisiones'
})
</script>

<style scoped>
:deep(.v-tabs) {
  background: white;
}
:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  min-width: 100px;
  font-size: 13px;
}
:deep(.v-tab--selected) {
  font-weight: 700;
}

/* Todas las Revisiones - Línea SIEMPRE visible */
.revisiones-tab {
  border-left: 2px solid #009688;
  transition: all 0.3s ease;
}
.revisiones-activas {
  background: rgba(0, 150, 136, 0.08);
}

/* Para Revisar - Línea solo cuando hay pendientes */
.pendientes-tab {
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
}
.pendientes-activas {
  border-left: 2px solid #ff9800;
  background: rgba(255, 152, 0, 0.08);
}

.badge-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@media (max-width: 960px) {
  :deep(.v-tab) {
    min-width: 70px;
    font-size: 11px;
    padding: 0 6px;
  }
}
</style>
