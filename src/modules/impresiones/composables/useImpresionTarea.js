//Composable para impresiones  useImpresionTarea.js
import { ref } from 'vue'
import { impresionTareaServicio } from '../services/impresionTareaService'

export function useImpresionTarea() {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Generar pdf de la Tarea/Subactividad
  async function generarPdfTarea(idTarea) {
    loading.value = true
    try {
      await impresionTareaServicio.imprimirTareaActividad(idTarea)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    //func
    generarPdfTarea,
  }
}
