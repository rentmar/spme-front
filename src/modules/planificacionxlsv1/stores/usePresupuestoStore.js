// stores/presupuestoStore.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { presupuestoProyectoServicio } from '../services/presupuestoProyectoService'

export const usePresupuestoStore = defineStore('presupuesto-proyecto', () => {
  // Estados de carga
  const loading = ref(false)
  const error = ref(null)
  const inicializado = ref(false)

  // Variables
  const arbolPresupuesto = ref(null)
  const metadata = ref(null)
  const idProyectoActual = ref(null)

  // Getters
  const presupuestoProyecto = computed(() => arbolPresupuesto.value?.datos?.presupuesto)

  const resultadoActividades = computed(
    () =>
      arbolPresupuesto.value?.hijos?.find(
        (n) => n.tipo_nodo === 'resultado_actividades' && n.es_nodo_virtual,
      ) || null,
  )

  // ─── Acciones base ─────────────────────────────────────

  async function cargarArbol(idProyecto) {
    loading.value = true
    error.value = null
    idProyectoActual.value = idProyecto

    try {
      const response = await presupuestoProyectoServicio.arbolPresupuestoCompleto(idProyecto)
      arbolPresupuesto.value = response.arbol
      metadata.value = response.metadata
      return response
    } catch (e) {
      error.value = e.message || 'Error al cargar el árbol presupuestario'
      arbolPresupuesto.value = null
      metadata.value = null
      throw e
    } finally {
      loading.value = false
    }
  }

  async function inicializar(idProyecto) {
    if (inicializado.value) return
    try {
      await cargarArbol(idProyecto)
      inicializado.value = true
    } catch (e) {
      console.error('No se inició el store')
      throw e
    }
  }

  async function recargar() {
    if (!idProyectoActual.value) {
      console.warn('No hay proyecto actual para recargar')
      return
    }
    await cargarArbol(idProyectoActual.value)
  }

  // ─── Obtener nodos individuales (con refresco) ──────────

  async function obtenerProyecto(idProyecto) {
    loading.value = true
    error.value = null
    try {
      const resultado = await presupuestoProyectoServicio.obtenerProyecto(idProyecto)
      await recargar()
      return resultado
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function obtenerActividad(idActividad) {
    loading.value = true
    error.value = null
    try {
      const resultado = await presupuestoProyectoServicio.obtenerActividad(idActividad)
      // await recargar()
      return resultado
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function obtenerTarea(idTarea) {
    loading.value = true
    error.value = null
    try {
      const resultado = await presupuestoProyectoServicio.obtenerTarea(idTarea)
      await recargar()
      return resultado
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // ─── CRUD Actividades ──────────────────────────────────

  async function crearActividad(data) {
    loading.value = true
    error.value = null
    try {
      await presupuestoProyectoServicio.crearActividad(data)
      await recargar()
    } catch (e) {
      error.value = e.message || 'Error al crear la actividad'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function actualizarActividad(idActividad, data) {
    loading.value = true
    error.value = null
    try {
      await presupuestoProyectoServicio.actualizarActividad(idActividad, data)
      await recargar()
    } catch (e) {
      error.value = e.message || 'Error al actualizar la actividad'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function actualizarPresupuestoActividad(idActividad, nuevoPresupuesto) {
    loading.value = true
    error.value = null
    try {
      await presupuestoProyectoServicio.actualizarPresupuestoActividad(
        idActividad,
        nuevoPresupuesto,
      )
      await recargar()
    } catch (e) {
      error.value = e.message || 'Error al actualizar el presupuesto'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ─── CRUD Tareas ───────────────────────────────────────

  async function crearTarea(data) {
    loading.value = true
    error.value = null
    try {
      await presupuestoProyectoServicio.crearTareaActividad(data)
      await recargar()
    } catch (e) {
      error.value = e.message || 'Error al crear la tarea'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function actualizarTarea(idTarea, data) {
    loading.value = true
    error.value = null
    try {
      await presupuestoProyectoServicio.actualizarTareaActividad(idTarea, data)
      await recargar()
    } catch (e) {
      error.value = e.message || 'Error al actualizar la tarea'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ─── Limpieza ──────────────────────────────────────────

  function limpiar() {
    arbolPresupuesto.value = null
    metadata.value = null
    loading.value = false
    error.value = null
    idProyectoActual.value = null
    inicializado.value = false
  }

  return {
    // Estados
    loading,
    error,
    inicializado,
    arbolPresupuesto,
    metadata,
    idProyectoActual,

    // Getters
    presupuestoProyecto,
    resultadoActividades,

    // Acciones base
    cargarArbol,
    inicializar,
    recargar,

    // Obtener individuales
    obtenerProyecto,
    obtenerActividad,
    obtenerTarea,

    // CRUD Actividades
    crearActividad,
    actualizarActividad,
    actualizarPresupuestoActividad,

    // CRUD Tareas
    crearTarea,
    actualizarTarea,

    // Limpieza
    limpiar,
  }
})
