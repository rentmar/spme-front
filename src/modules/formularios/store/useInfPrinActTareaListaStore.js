//Store para manejar los informes de actividad y tareas de una actividad

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useInformeActividadPrincipal } from '../composables/useInformeActividadPrincipal'

export const useInfPrinActTareaListaStore = defineStore('inf-actividad-subactividad-listas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const actividadDetalles = ref(null)
  const listaInformesActividad = ref(null)
  const listaInformesTarea = ref(null)

  //Iniciar el composable
  const { obtenerDetallesActividadPorID, actividadDetallesInforme } = useInformeActividadPrincipal()

  //Cargar todos los informes de una actividad
  const cargarActividadDetallesPorId = async (idactividadprin) => {
    loading.value = true
    try {
      await obtenerDetallesActividadPorID(idactividadprin)
      actividadDetalles.value = actividadDetallesInforme.value
    } catch (err) {
      console.error('Error al cargar al store los detalles de la act ' + idactividadprin, err)
    } finally {
      loading.value = false
    }
  }

  //Cargar todos los informes de las tareas relacionadas a la actividad

  return {
    loading,
    error,
    actividadDetalles,
    listaInformesActividad,
    listaInformesTarea,
    //func
    cargarActividadDetallesPorId,
  }
})
