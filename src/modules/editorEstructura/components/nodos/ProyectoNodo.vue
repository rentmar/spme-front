<template>
  <BaseNodo :id="id" :data="data" :show-delete="false" :show-estado="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Código:</strong> {{ datosNodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Título:</strong> {{ datosNodoProyecto.titulo }}</div>
        <div class="mb-1"><strong>Descripción:</strong> {{ datosNodoProyecto.descripcion }}</div>
        <div class="mb-1">
          <strong>Fecha de Inicio:</strong> {{ datosNodoProyecto.fecha_inicio }}
        </div>
        <div class="mb-1">
          <strong>Fecha de Finalización:</strong> {{ datosNodoProyecto.fecha_finalizacion }}
        </div>
        <div class="mb-1"><strong>Presupuesto:</strong> {{ datosNodoProyecto.presupuesto }}</div>
        <div class="mb-1"><strong>Estado:</strong> {{ datosNodoProyecto.estado }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
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
import { Handle } from '@vue-flow/core'
import { reactive, inject } from 'vue'
//COmposables CRUD
import { useObjetivoGeneralProyecto } from '@/modules/proyecto/composables/useObjetivoGeneralProyecto'
import { useObjetivoEspecifico } from '@/modules/proyecto/composables/useObjetivoEspecifico'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Estado de datos
const datosNodoProyecto = reactive(props.data.datosNodo || {})
//console.log(datosNodoProyecto.id.toString())

//Composable del diagram
//const { findNode } = useVueFlow()
//Composable de objetivos especificos
const { objetivoGeneral, error, addObjetivoGeneral } = useObjetivoGeneralProyecto()
const { objetivoEspecifico, crearObjetivoEspecifico } = useObjetivoEspecifico()

const proyectoEstructura = inject('proyectoEstructura')

const mapaNodoId = proyectoEstructura.value.mapa_nodo.id
// console.log('ID DEL MAPA')
// console.log(mapaNodoId)

//Eventos que el ProyectoNodo puede emitir
const emit = defineEmits(['addObjetivoGeneral', 'addObjetivoEspecifico'])

//Agregar Objetivo General
const agregarObjetivoGeneral = async () => {
  const objGral = {
    codigo: 'OO',
    descripcion: 'desc og',
    supuestos: 'sup og',
    riesgos: 'ries og',
    proyecto: datosNodoProyecto.id.toString(),
  }
  try {
    await addObjetivoGeneral(objGral)
    const payload = {
      sourceId: '1',
      meta: {
        label: 'Objetivo General',
        type: 'objetivogeneral',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: objetivoGeneral.value.id,
          codigo: objetivoGeneral.value.codigo,
          descripcion: objetivoGeneral.value.descripcion,
          supuestos: objetivoGeneral.value.supuestos,
          riesgos: objetivoGeneral.value.riesgos,
          proyecto: objetivoGeneral.value.proyecto,
        },
      },
    }
    emit('addObjetivoGeneral', payload)
  } catch (err) {
    error.value = err
    console.log('Error al crear el objetivo', error)
  }
}

//Agregar Objetivo Especifico
const agregarObjetivoEspecifico = async () => {
  const objEspOg = {
    codigo: 'SPO',
    descripcion: '',
    supuestos: '',
    riesgos: '',
    proyecto: datosNodoProyecto.id.toString(),
    objetivo_general: null,
  }

  try {
    await crearObjetivoEspecifico(objEspOg)
    // console.log(objetivoEspecifico)
    const payload = {
      sourceId: '1',
      meta: {
        label: 'Objetivo Especifico',
        type: 'objetivoespecifico',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: objetivoEspecifico.value.id,
          codigo: objetivoEspecifico.value.codigo,
          descripcion: objetivoEspecifico.value.descripcion,
          supuestos: objetivoEspecifico.value.supuestos,
          riesgos: objetivoEspecifico.value.riesgos,
          proyecto: objetivoEspecifico.value.proyecto,
          objetivo_general: objetivoEspecifico.value.objetivo_general,
        },
      },
    }
    emit('addObjetivoEspecifico', payload)
  } catch (err) {
    console.log('Error ' + err)
  }
}

/* Estilos */
//Estilos
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
