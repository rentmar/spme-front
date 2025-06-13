//composable useObjetivoEspecifico
//Operaciones CRUD para los Objetivos Especificos

import { ref } from 'vue'
import { proyectoObjetivos } from '../services/proyectoService'

//Estados
const loading = ref(null)
const error = ref(null)
const objetivoEspecifico = ref(null)

export function useObjetivoEspecifico() {
  //Cargar Objetivo Especifico por id
  async function cargarObjetivoEspecificoPorId(id) {
    loading.value = true
    try {
      const respuesta = await proyectoObjetivos.especificosPorId(id)
      objetivoEspecifico.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Crear el Objetivo Especifico
  async function crearObjetivoEspecifico(data) {
    loading.value = true
    try {
      const respuesta = await proyectoObjetivos.especificoCrear(data)
      objetivoEspecifico.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update Objetivo Especifico
  async function updateObjetivoEspecifico(id, data) {
    loading.value = true
    try {
      const respuesta = await proyectoObjetivos.especificoUpdate(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //DEl Objetivo Especifico
  async function delObjetivoEspecifico(id) {
    loading.value = true
    try {
      const respuesta = await proyectoObjetivos.especificoDel(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, ///ref
    objetivoEspecifico, //ref
    cargarObjetivoEspecificoPorId, //fun
    crearObjetivoEspecifico, //fun
    updateObjetivoEspecifico, //fun
    delObjetivoEspecifico, //fun
  }
}
