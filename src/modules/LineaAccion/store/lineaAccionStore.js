import { defineStore } from 'pinia'
import { ref } from 'vue'
//Funciones Http
import { lineaAccionServicios } from '../services/lineaAccionService'

//Store de las lineas de accion
export const useLineaAccionStore = defineStore('linea-accion', () => {
  //Estado del store
  const lineasDeAccion = ref([]) //Lista de Lineas de accion
  const lineaDeAccionActual = ref(null) //Almacena la linea de accion actual
  const cargando = ref(false) //Indicador de carga
  const error = ref(null) //Mensaje de error
  /* ACCIONES */
  //Obtener/almacenar todas las lineas de accion
  const obtenerLineasDeAccion = async () => {
    cargando.value = true
    error.value = null
    //Peticion http y almacena los estados
    try {
      lineasDeAccion.value = await lineaAccionServicios.obtenerTodo()
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  //Obtener una linea de accion por identificador
  const lineaDeAccionPorId = async (id) => {
    try {
      lineaDeAccionActual.value = await lineaAccionServicios.obtenerPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  /* RETORNO */
  return {
    lineasDeAccion, //ref
    lineaDeAccionActual, //ref
    cargando, //ref
    error, //ref
    obtenerLineasDeAccion, //accion
    lineaDeAccionPorId, //accion
  }
})
