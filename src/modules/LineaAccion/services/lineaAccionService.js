import api from '@/services/axios'

export const lineaAccionServicios = {
  /* Obtener todas las lineas de accion */
  obtenerTodo: async () => {
    try {
      const respuesta = await api.get('/lineas_accion')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo obtener la lista de Lineas de Accion', error)
    }
  },
  /* Obtener por ID */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await api.get('/lineas_accion/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo obtener la Linea de Accion con ID: ' + id, error)
    }
  },
  /* Crear Nueva Linea de Accion */
  crear: async (lineaData) => {
    try {
      const respuesta = await api.post('/lineas_accion/', lineaData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear nueva linea de accion', error)
      throw error
    }
  },
  /* Actualizar linea de accion */
  actualizar: async (id, lineaData) => {
    try {
      const respuesta = await api.put('/lineas_accion/' + id + '/', lineaData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al actualizar Línea de Acción con ID: ' + id, error)
      throw error
    }
  },
  /*Eliminar lineas de accion*/
  eliminar: async (id) => {
    try {
      const respuesta = await api.delete('/lineas_accion/' + id)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al eliminar Línea de Acción con ID: ' + id, error)
      throw error
    }
  },
}
