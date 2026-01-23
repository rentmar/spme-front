//Composable useNotificaciones.js
import { ref } from 'vue'
import { institucionServicios } from '../services/institucionService'
//Estados
const loading = ref(false)
const error = ref(null)
const institucionesLista = ref([])
const institucion = ref(null)

export function useInstituciones() {
  /******************** CRUD BASICO******************************/
  //Cargar todas las intstituciones
  async function cargarInstituciones() {
    loading.value = true
    try {
      const respuesta = await institucionServicios.instodos()
      institucionesLista.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //cargar una inst. por su id
  async function cargarInstitucionPorId(idinstitucion) {
    try {
      const respuesta = await institucionServicios.insporId(idinstitucion)
      institucion.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Crear institucion
  async function crearInstitucion(dataInst) {
    try {
      const respuesta = await institucionServicios.crearInstitucion(dataInst)
      institucion.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Actualizar una inst por id
  async function actualizarInstitucion(idinstitucion, dataInst) {}

  return {
    //Estados
    loading,
    error,
    institucionesLista,
    institucion,
    //func
    cargarInstituciones,
    cargarInstitucionPorId,
  }
}
