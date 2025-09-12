//Composable usePlanificacion
//CRUD de Actividades
import { ref } from 'vue'
import { trazadorServicios } from '../services/trazadorService'

//Estados
const loading = ref(null)
const error = ref(null)
const rutaDeLaActividad = ref([])
const rutaDeLaActividadIndicador = ref([])
const rutasDeLaActividadIndicador = ref([])

export function useTrazador() {
  //Ruta de una actividad
  async function obtenerRutaActividad(id) {
    loading.value = true
    try {
      const respuesta = await trazadorServicios.trazadorActividad(id)
      rutaDeLaActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Ruta de una actividad con indicadores
  async function obtenerRutaActividadIndicador(id) {
    loading.value = true
    try {
      const respuesta = await trazadorServicios.trazadorActividadIndicador(id)
      rutaDeLaActividadIndicador.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Todas las rutas de una actividad con indicadores
  async function obtenerAllRutaActividadIndicador(id) {
    loading.value = true
    try {
      const respuesta = await trazadorServicios.trazadorAllActividadIndicador(id)
      rutasDeLaActividadIndicador.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    rutaDeLaActividad, //ref
    rutaDeLaActividadIndicador, //ref
    rutasDeLaActividadIndicador, //ref
    obtenerRutaActividad, //func
    obtenerRutaActividadIndicador, //func
    obtenerAllRutaActividadIndicador, ///func
  }
}
