//Formateador de fechas
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
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
