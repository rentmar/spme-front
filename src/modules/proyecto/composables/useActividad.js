//Composable useActividad
//CRUD de Actividades
import { ref } from 'vue'
import { actividadServicios } from '../services/actividadService'

//Estados
const loading = ref(null)
const error = ref(null)
const actividades = ref([])
const actividad = ref(null)

const actividadTarea = ref([])

const proyectoDatos = ref(null)
const mensaje = ref(null)


export function useActividad() {
  //fecth kpis
  async function cargarActividades() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.all()
      console.log(respuesta)
      actividades.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarActividadPorId(id) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.porId(id)
      actividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearActividad(data) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.crear(data)
      actividad.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateActividad(id, data) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delActividad(id) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.delete(id)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
async function actividadesTareas() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.listaActividadesTareas()
      actividadTarea.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Fecth de actividades de un proyecto por id
  async function cargarActividadesPorIdProyecto(id) {
    loading.value = false
    try {
      const respuesta = await actividadServicios.allPorIdProyecto(id)
      actividades.value = respuesta.actividades
      proyectoDatos.value = respuesta.proyecto
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Actividad - Metodo Bulk
  async function guardarActividadesBulk(id, data) {
    loading.value = false
    try {
      const respuesta = await actividadServicios.guardarBulk(id, data)
      mensaje.value = respuesta.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Lista de Actividades y tareas
  async function obtenerListaActividadesTareas() {
    loading.value = false
    try {
      const respuesta = await actividadServicios.listaActividadesTareas()
      actividades.value = respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    actividades, //ref lista de kpis
    actividad, //ref un kpi por id

    actividadTarea, //ref un kpi por id
    actividadesTareas,

    mensaje,

    cargarActividades,
    cargarActividadPorId,
    cargarActividadesPorIdProyecto, //
    crearActividad,
    updateActividad,
    delActividad,
    guardarActividadesBulk,
    obtenerListaActividadesTareas,
  }
}
