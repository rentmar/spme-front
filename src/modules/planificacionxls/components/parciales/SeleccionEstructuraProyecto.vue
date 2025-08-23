<template>
  <div class="flow-container">
    <div class="flow-controls">
      <!-- <v-btn color="primary" @click="addNode" small class="mr-2">
        <v-icon left>mdi-plus</v-icon>
        Agregar Nodo
      </v-btn>
      <v-btn color="secondary" @click="addEdge" small class="mr-2">
        <v-icon left>mdi-connection</v-icon>
        Conectar Nodos
      </v-btn>
      <v-btn color="error" @click="clearAll" small>
        <v-icon left>mdi-delete</v-icon>
        Limpiar Todo
      </v-btn> -->
    </div>

    <div class="flow-wrapper">
      <VueFlow
        v-model="elements"
        :default-zoom="1.5"
        :min-zoom="0.2"
        :max-zoom="4"
        @node-click="onNodeClick"
        @edge-click="onEdgeClick"
      >
      </VueFlow>
    </div>

    <!-- Panel de información -->
    <v-card v-if="selectedElement" class="info-panel">
      <v-card-title>
        Información del Elemento
        <v-spacer></v-spacer>
        <v-btn icon @click="selectedElement = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="selectedElement.type === 'input' || selectedElement.type === 'default'">
          <h4>Nodo: {{ selectedElement.data?.label }}</h4>
          <p><strong>ID:</strong> {{ selectedElement.id }}</p>
          <p>
            <strong>Posición:</strong> X: {{ selectedElement.position.x }}, Y:
            {{ selectedElement.position.y }}
          </p>
        </div>
        <div v-else-if="selectedElement.type === 'edge'">
          <h4>Conexión</h4>
          <p><strong>Desde:</strong> {{ selectedElement.source }}</p>
          <p><strong>Hacia:</strong> {{ selectedElement.target }}</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// Elementos del flow (nodos y conexiones)
const elements = ref([
  // Nodo inicial
  {
    id: '1',
    type: 'input',
    label: 'Nodo Inicial',
    position: { x: 100, y: 100 },
    data: { label: 'Nodo Inicial' },
  },
  // Nodo intermedio
  {
    id: '2',
    type: 'default',
    label: 'Nodo Intermedio',
    position: { x: 300, y: 100 },
    data: { label: 'Nodo Intermedio' },
  },
  // Conexión
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'edge',
    label: 'conexión',
  },
])

// Elemento seleccionado
const selectedElement = ref(null)

// Contador para IDs únicos
let nodeIdCounter = 3
let edgeIdCounter = 2

// Agregar nuevo nodo
const addNode = () => {
  const newNode = {
    id: `${nodeIdCounter}`,
    type: 'default',
    label: `Nodo ${nodeIdCounter}`,
    position: {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    },
    data: { label: `Nodo ${nodeIdCounter}` },
  }

  elements.value = [...elements.value, newNode]
  nodeIdCounter++
}

// Agregar conexión entre los dos últimos nodos
const addEdge = () => {
  if (elements.value.filter((el) => el.type !== 'edge').length >= 2) {
    const nodes = elements.value.filter((el) => el.type !== 'edge')
    const lastTwoNodes = nodes.slice(-2)

    if (lastTwoNodes.length === 2) {
      const newEdge = {
        id: `e${edgeIdCounter}`,
        source: lastTwoNodes[0].id,
        target: lastTwoNodes[1].id,
        type: 'edge',
        label: `conexión-${edgeIdCounter}`,
      }

      elements.value = [...elements.value, newEdge]
      edgeIdCounter++
    }
  }
}

// Limpiar todo
const clearAll = () => {
  elements.value = []
  nodeIdCounter = 1
  edgeIdCounter = 1
}

// Event handlers
const onNodeClick = (event, node) => {
  selectedElement.value = node
  console.log('Nodo clickeado:', node)
}

const onEdgeClick = (event, edge) => {
  selectedElement.value = edge
  console.log('Conexión clickeada:', edge)
}
</script>

<style scoped>
.flow-container {
  width: 100%;
  height: 600px;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.flow-controls {
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 8px;
}

.flow-wrapper {
  width: 100%;
  height: calc(100% - 60px);
}

.info-panel {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 300px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Estilos personalizados para Vue Flow */
:deep(.vue-flow__node) {
  background: white;
  border: 2px solid #007acc;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.vue-flow__node-input) {
  background: #e3f2fd;
  border-color: #2196f3;
}

:deep(.vue-flow__edge-path) {
  stroke: #666;
  stroke-width: 2;
}

:deep(.vue-flow__controls) {
  bottom: 10px;
  left: 10px;
}

:deep(.vue-flow__minimap) {
  bottom: 10px;
  right: 10px;
}

:deep(.vue-flow__node.selected) {
  border-color: #ff6b00;
  box-shadow: 0 2px 12px rgba(255, 107, 0, 0.3);
}
</style>
