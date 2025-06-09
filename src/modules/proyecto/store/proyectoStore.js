import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  proyectoServicios,
  proyectoObjetivos,
  proyectoResultadoProducto,
} from '../services/proyectoService'

//Store de los proyectos
export const useProyectoStore = defineStore('proyecto', () => {
  /**** Estados activos del Store ****/
  const proyectos = ref([]) //Lista de proyectos
  const proyectoActual = ref(null) //Almacena el proyecto seleccionado
  const proyectoEstructura = ref(null) //Proyecto estrucutra
  const proyectosPlanificacion = ref([]) //Almacena los proyectos en estado de Planificacion
  const proyecto_objgeneral_info = ref(null) //Proyecto - objetivo-general-info adicional
  const objetivosIndicadores = ref([])
  const cargando = ref(false) //Indicador de carga
  const error = ref(null) //Mensaje de error
  /***  ACCIONES    ***/
  //Obtener todos los Proyectos
  const obtenerProyectos = async () => {
    cargando.value = true
    error.value = null
    //Peticion htttp y almacena en los estados
    try {
      const response = await proyectoServicios.obtenerTodos()
      proyectos.value = Array.isArray(response) ? response : []
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  //Obtener un proyecto por ID
  const obtenerProyectoPorId = async (id) => {
    cargando.value = true
    error.value = null
    //Peticion Http y almacena en los estados
    try {
      proyectoActual.value = await proyectoServicios.obtenertPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  //Estructura del proyecto
  const obtenerProyectoEstructuraPorId = async (id) => {
    cargando.value = true
    error.value = null
    try {
      proyectoEstructura.value = await proyectoServicios.estructuraPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  //Obtener una lista de proyectos en estado de planificacion del PEI vigente
  const obtenerProyectosPlanificacion = async (idpei) => {
    cargando.value = true
    error.value = null
    //Peticion http y almacenamiento de datos
    try {
      proyectosPlanificacion.value = await proyectoServicios.obtenerTodosPlanificacion(idpei)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  /* Objetivos generales y especificos, con indicadores asociados */
  /* Separar esta funcion en dos PENDIENTE */
  const objetivosIndPorIdProyecto = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      objetivosIndicadores.value =
        await proyectoObjetivos.objetivosIndicadoresPorIdProyecto(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  const proyectoObjGeneralInfo = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      proyecto_objgeneral_info.value = await proyectoServicios.proyecto_objgral_info(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  return {
    proyectos, //ref
    proyectoActual, //ref
    proyectoEstructura, //ref
    proyectosPlanificacion, //ref Todos los proyectos en estado de PLANIFICACION
    proyectoObjetivos, //ref
    objetivosIndicadores, //ref
    proyecto_objgeneral_info, //ref
    cargando, //ref
    error, //ref
    obtenerProyectos, //accion
    obtenerProyectosPlanificacion, //accion, todos los proyectos en estado de planificacion
    obtenerProyectoPorId, //accion
    obtenerProyectoEstructuraPorId, //accion
    objetivosIndPorIdProyecto, //accion
    proyectoObjGeneralInfo, //accion
  }
})

//Store de los objetivos generales
export const useProyObjetivoGralStore = defineStore('proyObjetivoGeneral', () => {
  const objetivosGenerales = ref([])
  const objetivoGeneral = ref()
  const objetivosGeneralPorIdProyecto = ref([])
  const cargando = ref(false)
  const error = ref(null)

  /****** ACCIONES ******/
  /* Todos los objetivos generales */
  const objetivosGeneralesAll = async () => {
    cargando.value = true
    error.value = null
    try {
      objetivosGenerales.value = await proyectoObjetivos.generalesAll()
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Objetivo general por ID */
  const objetivoGeneralPorID = async (id) => {
    cargando.value = true
    error.value = null
    try {
      objetivoGeneral.value = await proyectoObjetivos.especificosPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Objetivo general por Id de proyecto */
  const objetivoGeneralPorIdProyecto = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      objetivosGeneralPorIdProyecto.value =
        await proyectoObjetivos.generalesPorIdProyecto(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  return {
    cargando,
    error,
    objetivosGenerales,
    objetivoGeneral,
    objetivosGeneralPorIdProyecto,
    objetivosGeneralesAll,
    objetivoGeneralPorID,
    objetivoGeneralPorIdProyecto,
  }
})

//Store de los objetivos especificos
export const useProyObjetivoEspStore = defineStore('proyObjetivoEspecifico', () => {
  const objetivosEspecificos = ref([])
  const objetivoEspecifico = ref()
  const objetivoEspPorIdProyecto = ref([])
  const cargando = ref(false)
  const error = ref(null)
  /****** ACCIONES ******/
  /* Todos los objetivos especificos */
  const objetivosEspecificosAll = async () => {
    cargando.value = true
    error.value = null
    try {
      objetivosEspecificos.value = await proyectoObjetivos.especificosAll()
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Objetivo especifico por ID de proyecto */
  const objetivoEspecificoPorID = async (id) => {
    cargando.value = true
    error.value = null
    try {
      objetivoEspecifico.value = await proyectoObjetivos.especificosPorId(id)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Objetivo especifico por id de proyecto */
  const objetivoEspecificoPorIdProyecto = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      objetivoEspPorIdProyecto.value = await proyectoObjetivos.especificosPorIdProyecto(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }

  return {
    cargando, //ref
    error, //ref
    objetivosEspecificos, //ref
    objetivoEspecifico, //ref
    objetivoEspPorIdProyecto, //ref
    objetivosEspecificosAll, //accion
    objetivoEspecificoPorID, //accion
    objetivoEspecificoPorIdProyecto, //accion
  }
})

/* Store para los resultados y producto */
export const useResultProductStore = defineStore('ResultProduc', () => {
  /* Estados */
  const resulProductIndicadoresIdProyecto = ref([])
  const resultProdActividadesIdProyecto = ref([])
  const cargando = ref(false)
  const error = ref(null)

  /******** Acciones **********/
  /* Obtener resultados productos con sus indicadores filtrado por Id de proyecto */
  const proyResultProdIndPorIdProyecto = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      resulProductIndicadoresIdProyecto.value =
        await proyectoResultadoProducto.resultadoProdIndicadoresPorIdProyecto(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Obtener resultados productos con actividades filtrado por id de proyecto */
  const proyResultProdActividadesPorIdProyecto = async (idproyecto) => {
    cargando.value = true
    error.value = null
    try {
      resultProdActividadesIdProyecto.value =
        await proyectoResultadoProducto.resultadoProdActividadesPorIdProyecto(idproyecto)
    } catch (err) {
      error.value = err
    } finally {
      cargando.value = false
    }
  }
  /* Retorno de estados, acciones y getters */
  return {
    resulProductIndicadoresIdProyecto, //ref
    resultProdActividadesIdProyecto, //ref
    cargando, //ref
    error, //ref
    proyResultProdIndPorIdProyecto, //Accion
    proyResultProdActividadesPorIdProyecto, //Accion
  }
})
