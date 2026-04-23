//store/useSolicitudesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSolucitudFondos } from '../composables/useSolicitudFondos'
import { useSolicitudViaje } from '../composables/useSolicitudViaje'
import { useRendicionCuentas } from '../composables/useRendicionCuentas'
import { useVinculacionesInformeActividad } from '../composables/useVinculacionesInformeActividad'

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
  //Estado formularios
  const rendicionCuentasActual = ref(null)
  //Estado - Solicitudes de Viaje vinculados del informe de Actividad Actual
  const solicitudesViajeInformeActividadActual = ref([])
  const solicitudesViajeDisponibles = ref([])

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
    obtenerRendicionCuentasMasSolicitudes,
    rendicionCuentas,
  } = useRendicionCuentas()

  //Iniciar el composable vinculacion solicitudes de viajes a Inf de Actividad
  const {
    listaSolViajesVinculadasInformeActividad,
    obtenerSolsViajePorInformeActividad,
    listaSolViajesDisponibles,
    obtenerSolViajesDisponiblesPorIdActividad,
  } = useVinculacionesInformeActividad()

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

  //Cargar rendicion de cuentas mas solicitudes
  const cargarRendicionCuentasMasSolicitudesRelacionadas = async (idRendicionCuentas) => {
    loadingRendicionesActividad.value = true
    try {
      await obtenerRendicionCuentasMasSolicitudes(idRendicionCuentas)
      rendicionCuentasActual.value = rendicionCuentas.value
    } catch (error) {
      console.error('Error al cargar la rendicion de cuentas mas solicitudes', error)
    } finally {
      loadingRendicionesActividad.value = false
    }
  }

  /************ Vinculacion de Sol de Viajes a Informe Actividad ******************************************/
  //Cargar las solicitudes de viaje vinculadas a un informe de actividad
  const cargarSolViajesVinculadasInformeActividad = async (idInformeActividad) => {
    loadingViajesActividad.value = true
    try {
      await obtenerSolsViajePorInformeActividad(idInformeActividad)
      solicitudesViajeInformeActividadActual.value = listaSolViajesVinculadasInformeActividad.value
    } catch (error) {
      console.error('Error al cargar el informe de actividad y sus sol de viajes', error)
    } finally {
      loadingViajesActividad.value = false
    }
  }

  //Cargar las solicitudes de viaje disponibles por id de actividad
  const cargarSolViajeDisponiblePorIdActividad = async (idActividad) => {
    loadingViajesActividad.value = true
    try {
      await obtenerSolViajesDisponiblesPorIdActividad(idActividad)
      solicitudesViajeDisponibles.value = listaSolViajesDisponibles.value.solicitudes
    } catch (error) {
      console.error('Error al cargar las sol de viajes disponibles', error)
    } finally {
      loadingViajesActividad.value = false
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
    //Estado formulario Actual
    rendicionCuentasActual,
    //Estado Informe Actividad
    solicitudesViajeInformeActividadActual,
    solicitudesViajeDisponibles,

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
    //func
    cargarRendicionCuentasMasSolicitudesRelacionadas,
    //func Informe de Actividad
    cargarSolViajesVinculadasInformeActividad,
    cargarSolViajeDisponiblePorIdActividad,
  }
})
