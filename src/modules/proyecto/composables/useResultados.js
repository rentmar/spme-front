//Composable useResultado
//Operaciones Crud para Resultados

import { ref } from 'vue'
import { resultadObjGralService } from '../services/resultadoProductosService'

//Estados
const loading = ref(null)
const error = ref(null)
const resultadoOg = ref(null)

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

  return {
    resultadoOg, //ref
    loading, //ref
    error, //ref
    cargarResultadoOg, //func
    crearResultadoOg, //func
    updateResultadoOg, //func
  }
}
