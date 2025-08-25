<template>
  <v-app>
    <v-main>
      <div class="app-container">
        <!-- Panel de información a la izquierda -->
        <div class="info-panel">
          <div class="panel-header">
            <v-icon icon="mdi-information-outline"></v-icon> Información del Nodo
          </div>

          <div class="node-info">
            <h3>Detalles</h3>

            <div v-if="selectedNode">
              <v-card variant="outlined" class="mb-4">
                <v-card-text>
                  <div class="info-item">
                    <div class="info-label">ID:</div>
                    <div class="info-value">{{ selectedNode.id }}</div>
                  </div>

                  <div class="info-item">
                    <div class="info-label">Tipo:</div>
                    <div class="info-value">{{ selectedNode.type || 'default' }}</div>
                  </div>

                  <div class="info-item">
                    <div class="info-label">Posición:</div>
                    <div class="info-value">
                      X: {{ selectedNode.position.x }}, Y: {{ selectedNode.position.y }}
                    </div>
                  </div>

                  <div class="info-item" v-if="selectedNode.data && selectedNode.data.label">
                    <div class="info-label">Etiqueta:</div>
                    <div class="info-value">{{ selectedNode.data.label }}</div>
                  </div>
                </v-card-text>
              </v-card>

              <div class="info-item">
                <div class="info-label">Conectado a:</div>
                <v-card variant="outlined">
                  <v-card-text>
                    <div v-for="edge in connectedEdges" :key="edge.id" class="mb-1">
                      {{ edge.source }} → {{ edge.target }}
                    </div>
                    <div v-if="connectedEdges.length === 0" class="text-grey">Ninguna conexión</div>
                  </v-card-text>
                </v-card>
              </div>
            </div>

            <div v-else class="no-selection">
              <v-alert type="info" variant="tonal">
                Seleccione un nodo para ver sus detalles
              </v-alert>
            </div>
          </div>

          <div class="create-node">
            <h3>Crear Nuevo Nodo</h3>

            <v-form @submit.prevent="addNewNode">
              <v-text-field
                v-model="newNodeLabel"
                label="Etiqueta del nodo"
                placeholder="Ingrese etiqueta del nodo"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              ></v-text-field>

              <v-select
                v-model="newNodeType"
                label="Tipo de nodo"
                :items="nodeTypes"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-select>

              <v-btn
                type="submit"
                color="primary"
                block
                :disabled="!newNodeLabel"
                prepend-icon="mdi-plus"
              >
                Agregar Nodo
              </v-btn>
            </v-form>
          </div>
        </div>

        <!-- Contenedor de Vue Flow a la derecha -->
        <div class="flow-container">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            fit-view-on-init
            class="vue-flow-container"
            @node-click="handleNodeClick"
          >
            <Background />
            <MiniMap />
            <Controls />

            <Panel position="top-right">
              <div class="buttons-panel">
                <v-btn size="small" @click="vueFlowInstance.fitView()" variant="tonal">
                  <v-icon icon="mdi-fit-to-screen" size="small"></v-icon> Ajustar
                </v-btn>
                <v-btn size="small" @click="vueFlowInstance.zoomIn()" variant="tonal">
                  <v-icon icon="mdi-magnify-plus" size="small"></v-icon> Zoom+
                </v-btn>
                <v-btn size="small" @click="vueFlowInstance.zoomOut()" variant="tonal">
                  <v-icon icon="mdi-magnify-minus" size="small"></v-icon> Zoom-
                </v-btn>
              </div>
            </Panel>
          </VueFlow>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

// Inicializar store
const store = useProyectoStore()
const { nodes, edges } = storeToRefs(store)

// Inicializar composable de VueFlow
const vueFlowInstance = useVueFlow()

// Estado para el nodo seleccionado
const selectedNode = ref(null)

// Estado para crear nuevo nodo
const newNodeLabel = ref('')
const newNodeType = ref('default')
const nodeTypes = ref(['default', 'input', 'output', 'process'])

// Obtener las conexiones relacionadas con el nodo seleccionado
const connectedEdges = computed(() => {
  if (!selectedNode.value) return []
  return edges.value.filter(
    (edge) => edge.source === selectedNode.value.id || edge.target === selectedNode.value.id,
  )
})

// Manejar clic en un nodo - CORREGIDO
const handleNodeClick = (event, node) => {
  selectedNode.value = event.node
  console.log(selectedNode)
}

// Agregar un nuevo nodo - CORREGIDO
const addNewNode = () => {
  if (!newNodeLabel.value.trim()) return

  const newNodeId = `${nodes.value.length + 1}`
  const newNode = {
    id: newNodeId,
    type: newNodeType.value, // Asegurar que el tipo esté definido
    position: {
      x: Math.random() * 400,
      y: Math.random() * 400,
    },
    data: {
      label: newNodeLabel.value,
    },
  }

  // Agregar el nuevo nodo usando el método correcto
  vueFlowInstance.addNodes([newNode])

  // Si hay nodos existentes, crear una conexión aleatoria
  if (nodes.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * nodes.value.length)
    const targetNode = nodes.value[randomIndex]

    const newEdge = {
      id: `e${newNodeId}-${targetNode.id}`,
      source: newNodeId,
      target: targetNode.id,
    }

    vueFlowInstance.addEdges([newEdge])
  }

  // Resetear el formulario
  newNodeLabel.value = ''
  newNodeType.value = 'default'
}

// Asegurar que los nodos existentes tengan tipo definido
onMounted(() => {
  // Corregir nodos existentes que no tengan tipo
  nodes.value = nodes.value.map((node) => ({
    ...node,
    type: node.type || 'default', // Asignar tipo por defecto si no existe
  }))
})
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.info-panel {
  width: 350px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.panel-header {
  padding: 20px;
  background: rgb(var(--v-theme-primary));
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
}

.node-info {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.node-info h3 {
  margin-bottom: 15px;
  color: rgb(var(--v-theme-primary));
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-item {
  margin-bottom: 12px;
}

.info-label {
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.create-node {
  padding: 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.create-node h3 {
  margin-bottom: 15px;
  color: rgb(var(--v-theme-primary));
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.flow-container {
  flex: 1;
  position: relative;
  background: #fafafa;
}

.vue-flow-container {
  width: 100%;
  height: 100%;
}

.buttons-panel {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
