<template>
  <BaseNodo :id="id" :data="data" :show-delete="false" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Código:</strong> {{ data.codigo }}</div>
        <div class="mb-1"><strong>Título:</strong> {{ data.titulo }}</div>
        <div class="mb-1"><strong>Descripción:</strong> {{ data.descripcion }}</div>
        <div class="mb-1"><strong>Fecha de Inicio:</strong> {{}}</div>
        <div class="mb-1"><strong>Fecha de Finalización:</strong> {{}}</div>
        <div class="mb-1"><strong>Presupuesto:</strong> {{}}</div>
        <div class="mb-1"><strong>Estado:</strong> {{ data.estado }}</div>
        <div class="mb-1"><strong>Creado por:</strong> {{ data.creado_por }}</div>
        <h1>Datos</h1>
        <p>{{ nodoProyecto }}</p>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Editar el Nodo -->
      <v-list-item class="custom-menu-item">
        <v-list-item-title>Editar</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-pencil-outline'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarObjetivoGeneral">
        <v-list-item-title>Agregar Objetivo General</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-bullseye-arrow'"></v-icon>
        </template>
      </v-list-item>
      <!-- Editar el Nodo -->
      <v-list-item class="custom-menu-item" @click="agregarObjetivoEspecifico">
        <v-list-item-title>Agregar Objetivo Especifico</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-target-variant'"></v-icon>
        </template>
      </v-list-item>
    </template>
    <template #handles>
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

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const nodoProyecto = findNode(props.id)

//Eventos que el ProyectoNodo puede emitir
const emit = defineEmits(['addObjetivoGeneral', 'addObjetivoEspecifico'])

//Agregar Objetivo General
const agregarObjetivoGeneral = () => {
  const payload = {
    label: 'Mi objetivo',
    sourceId: '1',
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addObjetivoGeneral', payload)
}

//Agregar Objetivo Especifico
const agregarObjetivoEspecifico = () => {
  const payload = {
    label: 'Mi objetivo especifico',
    sourceId: '1',
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addObjetivoEspecifico', payload)
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
