/**
 * Utilidades de cálculos financieros para Planificación Excel
 * Presupuestos, porcentajes, totales
 */

/**
 * Calcula el porcentaje de ejecución presupuestaria
 * @param {number} ejecutado - Monto ejecutado
 * @param {number} presupuesto - Presupuesto total
 * @returns {string} Porcentaje formateado (ej: "75%")
 */
export const calcularPorcentaje = (ejecutado, presupuesto) => {
  if (!presupuesto || presupuesto === 0) return '0%'
  const porcentaje = (parseFloat(ejecutado || 0) / parseFloat(presupuesto)) * 100
  return `${Math.round(porcentaje)}%`
}

/**
 * Calcula el saldo presupuestario
 * @param {number} presupuesto - Presupuesto total
 * @param {number} ejecutado - Monto ejecutado
 * @returns {number} Saldo disponible
 */
export const calcularSaldo = (presupuesto, ejecutado) => {
  return parseFloat(presupuesto || 0) - parseFloat(ejecutado || 0)
}

/**
 * Calcula el total ejecutado de una lista de actividades
 * @param {array} actividades - Lista de actividades
 * @returns {number} Total ejecutado
 */
export const calcularTotalEjecutado = (actividades) => {
  return actividades.reduce((total, act) => {
    return total + parseFloat(act.totalEjecutado || 0)
  }, 0)
}

/**
 * Calcula el presupuesto total de una lista de actividades
 * @param {array} actividades - Lista de actividades
 * @returns {number} Presupuesto total
 */
export const calcularPresupuestoTotal = (actividades) => {
  return actividades.reduce((total, act) => {
    return total + parseFloat(act.presupuesto || 0)
  }, 0)
}

/**
 * Calcula el saldo total de una lista de actividades
 * @param {array} actividades - Lista de actividades
 * @returns {number} Saldo total
 */
export const calcularSaldoTotal = (actividades) => {
  return actividades.reduce((total, act) => {
    return total + calcularSaldo(act.presupuesto, act.totalEjecutado)
  }, 0)
}

/**
 * Calcula resumen financiero completo
 * @param {array} actividades - Lista de actividades
 * @returns {object} { presupuestoTotal, totalEjecutado, saldoTotal, porcentajeGlobal }
 */
export const calcularResumenFinanciero = (actividades) => {
  const presupuesto = calcularPresupuestoTotal(actividades)
  const ejecutado = calcularTotalEjecutado(actividades)
  const saldo = calcularSaldo(presupuesto, ejecutado)
  const porcentaje = calcularPorcentaje(ejecutado, presupuesto)

  return {
    presupuestoTotal: presupuesto,
    totalEjecutado: ejecutado,
    saldoTotal: saldo,
    porcentajeGlobal: porcentaje,
  }
}
