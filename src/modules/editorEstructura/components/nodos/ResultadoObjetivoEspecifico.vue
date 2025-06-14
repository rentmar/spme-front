<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
        {{ data }}
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar KPI -->
      <v-list-item class="custom-menu-item" @click="agregarIndicadorResultadoOE">
        <v-list-item-title>Agregar Indicador Resultado OE</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line-variant'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Indicador Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarProductoResultadoOE">
        <v-list-item-title>Agregar Producto de Resultado OE</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Resultado Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarProcesosResultadoOE">
        <v-list-item-title>Agregar Procesos para Resultado OE</v-list-item-title>
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
import { inject } from 'vue'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useProductos } from '@/modules/proyecto/composables/useProductos'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Inicar composables
const { indicadorResultadoObjEspecifico, crearIndicadorResultadoObjEspecifico } = useIndicadores()
const { productoResultadoOe, crearProductoResultadoOe } = useProductos()

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrenNode = currentNode.data.nodoProyecto.id
// console.log('Id del nodo backend')
// console.log(idCurretNode)

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

/* Funciones y señales del Nodo */
//Señales del nodo
const emit = defineEmits([
  'addIndicadorResultadoOE',
  'addProductoResultadoOE',
  'addProcesosResultadoOE',
])

const agregarIndicadorResultadoOE = async () => {
  const indicadorREsOe = {
    codigo: 'IND-RES-OE',
    redaccion: 'GUIA',
    fuente_verificacion: 'verificacion',
    target_poblacion: '1',
    tipo: 'A-Z',
    baseline: '12',
    target_q1: '12',
    target_q2: '21',
    target_q3: '212',
    target_q4: null,
    resultado_obj_especifico: idCurrenNode.toString(),
  }
  try {
    await crearIndicadorResultadoObjEspecifico(indicadorREsOe)
    // console.log(indicadorObjetivoEspecifico)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Indicador Resultado OE',
        type: 'indicadorroe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: indicadorResultadoObjEspecifico.value.id,
          codigo: indicadorResultadoObjEspecifico.value.codigo,
          redaccion: indicadorResultadoObjEspecifico.value.redaccion,
          fuente_verificacion: indicadorResultadoObjEspecifico.value.fuente_verificacion,
          target_poblacion: indicadorResultadoObjEspecifico.value.target_poblacion,
          tipo: indicadorResultadoObjEspecifico.value.tipo,
          baseline: indicadorResultadoObjEspecifico.value.baseline,
          target_q1: indicadorResultadoObjEspecifico.value.target_q1,
          target_q2: indicadorResultadoObjEspecifico.value.target_q2,
          target_q3: indicadorResultadoObjEspecifico.value.target_q3,
          target_q4: indicadorResultadoObjEspecifico.value.target_q4,
          resultado_obj_especifico: indicadorResultadoObjEspecifico.resultado_obj_especifico,
        },
      },
    }
    emit('addIndicadorResultadoOE', payload)
  } catch (err) {
    console.log('Error al crear el Indicador OE', err)
  }
}

const agregarProductoResultadoOE = async () => {
  const productoREsOe = {
    codigo: 'PROD-RES-OE',
    supuestos: 'sup prod',
    riesgos: 'risk prod',
    entregado: false,
    resultado_oe: idCurrenNode.toString(),
  }
  try {
    await crearProductoResultadoOe(productoREsOe)
    console.log(productoResultadoOe)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Producto Resultado OE',
        type: 'productoroe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: productoResultadoOe.value.id,
          codigo: productoResultadoOe.value.codigo,
          supuestos: productoResultadoOe.value.supuestos,
          riesgos: productoResultadoOe.value.riesgos,
          entregado: productoResultadoOe.value.entregado,
          resultado_oe: productoResultadoOe.value.resultado_oe,
        },
      },
    }
    emit('addProductoResultadoOE', payload)
  } catch (err) {
    console.log('Error al crear el Indicador OE', err)
  }
}

const agregarProcesosResultadoOE = () => {
  const payload = {
    label: 'Proceso para Resultado OE',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addProcesosResultadoOE', payload)
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
