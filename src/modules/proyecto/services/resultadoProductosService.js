import api from '@/services/axios'

export const resultadObjGralService = {
  /*******************  *************************/
  /* fetch todos los indicadores obj gral */
  obtener: async () => {
    try {
      const respuesta = await api.get('/resultado-og/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/resultado-og/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/resultado-og/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios:  ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/resultado-og/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios:  ', error)
    }
  },
  /* Del  OG*/
  del: async (id) => {
    try {
      const respuesta = await api.delete('/resultado-og/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios:   ' + id, error)
    }
  },
}

export const resultadObjEspecService = {
  /*******************  *************************/
  /* fetch todos los indicadores obj gral */
  obtener: async () => {
    try {
      const respuesta = await api.get('/resultado-oe/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch resultado oe ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/resultado-oe/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch resultado oe con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/resultado-oe/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear resultado oe ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/resultado-oe/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar resultado oe ', error)
    }
  },
  /* Del  OG*/
  del: async (id) => {
    try {
      const respuesta = await api.delete('/resultado-oe/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir resultado oe con id ' + id, error)
    }
  },
}
export const productoObjEspecService = {
  /*******************  *************************/
  /* fetch */
  obtener: async () => {
    try {
      const respuesta = await api.get('/producto-oe/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/producto-oe/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/producto-oe/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador og ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/producto-oe/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador og id ', error)
    }
  },
  /* Del  */
  del: async (id) => {
    try {
      const respuesta = await api.delete('/producto-oe/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador og con id ' + id, error)
    }
  },
}
export const productoResultadoObjEspecService = {
  /*******************  *************************/
  /* fetch */
  obtener: async () => {
    try {
      const respuesta = await api.get('/producto-result-oe/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch producto resultado oe ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/producto-result-oe/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch producto resultado oe con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/producto-result-oe/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear producto resultado oe ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/producto-result-oe/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar producto resultado oe id ', error)
    }
  },
  /* Del  */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/producto-result-oe/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador producto resultado oe id ' + id, error)
    }
  },
}

export const productoGeneralService = {
  /*******************  *************************/
  /* fetch */
  obtener: async () => {
    try {
      const respuesta = await api.get('/producto-general/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch producto general ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/producto-general/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch producto general' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/producto-general/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear producto general', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/producto-general/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar producto general', error)
    }
  },
  /* Del  */
  delete: async (id) => {
    try {
      const respuesta = await api.delete('/producto-general/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador producto resultado oe id ' + id, error)
    }
  },
}
