// src/utils/strings.js

export function unirValoresConComas(obj) {
  return Object.keys(obj)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => obj[key])
    .join(', ')
}

export function formatearObjetivoGeneral(obj) {
  if (!obj || typeof obj !== 'object') return ''
  const id = obj.id ?? ''
  const codigo = obj.codigo ?? ''
  const descripcion = obj.descripcion ?? ''
  return `${id} - ${codigo} - ${descripcion}`
}
