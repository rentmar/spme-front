<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
        <div class="mb-1"><strong>entregado:</strong> {{ data.nodoProyecto.entregado }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar Procesos -->
      <v-list-item class="custom-menu-item" @click="agregarProcesos">
        <v-list-item-title>Agregar Procesos</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line-variant'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Actividades -->
      <v-list-item class="custom-menu-item" @click="agregarActividades">
        <v-list-item-title>Agregar Actividades</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line-variant'"></v-icon>
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
import { useProcesos } from '@/modules/proyecto/composables/useProcesos'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Composables
const { procesos, crearProceso } = useProcesos()
const { actividad, crearActividad } = useActividad()

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrentNode = currentNode.data.nodoProyecto.id
//identificador del proyecto
const idProyecto = proyectoEstructura.value.id.toString()

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

//Señales del nodo
const emit = defineEmits(['addProcesoProductoOE', 'addActividadProdOE'])

/* Funciones */
const agregarProcesos = async () => {
  const processProdOe = {
    codigo: 'PROC',
    titulo: 'Proceso Producto OE',
    descripcion: '',
    resultado_og: null,
    resultado_oe: null,
    producto_oe: idCurrentNode,
  }
  // console.log(processResOg)
  try {
    await crearProceso(processProdOe)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Procesos Producto OE',
        type: 'procesopoe',
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
    emit('addProcesoProductoOE', payload)
  } catch (err) {
    console.log('Error al crear el Indicador Res OG' + err)
  }
}

//Agregar actividades
const agregarActividades = async () => {
  // const act = {
  //   codigo: 'ACT001',
  //   descripcion: 'dedede create',
  //   tipo: 'CSNS',
  //   fecha_programada: null,
  //   duracion: 4,
  //   fecha_inicio: null,
  //   fecha_cierre: null,
  //   presupuesto: null,
  //   presupuesto_pei: null,
  //   estado: 'SPLAN',
  //   procedencia_fondos: 'PROY',
  //   objetivo_de_actividad: '',
  //   descripcion_evaluacion: '',
  //   justificacion_modificacion: '',
  //   datos_actividad: null,
  //   proceso: null,
  //   resultado_og: null,
  //   resultado_oe: null,
  //   producto_oe: idCurrentNode,
  // }
  const act = {
    codigo: 'ACT',
    descripcion: '',
    supuestos: '',
    riesgos: '',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    fecha_programada: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    presupuestoGlobal: null,
    procedencia_fondos: null,
    estado: 'CRD',
    proceso: null,
    resultado_og: null,
    resultado_oe: null,
    producto_oe: idCurrentNode,
    objetivo_pei: null,
    indicador_pei: null,
    proyecto: idProyecto,
    responsable: null,
    tipo: [],
  }
  try {
    await crearActividad(act)
    console.log(actividad)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Actividad Prod. OE',
        type: 'actividadpoe',
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
          responsable: actividad.value.responsable,
          proyecto: actividad.value.proyecto,
        },
      },
    }
    emit('addActividadProdOE', payload)
  } catch (err) {
    console.error('Eror al crear', err)
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
