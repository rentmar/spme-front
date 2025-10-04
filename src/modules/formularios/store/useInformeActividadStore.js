import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

export const useInformeActividadStore = defineStore('informe-actividad', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Variables de estado
  const actividadDetalles = ref() //La totalidad de informacion de la rest api
  const actividad = ref() //Contiene la informacion de la actividad
  const tareas = ref([]) //Contiene la informacion de las tareas

  //Iniciar el composable
  const { actividadInfo, obtenerActidadPorId } = useActividad()

  //Cargar la actividad y desestructurar en los estados
  async function cargarActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar la informacion detallada usando el composable
      await obtenerActidadPorId(idactividad)
      //La respuesta completa
      actividadDetalles.value = actividadInfo.value

      // Desestructurar la respuesta en las variables específicas
      if (actividadInfo.value) {
        // Extraer la información principal de la actividad (excluyendo tareas)
        const { tareas: tareasData, ...actividadData } = actividadInfo.value
        actividad.value = actividadData
        tareas.value = tareasData || []
      }
    } catch (err) {
      console.error('Error al cargar la tarea', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    actividadDetalles,
    actividad,
    tareas,
    //Funciones
    cargarActividadPorId,
  }
})
