//Composable para Validacion de las Solicitudes de Fondos
import { ref } from 'vue'
import { validadoresSolFondosServicio } from '../services/validadoresSolFondosService'

export function useValidadoresSolFondos() {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)

  /* Asignar validadores a una sol de fondos
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadores(idSolFondos, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.asignarValidadoresSolFondos(
        idSolFondos,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /* Aprobar una solicitud de fondos, sin generar emails y mensajeria interna
   * @param {number} idSolFondos - ID de la solicitud
   * @param {array} iDsValidadores - IDs de los usuarios validadores
   */
  async function asignarValidadoresSolo(idSolFondos, iDsValidadores) {
    loading.value = true
    try {
      const respuesta = await validadoresSolFondosServicio.asignarValidadoresSinMensajesSolFondos(
        idSolFondos,
        iDsValidadores,
      )
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados de carga
    loading,
    error,
    //func
    asignarValidadores,
    asignarValidadoresSolo,
  }
}
