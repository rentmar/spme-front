//Composable para el crud de Tareas-subactividad
//composables/useTareaSubactividad.js

import { ref } from 'vue'
import { actividadServicios } from '../services/actividadService'

export function useTareaSubactividad() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  //Tareas subactividades
  const tareasSubactividadesLista = ref([])
  const tareaSubactividad = ref()
  const tareaSubactividadCreada = ref()
  const tareaSubactividadActualizada = ref()
  const tareaSubactividadEliminada = ref()
  const tareaDetalles = ref()

  //Obtener todas las tareas
  async function cargarTareasSubactividades() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaAll()
      tareasSubactividadesLista.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Obtener una tarea por su id
  async function cargarTareaPorId(idtarea) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaPorId(idtarea)
      tareaSubactividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Obtener una tarea por su id - mas detalles
  async function cargarTareaPorIdDetallesInformacion(idtarea) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaDetalles(idtarea)
      tareaDetalles.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Crear una tarea
  async function crearUnaTarea(tareaData) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaCrear(tareaData)
      tareaSubactividadCreada.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Actualizar Tarea
  async function actualizarUnaTarea(idtarea, tareaData) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaUpdate(idtarea, tareaData)
      tareaSubactividadActualizada.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Eliminar Tarea
  async function eliminarUnaTarea(idtarea) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.tareaDelete(idtarea)
      tareaSubactividadEliminada.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    tareasSubactividadesLista, //Lista de Tareas existentes
    tareaSubactividad, //Una tarea por su id de tarea
    tareaSubactividadCreada, //Datos de la tarea creada
    tareaSubactividadActualizada, //Datos de la tarea actualizada
    tareaSubactividadEliminada, //datos de la tarea eleminada
    tareaDetalles, // Tarea y sus detalles
    //func
    cargarTareasSubactividades, //Cargar todas las tareas
    cargarTareaPorId, //Cargar una tarea por su id
    crearUnaTarea, //Crear una tarea
    actualizarUnaTarea, //Actualizar una tarea
    eliminarUnaTarea, //Eliminar una tarea
    cargarTareaPorIdDetallesInformacion, //Cargar una tarea por su id con detalles
  }
}
