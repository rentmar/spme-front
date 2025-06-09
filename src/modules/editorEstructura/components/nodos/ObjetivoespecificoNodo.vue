<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Código:</strong> {{ data.codigo }}</div>
        <div class="mb-1"><strong>Título:</strong> {{ data.titulo }}</div>
        {{ currentNode }}
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar Indicador Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarIndicadorOE">
        <v-list-item-title>Agregar Indicador Objetivo Especifico</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Resultado OE -->
      <v-list-item class="custom-menu-item" @click="agregarResultadoOE">
        <v-list-item-title>Agregar Resultado Objetivo Especifico</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Producto OE -->
      <v-list-item class="custom-menu-item" @click="agregarProductoOE">
        <v-list-item-title>Agregar Producto Objetivo Especifico</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-package-variant-closed'"></v-icon>
        </template>
      </v-list-item>
    </template>
    <template #handles>
      <Handle type="target" position="top" :id="`source-${id}`" :style="handleStyle" />
      <Handle type="source" position="bottom" :id="`source-${id}`" :style="handleStyle" />
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

const { findNode } = useVueFlow()
const currentNode = findNode(props.id)

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const emit = defineEmits(['addIndicadorOE', 'addResultadoOE', 'addProductoOE'])

/* Funciones */
const agregarIndicadorOE = () => {
  const payload = {
    label: 'Indicador OE',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addIndicadorOE', payload)
}

const agregarResultadoOE = () => {
  const payload = {
    label: 'Resultado OE',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addResultadoOE', payload)
}

const agregarProductoOE = () => {
  const payload = {
    label: 'Producto OE',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addProductoOE', payload)
}
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
