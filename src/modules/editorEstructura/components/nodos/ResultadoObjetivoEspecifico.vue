<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
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
      <!-- Agregar Resultado Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarActividad">
        <v-list-item-title>Agregar Actividad para Resultado OE</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
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
import { inject } from 'vue'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useProductos } from '@/modules/proyecto/composables/useProductos'
import { useProcesos } from '@/modules/proyecto/composables/useProcesos'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Inicar composables
const { indicadorResultadoObjEspecifico, crearIndicadorResultadoObjEspecifico } = useIndicadores()
const { productoResultadoOe, crearProductoResultadoOe, productoGral, crearProductoGeneral } =
  useProductos()
const { procesos, crearProceso } = useProcesos()
const { actividad, crearActividad } = useActividad()

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
  'addActividadResOE',
  'addProducto',
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

const agregarProcesosResultadoOE = async () => {
  const processProdOe = {
    codigo: 'PROC',
    titulo: 'Proceso Resultado OE',
    descripcion: '',
    resultado_og: null,
    resultado_oe: idCurrenNode,
    producto_oe: null,
  }
  // console.log(processResOg)
  try {
    await crearProceso(processProdOe)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Procesos Resultado OE',
        type: 'procesoroe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: procesos.value.id,
          codigo: procesos.value.codigo,
          titulo: procesos.value.titulo,
          descripcion: procesos.value.descripcion,
          resultado_og: procesos.value.resultado_og,
          resultado_oe: procesos.value.resultado_oe,
          producto_oe: procesos.producto_oe,
        },
      },
    }
    emit('addProcesosResultadoOE', payload)
  } catch (err) {
    console.log('Error al crear el Indicador Res OG' + err)
  }
  //Emitir el evento
  //emit('addProcesosResultadoOE', payload)
}

//Agregar actividad
const agregarActividad = async () => {
  const act = {
    codigo: 'ACT001',
    descripcion: 'dedede create',
    tipo: 'CSNS',
    fecha_programada: null,
    duracion: 4,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    presupuesto_pei: null,
    estado: 'SPLAN',
    procedencia_fondos: 'PROY',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    justificacion_modificacion: '',
    datos_actividad: null,
    proceso: null,
    resultado_og: null,
    resultado_oe: idCurrenNode,
    producto_oe: null,
  }
  try {
    await crearActividad(act)
    console.log(actividad)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Actividad Res. OE',
        type: 'actividadroe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: actividad.value.id,
          codigo: actividad.value.codigo,
          descripcion: actividad.value.descripcion,
          tipo: actividad.value.tipo,
          fecha_programada: actividad.value.fecha_programada,
          duracion: actividad.value.duracion,
          fecha_inicio: actividad.value.fecha_inicio,
          fecha_cierre: actividad.value.fecha_cierre,
          presupuesto: actividad.value.presupuesto,
          presupuesto_pei: actividad.value.presupuesto_pei,
          estado: actividad.value.estado,
          procedencia_fondos: actividad.value.procedencia_fondos,
          objetivo_de_actividad: actividad.value.objetivo_de_actividad,
          descripcion_evaluacion: actividad.value.descripcion_evaluacion,
          justificacion_modificacion: actividad.value.justificacion_modificacion,
          datos_actividad: actividad.value.datos_actividad,
          proceso: actividad.value.proceso,
          resultado_og: actividad.value.resultado_og,
          resultado_oe: actividad.value.resultado_oe,
          producto_oe: actividad.value.producto_oe,
        },
      },
    }
    emit('addActividadResOE', payload)
  } catch (err) {
    console.error('Eror al crear', err)
  }
}

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
    resultado_oe: idCurrenNode,
    indicador_resultado_og: null,
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
