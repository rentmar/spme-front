// En src/stores/peiVigenteStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiVigenteServicio } from '../services/peiVigenteService'
export const usePeiVigenteStore = defineStore('peiVigente', () => {
  /* ESTADOS */
  const peiVigente = ref(null) //Pei vigente
  const peiVigenteEstructura = ref(null) //Estructura del PEI vigente
  const cargando = ref(false) //ref carga
  const error = ref(null) //ref error

  const obtenerPeiVigente = async () => {
    cargando.value = true
    error.value = null
    try {
      const response = await peiVigenteServicio.peiVigente()
      peiVigente.value = response
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener PEI vigente'
    } finally {
      cargando.value = false
    }
  }

  const establecerPeiVigente = async (peiId) => {
    cargando.value = true
    error.value = null
    try {
      const response = await peiVigenteServicio.cambiarPEI(peiId)
      peiVigente.value = response.data
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al establecer PEI vigente'
      return { success: false, error: error.value }
    } finally {
      cargando.value = false
    }
  }

  const obtenerPeiVigenteEstructura = async () => {
    cargando.value = true
    error.value = null
    try {
      const response = await peiVigenteServicio.peivigenteEstructura()
      peiVigenteEstructura.value = response
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener la estructura del PEI vigente'
      return { success: false, error: error.value }
    } finally {
      cargando.value = false
    }
  }

  return {
    peiVigente, //ref
    peiVigenteEstructura, //ref
    cargando, //ref
    error, //ref
    obtenerPeiVigente, //func
    establecerPeiVigente, //func
    obtenerPeiVigenteEstructura, //func
  }
})
