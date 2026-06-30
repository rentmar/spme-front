/**
 * Obtiene el color según el estado del validador
 * @param {string} estado - APROBADO, RECHAZADO, PENDIENTE
 * @returns {string} Color de Vuetify
 */
export const getColorEstado = (estado) => {
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    PENDIENTE: 'warning',
    EN_VALIDACION: 'warning', //No usado
    EN_CORRECCION: 'info', //No usao
  }
  return colores[estado] || 'grey'
}

/**
 * Obtiene el ícono según el estado del validador
 * @param {string} estado - APROBADO, RECHAZADO, PENDIENTE
 * @returns {string} Ícono de Material Design
 */
export const getIconoEstado = (estado) => {
  const iconos = {
    APROBADO: 'mdi-check',
    RECHAZADO: 'mdi-close',
    PENDIENTE: 'mdi-clock-outline',
  }
  return iconos[estado] || 'mdi-circle'
}

/**
 * Obtiene el ícono grande según el estado consolidado
 * @param {string} estado - Estado consolidado
 * @returns {string} Ícono de Material Design
 */
export const getIconoEstadoConsolidado = (estado) => {
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    EN_VALIDACION: 'mdi-clock-outline',
    PENDIENTE: 'mdi-clock',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-help-circle'
}

/**
 * Obtiene el texto legible del estado consolidado
 * @param {string} estado - Estado consolidado
 * @returns {string} Texto formateado
 */
export const getTextoEstadoConsolidado = (estado) => {
  const textos = {
    APROBADO: 'APROBADO',
    RECHAZADO: 'RECHAZADO',
    EN_VALIDACION: 'EN VALIDACIÓN',
    PENDIENTE: 'PENDIENTE',
    EN_CORRECCION: 'EN CORRECCIÓN',
  }
  return textos[estado] || 'SIN ESTADO'
}

/**
 * Obtiene el color para el tipo de solicitud
 * @param {string} tipo - ACTIVIDAD, SUBACTIVIDAD
 * @returns {string} Color de Vuetify
 */
export const getColorTipoSolicitud = (tipo) => {
  const colores = {
    ACTIVIDAD: 'info',
    SUBACTIVIDAD: 'warning',
  }
  return colores[tipo] || 'grey'
}

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '--/--/----'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea una fecha ISO a formato corto (solo fecha)
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDateCorta = (dateStr) => {
  if (!dateStr) return '--/--/----'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
