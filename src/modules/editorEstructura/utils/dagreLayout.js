//Utilitario para ordenar el layout de diagramas / interfaz de estructuracion
// utils/dagreLayout.js

import dagre from 'dagre'

const nodeWidth = 600
const nodeHeight = 400

export function layoutGraph(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction }) // TB = Top-Bottom, LR = Left-Right

  // Registrar nodos
  nodes.forEach((node) => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Registrar edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  // Aplicar nuevas posiciones
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id)
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
