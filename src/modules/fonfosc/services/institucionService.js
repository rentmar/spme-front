import { apiFf } from '@/services/axios'

export const institucionServicios = {
  /**************************** CRUD BASICO*********************************************/
  /* Todos los FF */
  instodos: async () => {
    try {
      const respuesta = await apiFf.get('/instituciones/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener los FF', error)
    }
  },
  insporId: async (idins) => {
    try {
      const respuesta = await apiFf.get('/instituciones/' + idins + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener  FF' + idins, error)
    }
  },
  inscrear: async (dataFf) => {
    try {
      const respuesta = await apiFf.post('/instituciones/', dataFf)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear  FF', error)
    }
  },
  insupdate: async (idinst, data) => {
    try {
      const respuesta = await apiFf.put('/instituciones/' + idinst + '/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  FF' + idinst, error)
    }
  },
}
