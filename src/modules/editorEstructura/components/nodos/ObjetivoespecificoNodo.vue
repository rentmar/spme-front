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
import { inject } from 'vue'
//Composables
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useResultados } from '@/modules/proyecto/composables/useResultados'
import { useProductos } from '@/modules/proyecto/composables/useProductos'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Iniciar los composables
const { indicadorObjetivoEspecifico, crearIndicadorObjEspecifico } = useIndicadores()
const { crearResultadoOe, resultadoOe, error } = useResultados()
const { crearProductoOe, productoOe } = useProductos()

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

const emit = defineEmits(['addIndicadorOE', 'addResultadoOE', 'addProductoOE'])

/* Funciones */
const agregarIndicadorOE = async () => {
  const indicadorOe = {
    codigo: 'IND001-OESP01',
    redaccion: 'GUIA',
    fuente_verificacion: '',
    target_poblacion: '',
    tipo: 'A-Z',
    baseline: '',
    target_q1: '',
    target_q2: '',
    target_q3: '',
    target_q4: '',
    objetivo_especifico: idCurrenNode.toString(),
  }
  try {
    await crearIndicadorObjEspecifico(indicadorOe)
    // console.log(indicadorObjetivoEspecifico)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Indicador OE',
        type: 'indicadoroe',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: indicadorObjetivoEspecifico.value.id,
          codigo: indicadorObjetivoEspecifico.value.codigo,
          redaccion: indicadorObjetivoEspecifico.value.redaccion,
          fuente_verificacion: indicadorObjetivoEspecifico.value.fuente_verificacion,
          target_poblacion: indicadorObjetivoEspecifico.value.target_poblacion,
          tipo: indicadorObjetivoEspecifico.value.tipo,
          baseline: indicadorObjetivoEspecifico.value.baseline,
          target_q1: indicadorObjetivoEspecifico.value.target_q1,
          target_q2: indicadorObjetivoEspecifico.value.target_q2,
          target_q3: indicadorObjetivoEspecifico.value.target_q3,
          target_q4: indicadorObjetivoEspecifico.value.target_q4,
          objetivo_especifico: indicadorObjetivoEspecifico.value.objetivo_especifico,
        },
      },
    }
    emit('addIndicadorOE', payload)
  } catch (err) {
    console.log('Error al crear el Indicador OE', err)
  }
}

const agregarResultadoOE = async () => {
  const resOe = {
    codigo: 'RES',
    descripcion: 'Des Res OE',
    supuestos: 'SUp Res OE',
    riesgos: 'Riesg Res OE',
    proceso: null,
    objetivo_especifico: idCurrenNode.toString(),
  }
  try {
    await crearResultadoOe(resOe)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Resultado OE',
        type: 'resultadooe',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: resultadoOe.value.id,
          codigo: resultadoOe.value.codigo,
          descripcion: resultadoOe.value.descripcion,
          supuestos: resultadoOe.value.supuestos,
          riesgos: resultadoOe.value.riesgos,
          proceso: null,
          objetivo_especifico: resultadoOe.value.objetivo_especifico,
        },
      },
    }
    emit('addResultadoOE', payload)
  } catch (err) {
    console.error('Error al crear ' + error, err)
  }
  // const payload = {
  //   label: 'Resultado OE',
  //   sourceId: currentNode.id.toString(),
  //   meta: {
  //     prioridad: 'alta',
  //     fechaLimite: '2023-12-31',
  //   },
  // }
  // //Emitir el evento
  // emit('addResultadoOE', payload)
}

const agregarProductoOE = async () => {
  const prodOe = {
    codigo: 'P00 -SO',
    supuestos: 'sup prod oe',
    riesgos: 'risk oe',
    entregado: false,
    proceso: null,
    objetivo_especifico: idCurrenNode.toString(),
  }
  try {
    await crearProductoOe(prodOe)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Producto OE',
        type: 'productooe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: productoOe.value.id,
          codigo: productoOe.value.codigo,
          descripcion: productoOe.value.descripcion,
          supuestos: productoOe.value.supuestos,
          riesgos: productoOe.value.riesgos,
          entregado: productoOe.value.entregado,
          proceso: null,
          objetivo_especifico: productoOe.value.objetivo_especifico,
        },
      },
    }
    emit('addProductoOE', payload)
  } catch (err) {
    console.error('Error al crear Producto OE', err)
  }

  // const payload = {
  //   label: 'Producto OE',
  //   sourceId: currentNode.id.toString(),
  //   meta: {
  //     prioridad: 'alta',
  //     fechaLimite: '2023-12-31',
  //   },
  // }
  // //Emitir el evento
  // emit('addProductoOE', payload)
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
