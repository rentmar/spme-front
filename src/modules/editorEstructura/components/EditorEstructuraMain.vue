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
  <VueFlow ref="vueFlowRef" :nodes="nodos" :edges="conectores" :minZoom="0.1" :maxZoom="2">
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
        @addEfecto="(payload) => ejecutarAccion('addEfecto', payload)"
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
    <!-- Nodo Efecto Proyecto-->
    <template #node-efecto="nodeProps">
      <EfectoNodo v-bind="nodeProps"></EfectoNodo>
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
  <!-- Modal para administrar financiadores -->
  <v-dialog v-model="mostrarModalFinanciadores" max-width="800">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">Administrar Financiadores</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="mostrarModalFinanciadores = false" variant="text" class="text-white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <!-- Aquí puedes incluir tu componente de administración de financiadores -->
        <ProcedenciaFondosLista></ProcedenciaFondosLista>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="mostrarModalFinanciadores = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
import ProcedenciaFondosLista from '@/modules/procedenciaFondos/components/ProcedenciaFondosLista.vue'
import EfectoNodo from './nodos/EfectoNodo.vue'
//Manejador de eventos
import useNodeEvents from '../composables/useNodeEvents'
//Exportaciones
import { toJpeg, toPng, toSvg } from 'html-to-image'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
//Composable de snackbars
import { useSnackbar } from '@/composables/useSnackbar'

//Capturar la inyeccion de datos
const proyecto = inject('proyectoEstructura')
const mostrarModalFinanciadores = ref(false)

//Nodos antes del layout
const rawNodes = ref([])
const rawEdges = ref([])

//Nodos y Edges
const nodos = ref([])
const conectores = ref([])

//Inicializar el composable
// eslint-disable-next-line no-unused-vars
const { fitView, onNodeDoubleClick, getNodes, getEdges, addNodes, removeNodes } = useVueFlow()

//Inicializar los snackbars
const { successMsg } = useSnackbar()

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
// En los métodos
const abrirModalFinanciadores = () => {
  mostrarModalFinanciadores.value = true
}

/**** MENSAJES ****/
const mostrarMensaje = ref(false)

watch(mensajeRecibido, (nuevo) => {
  mostrarMensaje.value = !!nuevo
})
const toolbarButtons = computed(() => [
  {
    icon: 'mdi-bank-plus',
    color: 'primary',
    tooltip: 'Administrar financiadores',
    action: abrirModalFinanciadores,
  },
  {
    icon: 'mdi-fit-to-page',
    color: 'info',
    tooltip: 'Ajustar vista',
    action: () => fitView(),
  },
  {
    icon: 'mdi-image',
    color: 'purple',
    tooltip: 'Exportar a PNG',
    action: () => exportDiagram('png'),
  },
  {
    icon: 'mdi-image',
    color: 'green',
    tooltip: 'Exportar a JPEG',
    action: () => exportDiagram('jpeg'),
  },
  {
    icon: 'mdi-file-pdf-box',
    color: 'red',
    tooltip: 'Exportar a PDF',
    action: exportToPDF,
  },
  {
    icon: 'mdi-microsoft-excel',
    color: 'green',
    tooltip: 'Exportar a Excel',
    action: exportToExcel,
  },
  {
    icon: 'mdi-code-json',
    color: 'amber',
    tooltip: 'Exportar a JSON',
    action: exportToJSON,
  },
  {
    icon: 'mdi-graphql', // O usa 'mdi-xml' si prefieres
    color: 'orange',
    tooltip: 'Exportar a GraphML',
    action: exportToGraphML,
  },
])

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
  efecto: defineAsyncComponent(() => import('./nodosFormularios/EfectoNodoForm.vue')),

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
  //alert('actualizar')
  successMsg('Operacion completada con exito')
  console.log(nuevosDatos)
  //nodoSeleccionado.value.data = { ...nodoSeleccionado.value.data, ...nuevosDatos }
  //nodoSeleccionado.value = null // Cierra el panel después de guardar
}

//ELiminar nodo
const eliminarNodo = () => {}

/******************** RUTINAS DE EXPORTACIONES ************************/
const vueFlowRef = ref(null)
const exportDiagram = async (type = 'png') => {
  const vueFlowInstance = vueFlowRef.value

  if (!vueFlowInstance) {
    console.error('No se pudo acceder al contenedor del diagrama')
    return
  }

  try {
    const element = vueFlowInstance.$el
    const options = {
      backgroundColor: '#ffffff',
      quality: 0.95, // Solo aplica para JPEG
      pixelRatio: 2, // Mejor calidad para dispositivos HiDPI
      filter: (node) => {
        // Excluir elementos que no queremos en la exportación
        return !(
          node.classList?.contains('vue-flow__controls') ||
          node.classList?.contains('vue-flow__minimap') ||
          node.classList?.contains('tool-panel')
        )
      },
    }

    let imageData
    switch (type) {
      case 'png':
        imageData = await toPng(element, options)
        break
      case 'jpeg':
        imageData = await toJpeg(element, options)
        break
      case 'svg':
        imageData = await toSvg(element, options)
        break
      default:
        throw new Error(`Tipo de exportación no soportado: ${type}`)
    }

    const link = document.createElement('a')
    link.href = imageData
    link.download = `diagrama-${new Date().toISOString().slice(0, 10)}.${type}`
    link.click()
  } catch (err) {
    console.error('Error al exportar diagrama:', err)
    alert(`Error al exportar: ${err.message}`)
  }
}
const exportToPDF = async () => {
  const vueFlowInstance = vueFlowRef.value

  if (!vueFlowInstance) {
    console.error('No se pudo acceder al contenedor del diagrama')
    return
  }

  try {
    // Mostrar mensaje de carga
    mostrarMensaje.value = true
    mensajeRecibido.value = 'Generando PDF, por favor espere...'

    const element = vueFlowInstance.$el
    const options = {
      backgroundColor: '#ffffff',
      pixelRatio: 2, // Mejor calidad
      filter: (node) => {
        // Excluir elementos que no queremos en la exportación
        return !(
          node.classList?.contains('vue-flow__controls') ||
          node.classList?.contains('vue-flow__minimap') ||
          node.classList?.contains('tool-panel')
        )
      },
    }

    // Generar imagen PNG
    const imageData = await toPng(element, options)

    // Crear PDF
    const pdf = new jsPDF({
      orientation: 'landscape', // o 'portrait' según necesites
      unit: 'mm',
    })

    // Tamaño de la página A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Añadir imagen al PDF
    const imgProps = pdf.getImageProperties(imageData)
    const imgWidth = pageWidth - 20 // Margen de 10mm cada lado
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width

    // Centrar la imagen en la página
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight)

    // Guardar PDF
    pdf.save(`diagrama-${new Date().toISOString().slice(0, 10)}.pdf`)

    // Ocultar mensaje
    mostrarMensaje.value = false
  } catch (err) {
    console.error('Error al exportar a PDF:', err)
    mensajeRecibido.value = `Error al generar PDF: ${err.message}`
    setTimeout(() => {
      mostrarMensaje.value = false
    }, 5000)
  }
}

const exportToExcel = () => {
  try {
    mostrarMensaje.value = true
    mensajeRecibido.value = 'Generando Excel, por favor espere...'

    const wb = XLSX.utils.book_new()

    // 1. Hoja de información del proyecto
    if (proyecto.value) {
      const proyectoData = [
        ['INFORMACIÓN DEL PROYECTO'],
        ['Código', proyecto.value.codigo || ''],
        ['Nombre', proyecto.value.nombre || ''],
        ['Descripción', proyecto.value.descripcion || ''],
        ['Fecha creación', proyecto.value.createdAt || ''],
        ['Última actualización', proyecto.value.updatedAt || ''],
      ]

      const wsProyecto = XLSX.utils.aoa_to_sheet(proyectoData)
      XLSX.utils.book_append_sheet(wb, wsProyecto, 'Proyecto')
    }

    // 2. Hoja de nodos
    const nodesData = [
      ['NODOS DEL DIAGRAMA'],
      ['ID', 'Tipo', 'Título', 'Descripción', 'Fecha creación'],
    ]

    getNodes.value.forEach((node) => {
      nodesData.push([
        node.id,
        node.type || '',
        node.data?.title || '',
        node.data?.description || '',
        node.data?.createdAt || '',
      ])
    })

    const wsNodes = XLSX.utils.aoa_to_sheet(nodesData)
    XLSX.utils.book_append_sheet(wb, wsNodes, 'Nodos')

    // 3. Hoja de conexiones
    const edgesData = [['CONEXIONES'], ['ID', 'Origen', 'Destino', 'Tipo', 'Etiqueta']]

    getEdges.value.forEach((edge) => {
      edgesData.push([edge.id, edge.source, edge.target, edge.type || '', edge.label || ''])
    })

    const wsEdges = XLSX.utils.aoa_to_sheet(edgesData)
    XLSX.utils.book_append_sheet(wb, wsEdges, 'Conexiones')

    // Generar archivo Excel
    XLSX.writeFile(
      wb,
      `diagrama-${proyecto.value?.codigo || 'proyecto'}-${new Date().toISOString().slice(0, 10)}.xlsx`,
    )

    mostrarMensaje.value = false
  } catch (err) {
    console.error('Error al exportar a Excel:', err)
    mensajeRecibido.value = `Error al generar Excel: ${err.message}`
    setTimeout(() => {
      mostrarMensaje.value = false
    }, 5000)
  }
}

const exportToJSON = (options = {}) => {
  try {
    mostrarMensaje.value = true
    mensajeRecibido.value = 'Generando JSON, por favor espere...'

    // Opciones por defecto
    const defaultOptions = {
      prettyPrint: true,
      includeMetadata: true,
      includeProjectInfo: true,
      includeDiagramData: true,
      customFileName: null,
    }

    const finalOptions = { ...defaultOptions, ...options }

    // Construir el objeto de exportación
    const exportData = {}

    // 1. Metadatos
    if (finalOptions.includeMetadata) {
      exportData.metadata = {
        exportedAt: new Date().toISOString(),
        exportTool: 'Vue Flow Diagram Exporter',
        version: '1.1',
      }
    }

    // 2. Información del proyecto
    if (finalOptions.includeProjectInfo && proyecto.value) {
      exportData.proyecto = {
        id: proyecto.value.id,
        codigo: proyecto.value.codigo,
        nombre: proyecto.value.nombre,
        descripcion: proyecto.value.descripcion,
        createdAt: proyecto.value.createdAt,
        updatedAt: proyecto.value.updatedAt,
      }
    }

    // 3. Datos del diagrama
    if (finalOptions.includeDiagramData) {
      exportData.diagrama = {
        nodos: getNodes.value.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
          hidden: node.hidden,
          selected: node.selected,
          dragging: node.dragging,
          zIndex: node.zIndex,
        })),
        edges: getEdges.value.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type,
          label: edge.label,
          animated: edge.animated,
          data: edge.data,
          hidden: edge.hidden,
          selected: edge.selected,
        })),
        viewport: {
          x: vueFlowRef.value?.viewport.x || 0,
          y: vueFlowRef.value?.viewport.y || 0,
          zoom: vueFlowRef.value?.viewport.zoom || 1,
        },
      }
    }

    // Convertir a JSON
    const jsonString = finalOptions.prettyPrint
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData)

    // Crear y descargar archivo
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const fileName =
      finalOptions.customFileName ||
      `diagrama-${proyecto.value?.codigo || 'proyecto'}-${new Date().toISOString().slice(0, 10)}.json`

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()

    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      mostrarMensaje.value = false
    }, 100)
  } catch (err) {
    console.error('Error al exportar a JSON:', err)
    mensajeRecibido.value = `Error al generar JSON: ${err.message}`
    setTimeout(() => {
      mostrarMensaje.value = false
    }, 5000)
  }
}
const exportToGraphML = () => {
  try {
    mostrarMensaje.value = true
    mensajeRecibido.value = 'Generando GraphML, por favor espere...'

    // Crear documento XML
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(
      '<?xml version="1.0" encoding="UTF-8"?><graphml xmlns="http://graphml.graphdrawing.org/xmlns"></graphml>',
      'application/xml',
    )
    const graphml = xmlDoc.documentElement

    // Definir atributos para nodos y aristas
    const keyId = xmlDoc.createElement('key')
    keyId.setAttribute('id', 'd0')
    keyId.setAttribute('for', 'node')
    keyId.setAttribute('attr.name', 'tipo')
    keyId.setAttribute('attr.type', 'string')
    graphml.appendChild(keyId)

    // Crear elemento <graph>
    const graph = xmlDoc.createElement('graph')
    graph.setAttribute('id', 'G')
    graph.setAttribute('edgedefault', 'directed')
    graphml.appendChild(graph)

    // Agregar nodos
    getNodes.value.forEach((node) => {
      const nodeElement = xmlDoc.createElement('node')
      nodeElement.setAttribute('id', node.id)

      const data = xmlDoc.createElement('data')
      data.setAttribute('key', 'd0')
      data.textContent = node.type || 'unknown'
      nodeElement.appendChild(data)

      // Opcional: Agregar más atributos (título, descripción)
      if (node.data?.title) {
        const keyTitle = xmlDoc.createElement('key')
        keyTitle.setAttribute('id', 'd1')
        keyTitle.setAttribute('for', 'node')
        keyTitle.setAttribute('attr.name', 'titulo')
        keyTitle.setAttribute('attr.type', 'string')
        graphml.insertBefore(keyTitle, graph)

        const titleData = xmlDoc.createElement('data')
        titleData.setAttribute('key', 'd1')
        titleData.textContent = node.data.title
        nodeElement.appendChild(titleData)
      }

      graph.appendChild(nodeElement)
    })

    // Agregar aristas (conexiones)
    getEdges.value.forEach((edge) => {
      const edgeElement = xmlDoc.createElement('edge')
      edgeElement.setAttribute('source', edge.source)
      edgeElement.setAttribute('target', edge.target)
      edgeElement.setAttribute('id', edge.id)
      graph.appendChild(edgeElement)
    })

    // Serializar a string
    const serializer = new XMLSerializer()
    const xmlString = serializer.serializeToString(xmlDoc)

    // Crear y descargar archivo
    const blob = new Blob([xmlString], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagrama-${proyecto.value?.codigo || 'proyecto'}-${new Date().toISOString().slice(0, 10)}.graphml`
    document.body.appendChild(a)
    a.click()

    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      mostrarMensaje.value = false
    }, 100)
  } catch (err) {
    console.error('Error al exportar a GraphML:', err)
    mensajeRecibido.value = `Error al generar GraphML: ${err.message}`
    setTimeout(() => {
      mostrarMensaje.value = false
    }, 5000)
  }
}
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
