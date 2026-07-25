// utils/tableRenders.js
import Handsontable from 'handsontable'

/**
 * Renderer de prueba - Colorea la celda de rojo
 */
export function renderRojo(instance, td, row, col, prop, value, cellProperties) {
  if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  td.style.backgroundColor = '#ffebee'
  td.style.borderLeft = '3px solid #c62828'
  td.style.color = '#b71c1c'
  td.style.fontWeight = 'bold'
}

// ═══════════════════════════════════════════════════════════
// PALETA DE COLORES
// ═══════════════════════════════════════════════════════════

const paletaColores = {
  success: {
    bg: '#e8f5e9',
    border: '#4caf50',
    text: '#2e7d32',
  },
  warning: {
    bg: '#fff8e1',
    border: '#ff9800',
    text: '#e65100',
  },
  error: {
    bg: '#ffebee',
    border: '#f44336',
    text: '#c62828',
  },
  info: {
    bg: '#e3f2fd',
    border: '#2196f3',
    text: '#0d47a1',
  },
  default: {
    bg: '#f5f5f5',
    border: '#9e9e9e',
    text: '#424242',
  },
  pending: {
    bg: '#f3e5f5',
    border: '#9c27b0',
    text: '#6a1b9a',
  },
  primary: {
    bg: '#e8eaf6',
    border: '#3f51b5',
    text: '#1a237e',
  },
}

// ═══════════════════════════════════════════════════════════
// RENDERS DE COLOR
// ═══════════════════════════════════════════════════════════

/**
 * Crea un renderer que colorea la celda con un color fijo
 * @param {string} color - 'success' | 'warning' | 'error' | 'info' | 'default' | 'pending' | 'primary'
 * @returns {Function}
 *
 * Uso:
 *   renderer: tablaRenders.colorCelda('warning')
 */
export function crearRenderColorCelda(color = 'default') {
  return function (instance, td, row, col, prop, value, cellProperties) {
    if (cellProperties.type === 'numeric') {
      Handsontable.renderers.NumericRenderer.apply(this, arguments)
    } else {
      Handsontable.renderers.TextRenderer.apply(this, arguments)
    }

    const paleta = paletaColores[color] || paletaColores.default

    td.style.backgroundColor = paleta.bg
    td.style.borderLeft = `3px solid ${paleta.border}`
    td.style.color = paleta.text
    td.style.fontWeight = '600'
  }
}

/**
 * Renderer que colorea según el valor de la celda
 * Mapea automáticamente valores comunes a colores
 *
 * Uso:
 *   renderer: tablaRenders.colorPorValor
 */
export function renderColorPorValor(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  let color = 'default'

  if (!value || value === '') {
    color = 'default'
  } else if (typeof value === 'string') {
    const v = value.toLowerCase()
    if (['completado', 'fin', 'aprobado', 'activo', 'compl'].includes(v)) color = 'success'
    else if (['pendiente', 'plan', 'planificada', 'pen', 'crd'].includes(v)) color = 'warning'
    else if (['rechazado', 'error', 'cancelado', 'des', 'retr'].includes(v)) color = 'error'
    else if (['ejec', 'en progreso', 'eprog', 'reprog', 'en ejecucion'].includes(v)) color = 'info'
  } else if (typeof value === 'number') {
    if (value === 0) color = 'default'
    else if (value > 80) color = 'error'
    else if (value > 50) color = 'warning'
    else color = 'success'
  }

  const paleta = paletaColores[color]
  td.style.backgroundColor = paleta.bg
  td.style.borderLeft = `3px solid ${paleta.border}`
  td.style.color = paleta.text
  td.style.fontWeight = '600'
  td.style.textAlign = 'center'
}

/**
 * Renderer para saldo (rojo si negativo, verde si positivo)
 */
export function renderSaldo(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.NumericRenderer.apply(this, arguments)

  const num = Number(value) || 0
  const color = num < 0 ? 'error' : num > 0 ? 'success' : 'default'
  const paleta = paletaColores[color]

  td.innerHTML = `Bs. ${num.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
  td.style.color = paleta.text
  td.style.fontWeight = 'bold'
  td.style.textAlign = 'right'
}

/**
 * Renderer para presupuesto con formato Bs.
 */
export function renderPresupuesto(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.NumericRenderer.apply(this, arguments)

  if (value !== null && value !== undefined && value !== '') {
    td.innerHTML = `Bs. ${Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
  }
  td.style.textAlign = 'right'
}

// ═══════════════════════════════════════════════════════════
// EXPORTAR TODOS
// ═══════════════════════════════════════════════════════════

export const tablaRenders = {
  // Render de prueba
  rojo: renderRojo,

  // Render de color dinámico
  colorCelda: crearRenderColorCelda,
  colorPorValor: renderColorPorValor,

  // Colores predefinidos
  celdaSuccess: crearRenderColorCelda('success'),
  celdaWarning: crearRenderColorCelda('warning'),
  celdaError: crearRenderColorCelda('error'),
  celdaInfo: crearRenderColorCelda('info'),
  celdaPending: crearRenderColorCelda('pending'),
  celdaPrimary: crearRenderColorCelda('primary'),
  celdaDefault: crearRenderColorCelda('default'),

  // Renders específicos
  saldo: renderSaldo,
  presupuesto: renderPresupuesto,
}
