<template>
  <VueFlow :nodes="nodos" :edges="edges">
    <div class="project-overlay">
      <div class="project-metadata">
        <h3>Proyecto</h3>
        <p>Código: {{ props.nuevoProyecto?.codigo || 'COD PROY' }}</p>
      </div>
    </div>
    <ControlMenuDiagrama></ControlMenuDiagrama>
    <Background variant="lines"></Background>
    <MiniMap pannable zoomable mask-color="rgb(0, 0, 0, 0.7)"></MiniMap>
    <Controls> </Controls>
  </VueFlow>
  <br /><br /><br />
  <h3>Nodos</h3>
  {{ nodos }}
  <h3>Objetivo General</h3>

  {{ objetivoGeneral }}
  <h3>Proyecto</h3>

  {{ nuevoProyecto }}
</template>

<script setup>
import { VueFlow } from '@vue-flow/core'
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
import ControlMenuDiagrama from './partials/ControlMenuDiagrama.vue'
//Store
import { useNodosStore } from '../store/useNodosStore'
import { storeToRefs } from 'pinia'
import { watch, onMounted } from 'vue'
//composable de los objetivos especificos
import { useObjetivoGeneralProyecto } from '../composables/useObjetivoGeneralProyecto'

//Los props del componente
const props = defineProps({
  nuevoProyecto: {
    type: Object,
    required: true,
    default: () => ({
      id: 'temp-id',
      codigo: 'SIN-CODIGO',
      titulo: 'Proyecto no cargado',
    }),
    validator: (value) => {
      return value !== null && typeof value === 'object' && 'codigo' in value && 'titulo' in value
    },
  },
})

//Inicializar el store
const nodosStore = useNodosStore()

//Des estructurar el store
const { nodos, edges } = storeToRefs(nodosStore)

//Objetivo especifico - composbale
const { objetivoGeneral } = useObjetivoGeneralProyecto()

onMounted(async () => {
  nodosStore.actualizarProyecto(props.nuevoProyecto)
})

// Watcher para actualizar cuando lleguen nuevos datos
watch(
  () => props.nuevoProyecto,
  (nuevoProyecto) => {
    if (nuevoProyecto) {
      nodosStore.actualizarProyecto(nuevoProyecto)
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.project-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
}
</style>
