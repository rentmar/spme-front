import { apiRep } from '@/services/axios'

export const bitacoraServicios = {
  /********************bitacora indicador og*********************************/
  /* Todos los registros */
  bitacoraOgAll: async () => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-og-crud/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener todas las bitacoras de Indicador-og', err)
      throw err
    }
  },
  /* Un registro */
  bitacoraOgPorId: async (idbindicadorog) => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-og-crud/' + idbindicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener la bitacora del Indicador-og con id ' + idbindicadorog,
        err,
      )
      throw err
    }
  },
  /* Crear una entrada */
  bitacoraOgCrear: async (dataBitacora) => {
    try {
      const respuesta = await apiRep.post('/bitacora-indicador-og-crud/', dataBitacora)
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al crear entrada en la bitacora indicador-og', err)
      throw err
    }
  },
  /* Crear un update de bitagora */
  bitacoraOgupdate: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.put('/bitacora-indicador-og-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al actualizar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /* Eliminar una entrada de la bitacora */
  bitacoraOgdel: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.delete('/bitacora-indicador-og-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al eliminar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /********************bitacora indicador oe*********************************/
  /* Todos los registros */
  bitacoraOeAll: async () => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-oe-crud/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener todas las bitacoras de Indicador-og', err)
      throw err
    }
  },
  /* Un registro */
  bitacoraOePorId: async (idbindicadorog) => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-oe-crud/' + idbindicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener la bitacora del Indicador-og con id ' + idbindicadorog,
        err,
      )
      throw err
    }
  },
  /* Crear una entrada */
  bitacoraOeCrear: async (dataBitacora) => {
    try {
      const respuesta = await apiRep.post('/bitacora-indicador-oe-crud/', dataBitacora)
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al crear entrada en la bitacora indicador-og', err)
      throw err
    }
  },
  /* Crear un update de bitagora */
  bitacoraOeUpdate: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.put('/bitacora-indicador-oe-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al actualizar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /* Eliminar una entrada de la bitacora */
  bitacoraOeDel: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.delete('/bitacora-indicador-oe-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al eliminar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /********************bitacora indicador resultado og*********************************/
  /* Todos los registros */
  bitacoraRogAll: async () => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-rog-crud/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener todas las bitacoras de Indicador-og', err)
      throw err
    }
  },
  /* Un registro */
  bitacoraRogPorId: async (idbindicadorog) => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-rog-crud/' + idbindicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener la bitacora del Indicador-og con id ' + idbindicadorog,
        err,
      )
      throw err
    }
  },
  /* Crear una entrada */
  bitacoraRogCrear: async (dataBitacora) => {
    try {
      const respuesta = await apiRep.post('/bitacora-indicador-rog-crud/', dataBitacora)
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al crear entrada en la bitacora indicador-og', err)
      throw err
    }
  },
  /* Crear un update de bitagora */
  bitacoraRogUpdate: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.put('/bitacora-indicador-rog-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al actualizar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /* Eliminar una entrada de la bitacora */
  bitacoraRogDel: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.delete('/bitacora-indicador-rog-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al eliminar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /********************bitacora indicador resultado oe*********************************/
  /* Todos los registros */
  bitacoraRoeAll: async () => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-roe-crud/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener todas las bitacoras de Indicador-og', err)
      throw err
    }
  },
  /* Un registro */
  bitacoraRoePorId: async (idbindicadorog) => {
    try {
      const respuesta = await apiRep.get('/bitacora-indicador-roe-crud/' + idbindicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error(
        'Axios: Error al obtener la bitacora del Indicador-og con id ' + idbindicadorog,
        err,
      )
      throw err
    }
  },
  /* Crear una entrada */
  bitacoraRoeCrear: async (dataBitacora) => {
    try {
      const respuesta = await apiRep.post('/bitacora-indicador-roe-crud/', dataBitacora)
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al crear entrada en la bitacora indicador-og', err)
      throw err
    }
  },
  /* Crear un update de bitagora */
  bitacoraRoeUpdate: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.put('/bitacora-indicador-roe-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al actualizar la entrada bitacora indicador-og', err)
      throw err
    }
  },
  /* Eliminar una entrada de la bitacora */
  bitacoraRoeDel: async (idIndicadorog) => {
    try {
      const respuesta = await apiRep.delete('/bitacora-indicador-roe-crud/' + idIndicadorog + '/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: error al eliminar la entrada bitacora indicador-og', err)
      throw err
    }
  },
}
