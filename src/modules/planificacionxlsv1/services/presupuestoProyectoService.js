import { apiPres } from '@/services/axios'
import { apiPlan } from '@/services/axios'
export const presupuestoProyectoServicio = {
  /*Obtener el arbol de presupuesto completo*/
  arbolPresupuestoCompleto: async (idproyecto) => {
    try {
      const respuesta = await apiPres.get('/proyecto/arbol-presupuesto/', {
        params: {
          nodo: 'proyecto',
          id: idproyecto,
          depth: 'all',
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Axios: Error al cargar el arbol presupuestario', error)
      throw error
    }
  },
  /**
   * Obtener solo un nodo específico del árbol
   * @param {string} tipoNodo - proyecto, actividad, tarea, resultado_actividades, resultado_tareas
   * @param {number} id - ID del nodo
   * @param {string|number} depth - all, self, 1, 2
   * @param {string} direction - down, up, both
   */
  obtenerNodo: async (tipoNodo, id, depth = 'all', direction = 'down') => {
    try {
      const respuesta = await apiPres.get('/arbol-presupuesto/', {
        params: {
          nodo: tipoNodo,
          id,
          depth,
          direction,
        },
      })
      return respuesta.data
    } catch (error) {
      console.error(`Error al obtener nodo ${tipoNodo}:${id}:`, error)
      throw error
    }
  },
  /*actualizar precio actividad*/
  actualizarPresupuestoActividad: async (idactividad, nuevoPresupuesto) => {
    try {
      const respuesta = await apiPlan.put(
        '/actividad-planificacion-proyecto/' + idactividad + '/',
        {
          presupuesto: nuevoPresupuesto,
        },
      )
      return respuesta.data
    } catch (error) {
      console.error('Error al actualizar el presupuesto', error)
      throw error
    }
  },
  /*actualizar precio actividad*/
  actualizarActividad: async (idactividad, data) => {
    try {
      const respuesta = await apiPlan.put(
        '/actividad-planificacion-proyecto/' + idactividad + '/',
        data,
      )
      return respuesta.data
    } catch (error) {
      console.error('Error al actualizar el presupuesto', error)
      throw error
    }
  },
  /* Crear actividad */
  crearActividad: async (data) => {
    try {
      const respuesta = await apiPlan.post('/actividad-planificacion-proyecto/', data)
      return respuesta
    } catch (error) {
      console.error('Error al crear la actividad')
      throw error
    }
  },
  /*Crear tarea*/
  crearTareaActividad: async (data) => {
    try {
      const respuesta = await apiPlan.post('/tarea-planificacion-proyecto/', data)
      return respuesta.data
    } catch (error) {
      console.error('Error al actualizar actividad', error)
      throw error
    }
  },
  /*Actualizar tarea*/
  actualizarTareaActividad: async (idtarea, data) => {
    try {
      const respuesta = await apiPlan.put('/tarea-planificacion-proyecto/' + idtarea + '/', data)
      return respuesta
    } catch (error) {
      console.error('Error al actualizar tarea', error)
      throw error
    }
  },
  /** Obtener solo el proyecto (sin actividades ni tareas) */
  obtenerProyecto: async (idproyecto) => {
    try {
      const respuesta = await apiPres.get('/proyecto/arbol-presupuesto/', {
        params: {
          nodo: 'proyecto',
          id: idproyecto,
          depth: 'self',
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener el proyecto:', error)
      throw error
    }
  },
  /** Obtener solo la actividad (sin tareas ni formularios) */
  obtenerActividad: async (idactividad) => {
    try {
      const respuesta = await apiPres.get('/proyecto/arbol-presupuesto/', {
        params: {
          nodo: 'actividad',
          id: idactividad,
          depth: 'all',
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener la actividad:', error)
      throw error
    }
  },
  /** Obtener solo la tarea (incluye formularios siempre) */
  obtenerTarea: async (idtarea) => {
    try {
      const respuesta = await apiPres.get('/proyecto/arbol-presupuesto/', {
        params: {
          nodo: 'tarea',
          id: idtarea,
          depth: 'self',
        },
      })
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener la tarea:', error)
      throw error
    }
  },
}
