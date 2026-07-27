// composables/usePlanificacionPayloadBulk.js
import { usePayloadBulkBase } from './usePayloadBulkBase'

export function usePlanificacionPayloadBulk() {
  const { separarPorBandera, validarMetadatos, validarSecciones } = usePayloadBulkBase()

  /**
   * Clasifica actividades según id, estado y bandera esNueva
   * - Se eliminan las que no tienen ID, estado y esNueva=false
   * - Se colocan en nuevos las que tienen esNueva=true, ID y estado
   * @param {Array} lista - Array de actividades
   * @returns {{ existentes: Array, nuevos: Array }}
   */
  const clasificarActividades = (lista = []) => {
    if (!Array.isArray(lista)) return { existentes: [], nuevos: [] }

    const nuevos = lista.filter((item) => item.esNueva === true)
    const existentes = lista.filter((item) => item.id && item.estado && !item.esNueva)

    return { existentes, nuevos }
  }

  /**
   * Construye los metadatos de seguimiento
   * @param {number} proyectoId
   * @param {string} proyectoNombre
   * @param {string} motivo
   * @returns {Object} Metadatos formateados
   */
  const construirMetadatos = (proyectoId, proyectoNombre, motivo) => {
    return {
      proyecto_id: proyectoId,
      proyecto_nombre: proyectoNombre || 'N/A',
      porque_modificacion: motivo,
    }
  }

  /**
   * Prepara los datos para el resumen del diálogo de confirmación
   * @param {Array} tablaActividades
   * @param {Array} tablaTareas
   * @param {Array} historialActividades
   * @param {Array} historialTareas
   * @param {string} proyectoNombre
   * @param {string} usuarioNombre
   * @returns {Object} Datos para el diálogo
   */
  const prepararResumen = (
    tablaActividades = [],
    tablaTareas = [],
    historialActividades = [],
    historialTareas = [],
    proyectoNombre = 'N/A',
    usuarioNombre = 'N/A',
  ) => {
    const { existentes: actExistentes, nuevos: actNuevos } = clasificarActividades(tablaActividades)
    const { existentes: tarExistentes, nuevos: tarNuevos } = separarPorBandera(tablaTareas)

    return {
      actividades_actualizar: actExistentes.length,
      actividades_nuevas: actNuevos.length,
      tareas_actualizar: tarExistentes.length,
      tareas_nuevas: tarNuevos.length,
      cambios: historialActividades.length + historialTareas.length,
      proyecto_nombre: proyectoNombre,
      usuario_nombre: usuarioNombre,
    }
  }

  /**
   * Construye el payload completo para enviar al endpoint bulk
   * @param {Object} opciones
   * @param {string} opciones.motivo
   * @param {Array} opciones.tablaActividades
   * @param {Array} opciones.tablaTareas
   * @param {Array} opciones.historialActividades
   * @param {Array} opciones.historialTareas
   * @param {number} opciones.proyectoId
   * @param {string} opciones.proyectoNombre
   * @param {Object} opciones.proyectoSnapshot - Respuesta original de la API
   * @returns {Object} Payload completo
   */
  const construirPayload = ({
    motivo,
    tablaActividades = [],
    tablaTareas = [],
    historialActividades = [],
    historialTareas = [],
    proyectoId,
    proyectoNombre,
    proyectoSnapshot,
  }) => {
    const { existentes: actExistentes, nuevos: actNuevos } = clasificarActividades(tablaActividades)
    const { existentes: tarExistentes, nuevos: tarNuevos } = separarPorBandera(tablaTareas)

    return {
      actividades_actualizar: actExistentes,
      actividades_nuevas: actNuevos,
      tareas_actualizar: tarExistentes,
      tareas_nuevas: tarNuevos,
      historial_actividades: historialActividades,
      historial_tareas: historialTareas,
      estado_anterior: proyectoSnapshot,
      metadatos_seguimiento: construirMetadatos(proyectoId, proyectoNombre, motivo),
    }
  }

  /**
   * Valida el payload antes de enviarlo
   * @param {Object} payload
   * @returns {{ valido: boolean, errores: string[] }}
   */
  const validarPayload = (payload) => {
    const { valido: metadatosValido, errores: erroresMetadatos } = validarMetadatos(
      payload.metadatos_seguimiento,
      {
        camposRequeridos: ['proyecto_id', 'porque_modificacion'],
        motivoMinCaracteres: 10,
      },
    )

    const { valido: seccionesValido, errores: erroresSecciones } = validarSecciones(payload, [
      'actividades_actualizar',
      'actividades_nuevas',
      'tareas_actualizar',
      'tareas_nuevas',
      'historial_actividades',
      'historial_tareas',
    ])

    return {
      valido: metadatosValido && seccionesValido,
      errores: [...erroresMetadatos, ...erroresSecciones],
    }
  }

  return {
    clasificarActividades,
    construirMetadatos,
    prepararResumen,
    construirPayload,
    validarPayload,
  }
}
