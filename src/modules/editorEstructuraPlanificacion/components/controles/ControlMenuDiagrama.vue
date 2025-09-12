<template>
  <Panel position="top-right">
    <v-card>
      <v-card-title class="panel-title">
        <v-icon left>mdi-cog</v-icon>
        Controles Principales
      </v-card-title>
      <div class="buttons">
        <!-- Botón Guardar -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="primary" v-bind="activatorProps" @click="onSave">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Guardar gráfico</span>
        </v-tooltip>

        <!-- Botón Restaurar -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="secondary" v-bind="activatorProps" @click="onRestore">
              <v-icon>mdi-backup-restore</v-icon>
            </v-btn>
          </template>
          <span>Restaurar gráfico</span>
        </v-tooltip>

        <!-- Botón Añadir -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="success" v-bind="activatorProps" @click="onAdd">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <span>Añadir nodo aleatorio</span>
        </v-tooltip>

        <!-- Botón Activar Grilla -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="success" v-bind="activatorProps" @click="activaGrilla">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <span>Grilla</span>
        </v-tooltip>
      </div>
    </v-card>
  </Panel>

  <!-- Nuevo panel de objetivos -->
  <Panel v-if="activarPanelObjetivos" position="top-left" :style="{ top: '120px' }">
    <v-card>
      <v-card-title class="panel-title">
        <v-icon left>mdi-application</v-icon>
        Elementos
      </v-card-title>
      <div class="buttons">
        <!-- Botón Crear Objetivo General -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="primary" v-bind="activatorProps" @click="addObjetivoGeneral">
              <v-icon>mdi-bullseye</v-icon>
            </v-btn>
          </template>
          <span>Agregar Objetivo General</span>
        </v-tooltip>
        <!-- Botón Agregar Objetivo Especifico -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn icon color="primary" v-bind="activatorProps" @click="addObjetivoEspecifico">
              <v-icon>mdi-bullseye-arrow</v-icon>
            </v-btn>
          </template>
          <span>Agregar Objetivo Especifico</span>
        </v-tooltip>
      </div>
    </v-card>
  </Panel>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Panel, useVueFlow } from '@vue-flow/core'
//Store
import { useNodosStore } from '../../store/useNodosStore'
import { diagramaEstructuraCrud } from '../../services/editorEstructuraService'

//Activar
const activarPanelObjetivos = ref(false)

//Inicializar el store
const diagramaStore = useNodosStore()

//Referencias

//Funciones
const { crearObjetivoGeneral, cargarObjetivoGeneralExistente } = diagramaStore

const { nodes, addNodes, dimensions, getNodes, getEdges } = useVueFlow()

// Verificar API al cargar el componente
onMounted(async () => {
  cargarObjetivoGeneralExistente()
})

async function onSave() {
  alert('Grabar')
  try {
    const nodos = getNodes.value
    const conexiones = getEdges.value

    const data = {
      codigoProyecto: 'PRUEBA123',
      nodos,
      conexiones,
      proyecto: 2, // o el ID real del proyecto si lo tienes
    }

    const respuesta = await diagramaEstructuraCrud.crear(data)
    console.log('✅ Diagrama guardado:', respuesta.data)
  } catch (error) {
    console.error('❌ Error al guardar el diagrama', error)
  }
}

function onRestore() {
  alert('Restaurar')
}

function onAdd() {
  const id = nodes.value.length + 1
  const newNode = {
    id: `random_node-${id}`,
    label: `Node ${id}`,
    position: {
      x: Math.random() * dimensions.value.width,
      y: Math.random() * dimensions.value.height,
    },
  }
  addNodes([newNode])
}

//Agregar Objetivo General
const addObjetivoGeneral = () => {
  const newObjGral = {
    codigo: 'POO',
    descripcion: '',
    supuestos: '',
    riesgos: '',
  }
  crearObjetivoGeneral(newObjGral)
}

//Agregar Objetivo Especifico
const addObjetivoEspecifico = () => {
  alert('Agregar Objetivo Especifico')
}

const activaGrilla = () => {}
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.panel-title {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}

.control-panel {
  width: 220px;
}

.templates-panel {
  width: 180px;
}
</style>
