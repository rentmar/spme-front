// estadoTareaUtils.js

/**
 * Función que toma una sigla de estado y retorna el formato "SIGLA - ESTADO_LITERAL"
 * @param {string} sigla - La sigla del estado (ej: 'PEN', 'EPROG', 'COMPL')
 * @returns {string} Formato "SIGLA - ESTADO_LITERAL" o la sigla original si no se encuentra
 */
export const formatearEstadoTarea = (sigla) => {
  // Validar entrada
  if (!sigla || typeof sigla !== 'string') {
    return 'SIN_ESTADO - No especificado'
  }

  // Normalizar la sigla (mayúsculas, sin espacios)
  const siglaNormalizada = sigla.trim().toUpperCase()

  // Definir el mapeo de estados como objeto para mejor performance
  const MAPA_ESTADOS = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }

  // Verificar si la sigla existe en el mapa
  if (MAPA_ESTADOS[siglaNormalizada]) {
    return `${siglaNormalizada} - ${MAPA_ESTADOS[siglaNormalizada]}`
  }

  // Si no se encuentra, retornar la sigla original
  return `${siglaNormalizada} - Estado desconocido`
}

/**
 * Función para obtener solo el literal del estado
 * @param {string} sigla - La sigla del estado
 * @returns {string} El literal del estado o texto por defecto
 */
export const obtenerLiteralEstado = (sigla) => {
  if (!sigla || typeof sigla !== 'string') {
    return 'No especificado'
  }

  const siglaNormalizada = sigla.trim().toUpperCase()
  const MAPA_ESTADOS = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }

  return MAPA_ESTADOS[siglaNormalizada] || 'Estado desconocido'
}

/**
 * Función para verificar si una sigla de estado es válida
 * @param {string} sigla - La sigla a verificar
 * @returns {boolean} True si la sigla es válida
 */
export const esEstadoValido = (sigla) => {
  if (!sigla || typeof sigla !== 'string') {
    return false
  }

  const siglaNormalizada = sigla.trim().toUpperCase()
  const ESTADOS_VALIDOS = ['PEN', 'EPROG', 'COMPL']

  return ESTADOS_VALIDOS.includes(siglaNormalizada)
}

// Exportar constantes de estados para uso en otros lugares
export const ESTADOS_TAREA = {
  PEN: 'Pendiente',
  EPROG: 'En Progreso',
  COMPL: 'Completada',
}

export const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Sin Fecha'

  try {
    const fecha = new Date(fechaString)
    if (isNaN(fecha.getTime())) return fechaString

    // Formato YYYY-MM-DD para campos type="date"
    const año = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    return `${año}-${mes}-${dia}`
  } catch (error) {
    console.log('Error al formatear la fecha', error)
    return fechaString
  }
}

export const formatearPresupuesto = (monto) => {
  if (!monto && monto !== 0) return 'No definido'

  const numValue = Number(monto)
  if (isNaN(numValue)) return monto

  return `Bs. ${numValue.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Exportar todas las funciones juntas
export default {
  formatearEstadoTarea,
  formatearFecha,
  obtenerLiteralEstado,
  esEstadoValido,
  ESTADOS_TAREA,
}
