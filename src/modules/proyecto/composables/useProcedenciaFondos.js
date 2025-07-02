//Composable useProcedenciaFondos
//CRUD de Procedencia de FOndos
import { ref } from 'vue'
import { procedenciaFondosServicio } from '../services/procedenciaFondosService'

//Estados
const loading = ref(null)
const error = ref(null)
const entidadesFinancieras = ref([])
const entidadFinanciera = ref(null)
const opcionesEntidadFinanciera = ref([])

export function useProcedenciaFondos() {
  //fecth kpis
  async function cargarActividades() {
    loading.value = true
    try {
      const respuesta = await procedenciaFondosServicio.all()
      entidadesFinancieras.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarActividadPorId(id) {
    loading.value = true
    try {
      const respuesta = await procedenciaFondosServicio.porId(id)
      entidadFinanciera.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearActividad(data) {
    loading.value = true
    try {
      const respuesta = await procedenciaFondosServicio.crear(data)
      entidadFinanciera.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateActividad(id, data) {
    loading.value = true
    try {
      const respuesta = await procedenciaFondosServicio.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delActividad(id) {
    loading.value = true
    try {
      const respuesta = await procedenciaFondosServicio.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Poblar select
  const fetchOptions = async (transformFn = (item) => item) => {
    loading.value = true
    error.value = null
    try {
      const data = await procedenciaFondosServicio.all()
      opcionesEntidadFinanciera.value = data.map((item) => transformFn(item))
    } catch (err) {
      error.value = err.message || 'Error al cargar las opciones'
      console.error('Error fetching options:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    entidadFinanciera, //ref entidad
    entidadesFinancieras, //ref entidades
    opcionesEntidadFinanciera, //ref
    cargarActividades,
    cargarActividadPorId,
    crearActividad,
    updateActividad,
    delActividad,
    fetchOptions,
  }
}
