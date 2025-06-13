//Composable kpi
//CRUD de kpis
import { ref } from 'vue'
import { kpiServicios } from '../services/kpiService'

//Estados
const loading = ref(null)
const error = ref(null)
const kpis = ref([])
const kpi = ref(null)

export function useKpis() {
  //fecth kpis
  async function cargarKpis() {
    loading.value = true
    try {
      const respuesta = await kpiServicios.cargarKpis()
      kpis.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarKpiPorId(id) {
    loading.value = true
    try {
      const respuesta = await kpiServicios.porId(id)
      kpi.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearKpi(data) {
    loading.value = true
    try {
      const respuesta = await kpiServicios.crear(data)
      kpi.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateKpi(id, data) {
    loading.value = true
    try {
      const respuesta = await kpiServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delKpi(id) {
    loading.value = true
    try {
      const respuesta = await kpiServicios.del(id)
      kpi.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    kpis, //ref lista de kpis
    kpi, //ref un kpi por id
    cargarKpis,
    cargarKpiPorId,
    crearKpi,
    updateKpi,
    delKpi,
  }
}
