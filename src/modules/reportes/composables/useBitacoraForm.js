import { ref, reactive, computed, watch } from 'vue'
import { useBitacoraHelpers } from './useBitacoraHelpers'

/**
 * Composable para manejo de formularios de bitácora.
 *
 * @param {object} bitacoraComposable - Instancia de useBitacora(tipo)
 * @param {number|null} indicadorId - ID del indicador
 */
export function useBitacoraForm(bitacoraComposable, indicadorId = null) {
  const { validarDatos } = useBitacoraHelpers()

  // ═══════════════════════════════════════════════════
  // ESTADO DEL FORMULARIO
  // ═══════════════════════════════════════════════════

  const form = reactive({
    indicador_id: indicadorId,
    tipo_dato: '1-9',
    valor_literal: '',
    valor_numerico: null,
    valor_porcentual: null,
    fecha_registro: null,
    observaciones: '',
    archivos_adjuntos: null,
    snapshot_indicador: null,
    informe_actividad_id: null,
    informe_tarea_id: null,
  })

  const errores = reactive({})
  const enviando = ref(false)
  const enviado = ref(false)

  // ═══════════════════════════════════════════════════
  // COMPUTADAS
  // ═══════════════════════════════════════════════════

  const esValido = computed(() => {
    const resultado = validarDatos(form.tipo_dato, {
      valor_literal: form.valor_literal,
      valor_numerico: form.valor_numerico,
      valor_porcentual: form.valor_porcentual,
    })
    return resultado.valido
  })

  const campoActivo = computed(() => {
    switch (form.tipo_dato) {
      case 'A-Z':
        return 'valor_literal'
      case '1-9':
        return 'valor_numerico'
      case '%':
        return 'valor_porcentual'
      default:
        return null
    }
  })

  // ═══════════════════════════════════════════════════
  // WATCHERS
  // ═══════════════════════════════════════════════════

  watch(
    () => form.tipo_dato,
    () => {
      form.valor_literal = ''
      form.valor_numerico = null
      form.valor_porcentual = null
      limpiarErrores()
    },
  )

  // ═══════════════════════════════════════════════════
  // MÉTODOS
  // ═══════════════════════════════════════════════════

  function validar() {
    limpiarErrores()

    const resultado = validarDatos(form.tipo_dato, {
      valor_literal: form.valor_literal,
      valor_numerico: form.valor_numerico,
      valor_porcentual: form.valor_porcentual,
    })

    if (!resultado.valido) {
      Object.assign(errores, resultado.errores)
      return false
    }

    return true
  }

  async function enviar() {
    if (!validar()) return null

    enviando.value = true

    try {
      const resultado = await bitacoraComposable.crear({ ...form })
      enviado.value = true
      return resultado
    } catch (err) {
      if (typeof err === 'object' && err !== null) {
        Object.assign(errores, err)
      }
      return null
    } finally {
      enviando.value = false
    }
  }

  function cargarEntrada(entrada) {
    form.indicador_id =
      entrada.indicador_og ||
      entrada.indicador_oe ||
      entrada.indicador_rog ||
      entrada.indicador_roe ||
      indicadorId
    form.tipo_dato = entrada.tipo_dato
    form.valor_literal = entrada.valor_literal || ''
    form.valor_numerico = entrada.valor_numerico
    form.valor_porcentual = entrada.valor_porcentual
    form.fecha_registro = entrada.fecha_registro
    form.observaciones = entrada.observaciones || ''
    form.archivos_adjuntos = entrada.archivos_adjuntos
    form.snapshot_indicador = entrada.snapshot_indicador
  }

  function resetear() {
    form.indicador_id = indicadorId
    form.tipo_dato = '1-9'
    form.valor_literal = ''
    form.valor_numerico = null
    form.valor_porcentual = null
    form.fecha_registro = null
    form.observaciones = ''
    form.archivos_adjuntos = null
    form.snapshot_indicador = null
    form.informe_actividad_id = null
    form.informe_tarea_id = null
    limpiarErrores()
    enviado.value = false
  }

  function limpiarErrores() {
    Object.keys(errores).forEach((key) => delete errores[key])
  }

  // ═══════════════════════════════════════════════════
  // RETORNO
  // ═══════════════════════════════════════════════════

  return {
    form,
    errores,
    enviando,
    enviado,
    esValido,
    campoActivo,
    validar,
    enviar,
    cargarEntrada,
    resetear,
    limpiarErrores,
  }
}
