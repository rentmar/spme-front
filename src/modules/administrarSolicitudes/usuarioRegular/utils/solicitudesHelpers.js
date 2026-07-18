// utils/solicitudesHelpers.js
export const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatMonto = (monto) => {
  if (!monto) return '0.00'
  return parseFloat(monto).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const getTipoIcon = (tipo) => {
  const icons = {
    fondos: 'mdi-cash-multiple',
    viajes: 'mdi-airplane',
    pago_directo: 'mdi-credit-card',
    reposicion: 'mdi-cash-refund',
    rendicion: 'mdi-file-document-check',
  }
  return icons[tipo] || 'mdi-file-document'
}

export const getTipoColor = (tipo) => {
  const colors = {
    fondos: 'success',
    viajes: 'info',
    pago_directo: 'warning',
    reposicion: 'secondary',
    rendicion: 'deep-purple',
  }
  return colors[tipo] || 'grey'
}

export const getTipoDisplay = (tipo) => {
  const displays = {
    fondos: 'Fondos',
    viajes: 'Viajes',
    pago_directo: 'Pago Directo',
    reposicion: 'Reposición',
    rendicion: 'Rendición',
  }
  return displays[tipo] || tipo
}

export const getEstadoColor = (estado) => {
  const colors = {
    PENDIENTE: 'warning',
    EN_REVISION: 'info',
    APROBADO: 'success',
    RECHAZADO: 'error',
    OBSERVADO: 'warning',
  }
  return colors[estado] || 'grey'
}
