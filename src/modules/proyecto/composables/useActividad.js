//Composable useActividad
//CRUD de Actividades
import { ref } from 'vue'
//import { actividadServicios, tareasServicios } from '../services/actividadService'
import { actividadServicios } from '../services/actividadService'
import { tareasServicios } from '../services/tareasService'

//Estados
const loading = ref(null)
const error = ref(null)
const actividades = ref([])
const actividad = ref(null)
const proyectoDatos = ref(null)
const mensaje = ref(null)
const actividadTarea = ref([])
const actividadesTareasListas = ref()
const actividadInfo = ref(null)
// Estados específicos para tareas
const tareasActividad = ref([])
const tareaActual = ref(null)
//Estados del PEI
const actividadesPei = ref([])
const actividadPei = ref(null)
const peiDatos = ref(null)

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
        const tareasFiltradas = todasTareas.filter((tarea) => tarea.actividad === actividadId)
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

  // Cargar activ
  //const actividadTarea = ref([])
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

  //Obtener lista de actividades sin filtrar
  async function obtenerListaActividadesConTareas() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.actividadesTareasLista()
      actividadesTareasListas.value = respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //Obtener una actividad por su id mas sus tareas y proyectos
  async function obtenerActidadPorId(idactividad) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.actividadInforPorId(idactividad)
      actividadInfo.value = respuesta
    } catch (err) {
      error.value = err
      throw err
    }
  }

  /*************************** ACTIVIDADES/TAREAS  PEI ******************************************/
  //Fecth de actividades de un proyecto por id
  async function cargarActividadesPorIdPei(idpei) {
    loading.value = false
    try {
      const respuesta = await actividadServicios.allPorIdPei(idpei)
      actividadesPei.value = respuesta.actividades
      peiDatos.value = respuesta.pei
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //FUNCIONES BASICAS PARA EL CRUD DE ACTIVIDADES PEI
  //fetch actividades
  async function cargarActividadesPei() {
    loading.value = true
    try {
      const respuesta = await actividadServicios.allActPei()
      actividadesPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  //fetch actividad por id
  async function cargarActividadPeiPorId(idactividad) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.porIdActPei(idactividad)
      actividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearActividadPei(dataActvidad) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.crearActPei(dataActvidad)
      actividadPei.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateActividadPei(idactividad, dataActividad) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.updateActPei(idactividad, dataActividad)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delActividadPei(idactividad) {
    loading.value = true
    try {
      const respuesta = await actividadServicios.deleteActPei(idactividad)
      return respuesta
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
    mensaje,
    actividadTarea,
    tareaActual,
    actividadesTareasListas, //Actividades con tareas sin filtrado
    actividadInfo, //Una actividad especifica mas Tareas y proyecto
    //Estado PEI
    actividadesPei,
    actividadPei,
    peiDatos,
    //func proyecto
    cargarActividades,
    cargarActividadPorId,
    cargarActividadesPorIdProyecto, //
    crearActividad,
    updateActividad,
    delActividad,
    guardarActividadesBulk,
    obtenerListaActividadesTareas,
    cargarTareasDeActividad,
    actividadesTareas,
    obtenerListaActividadesConTareas,
    obtenerActidadPorId,
    //Func PEI
    cargarActividadesPorIdPei,
    cargarActividadesPei,
    cargarActividadPeiPorId,
    crearActividadPei,
    updateActividadPei,
    delActividadPei,
  }
}
