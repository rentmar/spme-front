<template>
  <!-- Banner superior -->
  <transition name="fade-slide-down">
    <div v-if="mostrarMensaje" class="banner-superior">
      <v-icon left small color="white">mdi-information</v-icon>
      <span class="ml-2">{{ mensajeRecibido }}</span>
      <v-btn icon variant="text" @click="mostrarMensaje = false" size="x-small">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>
  </transition>
  <VueFlow :nodes="nodos" :edges="conectores" :minZoom="0.1" :maxZoom="2">
    <div class="project-overlay">
      <div class="project-metadata">
        <h3>Proyecto</h3>
        <p v-if="proyecto">Codigo: {{ proyecto.codigo }}</p>
      </div>
    </div>

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
        @addObjetivoEspecificoOg="(payload) => ejecutarAccion('addObjetivoEspecificoOg', payload)"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></ObjetivogeneralNodo>
    </template>
    <!--Nodo Objetivo Especifico-->
    <template #node-objetivoespecifico="nodeProps">
      <ObjetivoespecificoNodo
        v-bind="nodeProps"
        @addIndicadorOE="(payload) => ejecutarAccion('addIndicadorOE', payload)"
        @addResultadoOE="(payload) => ejecutarAccion('addResultadoOE', payload)"
        @addProductoOE="(payload) => ejecutarAccion('addProductoOE', payload)"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></ObjetivoespecificoNodo>
    </template>
    <!-- Nodo Objetivo Especifico relacionado al Objetivo General-->
    <template #node-objetivoespecificoog="nodeProps">
      <ObjetivoespecificoOGNodo
        v-bind="nodeProps"
        @addIndicadorOE="(payload) => ejecutarAccion('addIndicadorOE', payload)"
        @addResultadoOE="(payload) => ejecutarAccion('addResultadoOE', payload)"
        @addProductoOE="(payload) => ejecutarAccion('addProductoOE', payload)"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></ObjetivoespecificoOGNodo>
    </template>
    <!--Nodo KPI-->
    <template #node-kpi="nodeProps">
      <KpiNodo v-bind="nodeProps"></KpiNodo>
    </template>
    <!--Indicador de Objetivo general-->
    <template #node-indicadorog="nodeProps">
      <IndicadorObjgeneralNodo
        v-bind="nodeProps"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></IndicadorObjgeneralNodo>
    </template>
    <!--Indicador de Objetivo especifico-->
    <template #node-indicadoroe="nodeProps">
      <IndicadorObjespecifico
        v-bind="nodeProps"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></IndicadorObjespecifico>
    </template>
    <!--Resultado de Objetivo especifico-->
    <template #node-resultadoog="nodeProps">
      <ResultadoObjgeneralNodo
        v-bind="nodeProps"
        @addIndicadorResultadoOg="(payload) => ejecutarAccion('addIndicadorResultadoOg', payload)"
        @addProcesosResultadoOg="(payload) => ejecutarAccion('addProcesosResultadoOg', payload)"
        @addActividadResOG="(payload) => ejecutarAccion('addActividadResOG', payload)"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></ResultadoObjgeneralNodo>
    </template>
    <!-- Resultado de Objetivo Especifico -->
    <template #node-resultadooe="nodeProps">
      <ResultadoObjetivoEspecifico
        v-bind="nodeProps"
        @addIndicadorResultadoOE="(payload) => ejecutarAccion('addIndicadorResultadoOE', payload)"
        @addProductoResultadoOE="(payload) => ejecutarAccion('addProductoResultadoOE', payload)"
        @addProcesosResultadoOE="(payload) => ejecutarAccion('addProcesosResultadoOE', payload)"
        @addActividadResOE="(payload) => ejecutarAccion('addActividadResOE', payload)"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></ResultadoObjetivoEspecifico>
    </template>
    <!-- Resultado de Objetivo Especifico -->
    <template #node-productooe="nodeProps">
      <ProductoObjEspecifico
        v-bind="nodeProps"
        @addProcesoProductoOE="(payload) => ejecutarAccion('addProcesoProductoOE', payload)"
        @addActividadProdOE="(payload) => ejecutarAccion('addActividadProdOE', payload)"
      ></ProductoObjEspecifico>
    </template>
    <!-- Producto del Resultado Objetivo Especifico-->
    <template #node-productoroe="nodeProps">
      <ProductoResultadoObjEspecifico v-bind="nodeProps"></ProductoResultadoObjEspecifico>
    </template>
    <!-- Indicador del Resultado Objetivo Especifico-->
    <template #node-indicadorrog="nodeProps">
      <IndicadorResultadoObjGeneral
        v-bind="nodeProps"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></IndicadorResultadoObjGeneral>
    </template>
    <template #node-indicadorroe="nodeProps">
      <IndicadorResultadoObjEspecifico
        v-bind="nodeProps"
        @addProducto="(payload) => ejecutarAccion('addProducto', payload)"
      ></IndicadorResultadoObjEspecifico>
    </template>
    <template #node-procesorog="nodeProps">
      <ProcesoResultadoObjGeneral
        @addActividadProcesoResOG="(payload) => ejecutarAccion('addActividadProcesoResOG', payload)"
        v-bind="nodeProps"
      ></ProcesoResultadoObjGeneral>
    </template>
    <template #node-procesoroe="nodeProps">
      <ProcesoResultadoObjEspec
        v-bind="nodeProps"
        @addActividadProcResOE="(payload) => ejecutarAccion('addActividadProcResOE', payload)"
      ></ProcesoResultadoObjEspec>
    </template>
    <template #node-procesopoe="nodeProps">
      <ProcesoProductoObjEspec
        v-bind="nodeProps"
        @addActividadProcProdOE="(payload) => ejecutarAccion('addActividadProcProdOE', payload)"
      ></ProcesoProductoObjEspec>
    </template>
    <!--Nodo Actividad Resultado OG-->
    <template #node-actividadrog="nodeProps">
      <ActividadRogNodo v-bind="nodeProps"></ActividadRogNodo>
    </template>
    <!--Nodo Actividad Producto OE-->
    <template #node-actividadpoe="nodeProps">
      <ActividadPoeNodo v-bind="nodeProps"></ActividadPoeNodo>
    </template>
    <!--Nodo Actividad Resultado OE-->
    <template #node-actividadroe="nodeProps">
      <ActividadRoeNodo v-bind="nodeProps"></ActividadRoeNodo>
    </template>
    <!--Nodo Actividad -->
    <template #node-actividad="nodeProps">
      <ActividadNodo v-bind="nodeProps"></ActividadNodo>
    </template>
    <!-- Nodo Producto General -->
    <template #node-productogral="nodeProps">
      <ProductoNodo v-bind="nodeProps"></ProductoNodo>
    </template>

    <Panel position="top-right" class="tool-panel">
      <!-- Barra de título -->
      <v-toolbar color="primary" density="compact" class="panel-header">
        <v-toolbar-title class="text-white">Herramientas</v-toolbar-title>
      </v-toolbar>

      <!-- Barra de botones circulares -->
      <v-toolbar density="compact" class="button-bar">
        <v-tooltip
          v-for="btn in toolbarButtons"
          :key="btn.icon"
          :text="btn.tooltip"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="btn.icon"
              :color="btn.color"
              variant="flat"
              size="small"
              class="ma-1 circular-btn"
              @click="btn.action"
            />
          </template>
        </v-tooltip>
      </v-toolbar>

      <!-- Panel de edición condicional -->
      <v-expand-transition>
        <v-card v-if="nodoSeleccionado" class="node-editor" elevation="8">
          <v-toolbar color="primary" density="compact" class="panel-header">
            <v-toolbar-title class="text-white">Editar Nodo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" @click="nodoSeleccionado = null" class="text-white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text class="pa-4" style="max-height: 80vh; overflow: auto">
            <component
              :is="formularioActual"
              v-if="formularioActual"
              :node="nodoSeleccionado"
              @guardar="actualizarNodo"
              @cancelar="nodoSeleccionado = null"
              @eliminar="eliminarNodo"
            />

            <v-alert v-else type="info">
              No hay formulario disponible para este tipo de nodo
            </v-alert>
            <!-- <v-list density="compact" class="transparent">
              <v-list-item v-for="(value, key) in nodoSeleccionado.data" :key="key" class="px-0">
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-circle-small</v-icon>
                </template>
                <v-list-item-title class="info-label">{{ formatLabel(key) }}</v-list-item-title>
                <v-list-item-subtitle class="info-value">{{ value }}</v-list-item-subtitle>
              </v-list-item>
            </v-list> -->
          </v-card-text>

          <!-- <v-card-actions class="px-4 pb-4 pt-0">
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              class="action-btn"
              @click="editNode(nodoSeleccionado)"
            >
              <v-icon start size="small">mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn
              color="error"
              variant="tonal"
              size="small"
              class="action-btn ml-2"
              @click="deleteNode(nodoSeleccionado)"
            >
              <v-icon start size="small">mdi-delete</v-icon>
              Eliminar
            </v-btn> -->
          <!-- </v-card-actions> -->
        </v-card>
      </v-expand-transition>
    </Panel>
    <!-- <ControlMenuDiagrama></ControlMenuDiagrama> -->
    <Background variant="lines"></Background>
    <MiniMap pannable zoomable mask-color="rgb(0, 0, 0, 0.7)"></MiniMap>
    <Controls position="left"> </Controls>
  </VueFlow>
  <!-- {{ proyecto }}<br /><br />{{ getNodes }}<br /><br />{{ getEdges }} -->
</template>

<script setup>
import { ref, onMounted, inject, watch, computed, defineAsyncComponent } from 'vue'
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
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
//Layout
import { layoutGraph } from '../utils/dagreLayout'
//Nodos
import ProyectoNodo from './nodos/ProyectoNodo.vue'
import ObjetivogeneralNodo from './nodos/ObjetivogeneralNodo.vue'
import ObjetivoespecificoNodo from './nodos/ObjetivoespecificoNodo.vue'
import ObjetivoespecificoOGNodo from './nodos/ObjetivoespecificoOGNodo.vue'
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
import ActividadNodo from './nodos/ActividadNodo.vue'
import ActividadRogNodo from './nodos/ActividadRogNodo.vue'
import ActividadPoeNodo from './nodos/ActividadPoeNodo.vue'
import ActividadRoeNodo from './nodos/ActividadRoeNodo.vue'
import ProductoNodo from './nodos/ProductoNodo.vue'
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
// eslint-disable-next-line no-unused-vars
const { fitView, onNodeDoubleClick, getNodes, getEdges, addNodes, removeNodes } = useVueFlow()

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

/**** MENSAJES ****/
const mostrarMensaje = ref(false)

watch(mensajeRecibido, (nuevo) => {
  mostrarMensaje.value = !!nuevo
})
const toolbarButtons = computed(() => [
  {
    icon: 'mdi-plus',
    color: 'success',
  },
  {
    icon: 'mdi-delete',
    color: 'error',
    //action: () => selectedNode.value && removeNodes([selectedNode.value.id]),
  },
  {
    icon: 'mdi-fit-to-page',
    color: 'info',
    action: () => fitView(),
  },
])

const formatLabel = (key) => {
  return key
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
}

// Mapeo de tipos de nodo a componentes de formulario
const formulariosPorTipo = {
  proyecto: defineAsyncComponent(() => import('./nodosFormularios/ProyectoNodoForm.vue')),
  kpi: defineAsyncComponent(() => import('./nodosFormularios/KpiNodoForm.vue')),
  objetivogeneral: defineAsyncComponent(
    () => import('./nodosFormularios/ObjetivoGralNodoForm.vue'),
  ),
  objetivoespecifico: defineAsyncComponent(
    () => import('./nodosFormularios/ObjetivoEspecNodoForm.vue'),
  ),
  objetivoespecificoog: defineAsyncComponent(
    () => import('./nodosFormularios/ObjetivoEspecOgNodoForm.vue'),
  ),
  indicadorog: defineAsyncComponent(() => import('./nodosFormularios/IndicadorOgNodoForm.vue')),
  indicadoroe: defineAsyncComponent(() => import('./nodosFormularios/IndicadorOeNodoForm.vue')),
  resultadoog: defineAsyncComponent(() => import('./nodosFormularios/ResultadoOgNodoForm.vue')),
  resultadooe: defineAsyncComponent(() => import('./nodosFormularios/ResultadoOeNodoForm.vue')),
  productooe: defineAsyncComponent(() => import('./nodosFormularios/ProductoOeNodoForm.vue')),
  productoroe: defineAsyncComponent(
    () => import('./nodosFormularios/ProductoResultOeNodoForm.vue'),
  ),
  indicadorrog: defineAsyncComponent(() => import('./nodosFormularios/IndicadorResOgNodoForm.vue')),
  indicadorroe: defineAsyncComponent(() => import('./nodosFormularios/IndicadorResOeNodoForm.vue')),
  procesorog: defineAsyncComponent(
    () => import('./nodosFormularios/ProcesoResultadoOgNodoForm.vue'),
  ),
  procesoroe: defineAsyncComponent(
    () => import('./nodosFormularios/ProcesoResultadoOeNodoForm.vue'),
  ),
  procesopoe: defineAsyncComponent(() => import('./nodosFormularios/ProcesoProdOeNodoForm.vue')),
  actividadrog: defineAsyncComponent(() => import('./nodosFormularios/ActividadResOgNodoForm.vue')),
  actividadpoe: defineAsyncComponent(
    () => import('./nodosFormularios/ActividadProdOeNodoForm.vue'),
  ),
  actividadroe: defineAsyncComponent(
    () => import('./nodosFormularios/ActividadResulOeNodoForm.vue'),
  ),
  actividad: defineAsyncComponent(() => import('./nodosFormularios/ActividadNodoForm.vue')),
  productogral: defineAsyncComponent(() => import('./nodosFormularios/ProductoGralNodo.vue')),

  //proyecto: defineAsyncComponent(() => import('./nodos/formularios/ProyectoForm.vue')),
  // Agrega más tipos según necesites
}

// Determina el formulario a mostrar basado en el tipo de nodo
const formularioActual = computed(() => {
  if (!nodoSeleccionado.value) return null
  return formulariosPorTipo[nodoSeleccionado.value.type] || null
})

// Función para actualizar el nodo
const actualizarNodo = (nuevosDatos) => {
  alert('actualizar')
  console.log(nuevosDatos)
  //nodoSeleccionado.value.data = { ...nodoSeleccionado.value.data, ...nuevosDatos }
  //nodoSeleccionado.value = null // Cierra el panel después de guardar
}

//ELiminar nodo
const eliminarNodo = () => {}
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
  width: 800px;
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
/* MENSAJES */
.banner-superior {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #91d219;
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  z-index: 10000;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Transición para el banner */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/** Panel de edicion*/
.tool-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 400px;
}

.button-bar {
  padding: 8px;
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
}

.circular-btn {
  border-radius: 50%;
  transition: all 0.3s ease;
}

.circular-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.node-editor {
  margin: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.info-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.8rem;
}

.info-value {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.9rem;
  word-break: break-word;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.v-list-item {
  min-height: 36px;
}

.v-list-item__prepend {
  margin-right: 8px;
}
</style>
