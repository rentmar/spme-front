<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" :show-menu="false" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>

        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
        <div class="mb-1"><strong>Entregado:</strong> {{ data.nodoProyecto.entregado }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu> </template>
    <template #handles>
      <Handle type="target" position="top" :id="`source-${id}`" :style="handleStyle" />
    </template>
  </BaseNodo>
</template>

<script setup>
import BaseNodo from './BaseNodo.vue'
import { Handle, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const { findNode } = useVueFlow()
// eslint-disable-next-line no-unused-vars
const currentNode = findNode(props.id)
</script>
<style scoped>
.custom-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px; /* Menor padding horizontal */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.custom-menu-item:hover {
  background-color: #e0e0e0; /* Color más sutil y amigable */
  cursor: pointer;
}

.v-icon {
  font-size: 18px;
  color: #616161;
  min-width: 20px;
}

.v-list-item-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.v-list-item {
  min-height: 36px !important; /* Altura estándar menor */
  padding-left: 4px !important;
  padding-right: 4px !important;
}
</style>
