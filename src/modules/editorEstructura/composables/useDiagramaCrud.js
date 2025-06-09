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

  return {
    diagramasProyecto,
    diagramaProyecto,
    loading,
    error,
    obtenerDiagramas,
    obtenerDiagrama,
  }
}
