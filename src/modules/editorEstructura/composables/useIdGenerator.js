import { useVueFlow } from '@vue-flow/core'

export function useIdGenerator() {
  const { getNodes, getEdges } = useVueFlow()

  const getNextNodeId = () => {
    const ids = getNodes.value.map((n) => parseInt(n.id)).filter((n) => !isNaN(n))

    const maxId = ids.length > 0 ? Math.max(...ids) : 0
    return (maxId + 1).toString()
  }

  const getNextEdgeId = () => {
    const ids = getEdges.value
      .map((e) => {
        // Suponiendo que tus edges tienen id como "edge-1-2"
        const match = e.id.match(/\d+$/)
        return match ? parseInt(match[0]) : null
      })
      .filter((n) => n !== null)

    const maxId = ids.length > 0 ? Math.max(...ids) : 0
    return `edge-${maxId + 1}`
  }

  return {
    getNextNodeId,
    getNextEdgeId,
  }
}
