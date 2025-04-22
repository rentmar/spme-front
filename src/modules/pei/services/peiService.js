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
}
