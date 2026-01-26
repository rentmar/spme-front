import { apiFf } from '@/services/axios'

export const depBolServicios = {
  /**************************** CRUD BASICO*********************************************/
  /* Todos los FF */
  depboltodos: async () => {
    try {
      const respuesta = await apiFf.get('/departamentos-bolivia/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener los FF', error)
    }
  },
  depbolporId: async (idff) => {
    try {
      const respuesta = await apiFf.get('/departamentos-bolivia/' + idff + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener  FF' + idff, error)
    }
  },
  depbolcrear: async (dataFf) => {
    try {
      const respuesta = await apiFf.post('/departamentos-bolivia/', dataFf)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear  FF', error)
    }
  },
  depbolupdate: async (idff, dataFf) => {
    try {
      const respuesta = await apiFf.put('/departamentos-bolivia/' + idff + '/', dataFf)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  FF' + idff, error)
    }
  },
}
