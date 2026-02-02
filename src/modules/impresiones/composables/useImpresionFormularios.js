//Composable para impresion Solicitudes
import { ref } from 'vue'
import { impresionFormulariosServicio } from '../services/impresionFormulariosService'
//Estados
const loading = ref(false)
const error = ref(false)

export function useImpresionFormularios() {
  //Generar pdf solicitud de fondos
  async function generarPdfSolicitudFondos(idsolfondos) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolFondos(idsolfondos)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de viaje
  async function generarPdfSolicitudViaje(idsolviaje) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolViaje(idsolviaje)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudPagoDirecto(idsolpagodirecto) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolPagoDirecto(idsolpagodirecto)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudReposicion(idsolreposicion) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolReposicion(idsolreposicion)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfRendicionCuentas(idsolrendicioncuentas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirRendCuentas(idsolrendicioncuentas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfSolicitudFondosTareas(idsoltareas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolFondosTareas(idsoltareas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //
  return {
    loading,
    error,
    generarPdfSolicitudFondos,
    generarPdfSolicitudViaje,
    generarPdfSolicitudPagoDirecto,
    generarPdfSolicitudReposicion,
    generarPdfRendicionCuentas,
    generarPdfSolicitudFondosTareas,
  }
}
