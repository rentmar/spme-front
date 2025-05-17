import api from '@/services/axios'

export const peiServicios = {
  /*Todos los PEIs*/
  obtenerTodos: async () => {
    try {
      const respuesta = await api.get('/pei')
      return respuesta.data
    } catch (error) {
      console.error('No se pudo obtener la lista de PEIs', error)
    }
  },
  /* PEI por identificador */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/pei/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.log('No se pudo obtener el PEI don id: ' + id, error)
    }
  },
  /* PEI - objetivos -indicadores */
  obtenerPeiObjIndPorId: async (id) => {
    try {
      const respuesta = await api.get('/pei/' + id + '/objetivos/')
      return respuesta.data
    } catch (error) {
      console.log('Axios: Fallo al obtenre el PEI con id: ' + id, error)
    }
  },
  /* Crera nuevo pei*/
  crear: async (peiData) => {
    try {
      const respuesta = await api.post('/pei/', peiData)

      console.log('axios reps ' + respuesta.data)
      return respuesta.data
    } catch (error) {
      console.log('Axios: No se pudo crear el PEI', error)
      throw error
    }
  },
  /* Eliminar PEI */
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/pei/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el PEI con ID: ' + id, error)
      throw error
    }
  },
}

export const objetivoPeiServicios = {
  /* Crear un Objetivo PEI */
  crear: async (objData) => {
    try {
      const respuesta = await api.post('/objetivos-pei/', objData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo crear el Objetivo PEI')
      throw error
    }
  },
  /* Eliminar objetivos */
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/objetivos-pei/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo eliminar el objetivo Pei con Id: ' + id, error)
      throw error
    }
  },
}

export const indicadorPeiServicios = {
  /*Eliminar indicador de Pei sin importar su tipo */
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/indicadores/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo elimira el indicador de PEI con ID: ' + id, error)
      throw error
    }
  },
}
