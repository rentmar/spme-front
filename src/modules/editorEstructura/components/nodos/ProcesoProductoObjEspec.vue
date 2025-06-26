<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Titulo:</strong> {{ data.nodoProyecto.titulo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar Producto Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarActividades">
        <v-list-item-title>Agregar Actividad</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-clock-outline'"></v-icon>
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
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Composables
const { actividad, crearActividad } = useActividad()

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrentNode = currentNode.data.nodoProyecto.id

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const emit = defineEmits(['addActividadProcProdOE'])

/* Funciones */
const agregarActividades = async () => {
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
    proceso: idCurrentNode,
    resultado_og: null,
    resultado_oe: null,
    producto_oe: null,
  }
  try {
    await crearActividad(act)
    console.log(actividad)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Actividad Proc. Prod. OE',
        type: 'actividad',
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
    emit('addActividadProcProdOE', payload)
    //emit('addActividadProdOE', payload)
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
