// eslint-disable-next-line
import { computed } from 'vue'

/**
 * Utilidades compartidas para bitácoras.
 * Validaciones, formateo y preparación de datos.
 */
export function useBitacoraHelpers() {
  // ═══════════════════════════════════════════════════
  // VALIDACIONES
  // ═══════════════════════════════════════════════════

  function validarDatos(tipoDato, valores) {
    const errores = {}

    if (tipoDato === 'A-Z' && (!valores.valor_literal || valores.valor_literal.trim() === '')) {
      errores.valor_literal = 'El valor literal es requerido para tipo A-Z'
    }

    if (
      tipoDato === '1-9' &&
      (valores.valor_numerico === null ||
        valores.valor_numerico === undefined ||
        valores.valor_numerico === '')
    ) {
      errores.valor_numerico = 'El valor numérico es requerido para tipo 1-9'
    }

    if (
      tipoDato === '%' &&
      (valores.valor_porcentual === null ||
        valores.valor_porcentual === undefined ||
        valores.valor_porcentual === '')
    ) {
      errores.valor_porcentual = 'El valor porcentual es requerido para tipo %'
    }

    if (
      tipoDato === '%' &&
      valores.valor_porcentual !== null &&
      valores.valor_porcentual !== undefined &&
      valores.valor_porcentual !== ''
    ) {
      const valor = Number(valores.valor_porcentual)
      if (valor < 0 || valor > 100) {
        errores.valor_porcentual = 'El porcentaje debe estar entre 0 y 100'
      }
    }

    if (
      tipoDato === '1-9' &&
      valores.valor_numerico !== null &&
      valores.valor_numerico !== undefined &&
      valores.valor_numerico !== ''
    ) {
      const valor = Number(valores.valor_numerico)
      if (valor < 0) {
        errores.valor_numerico = 'El valor numérico debe ser positivo'
      }
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores,
    }
  }

  // ═══════════════════════════════════════════════════
  // PREPARACIÓN DE DATOS
  // ═══════════════════════════════════════════════════

  function prepararPayload(datos) {
    const payload = {
      indicador_id: datos.indicador_id,
      tipo_dato: datos.tipo_dato,
      fecha_registro: datos.fecha_registro || null,
      observaciones: datos.observaciones || '',
      archivos_adjuntos: datos.archivos_adjuntos || null,
      snapshot_indicador: datos.snapshot_indicador || null,
      informe_actividad_id: datos.informe_actividad_id || null,
      informe_tarea_id: datos.informe_tarea_id || null,
    }

    switch (datos.tipo_dato) {
      case 'A-Z':
        payload.valor_literal = datos.valor_literal
        payload.valor_numerico = null
        payload.valor_porcentual = null
        break
      case '1-9':
        payload.valor_literal = null
        payload.valor_numerico = Number(datos.valor_numerico)
        payload.valor_porcentual = null
        break
      case '%':
        payload.valor_literal = null
        payload.valor_numerico = null
        payload.valor_porcentual = Number(datos.valor_porcentual)
        break
    }

    return payload
  }

  function prepararPayloadActualizacion(datos) {
    const payload = {}

    if (datos.tipo_dato !== undefined) payload.tipo_dato = datos.tipo_dato
    if (datos.valor_literal !== undefined) payload.valor_literal = datos.valor_literal
    if (datos.valor_numerico !== undefined)
      payload.valor_numerico = datos.valor_numerico !== null ? Number(datos.valor_numerico) : null
    if (datos.valor_porcentual !== undefined)
      payload.valor_porcentual =
        datos.valor_porcentual !== null ? Number(datos.valor_porcentual) : null
    if (datos.fecha_registro !== undefined) payload.fecha_registro = datos.fecha_registro
    if (datos.observaciones !== undefined) payload.observaciones = datos.observaciones
    if (datos.archivos_adjuntos !== undefined) payload.archivos_adjuntos = datos.archivos_adjuntos
    if (datos.snapshot_indicador !== undefined)
      payload.snapshot_indicador = datos.snapshot_indicador

    return payload
  }

  // ═══════════════════════════════════════════════════
  // FORMATEO
  // ═══════════════════════════════════════════════════

  function formatearFecha(fecha) {
    if (!fecha) return null
    const d = new Date(fecha)
    return d.toISOString().split('T')[0]
  }

  function formatearFechaUI(fecha) {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function obtenerValor(entrada) {
    if (!entrada) return '—'
    switch (entrada.tipo_dato) {
      case 'A-Z':
        return entrada.valor_literal || '—'
      case '1-9':
        return entrada.valor_numerico !== null ? entrada.valor_numerico : '—'
      case '%':
        return entrada.valor_porcentual !== null ? `${entrada.valor_porcentual}%` : '—'
      default:
        return '—'
    }
  }

  function etiquetaTipoDato(tipoDato) {
    const etiquetas = {
      'A-Z': 'Literal',
      '1-9': 'Numérico',
      '%': 'Porcentual',
    }
    return etiquetas[tipoDato] || tipoDato
  }

  return {
    validarDatos,
    prepararPayload,
    prepararPayloadActualizacion,
    formatearFecha,
    formatearFechaUI,
    obtenerValor,
    etiquetaTipoDato,
  }
}
