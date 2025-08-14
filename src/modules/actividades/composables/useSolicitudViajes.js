//Composable useSolicitudViajes
//CRUD de Solicitudes de Viaje
import { ref } from 'vue'
import { solicitudViajeServicios } from '../services/solicitudViajesService'

//Estados
const loading = ref(null)
const error = ref(null)
const solicitudes = ref([])
const solicitud = ref(null)

export function useSolicitudViajes() {
  //fecth kpis
  async function cargarSolicitudViajes() {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicios.all()
      solicitudes.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //fetch kpi por id
  async function cargarSolicitudViajesPorId(id) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicios.porId(id)
      solicitud.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //crear
  async function crearSolicitudViaje(data) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicios.crear(data)
      solicitud.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Update
  async function updateSolicitudViaje(id, data) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicios.update(id, data)
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Eliminar
  async function delSolicitudViajes(id) {
    loading.value = true
    try {
      const respuesta = await solicitudViajeServicios.delete(id)
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
    solicitudes, //ref lista de solicitudes
    solicitud, //ref una solicitud por id
    cargarSolicitudViajes,
    cargarSolicitudViajesPorId,
    crearSolicitudViaje,
    updateSolicitudViaje,
    delSolicitudViajes,
  }
}
