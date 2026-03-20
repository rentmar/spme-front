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

  //Generar pd solicitud de viaje tareas
  async function generarPdfSolicitudViajeTareas(idsolviaje) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolViajeTareas(idsolviaje)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudPagoDirectoTareas(idsolpagodirectotarea) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolPagoDirectoTareas(idsolpagodirectotarea)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfRendicionCuentasTareas(idsolrendicioncuentas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirRendCuentasTareas(idsolrendicioncuentas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function generarPdfSolicitudReposicionTareas(idsolreposicion) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolReposicionTareas(idsolreposicion)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /********************************** SOLIC PEI *************************************************/
  //Generar pdf solicitud de fondos
  async function generarPdfSolicitudFondosPei(idsolfondos) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolFondosPei(idsolfondos)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de viaje
  async function generarPdfSolicitudViajePei(idsolviaje) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolViajePei(idsolviaje)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudPagoDirectoPei(idsolpagodirecto) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolPagoDirectoPei(idsolpagodirecto)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudReposicionPei(idsolreposicion) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolReposicionPei(idsolreposicion)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfRendicionCuentasPei(idsolrendicioncuentas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirRendCuentasPei(idsolrendicioncuentas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfSolicitudFondosTareasPei(idsoltareas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolFondosTareasPei(idsoltareas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de viaje tareas
  async function generarPdfSolicitudViajeTareasPei(idsolviaje) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolViajeTareasPei(idsolviaje)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pd solicitud de Pago directo
  async function generarPdfSolicitudPagoDirectoTareasPei(idsolpagodirectotarea) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolPagoDirectoTareasPei(idsolpagodirectotarea)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Generar pdf Rendicion de cuentas
  async function generarPdfRendicionCuentasTareasPei(idsolrendicioncuentas) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirRendCuentasTareasPei(idsolrendicioncuentas)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function generarPdfSolicitudReposicionTareasPei(idsolreposicion) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirSolReposicionTareasPei(idsolreposicion)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function generarPdfInformeActividadPrincipal(idInformeActividad) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirInformeActividadPrincipal(idInformeActividad)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function generarPdfInformeTareaPrincipal(idInformeTarea) {
    loading.value = true
    try {
      await impresionFormulariosServicio.imprimirInformeTareaPrincipal(idInformeTarea)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    //PROYECTO
    generarPdfSolicitudFondos,
    generarPdfSolicitudViaje,
    generarPdfSolicitudPagoDirecto,
    generarPdfSolicitudReposicion,
    generarPdfRendicionCuentas,
    generarPdfSolicitudFondosTareas,
    generarPdfSolicitudViajeTareas,
    generarPdfSolicitudPagoDirectoTareas,
    generarPdfRendicionCuentasTareas,
    generarPdfSolicitudReposicionTareas,
    generarPdfInformeActividadPrincipal,
    generarPdfInformeTareaPrincipal,
    //PEI
    generarPdfSolicitudFondosPei,
    generarPdfSolicitudViajePei,
    generarPdfSolicitudPagoDirectoPei,
    generarPdfSolicitudReposicionPei,
    generarPdfRendicionCuentasPei,
    generarPdfSolicitudFondosTareasPei,
    generarPdfSolicitudViajeTareasPei,
    generarPdfSolicitudPagoDirectoTareasPei,
    generarPdfRendicionCuentasTareasPei,
    generarPdfSolicitudReposicionTareasPei,
  }
}
