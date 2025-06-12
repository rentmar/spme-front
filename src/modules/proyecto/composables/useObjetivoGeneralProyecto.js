// composables/useObjetivoGeneralProyecto.js
// Operaciones CRUD para el Objetivo general
import { ref } from 'vue'
import { proyectoObjetivos } from '../services/proyectoService'
//Estados
const objetivosGenerales = ref([])
const objetivoGeneral = ref(null)
const loading = ref(false)
const error = ref(null)

export function useObjetivoGeneralProyecto() {
  //Obtener todos los objetivos generales
  async function cargarObjetivos() {
    loading.value = true
    try {
      objetivosGenerales.value = await proyectoObjetivos.generalesAll()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener un objetivo general por id
  async function cargarObjetivoPorId(id) {
    loading.value = true
    try {
      objetivoGeneral.value = await proyectoObjetivos.generalesPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtener objetivo general por id de proyecto
  async function cargarObjetivoPorIdProyecto(id) {
    loading.value = true
    try {
      objetivoGeneral.value = await proyectoObjetivos.generalesPorIdProyecto(id)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Agregar un objetivo general
  async function addObjetivoGeneral(data) {
    loading.value = true
    try {
      const respuesta = await proyectoObjetivos.generalesCrear(data)
      objetivoGeneral.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Modificar un objetivo general
  async function updateObjetivoGeneral(id, data) {
    loading.value = true
    try {
      objetivoGeneral.value = await proyectoObjetivos.generalesModificar(id, data)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar un objetivo general
  async function delObjetivoGeneral(id) {
    loading.value = true
    try {
      objetivoGeneral.value = await proyectoObjetivos.generalesEliminar(id)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    objetivoGeneral, //Solo un objetivo general
    objetivosGenerales /* todos los objetivos generales */,
    loading, //bandera de carga
    error, //Error
    cargarObjetivos, //Funcion carga
    cargarObjetivoPorId, //FUncion carga por ID
    cargarObjetivoPorIdProyecto, //Objetivo de un proyecto
    addObjetivoGeneral, // Agregar objetivo
    updateObjetivoGeneral, //Actualizar objetivo
    delObjetivoGeneral, //Eliminar el objetivo general
  }
}
