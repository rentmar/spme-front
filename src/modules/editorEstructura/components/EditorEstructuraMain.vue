<template>
  <VueFlow :nodes="nodos" :edges="conectores" :minZoom="0.1" :maxZoom="2">
    <div class="project-overlay">
      <div class="project-metadata">
        <h3>Proyecto</h3>
        <p v-if="proyecto">Codigo: {{ proyecto.codigo }}</p>
      </div>
    </div>

    <!-- Panel de información del nodo -->
    <v-card class="node-info-panel" :elevation="8" v-if="nodoSeleccionado">
      <v-toolbar>
        <v-toolbar-title>Nodo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="nodoSeleccionado = null" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <h3>Informacion del nodo seleccionado</h3>
        <p>
          {{ nodoSeleccionado }}
        </p>
      </v-card-text>
      <v-card-actions class="px-4 py-3">
        <v-btn color="secondary" small>
          <v-icon left small>mdi-pencil</v-icon>
          Editar
        </v-btn>
        <v-btn color="error" small class="ml-2">
          <v-icon left small>mdi-delete</v-icon>
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>

    <!--Nodo Proyecto-->
    <template #node-proyecto="nodeProps">
      <ProyectoNodo
        v-bind="nodeProps"
        @addObjetivoGeneral="(payload) => ejecutarAccion('addObjetivoGeneral', payload)"
        @addObjetivoEspecifico="(payload) => ejecutarAccion('addObjetivoEspecifico', payload)"
      ></ProyectoNodo>
    </template>
    <!--Nodo Objetivo General-->
    <template #node-objetivogeneral="nodeProps">
      <ObjetivogeneralNodo
        v-bind="nodeProps"
        @addKpi="(payload) => ejecutarAccion('addKpi', payload)"
        @addIndicadorObjGeneral="(payload) => ejecutarAccion('addIndicadorObjGeneral', payload)"
        @addResultadoObjGeneral="(payload) => ejecutarAccion('addResultadoObjGeneral', payload)"
        @addObjetivoEspecifico="(payload) => ejecutarAccion('addObjetivoEspecifico', payload)"
      ></ObjetivogeneralNodo>
    </template>
    <!--Nodo Objetivo Especifico-->
    <template #node-objetivoespecifico="nodeProps">
      <ObjetivoespecificoNodo
        v-bind="nodeProps"
        @addIndicadorOE="(payload) => ejecutarAccion('addIndicadorOE', payload)"
        @addResultadoOE="(payload) => ejecutarAccion('addResultadoOE', payload)"
        @addProductoOE="(payload) => ejecutarAccion('addProductoOE', payload)"
      ></ObjetivoespecificoNodo>
    </template>
    <!--Nodo KPI-->
    <template #node-kpi="nodeProps">
      <KpiNodo v-bind="nodeProps"></KpiNodo>
    </template>
    <!--Indicador de Objetivo general-->
    <template #node-indicadorog="nodeProps">
      <IndicadorObjgeneralNodo v-bind="nodeProps"></IndicadorObjgeneralNodo>
    </template>
    <!--Indicador de Objetivo especifico-->
    <template #node-indicadoroe="nodeProps">
      <IndicadorObjespecifico v-bind="nodeProps"></IndicadorObjespecifico>
    </template>
    <!--Resultado de Objetivo especifico-->
    <template #node-resultadoog="nodeProps">
      <ResultadoObjgeneralNodo v-bind="nodeProps"></ResultadoObjgeneralNodo>
    </template>
    <!-- Resultado de Objetivo Especifico -->
    <template #node-resultadooe="nodeProps">
      <ResultadoObjetivoEspecifico
        v-bind="nodeProps"
        @addIndicadorResultadoOE="(payload) => ejecutarAccion('addIndicadorResultadoOE', payload)"
        @addProductoResultadoOE="(payload) => ejecutarAccion('addProductoResultadoOE', payload)"
        @addProcesosResultadoOE="(payload) => ejecutarAccion('addProcesosResultadoOE', payload)"
      ></ResultadoObjetivoEspecifico>
    </template>
    <!-- Resultado de Objetivo Especifico -->
    <template #node-productooe="nodeProps">
      <ProductoObjEspecifico v-bind="nodeProps"></ProductoObjEspecifico>
    </template>
    <!-- Producto del Resultado Objetivo Especifico-->
    <template #node-productoroe="nodeProps">
      <ProductoResultadoObjEspecifico v-bind="nodeProps"></ProductoResultadoObjEspecifico>
    </template>
    <!-- Indicador del Resultado Objetivo Especifico-->
    <template #node-indicadorrog="nodeProps">
      <IndicadorResultadoObjGeneral v-bind="nodeProps"></IndicadorResultadoObjGeneral>
    </template>
    <template #node-indicadorroe="nodeProps">
      <IndicadorResultadoObjEspecifico v-bind="nodeProps"></IndicadorResultadoObjEspecifico>
    </template>
    <template #node-procesorog="nodeProps">
      <ProcesoResultadoObjGeneral v-bind="nodeProps"></ProcesoResultadoObjGeneral>
    </template>
    <template #node-procesoroe="nodeProps">
      <ProcesoResultadoObjEspec v-bind="nodeProps"></ProcesoResultadoObjEspec>
    </template>
    <template #node-procesopoe="nodeProps">
      <ProcesoProductoObjEspec v-bind="nodeProps"></ProcesoProductoObjEspec>
    </template>
    <ControlMenuDiagrama></ControlMenuDiagrama>
    <Background variant="lines"></Background>
    <MiniMap pannable zoomable mask-color="rgb(0, 0, 0, 0.7)"></MiniMap>
    <Controls position="left"> </Controls>
  </VueFlow>
  {{ mensajeRecibido }}
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
//Background
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
//Minimapa
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/minimap/dist/style.css'
//Controles
import { Controls } from '@vue-flow/controls'
import '@vue-flow/controls/dist/style.css'
import ControlMenuDiagrama from './controles/ControlMenuDiagrama.vue'
//Layout
import { layoutGraph } from '../utils/dagreLayout'
//Nodos
import ProyectoNodo from './nodos/ProyectoNodo.vue'
import ObjetivogeneralNodo from './nodos/ObjetivogeneralNodo.vue'
import ObjetivoespecificoNodo from './nodos/ObjetivoespecificoNodo.vue'
import KpiNodo from './nodos/KpiNodo.vue'
import IndicadorObjgeneralNodo from './nodos/IndicadorObjgeneralNodo.vue'
import IndicadorObjespecifico from './nodos/IndicadorObjespecifico.vue'
import ResultadoObjgeneralNodo from './nodos/ResultadoObjgeneralNodo.vue'
import ResultadoObjetivoEspecifico from './nodos/ResultadoObjetivoEspecifico.vue'
import ProductoObjEspecifico from './nodos/ProductoObjEspecifico.vue'
import ProductoResultadoObjEspecifico from './nodos/ProductoResultadoObjEspecifico.vue'
import IndicadorResultadoObjGeneral from './nodos/IndicadorResultadoObjGeneral.vue'
import IndicadorResultadoObjEspecifico from './nodos/IndicadorResultadoObjEspecifico.vue'
import ProcesoResultadoObjGeneral from './nodos/ProcesoResultadoObjGeneral.vue'
import ProcesoResultadoObjEspec from './nodos/ProcesoResultadoObjEspec.vue'
import ProcesoProductoObjEspec from './nodos/ProcesoProductoObjEspec.vue'
//Manjeador de eventos
import useNodeEvents from '../composables/useNodeEvents'

//Capturar la inyeccion de datos
const proyecto = inject('proyectoEstructura')

//Nodos antes del layout
const rawNodes = ref([])
const rawEdges = ref([])

//Nodos y Edges
const nodos = ref([])
const conectores = ref([])

//Inicializar el composable
const { fitView, onNodeDoubleClick } = useVueFlow()

//Captura del click sobre el nodo
onNodeDoubleClick((event) => {
  console.log(event)
  nodoSeleccionado.value = event.node
  console.log(nodoSeleccionado.value)
})

//Inicializar el manejador de eventos
const { mensaje: mensajeRecibido, executeAccion: ejecutarAccion } = useNodeEvents()

//Hook
onMounted(() => {
  //Cargando los nodos del proyecto
  rawNodes.value = proyecto.value.mapa_nodo.nodos
  rawEdges.value = proyecto.value.mapa_nodo.conexiones

  const result = layoutGraph(rawNodes.value, rawEdges.value, 'TB')
  nodos.value = result.nodes
  conectores.value = result.edges
  setTimeout(() => {
    fitView({ padding: 0.3, maxZoom: 0.5, minZoom: 0.5, duration: 800 })
  }, 100)
})

/****  PANEL DE INFORMACION  ****/
const nodoSeleccionado = ref(null)
</script>
<style scoped>
.project-overlay {
  position: absolute;
  top: 20px;
  left: 50px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
}

/*** Overlay de informacion ***/
.node-info-panel {
  position: absolute;
  top: 150px;
  left: 20px;
  width: 400px;
  max-height: 70vh;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 8px;
}
.panel-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
.panel-content {
  padding: 16px;
}

.info-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.8rem;
  text-transform: capitalize;
}

.info-value {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.9rem;
  word-break: break-word;
  margin-top: 4px;
}

/* Transición suave para la aparición/desaparición */
.v-card {
  transition: all 0.3s ease;
}

/* Ajustes para el scroll */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 0 8px 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Estilos para nodos seleccionados */
.vue-flow__node.selected {
  box-shadow: 0 0 0 2px #1976d2;
}
</style>
