import { apiPlan } from '@/services/axios'

export const ganttServicio = {
  /* Gantt */
  datosGantt: async () => {
    try {
      const respuesta = await apiPlan.get('/gantt/proyectos/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se puede cargar la informacion para el gantt', error)
    }
  },
}
