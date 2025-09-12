//Composable useActividad
//CRUD de Actividades
import { ref } from 'vue'
import { programasServicios } from '../services/programasServices'

//Estados
const loading = ref(null)
const error = ref(null)
const programas = ref([])
const programa = ref(null)

export function useProgramas() {
  //fecth kpis
  async function cargarProgramas() {
    loading.value = true
    try {
      const respuesta = await programasServicios.all()
      programas.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarProgramasPorId(id) {
    loading.value = true
    try {
      const respuesta = await programasServicios.porId(id)
      programa.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearPrograma(data) {
    loading.value = true
    try {
      const respuesta = await programasServicios.crear(data)
      programa.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updatePrograma(id, data) {
    loading.value = true
    try {
      const respuesta = await programasServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delPrograma(id) {
    loading.value = true
    try {
      const respuesta = await programasServicios.delete(id)
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
    programas,
    programa,
    cargarProgramas,
    cargarProgramasPorId,
    crearPrograma,
    updatePrograma,
    delPrograma,
  }
}
