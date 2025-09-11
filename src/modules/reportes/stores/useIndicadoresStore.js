// stores/useIndicadoresStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useReportes } from '../composables/useReportes'

export const useIndicadoresStore = defineStore('reportes', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const actividadInfo = ref(null)

  //Inicializar el composable
  const { actividadIndicadores, cargarActividadIndicadoresInfo } = useReportes()

  //Filtra y retorna todos los nodos tipo indicador
  const filtrarIndicadores = () => {
    if (!actividadInfo.value || !actividadInfo.value.estructuraProcedencia?.nodosRelacionados) {
      return []
    }

    const tiposIndicador = ['indicadorog', 'indicadoroe', 'indicadorrog', 'indicadorroe']
    return actividadInfo.value.estructuraProcedencia.nodosRelacionados.filter((nodo) =>
      tiposIndicador.includes(nodo.type),
    )
  }

  //Cargar la informacion de la actividad
  const cargarActividad = async (idindicador) => {
    loading.value = true
    error.value = null

    try {
      await cargarActividadIndicadoresInfo(idindicador)
      actividadInfo.value = actividadIndicadores.value
    } catch (e) {
      console.error('Error al cargar la actividad:', e)
      error.value = 'No se pudo cargar la actividad. Inténtelo de nuevo.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    actividadInfo,
    cargarActividad,
    filtrarIndicadores,
  }
})
