// composables/usePayloadBulkBase.js

export function usePayloadBulkBase() {
  /**
   * Separa una lista en existentes y nuevos según una bandera
   * @param {Array} lista - Array de objetos
   * @param {string} campo - Nombre del campo bandera (default: 'esNueva')
   * @returns {{ existentes: Array, nuevos: Array }}
   */
  const separarPorBandera = (lista, campo = 'esNueva') => {
    if (!Array.isArray(lista)) return { existentes: [], nuevos: [] }

    return {
      existentes: lista.filter((item) => !item[campo]),
      nuevos: lista.filter((item) => item[campo]),
    }
  }

  /**
   * Valida los metadatos de seguimiento según reglas configurables
   * @param {Object} metadatos - Objeto con datos de proyecto y motivo
   * @param {Object} reglas - Reglas de validación
   * @param {string[]} reglas.camposRequeridos - Campos obligatorios
   * @param {number} reglas.motivoMinCaracteres - Mínimo de caracteres para el motivo
   * @returns {{ valido: boolean, errores: string[] }}
   */
  const validarMetadatos = (metadatos = {}, reglas = {}) => {
    const { camposRequeridos = ['proyecto_id', 'porque_modificacion'], motivoMinCaracteres = 10 } =
      reglas

    const errores = []

    for (const campo of camposRequeridos) {
      if (!metadatos[campo] || (typeof metadatos[campo] === 'string' && !metadatos[campo].trim())) {
        errores.push(`Falta el campo requerido: ${campo}`)
      }
    }

    if (
      metadatos.porque_modificacion &&
      metadatos.porque_modificacion.trim().length < motivoMinCaracteres
    ) {
      errores.push(`El motivo debe tener al menos ${motivoMinCaracteres} caracteres`)
    }

    return {
      valido: errores.length === 0,
      errores,
    }
  }

  /**
   * Valida que al menos una de las secciones indicadas tenga datos
   * @param {Object} payload - Payload completo
   * @param {string[]} nombresSecciones - Nombres de las secciones a verificar
   * @returns {{ valido: boolean, errores: string[] }}
   */
  const validarSecciones = (payload = {}, nombresSecciones = []) => {
    const errores = []

    const algunaConDatos = nombresSecciones.some((seccion) => {
      const datos = payload[seccion]
      return Array.isArray(datos) && datos.length > 0
    })

    if (!algunaConDatos) {
      errores.push('No hay cambios para guardar')
    }

    return {
      valido: errores.length === 0,
      errores,
    }
  }

  return {
    separarPorBandera,
    validarMetadatos,
    validarSecciones,
  }
}
