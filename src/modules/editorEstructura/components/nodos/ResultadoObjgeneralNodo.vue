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
      <v-list-item class="custom-menu-item" @click="agregarIndicadorResultadoOg">
        <v-list-item-title>Agregar Indicador Resultado OG</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Proceso Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarProcesos">
        <v-list-item-title>Agregar Procesos</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Proceso Objetivo General -->
      <v-list-item class="custom-menu-item">
        <v-list-item-title>Agregar Actividad</v-list-item-title>
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
import { inject } from 'vue'
import BaseNodo from './BaseNodo.vue'
import { Handle, useVueFlow } from '@vue-flow/core'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Iniciar composables
const { error, indicadorResultadoObjGeneral, crearIndicadorResultadoObjetivoGeneral } =
  useIndicadores()

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id
// console.log('Id del diagrama Ind Res OG')
// console.log(mapaNodoId)

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrentNode = currentNode.data.nodoProyecto.id
// console.log(idCurrentNode)

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

/* Funciones */
//Emitir señales
const emit = defineEmits(['addIndicadorResultadoOg', 'addProcesosResultadoOg'])

//AGregar Indicador Obj General
const agregarIndicadorResultadoOg = async () => {
  const indicadorResultadoOg = {
    codigo: 'IND00-R0-OG',
    redaccion: 'GUIA',
    fuente_verificacion: 'Fuente Verificacion',
    target_poblacion: '',
    tipo: 'A-Z',
    baseline: '',
    target_q1: '',
    target_q2: '',
    target_q3: '',
    target_q4: '',
    resultado_og: idCurrentNode,
  }
  //Crear el indicador resultado og
  try {
    await crearIndicadorResultadoObjetivoGeneral(indicadorResultadoOg)
    console.log('Indicador Resultado OG')
    console.log(indicadorResultadoObjGeneral)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Indicador Res. OG',
        type: 'indicadorog',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: indicadorResultadoObjGeneral.value.id,
          codigo: indicadorResultadoObjGeneral.value.codigo,
          redaccion: indicadorResultadoObjGeneral.value.redaccion,
          fuente_verificacion: indicadorResultadoObjGeneral.value.fuente_verificacion,
          target_poblacion: indicadorResultadoObjGeneral.value.target_poblacion,
          tipo: indicadorResultadoObjGeneral.value.tipo,
          baseline: indicadorResultadoObjGeneral.value.baseline,
          target_q1: indicadorResultadoObjGeneral.value.target_q1,
          target_q2: indicadorResultadoObjGeneral.value.target_q2,
          target_q3: indicadorResultadoObjGeneral.value.target_q3,
          target_q4: indicadorResultadoObjGeneral.value.target_q4,
          resultado_og: indicadorResultadoObjGeneral.value.resultado_og,
        },
      },
    }
    emit('addIndicadorResultadoOg', payload)
  } catch (err) {
    console.log('Error al crear el Indicador Res OG' + err + ' - ' + error)
  }
}

//Agregar
const agregarProcesos = async () => {}
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
