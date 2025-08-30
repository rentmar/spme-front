//Composable useActividad
//CRUD de Actividades y Tareas
import { ref } from 'vue'
import { actividadServicios } from '../services/actividadService'
import { tareasServicios } from '../services/tareasService'

//Estados
const loading = ref(null)
const error = ref(null)
const actividades = ref([])
const actividad = ref(null)
const actividadTarea = ref([])

// Estados específicos para tareas
const tareasActividad = ref([])
const tareaActual = ref(null)

export function useActividad() {
  //fetch actividades
  async function cargarActividades() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.all()
      console.log(respuesta)
      actividades.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //fetch actividad por id
  async function cargarActividadPorId(id) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.porId(id)
      actividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //crear actividad
  async function crearActividad(data) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.crear(data)
      actividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Update actividad
  async function updateActividad(id, data) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Eliminar actividad
  async function delActividad(id) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cargar actividades con tareas
  async function actividadesTareas() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.listaActividadesTareas()
      actividadTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // === FUNCIONES PARA CRUD DE TAREAS ===

  // Cargar tareas de una actividad específica
  async function cargarTareasDeActividad(actividadId) {
    loading.value = true
    try {
      // Usar el nuevo endpoint específico para tareas por actividad
      const respuesta = await tareasServicios.porActividad(actividadId)
      tareasActividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      // Fallback: si el endpoint específico no existe, usar el método anterior
      try {
        const todasTareas = await tareasServicios.all()
        const tareasFiltradas = todasTareas.filter(tarea => tarea.actividad === actividadId)
        tareasActividad.value = tareasFiltradas
        return tareasFiltradas
      } catch (fallbackErr) {
        console.error('Error al cargar tareas:', fallbackErr)
        throw fallbackErr
      }
    } finally {
      loading.value = false
    }
  }

  // Crear tarea para una actividad
  async function crearTareaEnActividad(actividadId, tareaData) {
    loading.value = true
    try {
      // Usar el método específico del servicio
      const respuesta = await tareasServicios.crearParaActividad(actividadId, tareaData)
      tareaActual.value = respuesta

      // Actualizar la lista local de tareas
      if (Array.isArray(tareasActividad.value)) {
        tareasActividad.value.push(respuesta)
      }

      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar tarea
  async function actualizarTareaEnActividad(actividadId, tareaId, tareaData) {
    loading.value = true
    try {
      const dataConActividad = {
        ...tareaData,
        actividad: actividadId
      }
      const respuesta = await tareasServicios.update(tareaId, dataConActividad)
      tareaActual.value = respuesta

      // Actualizar la lista local de tareas
      const index = tareasActividad.value.findIndex(t => t.id === tareaId)
      if (index !== -1) {
        tareasActividad.value[index] = respuesta
      }

      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar tarea
  async function eliminarTareaDeActividad(actividadId, tareaId) {
    loading.value = true
    try {
      const respuesta = await tareasServicios.delete(tareaId)

      // Eliminar de la lista local de tareas
      tareasActividad.value = tareasActividad.value.filter(t => t.id !== tareaId)

      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener tarea por ID
  async function obtenerTareaPorId(tareaId) {
    loading.value = true
    try {
      const respuesta = await tareasServicios.porId(tareaId)
      tareaActual.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // Estados
    loading,
    error,
    actividades,
    actividad,
    actividadTarea,
    tareasActividad,
    tareaActual,

    // Funciones de actividades
    cargarActividades,
    cargarActividadPorId,
    crearActividad,
    updateActividad,
    delActividad,
    actividadesTareas,

    // Funciones de tareas
    cargarTareasDeActividad,
    crearTareaEnActividad,
    actualizarTareaEnActividad,
    eliminarTareaDeActividad,
    obtenerTareaPorId
  }
}
