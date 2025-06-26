<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" :show-menu="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Redaccion:</strong> {{ data.nodoProyecto.redaccion }}</div>
        <div class="mb-1">
          <strong>Fuente de verificacion:</strong> {{ data.nodoProyecto.fuente_verificacion }}
        </div>
        <div class="mb-1">
          <strong>Target poblacion:</strong> {{ data.nodoProyecto.target_poblacion }}
        </div>
        <div class="mb-1"><strong>Tipo:</strong> {{ data.nodoProyecto.tipo }}</div>
        <div class="mb-1"><strong>Baseline:</strong> {{ data.nodoProyecto.baseline }}</div>
        <div class="mb-1"><strong>target q1:</strong> {{ data.nodoProyecto.target_q1 }}</div>
        <div class="mb-1"><strong>target q2:</strong> {{ data.nodoProyecto.target_q2 }}</div>
        <div class="mb-1"><strong>target q3:</strong> {{ data.nodoProyecto.target_q3 }}</div>
        <div class="mb-1"><strong>target q4:</strong> {{ data.nodoProyecto.target_q4 }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar Producto General -->
      <v-list-item class="custom-menu-item" @click="agregarProductoGeneral">
        <v-list-item-title>Agregar Producto</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
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
import { useProductos } from '@/modules/proyecto/composables/useProductos'
import { inject } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

const { productoGral, crearProductoGeneral } = useProductos()

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrenNode = currentNode.data.nodoProyecto.id

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const emit = defineEmits(['addProducto'])

const agregarProductoGeneral = async () => {
  const ptrGral = {
    codigo: 'PTRG',
    supuestos: '',
    riesgos: '',
    entregado: false,
    objetivo_general: null,
    objetivo_especifico: null,
    indicador_og: null,
    indicador_oe: null,
    resultado_og: null,
    resultado_oe: null,
    indicador_resultado_og: idCurrenNode,
    indicador_resultado_oe: null,
  }
  try {
    console.log(ptrGral)
    await crearProductoGeneral(ptrGral)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Producto',
        type: 'productogral',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: productoGral.value.id,
          codigo: productoGral.value.codigo,
          supuestos: productoGral.value.supuestos,
          riesgos: productoGral.value.riesgos,
          entregado: productoGral.entregado,
          objetivo_general: productoGral.value.objetivo_general,
          objetivo_especifico: productoGral.value.objetivo_especifico,
          indicador_og: productoGral.value.indicador_og,
          indicador_oe: productoGral.value.indicador_oe,
          resultado_og: productoGral.value.resultado_og,
          resultado_oe: productoGral.value.resultado_oe,
          indicador_resultado_og: productoGral.value.indicador_resultado_og,
          indicador_resultado_oe: productoGral.value.indicador_resultado_oe,
        },
      },
    }
    emit('addProducto', payload)
  } catch (err) {
    console.log('ERROR: ', err)
  }
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
