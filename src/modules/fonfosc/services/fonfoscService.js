import { apiFf } from '@/services/axios'

export const fonfoscServicios = {
  /**************************** CRUD BASICO*********************************************/
  /* Todos los FF */
  fftodos: async () => {
    try {
      const respuesta = await apiFf.get('/fon-fosc-proyectos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener los FF', error)
    }
  },
  ffporId: async (idff) => {
    try {
      const respuesta = await apiFf.get('/fon-fosc-proyectos/' + idff + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al obtener  FF' + idff, error)
    }
  },
  ffcrear: async (dataFf) => {
    try {
      const respuesta = await apiFf.post('/fon-fosc-proyectos/', dataFf)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear  FF', error)
    }
  },
  ffupdate: async (idff, dataFf) => {
    try {
      const respuesta = await apiFf.put('/fon-fosc-proyectos/' + idff + '/', dataFf)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar  FF' + idff, error)
    }
  },
  /************************ FUNCIONES VARIAS ***********************************/
  ffestructura: async (idproyectoff) => {
    try {
      const respuesta = await apiFf.get('/proyectos-fonfosc/' + idproyectoff + '/estructura/')
      return respuesta.data
    } catch (err) {
      console.error('Axios: Error al obtener la estrcutura con id: ' + idproyectoff, err)
    }
  },
}
