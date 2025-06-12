import api from '@/services/axios'

export const resultadObjGralService = {
  /*******************  *************************/
  /* fetch todos los indicadores obj gral */
  obtener: async () => {
    try {
      const respuesta = await api.get('resultado-og/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('resultado-og/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('resultado-og/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios:  ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('resultado-og/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios:  ', error)
    }
  },
  /* Del  OG*/
  del: async (id) => {
    try {
      const respuesta = await api.delete('/' + id + '/')
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
      const respuesta = await api.get('/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador og ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador og id ', error)
    }
  },
  /* Del  OG*/
  del: async (id) => {
    try {
      const respuesta = await api.delete(' /' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador og con id ' + id, error)
    }
  },
}
export const productoObjEspecService = {
  /*******************  *************************/
  /* fetch */
  obtener: async () => {
    try {
      const respuesta = await api.get('')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador og ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador og id ', error)
    }
  },
  /* Del  */
  del: async (id) => {
    try {
      const respuesta = await api.delete('/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador og con id ' + id, error)
    }
  },
}
export const productoRsultadoObjEspecService = {
  /*******************  *************************/
  /* fetch */
  obtener: async () => {
    try {
      const respuesta = await api.get('')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch ', error)
    }
  },
  /* fetch  */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fetch con id ' + id, error)
    }
  },
  /* Crear  */
  crear: async (data) => {
    try {
      const respuesta = await api.post('/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: error crear indicador og ', error)
    }
  },
  /* Update */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/' + id + '/', data)
      return respuesta
    } catch (error) {
      console.error('Axios: error actualizar indicador og id ', error)
    }
  },
  /* Del  */
  del: async (id) => {
    try {
      const respuesta = await api.delete('/' + id + '/')
      return respuesta
    } catch (error) {
      console.error('Axios: no se pudo elimir indicador og con id ' + id, error)
    }
  },
}
