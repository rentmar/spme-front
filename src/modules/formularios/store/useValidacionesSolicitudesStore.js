// Store useValidacionesSolicitudesStore.js
// Validaciones para solicitud
// Listas completas
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useValidadoresSolFondos } from '../composables/useValidadoresSolFondos'

export const useValidacionesSolicitudesStore = defineStore('validaciones-forms', () => {
  //estados de carga
  const loading = ref(false)
  const error = ref(null)

  //Estados
  const solicitudFondosPendientesInfo = ref()

  //Iniciar Composable
  const { obtenerMisValidacionesPendientes } = useValidadoresSolFondos()

  /************************* Funciones ***********************************************/
  //Cargar las solicitudes de fondos pendientes del usuario actual
  const cargarSolicitudesFondosPendientes = async () => {
    loading.value = true
    try {
      const respuesta = await obtenerMisValidacionesPendientes()
      solicitudFondosPendientesInfo.value = respuesta
    } catch (error) {
      console.error('Error al cargar las sol de fondos pendientes', error)
    } finally {
      loading.value = false
    }
  }

  /****************************** COMPUTED ********************************************/
  //Numero de sol pendientes
  const numeroSolFondosPendientes = computed(() => {
    return solicitudFondosPendientesInfo.value?.count
  })

  //Solicitudes pendientes
  const solFondosPendientes = computed(() => {
    return solicitudFondosPendientesInfo.value?.results
  })

  //Todas las solicitudes pendientes
  const todasSolicitudesPendientes = computed(() => {
    const solicitudes = solFondosPendientes.value
    if (!Array.isArray(solicitudes)) {
      return []
    }
    return [...solicitudes]
  })

  //Calculo del numero de todas las solicitudes pendientes
  const numeroSolicitudesPendientes = computed(() => {
    return todasSolicitudesPendientes.value.length
  })

  return {
    //Estados de carga
    loading,
    error,
    //Estados
    solicitudFondosPendientesInfo,
    //Computed
    numeroSolFondosPendientes,
    solFondosPendientes,
    todasSolicitudesPendientes,
    numeroSolicitudesPendientes,
    //Funciones
    cargarSolicitudesFondosPendientes,
  }
})
