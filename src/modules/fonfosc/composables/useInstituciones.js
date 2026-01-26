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
    loading.value = true
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
    loading.value = true
    try {
      const respuesta = await institucionServicios.inscrear(dataInst)
      institucion.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Actualizar una inst por id
  async function actualizarInstitucion(idinstitucion, dataInst) {
    loading.value = true
    try {
      const respuesta = await institucionServicios.insupdate(idinstitucion, dataInst)
      institucion.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar Institucion por id
  async function eliminarInstitucion(idinstitucion) {
    loading.value = true
    try {
      const respuesta = await institucionServicios.insdelete(idinstitucion)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    institucionesLista,
    institucion,
    //func
    cargarInstituciones,
    cargarInstitucionPorId,
    actualizarInstitucion,
    crearInstitucion,
    eliminarInstitucion,
  }
}
