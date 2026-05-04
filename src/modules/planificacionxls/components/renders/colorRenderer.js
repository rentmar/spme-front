import Handsontable from 'handsontable'

/**
 * Renderer que cambia el color de fondo de la celda
 */
function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  if (value && value.length > 0) {
    td.style.backgroundColor = '#e8f5e9'
  } else {
    td.style.backgroundColor = '#fff3e0'
    td.innerHTML = 'NO DEFINIDOS'
  }

  return td
}

export { colorRenderer }
