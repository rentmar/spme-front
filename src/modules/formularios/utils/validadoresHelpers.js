/**
 * Obtiene el color según el estado del validador
 * @param {string} estado - APROBADO, RECHAZADO, PENDIENTE
 * @returns {string} Color de Vuetify
 */
export const getColorEstado = (estado) => {
  if (!estado) return 'grey'
  const estadoNormalizado = estado.toLowerCase()
  // const colores = {
  //   APROBADO: 'success',
  //   RECHAZADO: 'error',
  //   PENDIENTE: 'warning',
  //   EN_VALIDACION: 'warning', //No usado
  //   EN_CORRECCION: 'info', //No usao
  // }
  const colores = {
    aprobado: 'success',
    rechazado: 'error',
    pendiente: 'warning',
    sinrevisores: 'grey',
  }
  return colores[estadoNormalizado] || 'grey'
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

//Obtener el literarl para el subtipo de documento
export const getSubTipoSolicitud = (tipo) => {
  const subtipo = {
    ACTIVIDAD: 'ACTIVIDAD',
    TAREA: 'SUBACTIVIDAD',
  }
  return subtipo[tipo] || ''
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
 * Obtiene el color para el subtipo de solicitud
 * @param {string} tipo - ACTIVIDAD, SUBACTIVIDAD
 * @returns {string} Color de Vuetify
 */
export const getColorSubTipoSolicitud = (tipo) => {
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
// Funciones helper
export const getIconoTipoSolicitud = (tipo) => {
  const iconos = {
    solicitud_fondos: 'mdi-cash-multiple',
    solicitud_viaje: 'mdi-airplane',
    solicitud_pago_directo: 'mdi-credit-card',
    solicitud_reposicion: 'mdi-cash-refund',
    rendicion_cuentas: 'mdi-file-document-check',
    anticipo: 'mdi-cash-fast',
    reembolso: 'mdi-cash-plus',
    default: 'mdi-file-document',
  }
  return iconos[tipo] || iconos.default
}

/**
 * Obtiene el nombre completo del tipo de solicitud
 * @param {string} tipo - Tipo de solicitud
 * @returns {string} Nombre completo legible
 */
export const getNombreCompletoTipoSolicitud = (tipo) => {
  const nombres = {
    solicitud_fondos: 'Solicitud de Fondos',
    solicitud_viaje: 'Solicitud de Viaje',
    solicitud_pago_directo: 'Solicitud de Pago Directo',
    solicitud_reposicion: 'Solicitud de Reposición',
    rendicion_cuentas: 'Rendición de Cuentas',
    anticipo: 'Anticipo',
    reembolso: 'Reembolso',
    default: 'solicitud',
  }
  return nombres[tipo] || tipo || 'Solicitud'
}

/**
 * Obtiene el nombre completo del tipo de solicitud
 * @param {string} tipo - Tipo de solicitud
 * @returns {string} Nombre completo legible
 */
export const getNombreCortoTipoSolicitud = (tipo) => {
  const nombres = {
    solicitud_fondos: 'FONDOS',
    solicitud_viaje: 'VIAJE',
    solicitud_pago_directo: 'PAGO DIRECTO',
    solicitud_reposicion: 'REPOSICION',
    rendicion_cuentas: 'RENDICION',
    anticipo: 'ANTICIPO',
    reembolso: 'REEMBOLSO',
    default: 'DOCUMENTO',
  }
  return nombres[tipo] || tipo || 'Solicitud'
}

/**
 * Obtiene el color para el tipo de solicitud (versión extendida)
 * @param {string} tipo - Tipo de solicitud
 * @returns {string} Color de Vuetify
 */
export const getColorTipoSolicitudExtendido = (tipo) => {
  const colores = {
    solicitud_fondos: 'primary',
    solicitud_viaje: 'info',
    solicitud_pago_directo: 'success',
    solicitud_reposicion: 'warning',
    rendicion_cuentas: 'secondary',
    anticipo: 'error',
    reembolso: 'warning',
  }
  return colores[tipo] || 'grey'
}

/**
 * Obtiene el color según la prioridad
 * @param {string} prioridad - Nivel de prioridad
 * @returns {string} Color de Vuetify
 */
export const getColorPrioridad = (prioridad) => {
  if (!prioridad) return 'grey'
  const colores = {
    alta: 'error',
    urgente: 'error',
    media: 'warning',
    normal: 'info',
    baja: 'success',
  }
  return colores[prioridad?.toLowerCase()] || 'grey'
}

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
