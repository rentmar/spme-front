// composables/usePeiCrud.js

import { ref } from 'vue'
import { peiServicios } from '../services/peiService'

export function usePeiCrud() {
  //Estados
  const peis = ref([])
  const pei = ref(null)
  const peiEstructura = ref(null)
  const objetivosPei = ref([])
  const indicadoresPei = ref([])
  const loading = ref(false)
  const error = ref(null)
  const peiDetalle = ref(null)

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

  //Obtiene los objetivos del PEI por idpei
  const obtenerObjetivosPeiPorIdPei = async (id) => {
    loading.value = true
    try {
      objetivosPei.value = await peiServicios.objetivosPeiPorIdPei(id)
      return objetivosPei.value
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Obtiene los indicadores del PEI por idpei
  const obtenerIndicadoresPeiPorIdPei = async (id) => {
    loading.value = true
    try {
      indicadoresPei.value = await peiServicios.indicadoresPeiPorIdPei(id)
      return indicadoresPei.value
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

  //Obtener el detalle de un pei
  const obtenerDetallePei = async (idpei) => {
    loading.value = true
    try {
      const respuesta = await peiServicios.peiDetalleVista(idpei)
      peiDetalle.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    peis, //ref todos los peis
    pei, //ref proyecto por id
    peiEstructura, //ref
    objetivosPei,
    indicadoresPei,
    peiDetalle,
    loading, //ref estado de carga
    error, //ref variable de error
    obtenerPeis, //fun recupera todos los proyectos registrados
    obtenerPeiPorId, //fun un proyecto por id
    createPei, //fun crea un proyecto
    updatePei, //actualiza proyecto
    delPei, // fun elimina el proyecto
    obtenerEstructuraPeiPorId, //fun
    obtenerObjetivosPeiPorIdPei, //fun
    obtenerIndicadoresPeiPorIdPei, //func
    obtenerDetallePei,
  }
}
