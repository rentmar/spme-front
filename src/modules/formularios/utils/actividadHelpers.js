// utils/actividadHelpers.js

/**
 * Obtiene el ícono según el tipo de actividad
 */
export const getIconoTipoActividad = (sigla) => {
  const iconos = {
    NODEF: 'mdi-help-circle-outline',
    ACAP: 'mdi-school',
    PRIN: 'mdi-flask',
    AOP: 'mdi-cog',
    CSNS: 'mdi-bullhorn',
    PDES: 'mdi-rocket-launch',
    AINC: 'mdi-account-voice',
    AART: 'mdi-handshake',
    OTRO: 'mdi-dots-horizontal-circle',
  }
  return iconos[sigla] || 'mdi-circle'
}

/**
 * Obtiene el color según el tipo de actividad
 */
export const getColorTipoActividad = (sigla) => {
  const colores = {
    NODEF: 'grey',
    ACAP: 'info',
    PRIN: 'purple',
    AOP: 'teal',
    CSNS: 'orange',
    PDES: 'success',
    AINC: 'red',
    AART: 'indigo',
    OTRO: 'grey-darken-1',
  }
  return colores[sigla] || 'grey'
}

/**
 * Obtiene el color según el estado de la actividad
 */
export const getColorEstadoActividad = (estado) => {
  const colores = {
    CRD: 'grey',
    PLAN: 'info',
    RETR: 'error',
    REPROG: 'warning',
    EJEC: 'success',
    REP: 'primary',
    FIN: 'green-darken-2',
  }
  return colores[estado] || 'grey'
}

/**
 * Obtiene el ícono según el estado de la actividad
 */
export const getIconoEstadoActividad = (estado) => {
  const iconos = {
    CRD: 'mdi-circle-outline',
    PLAN: 'mdi-calendar-clock',
    RETR: 'mdi-alert-circle',
    REPROG: 'mdi-refresh',
    EJEC: 'mdi-progress-check',
    REP: 'mdi-file-document-edit',
    FIN: 'mdi-check-circle',
  }
  return iconos[estado] || 'mdi-circle'
}

/**
 * Obtiene el texto legible del estado
 */
export const getTextoEstadoActividad = (estado) => {
  const textos = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
  }
  return textos[estado] || estado || 'Sin estado'
}

/**
 * Formatea un monto a formato BOB
 */
export const formatearMonto = (monto) => {
  if (!monto && monto !== 0) return 'Bs 0.00'
  const valor = typeof monto === 'string' ? parseFloat(monto) : monto
  if (isNaN(valor)) return 'Bs 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(valor)
}
