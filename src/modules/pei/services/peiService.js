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
  /* PEI - Obtener estructura por id */
  getEstructuraPorId: async (id) => {
    try {
      const respuesta = await api.get('/pei/estructura/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.log('Error PEI estructura con id: ' + id, error)
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
  /* Actualizar el PEi */
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/pei/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar el pei con ID: ' + id, error)
      throw error
    }
  },
  /* Extraer objetivos pei por idpei */
  objetivosPeiPorIdPei: async (idpei) => {
    try {
      const respuesta = await api.get('/pei/' + idpei + '/objetivos-pei/')
      return respuesta.data.data
    } catch (error) {
      console.error('No se pudo obtener la lista de PEIs', error)
    }
  },
  /* Extraer indicadores pei por idpei */
  indicadoresPeiPorIdPei: async (idpei) => {
    try {
      const respuesta = await api.get('/pei/' + idpei + '/indicadores-pei/')
      return respuesta.data.data
    } catch (error) {
      console.error('No se pudo obtener la lista de PEIs', error)
    }
  },
  /* Extraer las actividades y tareas del pei */
  actividadesPorIdPei: async (idpei) => {
    try {
      const respuesta = await api.get('/pei/' + idpei + '/actividades-con-tareas/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: no se pudo obtener la lista de actividades del pei: ' + idpei, err)
    }
  },
  /* Estructura del pei */
  obtenerEstructuraPeiPorId: async (idpei) => {
    try {
      const respuesta = await api.get('/pei/' + idpei + '/estructura/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: no se pudo obtener la estructura del pei: ' + idpei, err)
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
  update: async (id, data) => {
    try {
      const respuesta = await api.put('/objetivos-pei/' + id + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se actualizo objetivo pei id: ' + id, error)
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
  /* Crear indicador cuantitativo  */
  crearIndCuantitativo: async (indData) => {
    try {
      const respuesta = await api.post('/indicadores-cuantitativos/', indData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo crear el indicador cualitativo', error)
      throw error
    }
  },
  /* Crear indicador cualitativo */
  crearIndCualitativo: async (indData) => {
    try {
      const respuesta = await api.post('/indicadores-cualitativos/', indData)
      return respuesta.data
    } catch (error) {
      console.log('Axios: Error al crear el indicador cualitativo', error)
      throw error
    }
  },
}
