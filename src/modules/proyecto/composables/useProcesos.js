//Composable useProcesos
//CRUD de Procesos
import { ref } from 'vue'
import { procesosServicios } from '../services/procesosService'

//Estados
const loading = ref(null)
const error = ref(null)
const procesosTodos = ref([])
const procesos = ref(null)

export function useProcesos() {
  //fecth kpis
  async function cargarProcesoTodos() {
    loading.value = true
    try {
      const respuesta = await procesosServicios.cargarTodos()
      procesosTodos.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarProcesoPorId(id) {
    loading.value = true
    try {
      const respuesta = await procesosServicios.porId(id)
      procesos.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearProceso(data) {
    loading.value = true
    try {
      const respuesta = await procesosServicios.crear(data)
      procesos.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateProceso(id, data) {
    loading.value = true
    try {
      const respuesta = await procesosServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delProceso(id) {
    loading.value = true
    try {
      const respuesta = await procesosServicios.delete(id)
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
    procesosTodos, //ref lista de procesos
    procesos, //ref un procesos por id
    cargarProcesoTodos,
    cargarProcesoPorId,
    crearProceso,
    updateProceso,
    delProceso,
  }
}
