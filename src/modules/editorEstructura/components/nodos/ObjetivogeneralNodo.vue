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
      <v-list-item class="custom-menu-item" @click="agregarObjetivoEspecificoOg">
        <v-list-item-title>Agregar Objetivo Especifico</v-list-item-title>
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
import { Handle } from '@vue-flow/core'
import { useVueFlow } from '@vue-flow/core'
import { reactive, inject } from 'vue'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useResultados } from '@/modules/proyecto/composables/useResultados'
import { useObjetivoEspecifico } from '@/modules/proyecto/composables/useObjetivoEspecifico'
import { useKpis } from '@/modules/proyecto/composables/useKpis'
import { useProductos } from '@/modules/proyecto/composables/useProductos'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Composables
const { productoGral, crearProductoGeneral } = useProductos()
const { crearIndicadorObjetivoGeneral, indicadorObjGeneral, error } = useIndicadores() //indicadores
const { resultadoOg, crearResultadoOg } = useResultados() //Resultados
const { objetivoEspecifico, crearObjetivoEspecifico, error: errrorOe } = useObjetivoEspecifico()
const { kpi, crearKpi } = useKpis()

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
  'addObjetivoEspecificoOg',
  'addProducto',
])

//Agregar KPI
const agregarKpi = async () => {
  const kpiOg = {
    codigo: 'KPI-',
    descripcion: '',
    objetivo_general: idObjetivoGeneral.toString(),
  }
  try {
    await crearKpi(kpiOg)
    console.log(kpi)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Kpi',
        type: 'kpi',
        mapaNodoId: mapaNodoId.toString(),
        //Datos backend del nodo
        nodoProyecto: {
          id: kpi.value.id,
          codigo: kpi.value.id,
          descripcion: kpi.value.descripcion,
          objetivo_general: kpi.value.objetivo_general,
        },
      },
    }
    emit('addKpi', payload)
  } catch (err) {
    console.error('Error al crear datos Nodo Kpi', err)
  }
  //Emitir el evento
  //emit('addKpi', payload)
}

//Agregar indicador
const agregarIndicadorObjGeneral = async () => {
  const indicadorOg = {
    codigo: 'IND-OG',
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
  //console.log(indicadorOg)

  try {
    await crearIndicadorObjetivoGeneral(indicadorOg)
    console.log(indicadorObjGeneral)
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
    console.log(payload)
    emit('addIndicadorObjGeneral', payload)
  } catch (err) {
    error.value = err
    console.log('Error al crear el objetivo', error)
  }
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
const agregarObjetivoEspecificoOg = async () => {
  const objEspOg = {
    codigo: 'SPO',
    descripcion: '',
    supuestos: '',
    riesgos: '',
    proyecto: null,
    objetivo_general: idObjetivoGeneral,
  }

  try {
    await crearObjetivoEspecifico(objEspOg)
    // console.log(objetivoEspecifico)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Objetivo Especifico OG',
        type: 'objetivoespecificoog',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: objetivoEspecifico.value.id,
          codigo: objetivoEspecifico.value.codigo,
          descripcion: objetivoEspecifico.value.descripcion,
          supuestos: objetivoEspecifico.value.supuestos,
          riesgos: objetivoEspecifico.value.riesgos,
          proyecto: null,
          objetivo_general: objetivoEspecifico.value.objetivo_general,
        },
      },
    }
    emit('addObjetivoEspecificoOg', payload)
  } catch (err) {
    console.log('Error ' + err + 'Error: ' + errrorOe)
  }
}
const agregarProductoGeneral = async () => {
  const ptrGral = {
    codigo: 'PTRG',
    supuestos: '',
    riesgos: '',
    entregado: false,
    objetivo_general: idObjetivoGeneral,
    objetivo_especifico: null,
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
