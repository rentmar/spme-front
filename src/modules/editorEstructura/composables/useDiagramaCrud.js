// composables/useDiagramaCrud.js
import { ref } from 'vue'
import { diagramaEstructuraCrud } from '../services/editorEstructuraService'

export function useDiagramaCrud() {
  //Estados
  const diagramasProyecto = ref([])
  const diagramaProyecto = ref(null)
  const loading = ref(false)
  const error = ref(null)

  //Obtener todos los diagramas
  const obtenerDiagramas = async () => {
    loading.value = true
    try {
      diagramasProyecto.value = await diagramaEstructuraCrud.obtenerAll()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener un diagrama por identificador
  const obtenerDiagrama = async (id) => {
    loading.value = true
    try {
      diagramaProyecto.value = await diagramaEstructuraCrud.obtenerPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Actualizar un diagrama
  const actualizarDiagrama = async (id, data) => {
    loading.value = true
    try {
      const respuesta = await diagramaEstructuraCrud.update(id, data)
      return respuesta.data
    } catch (err) {
      console.error('COMPOSABLE: No se pudo actualizar el diagrama con id: ' + id, err)
    } finally {
      loading.value = false
    }
  }

  //Actualizar Nodos y edges
  const actualizarNodosEdges = async (id, nodo, edge) => {
    const diagrama = {
      nodos: nodo,
      conexiones: edge,
    }
    loading.value = true
    try {
      const respuesta = await diagramaEstructuraCrud.updateNodosEdges(id, diagrama)
      return respuesta.data
    } catch (err) {
      console.error('COMPOSABLE: No de pudo actualizar los nodos y edges con id: ' + id, err)
    } finally {
      loading.value = false
    }
  }

  return {
    diagramasProyecto,
    diagramaProyecto,
    loading,
    error,
    obtenerDiagramas,
    obtenerDiagrama,
    actualizarDiagrama,
    actualizarNodosEdges,
  }
}
