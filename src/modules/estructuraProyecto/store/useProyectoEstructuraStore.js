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
    return (id) => {
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

    const relacionesFiltradas = edges.value.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId,
    )

    return relacionesFiltradas.map((edge) => {
      const sourceNode = nodes.value.find((n) => n.id === edge.source)
      const targetNode = nodes.value.find((n) => n.id === edge.target)

      const sourceLabel = sourceNode?.data?.label || sourceNode?.type || 'Nodo desconocido'
      const targetLabel = targetNode?.data?.label || targetNode?.type || 'Nodo desconocido'

      return {
        id: edge.id,
        descripcion: `${sourceLabel} → ${targetLabel}`,
        tipo: edge.source === nodeId ? 'saliente' : 'entrante',
      }
    })
  }

  // FUNCIÓN PARA MODIFICAR NODOS
  function modificarNodo(nodoId, modificaciones) {
    loading.value = true
    error.value = null

    try {
      // Buscar el nodo por ID
      const nodoIndex = nodes.value.findIndex((nodo) => nodo.id === nodoId)

      if (nodoIndex === -1) {
        throw new Error(`Nodo con ID ${nodoId} no encontrado`)
      }

      // Extraer el nodo y crear una copia para modificar
      const nodoOriginal = nodes.value[nodoIndex]
      const nodoModificado = JSON.parse(JSON.stringify(nodoOriginal))

      // Aplicar las modificaciones
      aplicarModificaciones(nodoModificado, modificaciones)

      // Reemplazar el nodo en el array original
      nodes.value[nodoIndex] = nodoModificado

      // Actualizar conexiones si es necesario
      actualizarConexiones(nodoId, nodoModificado)

      // Actualizar el diagrama completo
      if (diagrama.value) {
        const diagramaIndex = diagrama.value.nodos.findIndex((nodo) => nodo.id === nodoId)
        if (diagramaIndex !== -1) {
          diagrama.value.nodos[diagramaIndex] = nodoModificado
          diagrama.value.actualizado = new Date().toISOString()
          diagrama.value.sincronizado = false
        }
      }

      return nodoModificado
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Función auxiliar para aplicar modificaciones
  function aplicarModificaciones(nodo, modificaciones) {
    function aplicarRecursivo(objeto, mods) {
      for (const [key, value] of Object.entries(mods)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (!objeto[key]) objeto[key] = {}
          aplicarRecursivo(objeto[key], value)
        } else {
          objeto[key] = value
        }
      }
    }

    aplicarRecursivo(nodo, modificaciones)
  }

  // Función para actualizar conexiones
  function actualizarConexiones(nodoId, nodoModificado) {
    edges.value.forEach((conexion) => {
      if (conexion.source === nodoId && conexion.sourceNode) {
        conexion.sourceNode = nodoModificado
      }
      if (conexion.target === nodoId && conexion.targetNode) {
        conexion.targetNode = nodoModificado
      }
    })
  }

  // Función para buscar nodos por criterios
  function buscarNodos(criterio) {
    if (!nodes.value) return []

    if (typeof criterio === 'function') {
      return nodes.value.filter(criterio)
    }

    return nodes.value.filter((nodo) => {
      return Object.entries(criterio).every(([key, value]) => {
        const keys = key.split('.')
        let obj = nodo
        for (const k of keys) {
          if (obj && typeof obj === 'object' && k in obj) {
            obj = obj[k]
          } else {
            return false
          }
        }
        return obj === value
      })
    })
  }
  // En tu store, añade estas funciones:

  function extraerNodosPorIds(ids) {
    if (!nodes.value || !Array.isArray(ids)) return []

    return ids
      .map((id) => {
        const nodo = nodes.value.find((n) => n.id === id)
        return nodo ? JSON.parse(JSON.stringify(nodo)) : null
      })
      .filter((nodo) => nodo !== null)
  }

  function extraerNodosPorTipo(tipo) {
    if (!nodes.value) return []

    return nodes.value
      .filter((nodo) => nodo.data?.type === tipo)
      .map((nodo) => JSON.parse(JSON.stringify(nodo)))
  }

  function extraerNodosPorCriterio(criterio) {
    const nodosFiltrados = buscarNodos(criterio)
    return nodosFiltrados.map((nodo) => JSON.parse(JSON.stringify(nodo)))
  }

  // Agregar al return
  // return {
  //   // ... otras funciones
  //   extraerNodoPorId,
  //   extraerNodosPorIds,
  //   extraerNodosPorTipo,
  //   extraerNodosPorCriterio,
  // }

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
    // Nuevas funciones
    modificarNodo,
    buscarNodos,
    extraerNodosPorIds,
    extraerNodosPorTipo,
    extraerNodosPorCriterio,
  }
})
