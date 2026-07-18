<!-- components/usuario/MisSolicitudesFiltros.vue -->
<template>
  <div class="d-flex align-center pa-3 gap-3 filters-toolbar flex-wrap mb-4">
    <div class="d-flex align-center gap-2">
      <v-icon size="18" color="grey">mdi-filter</v-icon>
      <span class="text-caption text-grey font-weight-medium">Filtros:</span>
    </div>

    <template v-for="campo in campos" :key="campo.key">
      <v-select
        v-if="campo.type === 'select'"
        :model-value="filtros[campo.key]"
        :items="campo.items"
        :label="campo.label"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="min-width: 150px"
        class="compact-select"
        @update:model-value="updateFiltro(campo.key, $event)"
      />

      <v-text-field
        v-else-if="campo.type === 'text'"
        :model-value="filtros[campo.key]"
        :placeholder="campo.label"
        :prepend-inner-icon="campo.icon"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        :style="`min-width: ${campo.width || 220}px`"
        class="compact-select"
        @update:model-value="updateFiltro(campo.key, $event)"
      />

      <v-text-field
        v-else-if="campo.type === 'number'"
        :model-value="filtros[campo.key]"
        :label="campo.label"
        type="number"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        :prefix="campo.prefix"
        style="min-width: 160px"
        class="compact-select"
        @update:model-value="updateFiltro(campo.key, $event)"
      />
    </template>

    <v-spacer />

    <div class="d-flex align-center gap-2">
      <span class="text-caption text-grey">{{ resultados }} resultados</span>
      <v-btn
        v-if="hasActiveFilters"
        size="small"
        variant="text"
        color="error"
        @click="$emit('limpiar-filtros')"
      >
        <v-icon size="16">mdi-filter-off</v-icon>
        Limpiar
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filtros: { type: Object, required: true },
  campos: { type: Array, required: true },
  resultados: { type: Number, default: 0 },
})

const emit = defineEmits(['update:filtros', 'limpiar-filtros'])

const hasActiveFilters = computed(() => {
  if (!props.filtros || typeof props.filtros !== 'object') return false
  return Object.values(props.filtros).some((v) => v !== null && v !== '' && v !== undefined)
})

const updateFiltro = (key, value) => {
  const nuevoFiltro = { ...props.filtros, [key]: value }
  emit('update:filtros', nuevoFiltro)
}
</script>

<style scoped>
.filters-toolbar {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  min-height: 56px;
}

.compact-select :deep(.v-field) {
  font-size: 13px;
  min-height: 36px !important;
  background: white;
  border-radius: 8px;
}

@media (max-width: 960px) {
  .filters-toolbar {
    flex-direction: column;
    align-items: stretch !important;
  }
  .compact-select {
    width: 100% !important;
    min-width: 100% !important;
  }
}
</style>
