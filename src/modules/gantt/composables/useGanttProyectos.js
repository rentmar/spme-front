// composables/useGanttProyectos.js
import { ref } from 'vue'
import { ganttServicio } from '../services/ganttServices'

export function useGanttProyectos() {
  //estado de carga
  const loadingGantt = ref(false)
  const error = ref(null)
  //estados
  const tasks = ref([])

  //Funcion de inicio
  // En useGanttProyectos.js
  async function inicializar() {
    loadingGantt.value = true
    try {
      const respuesta = await ganttServicio.datosGantt()
      tasks.value = respuesta.data || []
    } catch (err) {
      error.value = err.message
      tasks.value = []
    } finally {
      loadingGantt.value = false
    }
  }

  return {
    //Estados
    loadingGantt,
    error,
    tasks,
    //func
    inicializar,
  }
}
