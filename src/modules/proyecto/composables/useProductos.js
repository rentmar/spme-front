//Composable useProducto
//Operaciones CRUD para Productos

import { ref } from 'vue'
import { productoObjEspecService } from '../services/resultadoProductosService'
import { productoResultadoObjEspecService } from '../services/resultadoProductosService'
import { productoGeneralService } from '../services/resultadoProductosService'

//Estados
const loading = ref(null)
const error = ref(null)
const productoGral = ref(null)
const productoOe = ref(null)
const productoResultadoOe = ref(null)

export function useProductos() {
  /**************** Productos Objetivos Especificos ********************/
  //Cargar producto oe por id
  async function cargarProductoOeporId(id) {
    loading.value = true
    try {
      const respuesta = await productoObjEspecService.obtenerPorId(id)
      productoOe.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear producto oe
  async function crearProductoOe(data) {
    loading.value = true
    try {
      const respuesta = await productoObjEspecService.crear(data)
      productoOe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Updare Prducto oe
  async function updateProductoOe(id, data) {
    loading.value = true
    try {
      const respuesta = await productoObjEspecService.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar Producto oe
  async function delProductoOe(id) {
    loading.value = true
    try {
      const respuesta = await productoObjEspecService.del(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**************** Productos Resultado Objetivos Especificos ********************/
  //Cargar producto oe por id
  async function cargarProductoResultadoOeporId(id) {
    loading.value = true
    try {
      const respuesta = await productoResultadoObjEspecService.obtenerPorId(id)
      productoResultadoOe.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear producto oe
  async function crearProductoResultadoOe(data) {
    loading.value = true
    try {
      const respuesta = await productoResultadoObjEspecService.crear(data)
      productoResultadoOe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Updare Prducto oe
  async function updateProductoResultadoOe(id, data) {
    loading.value = true
    try {
      const respuesta = await productoResultadoObjEspecService.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar Producto oe
  async function delProductoResultadoOe(id) {
    loading.value = true
    try {
      const respuesta = await productoResultadoObjEspecService.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**************** Productos Resultado Objetivos Especificos ********************/
  //Cargar producto oe por id
  async function cargarProductoGeneralPorId(id) {
    loading.value = true
    try {
      const respuesta = await productoGeneralService.obtenerPorId(id)
      productoGral.value = respuesta
      // productoResultadoOe.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Crear producto oe
  async function crearProductoGeneral(data) {
    loading.value = true
    try {
      const respuesta = await productoGeneralService.crear(data)
      productoGral.value = respuesta
      // productoResultadoOe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Updare Prducto oe
  async function updateProductoGeneral(id, data) {
    loading.value = true
    try {
      const respuesta = await productoGeneralService.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar Producto oe
  async function delProductoGeneral(id) {
    loading.value = true
    try {
      const respuesta = await productoGeneralService.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    productoOe, //ref Producto OE
    cargarProductoOeporId, //fun
    crearProductoOe, //fun
    updateProductoOe, //fun
    delProductoOe, //fun
    productoResultadoOe, //ref Producto Resultado OE
    cargarProductoResultadoOeporId,
    crearProductoResultadoOe,
    updateProductoResultadoOe,
    delProductoResultadoOe,
    productoGral, //ref Producto general
    cargarProductoGeneralPorId,
    crearProductoGeneral,
    updateProductoGeneral,
    delProductoGeneral,
  }
}
