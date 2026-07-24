// utils/seguimientoHelper.js
import { useUserStore } from '@/stores/user'

/**
 * Crea un objeto de registro de cambio con estructura estándar.
 * @param {Object} datos - Datos del cambio
 * @returns {Object} Registro de cambio formateado
 */
export function crearRegistroCambio({
  tipo,
  accion,
  fila_id,
  columna,
  valor_anterior,
  valor_nuevo,
  actividad_codigo = '',
  actividad_id = null,
  tarea_codigo = '',
}) {
  const userStore = useUserStore()

  return {
    trackid: crypto.randomUUID(),
    tipo, // 'actividad' | 'tarea'
    accion, // 'editar' | 'agregar' | 'eliminar' | 'toggle'
    fila_id,
    columna,
    valor_anterior,
    valor_nuevo,
    usuario: userStore.usuario || 'admin',
    timestamp: new Date().toISOString(),
    actividad_codigo,
    actividad_id,
    tarea_codigo,
  }
}

/**
 * Formatea el payload para enviar al REST API.
 * @param {Array} historialActividades - Cambios de actividades
 * @param {Array} historialTareas - Cambios de tareas
 * @param {Number|String} proyectoId - ID del proyecto
 * @returns {Object} Payload formateado
 */
export function formatearPayload(historialActividades, historialTareas, proyectoId) {
  return {
    proyecto_id: proyectoId,
    cambios: {
      actividades: historialActividades,
      tareas: historialTareas,
    },
    total_cambios: historialActividades.length + historialTareas.length,
    fecha_envio: new Date().toISOString(),
  }
}

/**
 * Filtra cambios por tipo.
 * @param {Array} historial - Array de cambios
 * @param {String} tipo - 'actividad' | 'tarea'
 * @returns {Array} Cambios filtrados
 */
export function filtrarCambiosPorTipo(historial, tipo) {
  return historial.filter((c) => c.tipo === tipo)
}

/**
 * Obtiene un resumen de cambios.
 * @param {Array} historial - Array de cambios
 * @returns {Object} Resumen con totales por tipo y acción
 */
export function obtenerResumenCambios(historial) {
  return {
    total: historial.length,
    porTipo: {
      actividad: historial.filter((c) => c.tipo === 'actividad').length,
      tarea: historial.filter((c) => c.tipo === 'tarea').length,
    },
    porAccion: {
      editar: historial.filter((c) => c.accion === 'editar').length,
      agregar: historial.filter((c) => c.accion === 'agregar').length,
      eliminar: historial.filter((c) => c.accion === 'eliminar').length,
      toggle: historial.filter((c) => c.accion === 'toggle').length,
    },
  }
}
