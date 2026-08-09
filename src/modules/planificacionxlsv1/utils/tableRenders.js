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
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
export function renderPresupuesto(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.NumericRenderer.apply(this, arguments)

  if (value !== null && value !== undefined && value !== '') {
    td.innerHTML = `Bs. ${Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
  }
  td.style.textAlign = 'right'
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA DESGLOSE DE PRESUPUESTO
// ═══════════════════════════════════════════════════════════
// eslint-disable-next-line
export function renderDesglosePresupuesto(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.textAlign = 'left'
  td.style.verticalAlign = 'middle'
  td.style.padding = '4px 8px'

  // No mostrar en filas placeholder
  const rowId = instance.getDataAtRowProp(row, 'id')
  if (rowId === null || rowId === undefined || rowId === '') {
    return td
  }

  let data = value
  if (typeof value === 'string') {
    try {
      data = JSON.parse(value)
    } catch {
      data = null
    }
  }

  const count = Array.isArray(data) ? data.length : 0

  // Contenedor flex
  const container = document.createElement('div')
  container.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;'

  // Información de fuentes
  const info = document.createElement('div')
  info.style.cssText = 'flex:1;min-width:0;'

  if (count > 0) {
    data.forEach((item) => {
      const linea = document.createElement('div')
      linea.style.cssText =
        'font-size:10px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
      linea.textContent = `${item.nombre}: Bs ${Number(item.monto || 0).toLocaleString('es-BO')}`
      info.appendChild(linea)
    })
  } else {
    info.textContent = 'Sin desglose'
    info.style.cssText += 'color:#999;font-style:italic;'
  }

  // Botón
  const btn = document.createElement('button')
  btn.textContent = count > 0 ? `Editar` : 'Agregar'
  btn.style.cssText =
    'padding:2px 8px;font-size:10px;cursor:pointer;background:#1a73e8;color:#fff;border:none;border-radius:4px;flex-shrink:0;'

  //Evento del boton
  btn.onclick = (e) => {
    e.stopPropagation()

    window.dispatchEvent(new CustomEvent('abrir-desglose', { detail: { row, data } }))
  }

  container.appendChild(info)
  container.appendChild(btn)
  td.appendChild(container)
  return td
}

// eslint-disable-next-line
export function estadoActividad(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  const colores = {
    CRD: '#9e9e9e', // Creada - gris (no está en la lista, agrego)
    PLAN: '#64b5f6', // Planificacion - azul claro
    RETR: '#ff0000', // Retraso - rojo
    REPROG: '#ffd54f', // Reprogramacion - amarillo
    EJEC: '#ffa726', // En Ejecucion - naranja
    REP: '#81c784', // En Reporte - verde
    FIN: '#003CFF', // Finalizado - azul oscuro
    DES: '#e0e0e0', // Deshabilitada - gris claro
  }

  const bg = colores[value] || 'white'
  td.style.backgroundColor = bg

  // Ajuste automático del color de texto (ej. negro para fondos claros, blanco para oscuros)
  const oscuros = ['RETR', 'FIN', 'EJEC', 'CRD']
  td.style.color = oscuros.includes(value) ? '#ffffff' : '#000000'

  td.style.fontWeight = 'bold'
  td.style.textAlign = 'center'
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA ESTRUCTURA DE PROCEDENCIA
// ═══════════════════════════════════════════════════════════
export function renderEstructuraProcedencia(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  // No renderizar en filas placeholder
  const rowId = instance.getDataAtRowProp(row, 'id')
  if (rowId === null || rowId === undefined || rowId === '') {
    td.innerHTML = ''
    return td
  }

  td.innerHTML = ''
  td.style.verticalAlign = 'middle'
  td.style.textAlign = 'left'
  td.style.padding = '4px 8px'

  const actividadId = rowId

  let datosParseados = null
  let tieneDatos = false

  if (value && value !== '' && value !== 'null') {
    try {
      datosParseados = typeof value === 'string' ? JSON.parse(value) : value
      const selecciones = datosParseados?.seleccionesSimples
      tieneDatos = selecciones && selecciones.objetivoGeneralId
    } catch {
      tieneDatos = false
    }
  }

  const container = document.createElement('div')
  container.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  `

  if (!tieneDatos) {
    const info = document.createElement('div')
    info.style.cssText = 'flex:1;min-width:0;'
    info.innerHTML = '<span style="color:#999;font-style:italic;font-size:10px;">Sin asignar</span>'
    container.appendChild(info)

    const btn = document.createElement('button')
    btn.textContent = 'Asignar'
    btn.style.cssText = `
      padding: 2px 8px;
      font-size: 10px;
      cursor: pointer;
      background: #ff9800;
      color: #fff;
      border: none;
      border-radius: 4px;
      flex-shrink: 0;
    `
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      window.dispatchEvent(
        new CustomEvent('abrir-asignacion-estructura', {
          detail: { row, data: null, actividadId },
        }),
      )
    })
    container.appendChild(btn)
    td.appendChild(container)
    return td
  }

  const selecciones = datosParseados.seleccionesSimples
  const d = datosParseados.datosProcedencia

  const ogCodigo = d?.objetivogeneral?.data?.codigo || '—'
  const resOG = d?.objetivogeneral?.data?.resultados_og?.find(
    (r) => r.id === selecciones.resultadoOGId,
  )
  const resCodigo = resOG?.codigo || '—'
  const proc = resOG?.proceso_resultado_og?.find((p) => p.id === selecciones.procesoOGId)
  const procCodigo = proc?.codigo || '—'

  const totalIndOG = selecciones.indicadorOGIds?.length || 0
  const totalIndRes = selecciones.indicadorResultadoOGIds?.length || 0

  const info = document.createElement('div')
  info.style.cssText = 'flex:1;min-width:0;'

  const lineas = [
    { icono: '🔗', label: 'OG', valor: ogCodigo },
    { icono: '📊', label: 'Ind.OG', valor: totalIndOG },
    { icono: '🎯', label: 'Res', valor: resCodigo },
    { icono: '📈', label: 'Ind.Res', valor: totalIndRes },
    { icono: '⚙️', label: 'Proc', valor: procCodigo },
  ]

  lineas.forEach((linea) => {
    const div = document.createElement('div')
    div.style.cssText = `
      font-size: 9px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
    `
    div.textContent = `${linea.icono} ${linea.label}: ${linea.valor}`
    info.appendChild(div)
  })

  container.appendChild(info)

  const btn = document.createElement('button')
  btn.textContent = 'Editar'
  btn.style.cssText = `
    padding: 2px 8px;
    font-size: 10px;
    cursor: pointer;
    background: #1a73e8;
    color: #fff;
    border: none;
    border-radius: 4px;
    flex-shrink: 0;
  `
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    window.dispatchEvent(
      new CustomEvent('abrir-asignacion-estructura', {
        detail: { row, data: datosParseados, actividadId },
      }),
    )
  })

  container.appendChild(btn)
  td.appendChild(container)
  return td
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
  desglosePresupuesto: renderDesglosePresupuesto,
  estadoColorActividad: estadoActividad,
  estructuraProcedencia: renderEstructuraProcedencia,
}
