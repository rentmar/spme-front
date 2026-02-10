// composable para bitacoras de indicadores
import { ref } from 'vue'
import { bitacoraServicios } from '../services/bitacorasService'

export function useBitacorasIndicadores() {
  // Estados
  const loading = ref(false)
  const error = ref(null)
  const bitacorasOg = ref([])
  const bitacorasOe = ref([])
  const bitacorasRog = ref([])
  const bitacorasRoe = ref([])
  const bitacoraActual = ref(null)

  /**************************** OPERACIONES BITÁCORA OG *******************************************/

  // Obtener todas las bitácoras OG
  const obtenerBitacorasOg = async () => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOgAll()
      bitacorasOg.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener bitácoras OG'
      console.error('Error en obtenerBitacorasOg:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener bitácora OG por ID
  const obtenerBitacoraOgPorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOgPorId(id)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener la bitácora OG'
      console.error('Error en obtenerBitacoraOgPorId:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear bitácora OG
  const crearBitacoraOg = async (datosBitacora) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOgCrear(datosBitacora)
      // Agregar al inicio del listado
      bitacorasOg.value.unshift(respuesta)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al crear bitácora OG'
      console.error('Error en crearBitacoraOg:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar bitácora OG
  const actualizarBitacoraOg = async (id, datosActualizados) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOgUpdate(id, datosActualizados)

      // Actualizar en el listado
      const index = bitacorasOg.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasOg.value[index] = respuesta
      }

      // Actualizar bitácora actual si es la misma
      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = respuesta
      }

      return respuesta
    } catch (err) {
      error.value = 'Error al actualizar bitácora OG'
      console.error('Error en actualizarBitacoraOg:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar bitácora OG
  const eliminarBitacoraOg = async (id) => {
    loading.value = true
    error.value = null
    try {
      await bitacoraServicios.bitacoraOgdel(id)

      // Remover del listado
      const index = bitacorasOg.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasOg.value.splice(index, 1)
      }

      // Limpiar bitácora actual si es la misma
      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = null
      }

      return true
    } catch (err) {
      error.value = 'Error al eliminar bitácora OG'
      console.error('Error en eliminarBitacoraOg:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**************************** OPERACIONES BITÁCORA OE *******************************************/

  // Obtener todas las bitácoras OE
  const obtenerBitacorasOe = async () => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOeAll()
      bitacorasOe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener bitácoras OE'
      console.error('Error en obtenerBitacorasOe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener bitácora OE por ID
  const obtenerBitacoraOePorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOePorId(id)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener la bitácora OE'
      console.error('Error en obtenerBitacoraOePorId:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear bitácora OE
  const crearBitacoraOe = async (datosBitacora) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOeCrear(datosBitacora)
      bitacorasOe.value.unshift(respuesta)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al crear bitácora OE'
      console.error('Error en crearBitacoraOe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar bitácora OE
  const actualizarBitacoraOe = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraOeUpdate(id)

      const index = bitacorasOe.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasOe.value[index] = respuesta
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = respuesta
      }

      return respuesta
    } catch (err) {
      error.value = 'Error al actualizar bitácora OE'
      console.error('Error en actualizarBitacoraOe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar bitácora OE
  const eliminarBitacoraOe = async (id) => {
    loading.value = true
    error.value = null
    try {
      await bitacoraServicios.bitacoraOeDel(id)

      const index = bitacorasOe.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasOe.value.splice(index, 1)
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = null
      }

      return true
    } catch (err) {
      error.value = 'Error al eliminar bitácora OE'
      console.error('Error en eliminarBitacoraOe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**************************** OPERACIONES BITÁCORA RESULTADO OG *******************************************/

  // Obtener todas las bitácoras ROG
  const obtenerBitacorasRog = async () => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRogAll()
      bitacorasRog.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener bitácoras ROG'
      console.error('Error en obtenerBitacorasRog:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener bitácora ROG por ID
  const obtenerBitacoraRogPorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRogPorId(id)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener la bitácora ROG'
      console.error('Error en obtenerBitacoraRogPorId:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear bitácora ROG
  const crearBitacoraRog = async (datosBitacora) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRogCrear(datosBitacora)
      bitacorasRog.value.unshift(respuesta)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al crear bitácora ROG'
      console.error('Error en crearBitacoraRog:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar bitácora ROG
  const actualizarBitacoraRog = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRogUpdate(id)

      const index = bitacorasRog.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasRog.value[index] = respuesta
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = respuesta
      }

      return respuesta
    } catch (err) {
      error.value = 'Error al actualizar bitácora ROG'
      console.error('Error en actualizarBitacoraRog:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar bitácora ROG
  const eliminarBitacoraRog = async (id) => {
    loading.value = true
    error.value = null
    try {
      await bitacoraServicios.bitacoraRogDel(id)

      const index = bitacorasRog.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasRog.value.splice(index, 1)
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = null
      }

      return true
    } catch (err) {
      error.value = 'Error al eliminar bitácora ROG'
      console.error('Error en eliminarBitacoraRog:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**************************** OPERACIONES BITÁCORA RESULTADO OE *******************************************/

  // Obtener todas las bitácoras ROE
  const obtenerBitacorasRoe = async () => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRoeAll()
      bitacorasRoe.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener bitácoras ROE'
      console.error('Error en obtenerBitacorasRoe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener bitácora ROE por ID
  const obtenerBitacoraRoePorId = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRoePorId(id)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al obtener la bitácora ROE'
      console.error('Error en obtenerBitacoraRoePorId:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear bitácora ROE
  const crearBitacoraRoe = async (datosBitacora) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRoeCrear(datosBitacora)
      bitacorasRoe.value.unshift(respuesta)
      bitacoraActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = 'Error al crear bitácora ROE'
      console.error('Error en crearBitacoraRoe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar bitácora ROE
  const actualizarBitacoraRoe = async (id) => {
    loading.value = true
    error.value = null
    try {
      const respuesta = await bitacoraServicios.bitacoraRoeUpdate(id)

      const index = bitacorasRoe.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasRoe.value[index] = respuesta
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = respuesta
      }

      return respuesta
    } catch (err) {
      error.value = 'Error al actualizar bitácora ROE'
      console.error('Error en actualizarBitacoraRoe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar bitácora ROE
  const eliminarBitacoraRoe = async (id) => {
    loading.value = true
    error.value = null
    try {
      await bitacoraServicios.bitacoraRoeDel(id)

      const index = bitacorasRoe.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        bitacorasRoe.value.splice(index, 1)
      }

      if (bitacoraActual.value && bitacoraActual.value.id === id) {
        bitacoraActual.value = null
      }

      return true
    } catch (err) {
      error.value = 'Error al eliminar bitácora ROE'
      console.error('Error en eliminarBitacoraRoe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Limpiar bitácora actual
  const limpiarBitacoraActual = () => {
    bitacoraActual.value = null
  }

  // Reiniciar todos los estados
  const reiniciarEstados = () => {
    bitacorasOg.value = []
    bitacorasOe.value = []
    bitacorasRog.value = []
    bitacorasRoe.value = []
    bitacoraActual.value = null
    error.value = null
  }

  return {
    // Estados
    loading,
    error,
    bitacorasOg,
    bitacorasOe,
    bitacorasRog,
    bitacorasRoe,
    bitacoraActual,

    // Métodos OG
    obtenerBitacorasOg,
    obtenerBitacoraOgPorId,
    crearBitacoraOg,
    actualizarBitacoraOg,
    eliminarBitacoraOg,

    // Métodos OE
    obtenerBitacorasOe,
    obtenerBitacoraOePorId,
    crearBitacoraOe,
    actualizarBitacoraOe,
    eliminarBitacoraOe,

    // Métodos ROG
    obtenerBitacorasRog,
    obtenerBitacoraRogPorId,
    crearBitacoraRog,
    actualizarBitacoraRog,
    eliminarBitacoraRog,

    // Métodos ROE
    obtenerBitacorasRoe,
    obtenerBitacoraRoePorId,
    crearBitacoraRoe,
    actualizarBitacoraRoe,
    eliminarBitacoraRoe,

    // Métodos generales
    limpiarBitacoraActual,
    reiniciarEstados,
  }
}
