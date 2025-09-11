//Composable useReportes
//CRUD de Reportes
import { ref } from 'vue'
import { reportesServicios } from '../services/reportesService'
//Estados
const loading = ref(null)
const error = ref(null)
const estructuraJerarquicaProyecto = ref([])
const actividadIndicadores = ref(null)

export function useReportes() {
  //fecth kpis
  async function cargarEstructuraJerarquicaProyecto(idproyecto) {
    loading.value = true
    try {
      const respuesta = await reportesServicios.estructuraJerReportes(idproyecto)
      estructuraJerarquicaProyecto.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Fetch actividades con indicadores e informacion adicional
  async function cargarActividadIndicadoresInfo(idActividad) {
    loading.value = true
    try {
      const respuesta = await reportesServicios.actidadIndPorId(idActividad)
      actividadIndicadores.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    estructuraJerarquicaProyecto,
    actividadIndicadores,
    cargarEstructuraJerarquicaProyecto,
    cargarActividadIndicadoresInfo,
  }
}
