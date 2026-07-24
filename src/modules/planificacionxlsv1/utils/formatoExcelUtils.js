/**
 * Utilidades de formateo para Planificación Excel
 * Números, fechas y texto
 */

/**
 * Formatea un número a formato monetario boliviano
 * @param {number|string} n - Número a formatear
 * @returns {string} Número formateado (ej: "1.500.000,00")
 */
export const fmt = (n) => {
  const num = parseFloat(n || 0)
  return num.toLocaleString('es-BO', { minimumFractionDigits: 2 })
}

/**
 * Obtiene la fecha actual formateada
 * @returns {string} Fecha formateada DD/MM/YYYY HH:MM
 */
export const obtenerFechaActual = () => {
  const now = new Date()
  return now.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Fecha formateada DD/MM/YYYY
 */
export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '---'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima (default: 50)
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, maxLength = 50) => {
  if (!texto) return ''
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength) + '...'
}

/**
 * Une los valores de una propiedad específica de una lista de objetos
 * @param {array} lista - Lista de objetos
 * @param {string} propiedad - Nombre de la propiedad a extraer
 * @param {string} separador - Separador entre valores (default: ', ')
 * @returns {string} String con los valores unidos
 */
export const unirPropiedad = (lista, propiedad, separador = ', ') => {
  if (!lista || !lista.length) return ''
  return lista
    .map((item) => item[propiedad])
    .filter(Boolean)
    .join(separador)
}
