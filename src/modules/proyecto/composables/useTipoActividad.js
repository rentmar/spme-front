//Composable useTipoActividad
//Operaciones Crud para Tipo de Actividades

import { ref } from 'vue'
import { tipoActividadServicio } from '../services/tipoActividadService'
//Estados
const loading = ref(null)
const error = ref(null)
const tipoDeActividad = ref()
const tipoDeActividades = ref([])

export function useTipoActividad() {
  /********************** Tipo de Actividad ************************************/

  //Cargar lista de actividades
  async function cargarListaTiposActividades() {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.all()
      tipoDeActividades.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar un tipo de actividad por ID
  async function cargarTipoDeActividadporId(id) {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.porId(id)
      tipoDeActividad.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear un Indicador OG
  async function crearTipoDeActividad(data) {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.crear(data)
      tipoDeActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateTipoDeActividad(id, data) {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function deleteTipoDeActividad(id) {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    tipoDeActividad,
    tipoDeActividades,
    cargarListaTiposActividades,
    cargarTipoDeActividadporId,
    crearTipoDeActividad,
    updateTipoDeActividad,
    deleteTipoDeActividad,
  }
}
