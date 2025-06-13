import api from '@/services/axios'

export const indicadoresServicios = {
  /******************* Indicadores Objetivo General *************************/
  /* fetch todos los indicadores obj gral */
  indicadoresOg: async () => {
    try {
      const respuesta = await api.get('indicadores-og/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch Indicador OG por ID */
  indicadorOgPorId: async (id) => {
    try {
      const respuesta = await api.get('indicadores-og/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear nuevo Indicador OG */
  crearIndicadorOg: async (data) => {
    try {
      const respuesta = await api.post('indicadores-og/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador og ', error)
    }
  },
  /* Update Indicador OG*/
  updateIndicadorOg: async (id, data) => {
    try {
      const respuesta = await api.put('indicadores-og/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador og id ', error)
    }
  },
  /* Del Indicador OG*/
  delIndicadorOg: async (id) => {
    try {
      const respuesta = await api.delete('indicadores-og/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador og con id ' + id, error)
    }
  },
  /******************* Indicadores de Resultado OG *************************/
  /* Todos los indicadores */
  indicadorResultadoOg: async () => {
    try {
      const respuesta = await api.get('indicador-resultado-og/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Indicador Res OG fetch erro ', error)
    }
  },
  /* Indicador por id */
  indicadorResultadoOgPorId: async (id) => {
    try {
      const respuesta = await api.get('indicador-resultado-og/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Indicador Res OG fetch erro ID ' + id, error)
    }
  },
  /* Crear indicador Resultado Og */
  crearIndicadorResultadoOg: async (data) => {
    try {
      const respuesta = await api.post('indicador-resultado-og/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador resultado og ', error)
    }
  },
  /* Update indicador resultado og */
  updateIndicadorResultadoOg: async (id, data) => {
    try {
      const respuesta = await api.put('indicador-resultado-og/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador res og id ' + id, error)
    }
  },
  /* Eliminar Indicador Resultado OG */
  delIndicadorResultadoOg: async (id) => {
    try {
      const respuesta = await api.delete('indicador-resultado-og/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador res og con id ' + id, error)
    }
  },
  /******************* Indicadores de Objetivo Especifico *************************/
  /* Todos los indicadores */
  indicadorObjEspec: async () => {
    try {
      const respuesta = await api.get('/indicador-oe/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fecth Indicador OE error', error)
      throw error
    }
  },
  /* Indicador OE por ID */
  indicadorObjEspecPorId: async (id) => {
    try {
      const respuesta = await api.get('/indicador-oe/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fecth Indicador OE error con ID ' + id, error)
      throw error
    }
  },
  /* Crear Indicador OE */
  crearIndicadorObjEspc: async (data) => {
    try {
      const respuesta = await api.post('/indicador-oe/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios, error al crear Indicador OE', error)
      throw error
    }
  },
  /* Actualizar INdicador OE */
  updateIndicadorObjEspc: async (id, data) => {
    try {
      const respuesta = await api.put('/indicador-oe/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar el Indicador OE', error)
      throw error
    }
  },
  /* Eliminar Indicador OE */
  deleteIndicadorObjEspec: async (id) => {
    try {
      const respuesta = await api.delete('/indicador-oe/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: Error al eliminar el Indicador OE con ID ' + id, error)
      throw error
    }
  },
  /******************* Indicadores de Resultado Objetivo Especifico *************************/
  /* Todos los indicadores */
  indicadorResultadoObjEspec: async () => {
    try {
      const respuesta = await api.get('/indicador-resultado-oe/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fecth Indicador Resultado OE error', error)
      throw error
    }
  },
  /* Indicador OE por ID */
  indicadorResultadoObjEspecPorId: async (id) => {
    try {
      const respuesta = await api.get('/indicador-resultado-oe/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: fecth Indicador Resultado OE error con ID ' + id, error)
      throw error
    }
  },
  /* Crear Indicador OE */
  crearIndicadorResultadoObjEspc: async (data) => {
    try {
      const respuesta = await api.post('/indicador-resultado-oe/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios, error al crear Indicador Resultado OE', error)
      throw error
    }
  },
  /* Actualizar INdicador OE */
  updateIndicadorResultadoObjEspc: async (id, data) => {
    try {
      const respuesta = await api.put('/indicador-resultado-oe/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar el Indicador Resultado OE', error)
      throw error
    }
  },
  /* Eliminar Indicador OE */
  deleteIndicadorResultadoObjEspec: async (id) => {
    try {
      const respuesta = await api.delete('/indicador-resultado-oe/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: Error al eliminar el Indicador Resultado OE con ID ' + id, error)
      throw error
    }
  },
}
