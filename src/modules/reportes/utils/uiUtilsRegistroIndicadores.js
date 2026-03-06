/**
 * Obtiene el color de Vuetify o CSS asociado a un tipo de dato específico.
 * * @param {string} tipo - El identificador del tipo de dato ('A-Z', '1-9', '%').
 * @returns {string} - El nombre del color (ej. 'purple') o 'grey' por defecto.
 */
export const getTipoDatoColor = (tipo) => {
  const colores = {
    'A-Z': 'purple',
    '1-9': 'blue',
    '%': 'green',
  }
  return colores[tipo] || 'grey'
}

/**
 * Obtiene el nombre del icono de Material Design Icons (MDI) según el tipo de dato.
 * * @param {string} tipo - El identificador del tipo de dato ('A-Z', '1-9', '%').
 * @returns {string} - El string del icono (ej. 'mdi-text') o 'mdi-help' por defecto.
 */
export const getTipoDatoIcon = (tipo) => {
  const iconos = {
    'A-Z': 'mdi-text',
    '1-9': 'mdi-numeric',
    '%': 'mdi-percent',
  }
  return iconos[tipo] || 'mdi-help'
}

// 👇 NUEVO: Función para formatear fechas
export const formatDateIndicador = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

//Funcion para formateo de fechas
export const getTipoDatoLabel = (tipo) => {
  const labels = {
    'A-Z': 'Literal',
    '1-9': 'Numérico',
    '%': 'Porcentual',
  }
  return labels[tipo] || tipo
}
