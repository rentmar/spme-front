// composables/usePeiCrud.js

import { ref } from 'vue'
import { peiServicios } from '../services/peiService'

export function usePeiCrud() {
  //Estados
  const peis = ref([])
  const pei = ref(null)
  const peiEstructura = ref(null)
  const loading = ref(false)
  const error = ref(null)

  //Obtiene todos los pei
  const obtenerPeis = async () => {
    loading.value = true
    try {
      peis.value = await peiServicios.obtenerTodos()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtiene el pei por id
  const obtenerPeiPorId = async (id) => {
    loading.value = true
    try {
      pei.value = await peiServicios.obtenerPorId(id)
      return pei.value
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtiene la estructura del PEI por id
  const obtenerEstructuraPeiPorId = async (id) => {
    loading.value = true
    try {
      peiEstructura.value = await peiServicios.getEstructuraPorId(id)
      return peiEstructura.value
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Crea un pei
  const createPei = async (payload) => {
    return await peiServicios.crear(payload)
  }

  //Actualiza un pei
  const updatePei = async (id, payload) => {
    try {
      const respuesta = await peiServicios.update(id, payload)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar el proyecto', error)
      throw error
    }
  }

  //Elimina un pei
  const delPei = async (id) => {
    try {
      const respuesta = await peiServicios.delProyecto(id)
      return respuesta.data
    } catch (error) {
      console.error('Comp: no se pudo eliminar el proyecto', error)
    }
  }

  return {
    peis, //ref todos los peis
    pei, //ref proyecto por id
    peiEstructura, //ref
    loading, //ref estado de carga
    error, //ref variable de error
    obtenerPeis, //fun recupera todos los proyectos registrados
    obtenerPeiPorId, //fun un proyecto por id
    createPei, //fun crea un proyecto
    updatePei, //actualiza proyecto
    delPei, // fun elimina el proyecto
    obtenerEstructuraPeiPorId, //fun
  }
}
