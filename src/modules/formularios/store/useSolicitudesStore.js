//store/useSolicitudesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSolucitudFondos } from '../composables/useSolicitudFondos'
import { useSolicitudViaje } from '../composables/useSolicitudViaje'
import { useRendicionCuentas } from '../composables/useRendicionCuentas'

export const useSolicitudesStore = defineStore('solicitudes-formularios', () => {
  //Estados - formularios actividad
  const solicitudesFondosActividad = ref([])
  const solicitudesViajeActividad = ref([])
  const rendicionesCuentasExistentesActividad = ref([])

  //Estados - formularios de tarea
  const solicitudesFondosTarea = ref([])
  const solicitudesViajeTarea = ref([])
  const rendicionesCuentasExistentesTarea = ref([])

  //Estados de carga -act
  const loadingFondosActividad = ref(false)
  const loadingViajesActividad = ref(false)
  const loadingRendicionesActividad = ref(false)
  //Estados de carga -tarea
  const loadingFondosTarea = ref(false)
  const loadingViajesTarea = ref(false)
  const loadingRendicionesTarea = ref(false)
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  //Iniciar el composable -Sol de fondos
  const {
    obtenerListaSolFondosPorIdActividad,
    listaSolicitudesFondosActividad,
    obtenerListaSolFondosPorIdTarea,
    lsitaSolicitudesFondosTarea,
  } = useSolucitudFondos()
  //Iniciar el composable - Sol de viajes
  const {
    obtenerListaSolViajesPorIdActividad,
    listaSolicitudViajeActividad,
    obtenerListaSolViajesPorIdTarea,
    listaSolicitudViajeTarea,
  } = useSolicitudViaje()
  //Inciar el composable - Rendicion cuentas
  const {
    obtenerListaRendicionCuentasPorIdActividad,
    listaRendicionCuentasActividad,
    obtenerListaRendicionCuentasPorIdTarea,
    listaRendicionCuentasTarea,
  } = useRendicionCuentas()

  /******************************** Funciones Actividad *****************************************************/
  //Cargar formularioas de la Actividad
  //Solicitudes y Rendiciones
  const cargarFormulariosDeActividad = async (idActividad) => {
    loading.value = true
    try {
      await Promise.all[
        (cargarSolicitudFondosActividad(idActividad),
        cargarSolicitudViajeActividad(idActividad),
        cargarRendicionCuentasActividad(idActividad))
      ]
    } catch (err) {
      console.error('Error al cargar formulario de la actividad: ' + idActividad, err)
    } finally {
      loading.value = false
    }
  }

  //Cargar Solicitude de Fondos de la Actividad
  const cargarSolicitudFondosActividad = async (idActividad) => {
    loadingFondosActividad.value = true
    try {
      await obtenerListaSolFondosPorIdActividad(idActividad)
      solicitudesFondosActividad.value = listaSolicitudesFondosActividad.value.solicitudes
    } catch (err) {
      console.log('Error al cargar las Sol de Fondos de la actividad: ' + idActividad, err)
    } finally {
      loadingFondosActividad.value = false
    }
  }

  //Cargar Solicitudes de Viaje de la Actividad
  const cargarSolicitudViajeActividad = async (idActividad) => {
    loadingViajesActividad.value = true
    try {
      await obtenerListaSolViajesPorIdActividad(idActividad)
      solicitudesViajeActividad.value = listaSolicitudViajeActividad.value.solicitudes
    } catch (err) {
      console.error('Error al cargar la sol de viaje de la actividad: ', +idActividad, err)
    } finally {
      loadingViajesActividad.value = false
    }
  }

  //Cargar las rendiciones de cuentas de la actividad
  const cargarRendicionCuentasActividad = async (idActividad) => {
    loadingRendicionesActividad.value = true
    try {
      await obtenerListaRendicionCuentasPorIdActividad(idActividad)
      rendicionesCuentasExistentesActividad.value = listaRendicionCuentasActividad.value.rendiciones
    } catch (err) {
      console.error(
        'Error al cargar las rendiciones de cuenta de la actividad: ' + idActividad,
        err,
      )
    } finally {
      loadingRendicionesActividad.value = false
    }
  }

  /******************************** Tareas **********************************************************/

  //Cargar Formularios de la Tarea
  const cargarFormulariosDeTarea = async (idActividad, idTarea) => {
    loading.value = true
    try {
      await Promise.all([
        cargarSolicitudFondosTarea(idActividad, idTarea),
        cargarSolicitudViajesTarea(idActividad, idTarea),
        cargarRendicionCuentasTarea(idActividad, idTarea),
      ])
    } catch (err) {
      console.error('Error al cargar los formularios de la Tarea: ' + idTarea, err)
    } finally {
      loading.value = false
    }
  }

  //Cargar Solicitud de fondos Tarea
  const cargarSolicitudFondosTarea = async (idActividad, idTarea) => {
    loadingFondosTarea.value = true
    try {
      await obtenerListaSolFondosPorIdTarea(idActividad, idTarea)
      solicitudesFondosTarea.value = lsitaSolicitudesFondosTarea.value.solicitudes
    } catch (err) {
      console.error('Error al cargar los formularios de la tarea: ' + idTarea, err)
    } finally {
      loadingFondosTarea.value = false
    }
  }

  //Cargar las solicitudes de viaje de la tarea
  const cargarSolicitudViajesTarea = async (idActividad, idTarea) => {
    loadingViajesTarea.value = true
    try {
      await obtenerListaSolViajesPorIdTarea(idActividad, idTarea)
      solicitudesViajeTarea.value = listaSolicitudViajeTarea.value.solicitudes
    } catch (err) {
      console.error('Error al cargar las sol de viaje de la tarea: ' + idTarea, err)
    } finally {
      loadingViajesTarea.value = false
    }
  }

  //Cargar las rendiciones de cuenta de la tarea
  const cargarRendicionCuentasTarea = async (idActividad, idTarea) => {
    loadingRendicionesTarea.value = true
    try {
      await obtenerListaRendicionCuentasPorIdTarea(idActividad, idTarea)
      rendicionesCuentasExistentesTarea.value = listaRendicionCuentasTarea.value.rendiciones
    } catch (error) {
      console.error('Error al cargar las rendiciones de la tarea: ' + idTarea, error)
    } finally {
      loadingRendicionesTarea.value = false
    }
  }

  return {
    //estados -actividad
    solicitudesFondosActividad,
    solicitudesViajeActividad,
    rendicionesCuentasExistentesActividad,
    loadingFondosActividad,
    loadingViajesActividad,
    loadingRendicionesActividad,
    //Estadoos -tarea
    solicitudesFondosTarea,
    solicitudesViajeTarea,
    rendicionesCuentasExistentesTarea,
    loadingFondosTarea,
    loadingViajesTarea,
    loadingRendicionesTarea,
    error,
    loading,
    //Func - act
    cargarFormulariosDeActividad,
    cargarSolicitudFondosActividad,
    cargarSolicitudViajeActividad,
    cargarRendicionCuentasActividad,
    //Func - tarea
    cargarFormulariosDeTarea,
    cargarSolicitudFondosTarea,
    cargarSolicitudViajesTarea,
    cargarRendicionCuentasTarea,
  }
})
