// composables/useSeguimientoCambios.js
import { ref, computed } from 'vue'
import { usePlanificacionExcelStore } from '../stores/usePlanificacionExcelStore'
import { crearRegistroCambio, obtenerResumenCambios } from '../utils/seguimientoHelper'

export function useSeguimientoCambios() {
  const store = usePlanificacionExcelStore()

  // ── Columnas rastreables (extensibles) ──
  const columnasRastreablesActividades = ref([
    'presupuesto',
    'totalEjecutado',
    'estado',
    'fecha_inicio',
    'fecha_cierre',
    'responsable',
    'tipo',
  ])

  const columnasRastreablesTareas = ref([
    'presupuesto',
    'estado',
    'titulo',
    'descripcion',
    'fecha_ejecucion',
    'fecha_limite',
  ])

  // ── Getters ──
  const totalCambios = computed(
    () => store.historialCambiosActividades.length + store.historialCambiosTareas.length,
  )

  const resumenActividades = computed(() =>
    obtenerResumenCambios(store.historialCambiosActividades),
  )

  const resumenTareas = computed(() => obtenerResumenCambios(store.historialCambiosTareas))

  // ── Métodos ──
  /**
   * Verifica si una columna es rastreable para un tipo dado.
   */
  const esColumnaRastreable = (tipo, columna) => {
    return tipo === 'actividad'
      ? columnasRastreablesActividades.value.includes(columna)
      : columnasRastreablesTareas.value.includes(columna)
  }

  /**
   * Agrega una columna a la lista de rastreables.
   */
  const agregarColumnaRastreable = (tipo, columna) => {
    if (tipo === 'actividad' && !columnasRastreablesActividades.value.includes(columna)) {
      columnasRastreablesActividades.value.push(columna)
    } else if (tipo === 'tarea' && !columnasRastreablesTareas.value.includes(columna)) {
      columnasRastreablesTareas.value.push(columna)
    }
  }

  /**
   * Registra un cambio en el store.
   */
  const registrarCambio = (datos) => {
    const registro = crearRegistroCambio(datos)

    if (datos.tipo === 'actividad') {
      store.agregarCambioActividad(registro)
    } else if (datos.tipo === 'tarea') {
      store.agregarCambioTarea(registro)
    }
  }

  /**
   * Confirma si el usuario quiere cambiar de actividad perdiendo cambios en tareas.
   */
  const confirmarCambioActividad = () => {
    return store.confirmarCambioActividad()
  }

  /**
   * Guarda todos los cambios en el REST API.
   */
  const guardarCambios = async () => {
    return store.guardarCambios()
  }

  /**
   * Descarta todos los cambios sin guardar.
   */
  const descartarCambios = () => {
    store.descartarCambios()
  }

  return {
    // Estado
    columnasRastreablesActividades,
    columnasRastreablesTareas,
    // Getters
    totalCambios,
    resumenActividades,
    resumenTareas,
    // Métodos
    esColumnaRastreable,
    agregarColumnaRastreable,
    registrarCambio,
    confirmarCambioActividad,
    guardarCambios,
    descartarCambios,
  }
}
