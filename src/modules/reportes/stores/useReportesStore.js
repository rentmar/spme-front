// stores/useReportesStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDiagramaCrud } from '@/modules/editorEstructura/composables/useDiagramaCrud'

export const useReportesStore = defineStore('reportes', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const nodes = ref([])
  const edges = ref([])
  const diagramaPlanificacion = ref([])
  const filtroTipo = ref('all')

  //getters: Propiedades calculadas
  const allNodes = computed(() => nodes.value)
  const allEdges = computed(() => edges.value)

  //getters: Tipos de nodos disponibles
  const tiposDisponibles = computed(() => {
    const types = new Set(nodes.value.map((node) => node.type))
    return ['all', ...Array.from(types)]
  })

  //getters: Encontrar nodo por id
  const encontrarNodoPorID = computed(() => {
    return (id) => {
      if (!nodes.value) {
        return undefined
      }
      return nodes.value.find((node) => node.id === id)
    }
  })

  //Iniciar el composable
  const { diagramaProyecto, obtenerDiagramaPorIdProyecto, obtenerDiagrama } = useDiagramaCrud()
  //MODIFICADORES
  //Obtiene el diagrama usando el id del nodo
  async function obtenerDiagramaPorId(id) {
    await obtenerDiagrama(id)
    diagramaPlanificacion.value = diagramaProyecto.value
    if (diagramaProyecto) {
      nodes.value = diagramaProyecto.value.nodos
      edges.value = diagramaProyecto.value.conexiones
    }
  }
  //Obtiene el digrama usando el id de proyecto
  async function obtenerDiagramaPorIdProy(id) {
    //await obtenerDiagrama(id)
    await obtenerDiagramaPorIdProyecto(id)
    diagramaPlanificacion.value = diagramaProyecto.value
    if (diagramaProyecto) {
      nodes.value = diagramaProyecto.value.nodos
      edges.value = diagramaProyecto.value.conexiones
    }
  }

  return {
    //Estados
    loading,
    error,
    nodes,
    edges,
    diagramaPlanificacion,
    allNodes,
    allEdges,
    filtroTipo,
    encontrarNodoPorID,
    tiposDisponibles,
    //Funciones
    obtenerDiagramaPorId,
    obtenerDiagramaPorIdProy,
  }
})
