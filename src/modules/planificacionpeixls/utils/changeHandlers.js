// /utils/changeHandlers.js
import { parse, isValid, isAfter } from 'date-fns'
import { registroCambios } from './registroCambios'

//Funcion simple para fechas
const manejarFecha = (tipo, row, oldValue, newValue, callbacks, tabla, hotTable) => {
  // 1. Solo si hay cambio real
  if (oldValue === newValue) return

  // 2. Marcar que hay cambios
  callbacks.marcarCambios?.(true)
  console.log(`Fecha ${tipo} cambiada: ${oldValue} → ${newValue}`)

  // 3. Obtener la actividad
  const actividad = tabla?.[row]
  registroCambios.registrar(
    tipo === 'inicio' ? 'fecha_inicio' : 'fecha_cierre',
    row,
    oldValue,
    newValue,
    actividad?.id,
    actividad?.nombreCorto,
  )
  if (!actividad) return

  // 4. Ver qué estado tiene
  const estado = actividad.estado || 'CRD'
  const esCRD = estado === 'CRD'
  const esPLAN = estado === 'PLAN'

  // 5. Ver si tenemos ambas fechas
  const tieneInicio = actividad.fecha_inicio
  const tieneCierre = actividad.fecha_cierre

  if (tieneInicio && !tieneCierre) {
    callbacks.mensajeInfo?.('⚠️ Falta fecha de cierre')
    return
  }

  if (!tieneInicio && tieneCierre) {
    callbacks.mensajeInfo?.('⚠️ Falta fecha de inicio')
    return
  }

  // 6. Si tenemos ambas fechas, validar
  if (tieneInicio && tieneCierre) {
    const inicio = parse(tieneInicio, 'yyyy-MM-dd', new Date())
    const cierre = parse(tieneCierre, 'yyyy-MM-dd', new Date())

    if (!isValid(inicio) || !isValid(cierre)) {
      callbacks.mensajeError?.('❌ Fechas inválidas')
      return
    }

    if (isAfter(inicio, cierre)) {
      hotTable?.setDataAtCell(row, 5, null) // fecha_inicio (columna 5)
      hotTable?.setDataAtCell(row, 6, null) // fecha_cierre (columna 6)
      callbacks.mensajeError?.('❌ Fecha inicio debe ser antes que cierre')
      return
    }

    // 7. ¡Fechas válidas! Cambiar estado
    if (esCRD) {
      // De CRD a PLAN
      hotTable?.setDataAtCell(row, 15, 'PLAN') // estado
      hotTable?.setDataAtCell(row, 16, 'PLANIFICADA') // grado
      callbacks.mensajeExito?.('✅ Actividad planificada')
    }
    if (esPLAN) {
      // De PLAN a REPROG
      hotTable?.setDataAtCell(row, 15, 'REPROG') // estado
      hotTable?.setDataAtCell(row, 16, 'REPROGRAMACION') // grado
      callbacks.mensajeExito?.('✅ Actividad reprogramada')
    }
  }
}

//Funcion para procesar y validar fechas
// const procesarFecha = (tipoFecha, row, oldValue, newValue, callbacks) => {
//   console.log(`Fecha ${tipoFecha} cambiada:`, oldValue, '→', newValue)
//   if (tipoFecha === 'inicio') {
//     callbacks.infoMsg?.(`Fecha ${tipoFecha} cambiada: ${oldValue} → ${newValue}`)
//   } else {
//     callbacks.infoMsg?.(`Fecha ${tipoFecha} cambiada: ${oldValue} → ${newValue}`)
//   }
// }

/**
 * Retorna un objeto con handlers para diferentes tipos de cambios
 * @param {Object} callbacks - Funciones callback necesarias
 * @returns {Object} - Objeto con handlers
 */
export const getChangeHandlers = (callbacks, tabla, hotTable) => {
  return {
    codigo: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Codigo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Codigo actualizado: ${oldValue} → ${newValue}`)

        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'codigo',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.codigo,
        )
      }
    },
    nombreCorto: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Nombre cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Nombre actualizado: ${oldValue} → ${newValue}`)

        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'nombre',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    responsable: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Responsable cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Responsable actualizado: ${oldValue} → ${newValue}`)

        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'responsable',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    tipo: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Tipo de Actividad actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'tipo',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    fecha_inicio: (row, oldValue, newValue) => {
      manejarFecha('inicio', row, oldValue, newValue, callbacks, tabla, hotTable)
    },
    fecha_cierre: (row, oldValue, newValue) => {
      manejarFecha('cierre', row, oldValue, newValue, callbacks, tabla, hotTable)
    },
    supuestos: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Supuestos actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'supuestos',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    riesgos: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Riesgos actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'riesgos',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    presupuesto: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Presupuesto actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'presupuesto',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    procedencia_fondos: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Procedencia de fondos actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'presupuesto',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    presupuestoGlobal: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Presupuesto global actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'presupuesto',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    totalEjecutado: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Total ejecutado actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'presupuesto',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
    saldo: (row, oldValue, newValue) => {
      if (oldValue !== newValue) {
        callbacks.marcarCambios?.(true)
        console.log('Tipo cambiado:', oldValue, '→', newValue)
        callbacks.mensajeExito?.(`Saldo ejecutado actualizado: ${oldValue} → ${newValue}`)
        // Registrar cambio
        const actividad = tabla?.[row]
        registroCambios.registrar(
          'presupuesto',
          row,
          oldValue,
          newValue,
          actividad?.id,
          actividad?.nombreCorto,
        )
      }
    },
  }
}

export { registroCambios }
