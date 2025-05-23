import api from '@/services/axios'

export const peiVigenteServicio = {
  /* Obtener el PEI VIGENTE */
  peiVigente: async () => {
    try {
      const respuesta = await api.get('/pei-vigente/')
      return respuesta.data
    } catch (error) {
      console.error('AXIOS: err obtener PEI vigente', error)
    }
  },
  /* Establecer el PEI VIGENTE */
  cambiarPEI: async (id) => {
    try {
      const respuesta = await api.get('/pei-vigente/' + id + '/')
      return respuesta.data
    } catch (error) {
      console.error('AXIOS: err al cambiar el  PEI vigente', error)
    }
  },
}
