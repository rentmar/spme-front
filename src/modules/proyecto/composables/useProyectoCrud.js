// composables/useProyectoCrud.js

import { ref } from 'vue'
import { proyectoServicios } from '../services/proyectoService'

export function useProyectoCrud() {
  //Estados
  const proyectos = ref([])
  const proyecto = ref(null)
  const loading = ref(false)
  const error = ref(null)

  //Obtiene todos los proyectos dentro
  const obtenerProyectos = async () => {
    loading.value = true
    try {
      const respuesta = await proyectoServicios.obtenerTodos()
      console.log(respuesta)
      proyectos.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Obtiene el proyecto por id
  const obtenerProyecto = async (id) => {
    loading.value = true
    try {
      proyecto.value = await proyectoServicios.obtenertPorId(id)
      return proyecto.value
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Crea un proyecto
  const createProyecto = async (payload) => {
    return await proyectoServicios.crear(payload)
  }

  //Actualiza un proyecto
  const updateProyecto = async (id, payload) => {
    try {
      const respuesta = await proyectoServicios.actualizar(id, payload)
      return respuesta.data
    } catch (error) {
      console.error('Axios: No se pudo actualizar el proyecto', error)
      throw error
    }
  }

  //Elimina un proyecto
  const delProyecto = async (id) => {
    try {
      const respuesta = await proyectoServicios.delProyecto(id)
      return respuesta.data
    } catch (error) {
      console.error('Comp: no se pudo eliminar el proyecto', error)
    }
  }

  //Obtiene el proyecto por id
  const obtenerProyectoDetallesPorId = async (id) => {
    loading.value = true
    try {
      proyecto.value = await proyectoServicios.proyectoDetalles(id)
      return proyecto.value
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    proyectos, //ref todos los proyectos
    proyecto, //ref proyecto por id
    loading, //ref estado de carga
    error, //ref variable de error
    obtenerProyectos, //fun recupera todos los proyectos registrados
    obtenerProyecto, //fun un proyecto por id
    createProyecto, //fun crea un proyecto
    updateProyecto, //actualiza proyecto
    delProyecto, // fun elimina el proyecto
    obtenerProyectoDetallesPorId,
  }
}
