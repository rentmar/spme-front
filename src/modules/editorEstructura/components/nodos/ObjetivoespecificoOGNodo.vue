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
      <!--Agregar Producto General-->
      <!-- <v-list-item class="custom-menu-item" @click="agregarProductoGeneral">
        <v-list-item-title>Agregar Producto</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item> -->
      <!--Agregar Proceso-->
      <v-list-item class="custom-menu-item" @click="agregarProcesoObjEsp">
        <v-list-item-title>Agregar Proceso Objetivo Especifico</v-list-item-title>
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
import { reactive, inject } from 'vue'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useResultados } from '@/modules/proyecto/composables/useResultados'
import { useProductos } from '@/modules/proyecto/composables/useProductos'
import { useProcesos } from '@/modules/proyecto/composables/useProcesos'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

// eslint-disable-next-line no-unused-vars
const datosNodoProyecto = reactive(props.data.datosNodo || {})

//composables
const { indicadorObjetivoEspecifico, crearIndicadorObjEspecifico } = useIndicadores()
const { crearResultadoOe, resultadoOe, error } = useResultados()
const { crearProductoOe, productoOe, productoGral, crearProductoGeneral } = useProductos()
const { procesos, crearProceso } = useProcesos()

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrenNode = currentNode.data.nodoProyecto.id

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

const emit = defineEmits([
  'addIndicadorOE',
  'addResultadoOE',
  'addProductoOE',
  'addProducto',
  'addProcesoOE',
])

/* Funciones */
const agregarIndicadorOE = async () => {
  // const indicadorOe = {
  //   codigo: 'IND001-OESP01',
  //   descripcion: 'des test',
  //   definicion: 'def test',
  //   redaccion: 'GUIA',
  //   fuente_verificacion: '',
  //   target_poblacion: '',
  //   tipo: 'A-Z',
  //   baseline: '',
  //   target_q1: '',
  //   target_q2: '',
  //   target_q3: '',
  //   objetivo_especifico: idCurrenNode.toString(),
  // }
  const indicadorOe = {
    codigo: 'IND00-SPO',
    descripcion: 'Descripcion',
    redaccion: 'GUIA',
    fuente_verificacion: '',
    target_poblacion: '',
    fechaTargetPoblacion: null,
    tipo: 'A-Z',
    frecuencia: 'MENSUAL',
    responsable: '',
    baseline: '',
    fechaLineaBase: null,
    target_q1: '',
    fechaTargetQ1: null,
    target_q2: '',
    fechaTargetQ2: null,
    target_q3: '',
    fechaTargetQ3: null,
    target_q4: null,
    fechaTargetQ4: null,
    objetivo_especifico: idCurrenNode.toString(),
  }

  try {
    await crearIndicadorObjEspecifico(indicadorOe)
    console.log(indicadorObjetivoEspecifico)
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
          descripcion: indicadorObjetivoEspecifico.value.descripcion,
          definicion: indicadorObjetivoEspecifico.value.definicion,
          redaccion: indicadorObjetivoEspecifico.value.redaccion,
          fuente_verificacion: indicadorObjetivoEspecifico.value.fuente_verificacion,
          target_poblacion: indicadorObjetivoEspecifico.value.target_poblacion,
          fechaTargetPoblacion: indicadorObjetivoEspecifico.value.fechaTargetPoblacion,
          tipo: indicadorObjetivoEspecifico.value.tipo,
          frecuencia: indicadorObjetivoEspecifico.value.frecuencia,
          responsable: indicadorObjetivoEspecifico.value.responsable,
          baseline: indicadorObjetivoEspecifico.value.baseline,
          fechaLineaBase: indicadorObjetivoEspecifico.value.fechaLineaBase,
          target_q1: indicadorObjetivoEspecifico.value.target_q1,
          fechaTargetQ1: indicadorObjetivoEspecifico.value.fechaTargetPoblacion,
          target_q2: indicadorObjetivoEspecifico.value.target_q2,
          fechaTargetQ2: indicadorObjetivoEspecifico.value.fechaTargetQ2,
          target_q3: indicadorObjetivoEspecifico.value.target_q3,
          fechaTargetQ3: indicadorObjetivoEspecifico.value.fechaTargetQ3,
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
}

const agregarProductoGeneral = async () => {
  const ptrGral = {
    codigo: 'PTRG',
    supuestos: '',
    riesgos: '',
    entregado: false,
    objetivo_general: null,
    objetivo_especifico: idCurrenNode,
    indicador_og: null,
    indicador_oe: null,
    resultado_og: null,
    resultado_oe: null,
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

//Agregar nodo de Procedo OE
const agregarProcesoObjEsp = async () => {
  const procesoObjEsp = {
    codigo: 'PROC-OE',
    titulo: 'Proceso Objetivo Especifico',
    descripcion: 'Descripcion del Proceso OE',
    resultado_og: null,
    resultado_oe: null,
    producto_oe: null,
    objetivo_especifico: idCurrenNode,
  }
  try {
    console.log(procesoObjEsp)
    await crearProceso(procesoObjEsp)
    console.log('Proceso creado: ', procesos)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Procesos OE',
        type: 'procesooe',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: procesos.value.id,
          codigo: procesos.value.codigo,
          titulo: procesos.value.titulo,
          descripcion: procesos.value.descripcion,
          resultado_og: procesos.value.resultado_og,
          resultado_oe: procesos.value.resultado_oe,
          producto_oe: procesos.value.producto_oe,
          objetivo_especifico: procesos.value.objetivo_especifico,
        },
      },
    }
    emit('addProcesoOE', payload)
  } catch (err) {
    console.error('ERROR AL Crear el NODO: procesooe ', err)
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
