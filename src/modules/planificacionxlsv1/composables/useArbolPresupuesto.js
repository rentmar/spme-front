// composables/useArbolPresupuesto.js
import { ref, watch, toValue, onUnmounted } from 'vue'
import { presupuestoProyectoServicio } from '../services/presupuestoProyectoService'

export function useArbolPresupuesto(idNodo, tipoNodo, { intervalo = null } = {}) {
  const datos = ref(null)
  const cargando = ref(false)
  const error = ref(null)
  let timer = null

  async function cargar() {
    const id = toValue(idNodo)
    const tipo = toValue(tipoNodo)

    if (!id || !tipo) {
      datos.value = null
      return
    }

    cargando.value = true
    error.value = null

    try {
      switch (tipo) {
        case 'proyecto':
          datos.value = await presupuestoProyectoServicio.obtenerProyecto(id)
          break
        case 'actividad':
          datos.value = await presupuestoProyectoServicio.obtenerActividad(id)
          break
        case 'tarea':
          datos.value = await presupuestoProyectoServicio.obtenerTarea(id)
          break
        default:
          throw new Error(`Tipo de nodo no válido: ${tipo}`)
      }
    } catch (err) {
      error.value = err.message || 'Error al cargar los datos'
      datos.value = null
    } finally {
      cargando.value = false
    }
  }
}
