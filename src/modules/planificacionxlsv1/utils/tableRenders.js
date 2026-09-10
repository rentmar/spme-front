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
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.NumericRenderer.apply(this, arguments)

  td.style.backgroundColor = '#F0FDF4' // Verde muy claro
  td.style.borderLeft = '4px solid #22C55E' // Borde verde
  td.style.color = '#166534' // Texto verde oscuro
  td.style.fontWeight = '600'
  td.style.textAlign = 'right'

  if (value !== null && value !== undefined && value !== '') {
    td.innerHTML = Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2 })
  }

  return td
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA DESGLOSE DE PRESUPUESTO
// ═══════════════════════════════════════════════════════════
// eslint-disable-next-line
export function renderDesglosePresupuesto(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    td.style.cursor = 'default'
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.textAlign = 'left'
  td.style.verticalAlign = 'middle'
  td.style.padding = '4px 8px'

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

  // Evento del botón
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
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    td.style.cursor = 'default'
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  const colores = {
    CRD: '#9e9e9e', // Creada - gris
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

  // Ajuste automático del color de texto
  const oscuros = ['RETR', 'FIN', 'EJEC', 'CRD']
  td.style.color = oscuros.includes(value) ? '#ffffff' : '#000000'

  td.style.fontWeight = 'bold'
  td.style.textAlign = 'center'

  return td
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA ESTRUCTURA DE PROCEDENCIA
// ═══════════════════════════════════════════════════════════
// eslint-disable-next-line
export function renderEstructuraProcedencia(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    td.style.cursor = 'default'
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.verticalAlign = 'middle'
  td.style.textAlign = 'left'
  td.style.padding = '4px 8px'

  const actividadId = instance.getDataAtRowProp(row, 'id')

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
  const ogData = d?.objetivogeneral?.data

  const ogCodigo = ogData?.codigo || '—'

  // Rama Izquierda (OG)
  const resOG = ogData?.resultados_og?.find((r) => r.id === selecciones.resultadoOGId)
  const resCodigo = resOG?.codigo || null
  const procOG = resOG?.proceso_resultado_og?.find((p) => p.id === selecciones.procesoOGId)
  const procCodigo = procOG?.codigo || null

  const totalIndOG = selecciones.indicadorOGIds?.length || 0
  const totalIndResOG = selecciones.indicadorResultadoOGIds?.length || 0

  // Rama Derecha (OE)
  const oe = ogData?.objetivos_especificos_og?.find(
    (o) => o.id === selecciones.objetivoEspecificoId,
  )
  const oeCodigo = oe?.codigo || null
  const totalIndOE = selecciones.indicadorOEIds?.length || 0

  const resOE = oe?.resultados_oe?.find((r) => r.id === selecciones.resultadoOEId)
  const prodOE = oe?.productos_oe?.find((p) => p.id === selecciones.productoOEId)
  const procEspecificoOE = oe?.proceso_oe?.find((p) => p.id === selecciones.procesoEspecificoOEId)

  const totalIndResOE = selecciones.indicadorResultadoOEIds?.length || 0
  const totalProdResOE = selecciones.productoResultadoOEIds?.length || 0
  const procResOE = resOE?.proceso_resultado_oe?.find(
    (p) => p.id === selecciones.procesoResultadoOEId,
  )
  const procProdOE = prodOE?.proceso_producto_oe?.find(
    (p) => p.id === selecciones.procesoProductoOEId,
  )

  // Construir líneas del resumen
  const lineas = []

  // OG
  lineas.push({ icono: '🎯', label: 'OG', valor: ogCodigo })

  // Rama Izquierda
  if (totalIndOG > 0) lineas.push({ icono: '📊', label: 'Ind.OG', valor: totalIndOG })
  if (resCodigo) {
    lineas.push({ icono: '📁', label: 'Res.OG', valor: resCodigo })
    if (totalIndResOG > 0) lineas.push({ icono: '📈', label: 'Ind.Res', valor: totalIndResOG })
    if (procCodigo) lineas.push({ icono: '⚙️', label: 'Proc', valor: procCodigo })
  }

  // Rama Derecha
  if (oeCodigo) {
    lineas.push({ icono: '🔷', label: 'OE', valor: oeCodigo })
    if (totalIndOE > 0) lineas.push({ icono: '📊', label: 'Ind.OE', valor: totalIndOE })
    if (selecciones.resultadoOEId && resOE) {
      lineas.push({ icono: '📁', label: 'Res.OE', valor: resOE.codigo || '—' })
      if (totalIndResOE > 0) lineas.push({ icono: '📈', label: 'Ind.ResOE', valor: totalIndResOE })
      if (totalProdResOE > 0) lineas.push({ icono: '📦', label: 'Prod.Res', valor: totalProdResOE })
      if (procResOE) lineas.push({ icono: '⚙️', label: 'Proc.Res', valor: procResOE.codigo || '—' })
    }
    if (selecciones.productoOEId && prodOE) {
      lineas.push({ icono: '📦', label: 'Prod', valor: prodOE.codigo || '—' })
      if (procProdOE)
        lineas.push({ icono: '⚙️', label: 'Proc.Prod', valor: procProdOE.codigo || '—' })
    }
    if (procEspecificoOE)
      lineas.push({ icono: '⚙️', label: 'Proc.OE', valor: procEspecificoOE.codigo || '—' })
  }

  // Info (lado izquierdo)
  const info = document.createElement('div')
  info.style.cssText = 'flex:1;min-width:0;'

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

  // Botón Editar (lado derecho)
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
/**
 * Versión simplificada - Solo verifica por ID
 */
export function esFilaPlaceholder(instance, row) {
  const rowData = instance?.getSourceDataAtRow(row)
  return !rowData || rowData.id === null || rowData.id === undefined || rowData.id === ''
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPOS EDITABLES POR USUARIOS AUTORIZADOS
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campos editables solo por usuarios autorizados
 * Usa color amarillo suave con borde naranja
 *
 * Uso:
 *   renderer: tablaRenders.campoEditableAutorizado
 */

export function renderCampoEditableAutorizado(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función reutilizable para detectar placeholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  td.style.backgroundColor = '#FEF3C7'
  td.style.borderLeft = '4px solid #F59E0B'
  td.style.color = '#92400E'
  td.style.fontWeight = '600'
  td.style.textAlign = 'right'
  td.title = 'Editable solo por usuarios autorizados'

  return td
}
// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPOS CALCULADOS AUTOMÁTICAMENTE
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campos calculados automáticamente (totalReportado)
 * Usa color azul claro con borde azul
 *
 * Uso:
 *   renderer: tablaRenders.campoCalculado
 */

export function renderCampoCalculado(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función reutilizable para detectar placeholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  td.style.backgroundColor = '#E0F2FE' // Azul claro
  td.style.borderLeft = '4px solid #3B82F6' // Borde azul
  td.style.color = '#1E40AF' // Texto azul oscuro
  td.style.fontWeight = '600'
  td.style.textAlign = 'right'

  // Agregar tooltip
  td.title = 'Campo calculado automáticamente por el sistema'

  return td
}
// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPOS DE SOLO LECTURA
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campos de solo lectura
 * Usa color gris claro
 *
 * Uso:
 *   renderer: tablaRenders.campoSoloLectura
 */

export function renderCampoSoloLectura(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  td.style.backgroundColor = '#F3F4F6' // Gris claro
  td.style.borderLeft = '3px solid #9CA3AF' // Borde gris
  td.style.color = '#6B7280' // Texto gris
  td.style.fontWeight = '400'

  // Agregar tooltip
  td.title = 'Campo de solo lectura'

  return td
}
// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPOS FINANCIEROS (Solo área de finanzas)
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campos financieros editables solo por finanzas
 * Usa color púrpura claro con borde púrpura
 *
 * Uso:
 *   renderer: tablaRenders.campoFinanciero
 */

export function renderCampoFinanciero(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

  td.style.backgroundColor = '#F3E8FF' // Púrpura claro
  td.style.borderLeft = '4px solid #9333EA' // Borde púrpura
  td.style.color = '#6B21A8' // Texto púrpura oscuro
  td.style.fontWeight = '600'
  td.style.textAlign = 'right'

  // Agregar tooltip
  td.title = 'Editable solo por el área de finanzas'

  return td
}
// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPOS CON FORMATO MONETARIO Bs.
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campos monetarios con formato Bs.
 *
 * Uso:
 *   renderer: tablaRenders.campoMonetario
 */
// eslint-disable-next-line
export function renderCampoMonetario(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.NumericRenderer.apply(this, arguments)

  if (value !== null && value !== undefined && value !== '') {
    td.innerHTML = `Bs. ${Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
  }

  td.style.textAlign = 'right'
  td.style.fontWeight = '600'

  return td
}
/**
 * Renderer para responsable select con ícono
 * Muestra un ícono de persona y el valor seleccionado
 *
 * Uso:
 *   type: 'dropdown',
 *   source: ['Juan Pérez', 'María García', 'Carlos López'],
 *   renderer: tablaRenders.campoResponsableSelectIcono
 */
export function renderCampoResponsableSelectIcono(
  instance,
  td,
  row,
  col,
  prop,
  value,
  // eslint-disable-next-line
  cellProperties,
) {
  // ============================================================
  // FILA PLACEHOLDER
  // ============================================================
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)

    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'

    td.textContent = '—'
    td.title = ''

    return td
  }

  // ============================================================
  // FILA NORMAL
  // ============================================================
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.padding = '4px 8px'
  td.style.cursor = 'pointer'

  // Contenedor principal
  const container = document.createElement('div')
  container.style.cssText = 'display:flex;align-items:center;gap:6px;width:100%;position:relative;'

  // Contenido principal
  const contenido = document.createElement('div')
  contenido.style.cssText = 'flex:1;min-width:0;display:flex;align-items:center;gap:6px;'

  // Flecha de dropdown
  const flecha = document.createElement('span')
  flecha.textContent = '▼'
  flecha.style.cssText = `
    font-size: 10px;
    color: #4B5563;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.05);
    border-radius: 3px;
    margin-left: auto;
  `

  // ============================================================
  // SIN RESPONSABLE
  // ============================================================
  if (!value || value === '' || value === 'null' || value === 'None' || value === null) {
    td.style.backgroundColor = '#FEF3C7'
    td.style.borderLeft = '4px solid #F59E0B'
    td.style.color = '#92400E'

    const icono = document.createElement('span')
    icono.textContent = '👤'
    icono.style.cssText = 'font-size:13px;opacity:0.5;flex-shrink:0;'

    const texto = document.createElement('span')
    texto.textContent = 'Seleccionar...'
    texto.style.cssText =
      'font-style:italic;opacity:0.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'

    contenido.appendChild(icono)
    contenido.appendChild(texto)

    container.appendChild(contenido)
    container.appendChild(flecha)

    td.appendChild(container)
    td.title = 'Responsable pendiente de asignación'

    return td
  }

  // ============================================================
  // CON RESPONSABLE
  // ============================================================
  td.style.backgroundColor = '#D1FAE5'
  td.style.borderLeft = '4px solid #10B981'
  td.style.color = '#065F46'
  td.style.fontStyle = 'normal'
  td.style.fontWeight = '600'

  const icono = document.createElement('span')
  icono.textContent = '👤'
  icono.style.cssText = 'font-size:13px;flex-shrink:0;'

  const texto = document.createElement('span')
  texto.textContent = value
  texto.style.cssText =
    'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;'

  contenido.appendChild(icono)
  contenido.appendChild(texto)

  container.appendChild(contenido)
  container.appendChild(flecha)

  td.appendChild(container)
  td.title = `Responsable: ${value}`

  return td
}

// ═══════════════════════════════════════════════════════════
// RENDER PARA CAMPO TIPO DE ACTIVIDAD (SELECT)
// ═══════════════════════════════════════════════════════════

/**
 * Renderer para campo tipo de actividad con editor select
 * Usa colores específicos para cada tipo de actividad del sistema
 *
 * Uso:
 *   type: 'dropdown',
 *   source: ['ACAP-Actividad de Capacitación', 'AART-Actividad de Articulación', ...],
 *   renderer: tablaRenders.campoTipoActividadSelect
 */

export function renderCampoTipoActividadSelect(
  instance,
  td,
  row,
  col,
  prop,
  value,
  // eslint-disable-next-line
  cellProperties,
) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Limpiar y usar renderer base
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.padding = '4px 8px'
  td.style.cursor = 'pointer'

  // Mapeo de colores según el tipo de actividad
  const tiposActividadColores = {
    OTRO: {
      bg: '#F3F4F6',
      border: '#6B7280',
      text: '#374151',
      icono: '📌',
      nombre: 'Otro Tipo de Actividad',
    },
    AART: {
      bg: '#DBEAFE',
      border: '#3B82F6',
      text: '#1E40AF',
      icono: '🤝',
      nombre: 'Actividad de Articulación',
    },
    AINC: {
      bg: '#FEF3C7',
      border: '#F59E0B',
      text: '#92400E',
      icono: '📢',
      nombre: 'Actividad de Incidencia',
    },
    PDES: {
      bg: '#D1FAE5',
      border: '#10B981',
      text: '#065F46',
      icono: '🎯',
      nombre: 'Proyecto de Desarrollo',
    },
    CSNS: {
      bg: '#FCE7F3',
      border: '#EC4899',
      text: '#9D174D',
      icono: '📣',
      nombre: 'Campaña de Sensibilización',
    },
    AOP: {
      bg: '#F3E8FF',
      border: '#9333EA',
      text: '#6B21A8',
      icono: '⚙️',
      nombre: 'Actividad Operativa',
    },
    PRIN: {
      bg: '#E0F2FE',
      border: '#0284C7',
      text: '#075985',
      icono: '🔬',
      nombre: 'Proyecto de Investigación',
    },
    ACAP: {
      bg: '#FFE4E6',
      border: '#E11D48',
      text: '#9F1239',
      icono: '📚',
      nombre: 'Actividad de Capacitación',
    },
    NODEF: {
      bg: '#FEF9C3',
      border: '#CA8A04',
      text: '#713F12',
      icono: '❓',
      nombre: 'No Definido',
    },
  }

  // Crear contenedor flex
  const container = document.createElement('div')
  container.style.cssText = 'display:flex;align-items:center;gap:6px;width:100%;position:relative;'

  // Contenido principal (ícono + texto)
  const contenido = document.createElement('div')
  contenido.style.cssText = 'flex:1;min-width:0;display:flex;align-items:center;gap:6px;'

  // Flecha de dropdown - MÁS VISIBLE
  const flecha = document.createElement('span')
  flecha.textContent = '▼'
  flecha.style.cssText = `
    font-size: 10px;
    color: #4B5563;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.05);
    border-radius: 3px;
    margin-left: auto;
  `

  if (!value || value === '' || value === 'null' || value === 'None' || value === null) {
    // Sin tipo de actividad asignado
    td.style.backgroundColor = '#FEF3C7'
    td.style.borderLeft = '4px solid #F59E0B'
    td.style.color = '#92400E'

    const icono = document.createElement('span')
    icono.textContent = '📌'
    icono.style.cssText = 'font-size:13px;opacity:0.5;flex-shrink:0;'

    const texto = document.createElement('span')
    texto.textContent = 'Seleccionar tipo...'
    texto.style.cssText =
      'font-style:italic;opacity:0.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'

    contenido.appendChild(icono)
    contenido.appendChild(texto)
    container.appendChild(contenido)
    container.appendChild(flecha)
    td.appendChild(container)
    td.title = 'Tipo de actividad pendiente de asignación'
    return td
  }

  // Extraer el código del tipo
  const codigoTipo = value.split('-')[0] || value

  // Obtener configuración de color
  const config = tiposActividadColores[codigoTipo] || {
    bg: '#F3F4F6',
    border: '#6B7280',
    text: '#374151',
    icono: '📌',
    nombre: value,
  }

  td.style.backgroundColor = config.bg
  td.style.borderLeft = `4px solid ${config.border}`
  td.style.color = config.text
  td.style.fontStyle = 'normal'
  td.style.fontWeight = '600'

  // Ícono del tipo
  const icono = document.createElement('span')
  icono.textContent = config.icono
  icono.style.cssText = 'font-size:13px;flex-shrink:0;'

  // Texto del tipo
  const texto = document.createElement('span')
  texto.textContent = value
  texto.style.cssText =
    'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;'

  contenido.appendChild(icono)
  contenido.appendChild(texto)
  container.appendChild(contenido)
  container.appendChild(flecha)
  td.appendChild(container)
  td.title = `Tipo de actividad: ${value}`

  return td
}
/**
 * Renderer para código con estilo técnico
 * Incluye ícono de etiqueta y formato especial
 *
 * Uso:
 *   renderer: tablaRenders.campoCodigoTecnico
 */
// eslint-disable-next-line
export function renderCampoCodigoTecnico(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.innerHTML = ''
  td.style.padding = '4px 8px'
  td.style.textAlign = 'left'

  const container = document.createElement('div')
  container.style.cssText = 'display:flex;align-items:center;gap:6px;'

  // Ícono de etiqueta
  const icono = document.createElement('span')
  icono.textContent = '🏷️'
  icono.style.cssText = 'font-size:12px;flex-shrink:0;'

  // Código - Fuente default con negrita
  const codigo = document.createElement('span')
  codigo.style.cssText = `
    font-weight: 700;
    font-size: 12px;
    color: #065F46;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `

  if (!value || value === '' || value === 'null' || value === 'None' || value === null) {
    td.style.backgroundColor = '#F3F4F6'
    td.style.borderLeft = '4px solid #D1D5DB'
    icono.style.opacity = '0.3'
    codigo.textContent = 'Sin código'
    codigo.style.color = '#9CA3AF'
    codigo.style.fontStyle = 'italic'
    codigo.style.fontWeight = '400'
    td.title = 'Código no asignado'
  } else {
    // Fondo verde que resalta
    td.style.backgroundColor = '#D1FAE5' // Verde menta claro
    td.style.borderLeft = '4px solid #10B981' // Borde verde esmeralda
    codigo.textContent = value
    codigo.style.color = '#065F46' // Texto verde oscuro
    td.title = `Código: ${value}`
  }

  container.appendChild(icono)
  container.appendChild(codigo)
  td.appendChild(container)

  return td
}
/**
 * Renderer para nombre multilínea
 * Permite mostrar nombres largos en múltiples líneas
 *
 * Uso:
 *   renderer: tablaRenders.campoNombreMultilinea
 */
// eslint-disable-next-line
export function renderCampoNombreMultilinea(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  td.style.backgroundColor = '#FFFFFF'
  td.style.borderLeft = '4px solid #3B82F6'
  td.style.color = '#111827'
  td.style.fontWeight = '500'
  td.style.textAlign = 'left'
  td.style.padding = '6px 10px'
  td.style.whiteSpace = 'normal' // Permite múltiples líneas
  td.style.wordBreak = 'break-word' // Rompe palabras largas
  td.style.lineHeight = '1.4'
  td.style.verticalAlign = 'top'

  if (!value || value === '' || value === 'null' || value === 'None' || value === null) {
    td.style.backgroundColor = '#F9FAFB'
    td.style.borderLeft = '4px solid #D1D5DB'
    td.style.color = '#9CA3AF'
    td.style.fontStyle = 'italic'
    td.textContent = 'Sin nombre'
    td.title = 'Nombre no asignado'
  } else {
    td.style.fontStyle = 'normal'
    td.textContent = value
    td.title = value
  }

  return td
}

/**
 * Renderer Neutro para filas comunes
 */
// eslint-disable-next-line
export function renderNeutro(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    // NO ocultar con display: none - Usar estilo neutro en su lugar
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Renderer normal para filas con datos
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  // Estilo neutro
  td.style.backgroundColor = '#FFFFFF'
  td.style.color = '#111827'
  td.style.fontWeight = '400'
  td.style.textAlign = 'left'
  td.style.padding = '4px 8px'

  return td
}

/**
 * Renderer para fecha de inicio
 */

/**
 * Renderer para campos de fecha
 * Color imperceptible, elimina flechas en placeholders
 */

/**
 * Renderer para campos de fecha
 * Color imperceptible, flecha visible en filas con datos
 */

/**
 * Renderer sencillo para campos de fecha
 */

/**
 * Renderer sencillo para campos de fecha
 * Solo esconde flechas en placeholders
 */

/**
 * Renderer para fechas
 * Mantiene el render original y esconde flecha en placeholders
 */

export function renderCampoFecha(instance, td, row, col, prop, value, cellProperties) {
  // Usar la función local esFilaPlaceholder
  if (esFilaPlaceholder(instance, row)) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.backgroundColor = '#FAFAFA'
    td.style.color = '#BDBDBD'
    td.style.fontStyle = 'italic'
    td.style.fontWeight = '400'
    td.style.textAlign = 'center'
    td.style.borderLeft = 'none'
    td.style.borderBottom = '1px dashed #E0E0E0'
    td.textContent = '—'
    td.title = ''
    return td
  }

  // Render original de Handsontable (sin cambios)
  if (cellProperties.type === 'date') {
    Handsontable.renderers.DateRenderer.apply(this, arguments)
  } else if (cellProperties.type === 'numeric') {
    Handsontable.renderers.NumericRenderer.apply(this, arguments)
  } else {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
  }

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

  // RENDERS PARA CAMPOS CON PERMISOS
  campoEditableAutorizado: renderCampoEditableAutorizado, // Amarillo - Editable por autorizados
  campoCalculado: renderCampoCalculado, // Azul - Calculado automáticamente
  campoSoloLectura: renderCampoSoloLectura, // Gris - Solo lectura
  campoFinanciero: renderCampoFinanciero, // Púrpura - Solo finanzas
  campoMonetario: renderCampoMonetario, // Formato Bs.
  campoResponsable: renderCampoResponsableSelectIcono,
  campoTipoDeActividad: renderCampoTipoActividadSelect,
  campoCodigoActividad: renderCampoCodigoTecnico,
  campoNombreActividad: renderCampoNombreMultilinea,
  campoNeutro: renderNeutro,
  campoFecha: renderCampoFecha,
}
