//useProyectoEstructuraStore
//Store para manejar la estructura grafica de un proyecto
//Sin llamar a VueFlow
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDiagramaCrud } from '@/modules/editorEstructura/composables/useDiagramaCrud'

export const useProyectoEstructuraStore = defineStore('proyectoHandleEstructura', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const nodes = ref([])
  const edges = ref([])
  const diagrama = ref([])
  const filtroTipo = ref('all')

  //getters: Propiedades calculadas
  const allNodes = computed(() => nodes.value)
  const allEdges = computed(() => edges.value)

  //getters: Filtro de nodos
  const filtrarNodos = computed(() => {
    if (filtroTipo.value === 'all' || !filtroTipo.value) {
      return nodes.value
    }
    return nodes.value.filter((node) => node.type === filtroTipo.value)
  })

  //getters: Tipos de nodos disponibles
  const tiposDisponibles = computed(() => {
    const types = new Set(nodes.value.map((node) => node.type))
    return ['all', ...Array.from(types)]
  })

  //getters: Encontrar nodo por id
  const encontrarNodoPorID = computed(() => {
    // Return a function that performs the find operation.
    return (id) => {
      // Add a null check to ensure nodes.value is an array before trying to find an element.
      if (!nodes.value) {
        return undefined
      }
      return nodes.value.find((node) => node.id === id)
    }
  })

  //Iniciar el composable
  const { diagramaProyecto, obtenerDiagrama } = useDiagramaCrud()

  //MODIFICADORES
  //Carga de datos desde la rest api
  async function obtenerDiagramaPorId(id) {
    await obtenerDiagrama(id)
    diagrama.value = diagramaProyecto.value
    if (diagramaProyecto) {
      nodes.value = diagramaProyecto.value.nodos
      edges.value = diagramaProyecto.value.conexiones
    }
  }

  //Colocar un nuevo tipo de filtro
  function colocarFiltro(newType) {
    filtroTipo.value = newType
  }

  //Obtenera la descripcion de una relacion
  function getRelacionDescripcion(edge) {
    const sourceNode = encontrarNodoPorID.value(edge.source)
    const targetNode = encontrarNodoPorID.value(edge.target)

    if (sourceNode && targetNode) {
      const sourceLabel = sourceNode.data?.label || sourceNode.type
      const targetLabel = targetNode.data?.label || targetNode.type
      return `${sourceLabel} → ${targetLabel}`
    }
    return 'Relación desconocida'
  }

  // En tu store (useProyectoEstructuraStore.js)

  // Nuevo getter computado
  const relacionesConDescripcion = computed(() => {
    if (!edges.value || !nodes.value) {
      return []
    }

    return edges.value.map((edge) => {
      const sourceNode = nodes.value.find((n) => n.id === edge.source)
      const targetNode = nodes.value.find((n) => n.id === edge.target)

      const sourceLabel = sourceNode?.data?.label || sourceNode?.type || 'Nodo desconocido'
      const targetLabel = targetNode?.data?.label || targetNode?.type || 'Nodo desconocido'

      return {
        id: edge.id,
        descripcion: `${sourceLabel} → ${targetLabel}`,
      }
    })
  })

  // Nueva función para obtener relaciones por el ID de un nodo
  function obtenerRelacionesDeNodo(nodeId) {
    if (!edges.value || !nodes.value || !nodeId) {
      return []
    }

    // Filtra las aristas donde el nodo de origen o destino coincida con el ID
    const relacionesFiltradas = edges.value.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId,
    )

    // Mapea las relaciones filtradas para agregarles la descripción
    return relacionesFiltradas.map((edge) => {
      const sourceNode = nodes.value.find((n) => n.id === edge.source)
      const targetNode = nodes.value.find((n) => n.id === edge.target)

      const sourceLabel = sourceNode?.data?.label || sourceNode?.type || 'Nodo desconocido'
      const targetLabel = targetNode?.data?.label || targetNode?.type || 'Nodo desconocido'

      return {
        id: edge.id,
        descripcion: `${sourceLabel} → ${targetLabel}`,
        // Añade el tipo de conexión (saliente o entrante) para una mejor visualización
        tipo: edge.source === nodeId ? 'saliente' : 'entrante',
      }
    })
  }

  return {
    //Estados
    loading,
    error,
    nodes,
    edges,
    filtroTipo,
    allNodes,
    allEdges,
    diagrama,
    filtrarNodos,
    tiposDisponibles,
    encontrarNodoPorID,
    obtenerDiagramaPorId,
    colocarFiltro,
    getRelacionDescripcion,
    relacionesConDescripcion,
    obtenerRelacionesDeNodo,
  }
})
