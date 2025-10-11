import { defineStore } from 'pinia'
import { ref } from 'vue'
// Asegúrate de que esta ruta sea correcta en tu proyecto
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'

export const useInformeTareaStore = defineStore('informe-tarea', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)

  // Variables de estado para la información separada
  const tarea = ref(null) // Contendrá la información principal de la tarea
  const actividad = ref(null) // Contendrá la información de la actividad
  const proyecto = ref(null) // Contendrá la información del proyecto
  const usuario = ref(null) // Contendrá la información del responsable de la actividad

  // Variable para almacenar la respuesta completa (incluyendo metadatos y nodos)
  const tareaDetallesInfo = ref(null)

  // === COMPOSABLE ===
  const { tareaDetalles, cargarTareaPorIdDetallesInformacion } = useTareaSubactividad()

  // === ACCIONES ===
  // Cargar la tarea y desestructurar sus datos en los estados
  async function obtenerTareasPorIdMasDetalles(idtarea) {
    loading.value = true
    error.value = null // Limpiar errores previos

    try {
      //Cargar la información detallada usando el composable
      await cargarTareaPorIdDetallesInformacion(idtarea)

      // La respuesta completa (incluyendo nodos, selecciones, etc.)
      tareaDetallesInfo.value = tareaDetalles.value

      if (tareaDetallesInfo.value && tareaDetallesInfo.value.tarea) {
        // Obtenemos el objeto principal de la tarea
        const dataTarea = tareaDetallesInfo.value.tarea

        //Asignar la información de la Tarea y la Actividad
        tarea.value = dataTarea
        actividad.value = dataTarea.actividad

        //Asignar la información anidada de Proyecto y Usuario
        proyecto.value = dataTarea.actividad?.proyecto_info || null
        usuario.value = dataTarea.actividad?.responsable_info || null
      } else {
        throw new Error('La respuesta del servidor no contiene la estructura esperada de la tarea.')
      }
    } catch (err) {
      console.error('Error al cargar la tarea:', err)
      error.value = 'No se pudo cargar la información detallada de la tarea.'
    } finally {
      loading.value = false
    }
  }

  // === RETORNO PÚBLICO ===
  return {
    // Estados
    loading,
    error,
    tarea,
    actividad,
    proyecto,
    usuario,
    tareaDetallesInfo,

    // Función para cargar los datos
    obtenerTareasPorIdMasDetalles,
  }
})
