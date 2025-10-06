//Servicios para peticiones para los formularios del monitoreo
import api from '@/services/axios'

export const formulariosServico = {
  /* Crear formulario minimo  de Informe de Actividad */
  crearInformeActividadMinimo: async (informeActividadMinData) => {
    try {
      const respuesta = await api.post(informeActividadMinData)
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al crear el Informe de Actividad Minimo', error)
      throw error
    }
  },
}
