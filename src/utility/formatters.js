//Formateador de fechas
// export const formatDate = (dateString) => {
//   if (!dateString) return 'Sin fecha'
//   const options = { year: 'numeric', month: 'short', day: 'numeric' }
//   return new Date(dateString).toLocaleDateString('es-ES', options)
// }
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'

  // Divide la cadena de fecha 'YYYY-MM-DD' en sus componentes
  const [year, month, day] = dateString.split('-').map(Number)

  // Crea la fecha usando los componentes en la zona horaria local
  // Se resta 1 al mes porque en JavaScript los meses van de 0 a 11
  const date = new Date(year, month - 1, day)

  // Verifica si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('es-ES', options)
}

//Formateador de color
export const getStatusColor = (status) => {
  const colors = {
    ES: 'warning', // Estructuración
    EJ: 'success', // En Ejecución
    CO: 'info', // Completado
    SU: 'error', // Suspendido
  }
  return colors[status] || 'primary'
}

//Formateador de estado
export const getEstadoTexto = (status) => {
  const estados = {
    ES: 'Estructuración',
    EJ: 'En Ejecución',
    CO: 'Completado',
    SU: 'Suspendido',
  }
  return estados[status] || status
}

//Color de la prioridad
export const getPriorityColor = (priority) => {
  const colors = {
    Alta: 'red-lighten-2',
    Media: 'orange-lighten-2',
    Baja: 'green-lighten-2',
  }
  return colors[priority] || 'grey-lighten-2'
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

//Codificacion de colores para la seleccion
export const colorAccion = (accion) => {
  const colors = {
    seleccion: 'BLUE',
    insercion: 'ASIGNACION',
    asignacion: 'INSERCION',
  }
  return colors[accion] || 'primary'
}

// Color por vigencia
export const getVigenciaColor = (vigente) => {
  return vigente ? 'success' : 'grey'
}

// Funciones de utilidad
export const calcularPeriodo = (inicio, fin) => {
  const diff = new Date(fin) - new Date(inicio)
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
}

// Asignar colores por código de instancia
export const getChipColor = (codigo) => {
  const colorMap = {
    URBANO: 'deep-purple-lighten-2',
    UG: 'blue-lighten-2',
    REDES: 'green-lighten-2',
    'PM&E': 'orange-lighten-2',
    NINA: 'pink-lighten-2',
    'DIR EJEC': 'red-lighten-2',
    DEFENSORES: 'indigo-lighten-2',
    COM: 'cyan-lighten-2',
    ADM: 'teal-lighten-2',
  }
  return colorMap[codigo] || 'grey-lighten-2'
}

// Asignar iconos por código de instancia
export const getInstanciaIcon = (codigo) => {
  const iconMap = {
    URBANO: 'mdi-city',
    UG: 'mdi-office-building',
    REDES: 'mdi-vector-link',
    'PM&E': 'mdi-chart-bar',
    NINA: 'mdi-human-child',
    'DIR EJEC': 'mdi-account-tie',
    DEFENSORES: 'mdi-shield-account',
    COM: 'mdi-message-text',
    ADM: 'mdi-file-document-multiple',
  }
  return iconMap[codigo] || 'mdi-domain'
}

/* Colores para los indicadores */
export const getColorTipoIndicador = (tipo) => {
  const colores = {
    indicadorog: 'primary',
    indicadoroe: 'secondary',
    indicadorrog: 'success',
    indicadorroe: 'warning',
  }
  return colores[tipo] || 'grey'
}

/* Icono para los indicadores */
export const getIconoTipoIndicador = (tipo) => {
  const iconos = {
    indicadorog: 'mdi-chart-bar',
    indicadoroe: 'mdi-chart-line',
    indicadorrog: 'mdi-chart-areaspline',
    indicadorroe: 'mdi-chart-pie',
  }
  return iconos[tipo] || 'mdi-chart-line'
}

/* Texto para los indicadores */
export const getTipoTextoIndicador = (tipo) => {
  const tipos = {
    'A-Z': 'Literal',
    '1-9': 'Numérico',
    '%': 'Porcentual',
  }
  return tipos[tipo] || tipo
}
