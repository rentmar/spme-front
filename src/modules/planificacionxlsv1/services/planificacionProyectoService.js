import { apiPlan } from '@/services/axios'

export const planificacionProyectoServicio = {
  guardarPlanificacion: async (payload) => {
    try {
      const respuesta = await apiPlan.post('/planificacion/guardar/', payload)
      return respuesta
    } catch (error) {
      console.error('Axios: No se pudo almacenar la planificacion', error)
      throw error
    }
  },
}
