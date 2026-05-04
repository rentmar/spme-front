import Handsontable from 'handsontable'

export function presupuestoRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  const monto = parseFloat(value) || 0

  td.style.fontWeight = '600'
  td.style.textAlign = 'right'
  td.style.padding = '8px'

  if (monto > 10000) {
    td.style.backgroundColor = '#e3f2fd'
    td.style.color = '#1565c0'
  } else if (monto > 5000) {
    td.style.backgroundColor = '#e8f5e9'
    td.style.color = '#2e7d32'
  } else if (monto > 0) {
    td.style.backgroundColor = '#f3e5f5'
    td.style.color = '#7b1fa2'
  } else {
    td.style.backgroundColor = '#fafafa'
    td.style.color = '#9e9e9e'
  }

  td.innerHTML =
    'Bs ' +
    monto.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return td
}
