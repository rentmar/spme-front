import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiServicios } from '../services/peiService'
import { objetivoPeiServicios } from '../services/peiService'

export const usePeiStore = defineStore('pei', () => {
  /***** ESTADOS REACTIVOS DEL STORE ******/
  const peis = ref([]) //Almacena la lista completa de PEIs
  const peiActual = ref(null) //Almacena el PEI seleccionado
  const peiObjIndPorId = ref(null) //PEI con objetivoes e indicadores
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

  //Obtener el PEI con objetivos e indicadores
  const obtenerPeiObjInd = async (id) => {
    cargando.value = true
    try {
      peiObjIndPorId.value = await peiServicios.obtenerPeiObjIndPorId(id)
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  //Accion para remover objetivo solo del store sin peticion HTTP
  const removerObjetivoLocalmente = (objetivoId) => {
    if (peiObjIndPorId.value?.objetivos) {
      peiObjIndPorId.value.objetivos = peiObjIndPorId.value.objetivos.filter(
        (obj) => obj.id !== objetivoId,
      )
    }
    if (peiActual.value?.objetivos) {
      peiActual.value.objetivos = peiActual.value.objetivos.filter((obj) => obj.id !== objetivoId)
    }
  }

  //Eliminar un PEI con verificacion HTTP
  const eliminarObjetivo = async (objetivoId) => {
    cargando.value = true
    error.value = null
    try {
      await objetivoPeiServicios.eliminar(objetivoId)
      removerObjetivoLocalmente(objetivoId)
      return true //Exito
    } catch (err) {
      error.value = err.message
      return false //Fracaso
    } finally {
      cargando.value = false
    }
  }

  return {
    peis, //Estado: Lista de PEIs
    peiActual, //Estado: PEI actual
    peiObjIndPorId, //Estado
    cargando, //Estado: Bandera de carga
    error, //Estado: Error
    obtenerPeis, //Accion
    obtenerPeiPorId, //Accion publica
    obtenerPeiObjInd, //Accion
    removerObjetivoLocalmente,
    eliminarObjetivo,
  }
})
