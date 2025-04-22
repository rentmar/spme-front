import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiServicios } from '../services/peiService'

export const usePeiStore = defineStore('pei', () => {
  /***** ESTADOS REACTIVOS DEL STORE ******/
  const peis = ref([]) //Almacena la lista completa de PEIs
  const peiActual = ref(null) //Almacena el PEI seleccionado
  const cargando = ref(false) //Indica si hay operaciones en curso
  const error = ref(null) //Almaena mensajes de error

  /************* ACCIONES ****************/
  //Obtener todos los PEIs
  const obtenerPeis = async () => {
    cargando.value = true
    error.value = null
    try {
      peis.value = await peiServicios.obtenerTodos()
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  //Obtener PEI por ID
  const obtenerPeiPorId = async (id) => {
    cargando.value = true
    try {
      peiActual.value = await peiServicios.obtenerPorId(id)
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  return {
    peis, //Estado: Lista de PEIs
    peiActual, //Estado: PEI actual
    cargando, //Estado: Bandera de carga
    error, //Estado: Error
    obtenerPeis, //Accion
    obtenerPeiPorId, //Accion publica
  }
})
