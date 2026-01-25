// /utils/registroCambios.js

class RegistroCambios {
  constructor() {
    this.cambios = {
      responsable: [],
      tipo: [],
      fecha_inicio: [],
      fecha_cierre: [],
      presupuesto: [],
      codigo: [],
      nombreCorto: [],
      objetivo_pei: [],

      otros: [], // Para cambios en otras columnas
    }
  }

  // Registrar un cambio
  registrar(prop, row, oldValue, newValue, actividadId, actividadNombre) {
    if (oldValue === newValue) return // Ignorar si no hay cambio real

    const cambio = {
      fecha: new Date().toISOString(),
      fila: row,
      actividad_id: actividadId,
      actividad_nombre: actividadNombre,
      anterior: oldValue,
      nuevo: newValue,
      propiedad: prop,
    }

    // Agregar al array correspondiente
    if (this.cambios[prop]) {
      this.cambios[prop].push(cambio)
    } else {
      this.cambios.otros.push(cambio)
    }

    console.log(`📝 Registrado cambio en ${prop}:`, cambio)
  }

  // Obtener todos los cambios en formato JSON
  obtenerJSON() {
    return {
      timestamp: new Date().toISOString(),
      total_cambios: this.contarTotal(),
      cambios_por_propiedad: this.obtenerConteoPorPropiedad(),
      detalles: this.cambios,
    }
  }

  // Contar cambios totales
  contarTotal() {
    let total = 0
    Object.values(this.cambios).forEach((array) => {
      total += array.length
    })
    return total
  }

  // Obtener conteo por propiedad
  obtenerConteoPorPropiedad() {
    const conteo = {}
    Object.keys(this.cambios).forEach((prop) => {
      conteo[prop] = this.cambios[prop].length
    })
    return conteo
  }

  // Limpiar registro
  limpiar() {
    Object.keys(this.cambios).forEach((prop) => {
      this.cambios[prop] = []
    })
  }

  // Ver si hay cambios pendientes
  hayCambios() {
    return this.contarTotal() > 0
  }
}

// Exportar una instancia única
export const registroCambios = new RegistroCambios()
