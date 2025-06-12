// composable/useIndicadores
// Operaciones crud para los Indicadores

import { ref } from 'vue'
import { indicadoresServicios } from '../services/indicadoresService'

//Estados
const indicadorObjGeneral = ref(null)
const indicadorResultadoObjGeneral = ref(null)
const loading = ref(null)
const error = ref(null)

export function useIndicadores() {
  /*********** Indicadores Objetivo General *************/
  //Cargar un Indicador OG por ID
  async function cargarIndicadorObjGeneralPorId(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.indicadorOgPorId(id)
      indicadorObjGeneral.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear un Indicador OG
  async function crearIndicadorObjetivoGeneral(data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.crearIndicadorOg(data)
      indicadorObjGeneral.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update Indicador OG
  async function updateIndicadorObjetivoGeneral(id, data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.updateIndicadorOg(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  /*********** Indicadores Resultado Objetivo General *************/
  //Cargar un Indicador OG por ID
  async function cargarIndicadorResultadoObjGeneralPorId(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.indicadorResultadoOgPorId(id)
      indicadorResultadoObjGeneral.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear un Indicador OG
  async function crearIndicadorResultadoObjetivoGeneral(data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.crearIndicadorResultadoOg(data)
      indicadorResultadoObjGeneral.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update Indicador OG
  async function updateIndicadorResultadoObjetivoGeneral(id, data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.updateIndicadorResultadoOg(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Del Indicador OG
  async function delIndicadorResultadoObjetivoGeneral(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.delIndicadorResultadoOg(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    indicadorObjGeneral, //ref
    indicadorResultadoObjGeneral, //ref
    loading, //ref
    error, //ref
    cargarIndicadorObjGeneralPorId, //func
    crearIndicadorObjetivoGeneral, //func
    updateIndicadorObjetivoGeneral, //func
    cargarIndicadorResultadoObjGeneralPorId, //func
    crearIndicadorResultadoObjetivoGeneral, //func
    updateIndicadorResultadoObjetivoGeneral, //func
    delIndicadorResultadoObjetivoGeneral, //func
  }
}
