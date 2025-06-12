<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Código:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar KPI -->
      <v-list-item class="custom-menu-item" @click="agregarKpi">
        <v-list-item-title>Agregar KPI</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line-variant'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Indicador Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarIndicadorObjGeneral">
        <v-list-item-title>Agregar Indicador Objetivo General</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Resultado Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarResultadoObjGeneral">
        <v-list-item-title>Agregar Resultado Objetivo General</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Resultado Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarObjetivoEspecifico">
        <v-list-item-title>Agregar Objetivo Especifico</v-list-item-title>
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
import { Handle } from '@vue-flow/core'
import { useVueFlow } from '@vue-flow/core'
import { reactive, inject } from 'vue'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useResultados } from '@/modules/proyecto/composables/useResultados'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Composables
const { crearIndicadorObjetivoGeneral, indicadorObjGeneral, error } = useIndicadores() //indicadores
const { resultadoOg, crearResultadoOg } = useResultados() //Resultados

// eslint-disable-next-line no-unused-vars
const datosNodoProyecto = reactive(props.data.datosNodo || {})

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id
// console.log('Id del diagram')
// console.log(mapaNodoId)

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idObjetivoGeneral = currentNode.data.nodoProyecto.id

//Eventos del nodo
const emit = defineEmits([
  'addKpi',
  'addIndicadorObjGeneral',
  'addResultadoObjGeneral',
  'addObjetivoEspecifico',
])

//Agregar KPI
const agregarKpi = () => {
  const payload = {
    label: 'KPI',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addKpi', payload)
}

//Agregar indicador
const agregarIndicadorObjGeneral = async () => {
  const indicadorOg = {
    codigo: 'IND-',
    redaccion: 'GUIA',
    fuente_verificacion: 'Fuentes de verificacion',
    target_poblacion: '',
    tipo: 'A-Z',
    baseline: '',
    target_q1: '',
    target_q2: '',
    target_q3: '',
    target_q4: '',
    objetivo_general: idObjetivoGeneral,
  }

  try {
    await crearIndicadorObjetivoGeneral(indicadorOg)
    // console.log(indicadorObjGeneral)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Indicador OG',
        type: 'indicadorog',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: indicadorObjGeneral.value.id,
          codigo: indicadorObjGeneral.value.codigo,
          redaccion: indicadorObjGeneral.value.redaccion,
          fuente_verificacion: indicadorObjGeneral.value.fuente_verificacion,
          target_poblacion: indicadorObjGeneral.value.target_poblacion,
          tipo: indicadorObjGeneral.value.tipo,
          baseline: indicadorObjGeneral.value.baseline,
          target_q1: indicadorObjGeneral.value.target_q1,
          target_q2: indicadorObjGeneral.value.target_q2,
          target_q3: indicadorObjGeneral.value.target_q3,
          target_q4: indicadorObjGeneral.value.target_q4,
          objetivo_general: indicadorObjGeneral.value.objetivo_general,
        },
      },
    }
    emit('addIndicadorObjGeneral', payload)
  } catch (err) {
    error.value = err
    console.log('Error al crear el objetivo', error)
  }
  //Emitir el evento
  //emit('addIndicadorObjGeneral', payload)
}

//Agregar Resultado Objetivo General
const agregarResultadoObjGeneral = async () => {
  //Definiendo el Resultado OG
  const resOg = {
    codigo: 'R0',
    descripcion: 'Descripcion del resultado de obj gral',
    supuestos: 'sup res obj gral',
    riesgos: 'riesg res obj gral',
    objetivo_general: idObjetivoGeneral,
  }
  //Crear el registro del resultado OG
  try {
    await crearResultadoOg(resOg)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Resultado OG',
        type: 'resultadoog',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: resultadoOg.value.id,
          codigo: resultadoOg.value.codigo,
          descripcion: resultadoOg.value.descripcion,
          supuestos: resultadoOg.value.supuestos,
          riesgos: resultadoOg.value.riesgos,
          objetivo_general: resultadoOg.value.objetivo_general,
        },
      },
    }
    //Emitir el evento
    emit('addResultadoObjGeneral', payload)
  } catch (err) {
    console.error('Error en la creacion', err + ' - ' + error)
  }
}

//Agregar Objetivo Especifico
const agregarObjetivoEspecifico = () => {
  const payload = {
    label: 'Objetivo Especifico',
    sourceId: currentNode.id.toString(),
    meta: {
      prioridad: 'alta',
      fechaLimite: '2023-12-31',
    },
  }
  //Emitir el evento
  emit('addObjetivoEspecifico', payload)
}

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
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
