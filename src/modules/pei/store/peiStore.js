import { defineStore } from 'pinia'
import { ref } from 'vue'
import { indicadorPeiServicios, peiServicios } from '../services/peiService'
import { objetivoPeiServicios } from '../services/peiService'

export const usePeiStore = defineStore('pei', () => {
  /***** ESTADOS REACTIVOS DEL STORE ******/
  const peis = ref([]) //Almacena la lista completa de PEIs
  const peiActual = ref(null) //Almacena el PEI seleccionado
  const peiEstructura = ref(null) //Almacena la estructura del PEI seleccionado
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

  //Obtener Estructura del PEI por ID
  const obtenerPeiEstructuraPorId = async (id) => {
    cargando.value = true
    try {
      peiEstructura.value = await peiServicios.obtenerEstructuraPorId(id)
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
  //Funcion auxiliar para actualizar el store despues de agregar un indicadpr
  const agregarIndicadorLocalmente = (objetivoId, nuevoIndicador, tipo) => {
    //Si los objetivos son null no se procede
    //Esta es la comprobacion de q la peticion ha sido exitosa
    if (!peiObjIndPorId.value?.objetivos) return
    //Comprobar si el objetivo existe
    const objetivoIndex = peiObjIndPorId.value.objetivos.findIndex((obj) => obj.id === objetivoId)
    if (objetivoIndex !== -1) {
      if (!peiObjIndPorId.value.objetivos[objetivoIndex].indicadores) {
        peiObjIndPorId.value.objetivos[objetivoIndex].indicadores = []
      }
      // Agregar el nuevo indicador al objetivo correspondiente
      peiObjIndPorId.value.objetivos[objetivoIndex].indicadores.push({
        ...nuevoIndicador,
        tipo, // 'cualitativo' o 'cuantitativo'
      })
    }
  }

  //Agregar indicador cualitativo
  const agregarIndicadorCualitativo = async (objetivoId, datosIndicador) => {
    cargando.value = true
    error.value = null
    try {
      // 1. Hacer la petición al API
      //const nuevoIndicador = await indicadorCualitativoServicios.crear(datosIndicador)
      const nuevoIndicador = await indicadorPeiServicios.crearIndCualitativo(datosIndicador)

      // 2. Actualizar el store localmente si la petición fue exitosa
      agregarIndicadorLocalmente(objetivoId, nuevoIndicador, 'cualitativo')

      return nuevoIndicador // Devolver el indicador creado
    } catch (err) {
      error.value = err.message
      throw err // Relanzar el error para manejarlo en el componente
    } finally {
      cargando.value = false
    }
  }
  // Agregar indicador cuantitativo
  const agregarIndicadorCuantitativo = async (objetivoId, datosIndicador) => {
    cargando.value = true
    error.value = null
    try {
      // 1. Hacer la petición al API
      //const nuevoIndicador = await indicadorCuantitativoServicios.crear(datosIndicador)
      const nuevoIndicador = await indicadorPeiServicios.crearIndCuantitativo(datosIndicador)

      // 2. Actualizar el store localmente si la petición fue exitosa
      agregarIndicadorLocalmente(objetivoId, nuevoIndicador, 'cuantitativo')

      return nuevoIndicador // Devolver el indicador creado
    } catch (err) {
      error.value = err.message
      throw err // Relanzar el error para manejarlo en el componente
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
    obtenerPeiEstructuraPorId,
    removerObjetivoLocalmente,
    eliminarObjetivo,
    agregarIndicadorCualitativo, // Accion
    agregarIndicadorCuantitativo, // Accion
  }
})
