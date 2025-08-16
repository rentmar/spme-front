//Composable useEfecto.js
//CRUD de Efectos de Proyecto
import { ref } from 'vue'
import { efectoServicios } from '../services/efectoService'

//Estados
const loading = ref(null)
const error = ref(null)
const efectos = ref([])
const efecto = ref(null)

export function useEfecto() {
  //fecth kpis
  async function cargarEfectos() {
    loading.value = true
    try {
      const respuesta = await efectoServicios.all()
      efectos.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarEfectoPorId(id) {
    loading.value = true
    try {
      const respuesta = await efectoServicios.porId(id)
      efecto.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearEfecto(data) {
    loading.value = true
    try {
      const respuesta = await efectoServicios.crear(data)
      efecto.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateEfecto(id, data) {
    loading.value = true
    try {
      const respuesta = await efectoServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delEfecto(id) {
    loading.value = true
    try {
      const respuesta = await efectoServicios.delete(id)
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
    efecto, //ref
    efectos, //ref
    cargarEfectos, //fun
    cargarEfectoPorId, //fun
    crearEfecto, //fn
    updateEfecto, //fn
    delEfecto, //fn
  }
}
