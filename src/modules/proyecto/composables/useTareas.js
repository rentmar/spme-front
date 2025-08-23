//Composable useActividad
//CRUD de Actividades
import { ref } from 'vue'
import { tareasServicios } from '../services/tareasService'

//Estados
const load = ref(null)
const eerror = ref(null)
const tareas = ref([])
const tarea = ref(null)

export function useTareas() {
  //fecth kpis
  async function cargarTareas() {
    load.value = true
    try {
      const respuesta = await tareasServicios.all()
      tareas.value = respuesta
      return respuesta
    } catch (err) {
      eerror.value = err
    } finally {
      load.value = false
    }
  }

  //fetch kpi por id
  async function cargarTareaPorId(id) {
    load.value = true
    try {
      const respuesta = await tareasServicios.porId(id)
      tarea.value = respuesta
      return respuesta
    } catch (err) {
      eerror.value = err
    } finally {
      load.value = false
    }
  }

  //crear
  async function crearTarea(data) {
    load.value = true
    try {
      const respuesta = await tareasServicios.crear(data)
      tarea.value = respuesta
      return respuesta
    } catch (err) {
      eerror.value = err
    } finally {
      load.value = false
    }
  }

  //Update
  async function updateTarea(id, data) {
    load.value = true
    try {
      const respuesta = await tareasServicios.update(id, data)
      return respuesta
    } catch (err) {
      eerror.value = err
    } finally {
      load.value = false
    }
  }

  //Eliminar
  async function delTarea(id) {
    load.value = true
    try {
      const respuesta = await tareasServicios.delete(id)
      return respuesta
    } catch (err) {
      eerror.value = err
    } finally {
      load.value = false
    }
  }

  return {
    load, //loading, //ref
    eerror, //ref
    tareas, //ref lista de kpis
    tarea, //ref un kpi por id
    cargarTareas,
    cargarTareaPorId,
    crearTarea,
    updateTarea,
    delTarea,
  }
}
