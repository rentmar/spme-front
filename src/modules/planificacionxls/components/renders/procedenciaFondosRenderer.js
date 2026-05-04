import Handsontable from 'handsontable'
import { createApp } from 'vue'
import ProcedenciaFondosCell from './ProcedenciaFondosCell.vue'

export function procedenciaFondosRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.BaseRenderer.apply(this, arguments)

  if (td._vueApp) {
    td._vueApp.unmount()
    delete td._vueApp
  }

  td.innerHTML = ''
  td.style.padding = '0'
  td.style.verticalAlign = 'top'

  const mountPoint = document.createElement('div')
  // 👇 Solo el mountPoint ignora clicks, no los hijos
  mountPoint.style.pointerEvents = 'auto'
  td.appendChild(mountPoint)

  const rowData = instance.getDataAtRow(row)
  const fondos = rowData[col]
  const dataArray = Array.isArray(fondos) ? fondos : []

  const app = createApp(ProcedenciaFondosCell, {
    data: dataArray,
  })

  app.mount(mountPoint)
  td._vueApp = app

  return td
}
