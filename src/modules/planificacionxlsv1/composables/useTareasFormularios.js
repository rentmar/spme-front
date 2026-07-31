//Composable para el crud de tareas
import { ref } from 'vue'
import { tareasServicios } from '@/modules/proyecto/services/tareasService'

export const useTareasFormularios = (idTarea) => {
  //estados de carga
  const loading = ref(false)
  const error = ref(null)

  //Estado
  const tarea = ref(null)

  //FUncion de carga
  const cargarDatos = async () => {
    loading.value = true
    try {
      const respuesta = await tareasServicios.porId(idTarea)
      tarea.value = respuesta
    } catch (error) {
      console.error('Error de carga', error)
    } finally {
      loading.value = false
    }
  }

  cargarDatos()

  return {
    //estados
    loading,
    error,
    tarea,
  }
}
