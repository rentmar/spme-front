// composable/useIndicadores
// Operaciones crud para los Indicadores

import { ref } from 'vue'
import { indicadoresServicios } from '../services/indicadoresService'

//Estados
const indicadorObjGeneral = ref(null)
const indicadorObjetivoEspecifico = ref(null)
const indicadorResultadoObjGeneral = ref(null)
const indicadorResultadoObjEspecifico = ref(null)
const listaIndicadoresOg = ref(null)
const listaIndicadoresRog = ref(null)
const listaIndicadoresOe = ref(null)
const listaIndicadoresRoe = ref(null)
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

  //Cargar una lista de Indicadores OG
  async function cargarIndicadoresOgporIds(dataArrayId) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.fetchIndicadoresOgPorIds(dataArrayId)
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

  //Cargar una lista de Indicadores OG
  async function cargarIndicadoresResultadoOgPorIds(dataArrayId) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.fetchIndicadoresRogPorIds(dataArrayId)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /*********** Indicadores obejtivo Especifico *************/
  //cargar por id
  async function cargarIndicadorObjEspecifico(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.indicadorObjEspecPorId(id)
      indicadorObjetivoEspecifico.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearIndicadorObjEspecifico(data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.crearIndicadorObjEspc(data)
      indicadorObjetivoEspecifico.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //update
  async function updateIndicadorObjEspecifico(id, data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.updateIndicadorObjEspc(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Del
  async function delIndicadorObjEspecifico(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.deleteIndicadorObjEspec(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Cargar una lista de Indicadores OE
  async function cargarIndicadoresOePorIds(dataArrayId) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.fetchIndicadoresOePorIds(dataArrayId)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /*********** Indicadores Resultado Objetivo Especifico *************/
  //cargar por id
  async function cargarIndicadorResultadoObjEspecifico(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.indicadorResultadoObjEspecPorId(id)
      indicadorResultadoObjEspecifico.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearIndicadorResultadoObjEspecifico(data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.crearIndicadorResultadoObjEspc(data)
      indicadorResultadoObjEspecifico.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //update
  async function updateIndicadorResultadoObjEspecifico(id, data) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.updateIndicadorResultadoObjEspc(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Del
  async function delIndicadorResultadoObjEspecifico(id) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.deleteIndicadorResultadoObjEspec(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar una lista de Indicadores OE
  async function cargarIndicadoresResultadoOePorIds(dataArrayId) {
    loading.value = true
    try {
      const respuesta = await indicadoresServicios.fetchIndicadoresRoePorIds(dataArrayId)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    indicadorObjGeneral, //ref
    indicadorObjetivoEspecifico, //ref
    indicadorResultadoObjGeneral, //ref
    indicadorResultadoObjEspecifico, //ref
    loading, //ref
    error, //ref
    listaIndicadoresOg,
    listaIndicadoresRog,
    listaIndicadoresOe,
    listaIndicadoresRoe,
    // Ind Objj General
    cargarIndicadorObjGeneralPorId, //func
    crearIndicadorObjetivoGeneral, //func
    updateIndicadorObjetivoGeneral, //func
    // Ind Res Obj Gral
    cargarIndicadorResultadoObjGeneralPorId, //func
    crearIndicadorResultadoObjetivoGeneral, //func
    updateIndicadorResultadoObjetivoGeneral, //func
    delIndicadorResultadoObjetivoGeneral, //func
    //Ind Obj Espec
    cargarIndicadorObjEspecifico, //func
    crearIndicadorObjEspecifico, //func
    updateIndicadorObjEspecifico, //func
    delIndicadorObjEspecifico, //func
    //Indicador Resultado obj esp
    cargarIndicadorResultadoObjEspecifico,
    crearIndicadorResultadoObjEspecifico,
    updateIndicadorResultadoObjEspecifico,
    delIndicadorResultadoObjEspecifico,
    //fectch indicadores
    cargarIndicadoresOgporIds,
    cargarIndicadoresResultadoOgPorIds,
    cargarIndicadoresOePorIds,
    cargarIndicadoresResultadoOePorIds,
  }
}
