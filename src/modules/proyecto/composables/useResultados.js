//Composable useResultado
//Operaciones Crud para Resultados

import { ref } from 'vue'
import { resultadObjGralService } from '../services/resultadoProductosService'
import { resultadObjEspecService } from '../services/resultadoProductosService'

//Estados
const loading = ref(null)
const error = ref(null)
const resultadoOg = ref(null)
const resultadoOe = ref(null)

export function useResultados() {
  /********************** Resultados Objetivos Generales ************************************/
  //Cargar un Resultado OG por ID
  async function cargarResultadoOg(id) {
    loading.value = true
    try {
      const respuesta = await resultadObjGralService.obtenerPorId(id)
      resultadoOg.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear un Indicador OG
  async function crearResultadoOg(data) {
    loading.value = true
    try {
      const respuesta = await resultadObjGralService.crear(data)
      resultadoOg.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update Indicador OG
  async function updateResultadoOg(id, data) {
    loading.value = true
    try {
      const respuesta = await resultadObjGralService.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /********************** Resultados Objetivos Especificos ************************************/
  //Cargar un Resultado OG por ID
  async function cargarResultadoOe(id) {
    loading.value = true
    try {
      const respuesta = await resultadObjEspecService.obtenerPorId(id)
      resultadoOe.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear un Indicador OG
  async function crearResultadoOe(data) {
    loading.value = true
    try {
      const respuesta = await resultadObjEspecService.crear(data)
      resultadoOe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update Indicador OG
  async function updateResultadoOe(id, data) {
    loading.value = true
    try {
      const respuesta = await resultadObjEspecService(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function delResultadoOe(id) {
    loading.value = true
    try {
      const respuesta = await resultadObjEspecService.del(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    resultadoOg, //ref
    resultadoOe, //ref
    loading, //ref
    error, //ref
    cargarResultadoOg, //func
    crearResultadoOg, //func
    updateResultadoOg, //func
    cargarResultadoOe, //func
    crearResultadoOe, //func
    updateResultadoOe, //func
    delResultadoOe, //func
  }
}
