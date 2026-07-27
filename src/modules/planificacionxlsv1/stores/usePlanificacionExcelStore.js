import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
import { procesarRespuestaProyecto } from '../utils'
import { tipoActividadServicio } from '@/modules/proyecto/services/tipoActividadService'
import { planificacionProyectoServicio } from '../services/planificacionProyectoService'
import { usePlanificacionPayloadBulk } from '../composables/usePlanificacionPayloadBulk'

export const usePlanificacionExcelStore = defineStore('excel-store', () => {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  //Datos
  const proyectoActual = ref(null)
  const actividades = ref([])
  const tareas = ref([])
  const metadata = ref(null)
  const proyectoId = ref(null) //id del proyecto
  const tiposDeActividad = ref(null)
  const proyectoSnapshoot = ref(null) //Snapshoot del proyecto, se almacena para seguimiento, no se modifica durante toda la sesion

  //Dialogo
  const showDialogCambioActividad = ref(false)
  const resolverDialogo = ref(null)

  // ── Getters ──
  const count = computed(() => actividades.value.length)
  const proyecto = computed(() => proyectoActual)
  const metadatos = computed(() => metadata)
  const tiposActividad = computed(() => tiposDeActividad.value)
  const presupuestoProyecto = computed(() => proyectoActual?.value.presupuesto)
  const procedenciaFondos = computed(() => proyectoActual?.value.financiadores)
  const procedenciaFondosIds = computed(() => {
    const datos = proyectoActual?.value.financiadores
    return datos.map((item) => {
      const data = item._custom?.value || item
      return data.id
    })
  })
  const getTareasPorActividad = (actividadId) => {
    return computed(() => tareas.value.filter((t) => t.actividad === actividadId))
  }

  //-- Historial de cambios
  const historialCambiosActividades = ref([])
  const historialCambiosTareas = ref([])
  const tieneCambiosActividades = ref(false)
  const tieneCambiosTareas = ref(false)
  const tieneCambiosSinGuardar = computed(
    () => tieneCambiosActividades.value || tieneCambiosTareas.value,
  )

  //--- Acciones del historial ---
  //Agrega un cambio de Actividad
  const agregarCambioActividad = (registro) => {
    historialCambiosActividades.value.push(registro)
    tieneCambiosActividades.value = true
  }

  //Agrega un cambio de tarea
  const agregarCambioTarea = (registro) => {
    historialCambiosTareas.value.push(registro)
    tieneCambiosTareas.value = true
  }

  //Confirma cambio de actividad - al cargar con el menu contextual
  //Carga tareas de una nueva actividad
  const confirmarCambioActividad = () => {
    return new Promise((resolve) => {
      if (tieneCambiosTareas.value) {
        showDialogCambioActividad.value = true
        resolverDialogo.value = resolve
      } else {
        resolve(true)
      }
    })
  }

  //GUarda los cambios, enia la informacion a la rest api
  //Pendiente -- incluir los datos de las grillas actividad y tarea
  const guardarCambios = async (motivo, grillaActividades, grillaTareas) => {
    if (!tieneCambiosSinGuardar.value) {
      console.warn('No hay cambios para guardar')
      return { success: false, message: 'No hay cambios para guardar' }
    }
    loading.value = true
    error.value = null

    try {
      const { construirPayload, validarPayload } = usePlanificacionPayloadBulk()
      const payload = construirPayload({
        motivo,
        tablaActividades: grillaActividades || [],
        tablaTareas: grillaTareas || [],
        historialActividades: historialCambiosActividades.value,
        historialTareas: historialCambiosTareas.value,
        proyectoId: proyectoId.value,
        proyectoNombre: proyectoActual.value?.titulo,
        proyectoSnapshot: proyectoSnapshoot.value,
      })

      console.log('PAYLOAD: ', payload)
      const { valido, errores } = validarPayload(payload)
      if (!valido) throw new Error(errores.join(', '))

      const respuesta = await planificacionProyectoServicio.guardarPlanificacion(payload)
      return respuesta
    } catch (e) {
      error.value = e.message
      console.error('❌ Error al guardar planificación:', e)
      throw e
    } finally {
      loading.value = false
      tieneCambiosActividades.value = false
      tieneCambiosTareas.value = false
    }
  }

  const aceptarCambioActividad = () => {
    tieneCambiosTareas.value = false
    historialCambiosTareas.value = [] // ← Limpiar historial de tareas
    showDialogCambioActividad.value = false
    if (resolverDialogo.value) {
      resolverDialogo.value(true)
      resolverDialogo.value = null
    }
  }

  const cancelarCambioActividad = () => {
    showDialogCambioActividad.value = false
    if (resolverDialogo.value) {
      resolverDialogo.value(false)
      resolverDialogo.value = null
    }
  }

  //Descartar los cambios
  const descartarCambios = () => {
    historialCambiosActividades.value = []
    historialCambiosTareas.value = []
    tieneCambiosActividades.value = false
    tieneCambiosTareas.value = false
  }

  // ── Acciones ──

  const inicializar = async (idproyecto) => {
    if (initialized.value) return

    loading.value = true
    error.value = null
    proyectoId.value = idproyecto //Colocar el valor de id de proyecto en los estados
    descartarCambios()

    try {
      // Cargar proyecto con toda su estructura
      await cargarProyectoCompleto(idproyecto)
      initialized.value = true
    } catch (e) {
      error.value = e.message || 'Error al cargar el proyecto'
      console.error('Error al inicializar:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Carga el proyecto completo con actividades y tareas
   * Usa procesarRespuestaProyecto para extraer todo de una vez
   */
  const cargarProyectoCompleto = async (idproyecto) => {
    loading.value = true
    error.value = null

    try {
      // 1. Obtener datos del servicio
      const respuesta = await proyectoServicios.obtenerActividadesActivasPorProyectoId(idproyecto)
      const ta = await cargarTiposDeActividad()
      // 2. ═══ PROCESAR LA RESPUESTA ═══
      const datos = procesarRespuestaProyecto(respuesta)

      // 3. Asignar a los refs
      proyectoActual.value = datos.proyecto
      proyectoSnapshoot.value = datos.proyecto
      actividades.value = datos.actividades
      tareas.value = datos.tareas
      metadata.value = datos.metadata
      tiposDeActividad.value = ta

      console.log('✅ Proyecto cargado:', {
        codigo: datos.proyecto?.codigo,
        actividades: datos.actividades.length,
        tareas: datos.tareas.length,
      })

      return datos
    } catch (error) {
      console.error('❌ Error al cargar proyecto:', error)
      error.value = error.message || 'Error al cargar la información del proyecto'
      throw error
    } finally {
      loading.value = false
    }
  }

  //Funcion para cargar los tipos de actividad
  const cargarTiposDeActividad = async () => {
    loading.value = true
    try {
      const respuesta = await tipoActividadServicio.all()
      return respuesta
    } catch (error) {
      console.error('Error al cargar los tipos de actividad', error)
    } finally {
      loading.value = false
    }
  }

  //Limpiar el store
  const reset = () => {
    actividades.value = []
    tareas.value = []
    proyectoActual.value = null
    proyectoId.value = null
    initialized.value = false
    error.value = null
    descartarCambios()
  }

  //Retornos
  return {
    //estado de carga
    loading,
    error,
    initialized,
    //datos
    actividades,
    tareas,
    proyectoActual,
    proyectoId,
    metadata, //variable de los estados no computed
    tiposDeActividad,
    //getters
    count,
    proyecto,
    metadatos,
    tiposActividad,
    presupuestoProyecto,
    procedenciaFondos,
    procedenciaFondosIds,
    //Historial
    historialCambiosActividades,
    historialCambiosTareas,
    tieneCambiosSinGuardar,
    tieneCambiosTareas,
    //HIstorial funciones
    agregarCambioActividad,
    agregarCambioTarea,
    confirmarCambioActividad,
    guardarCambios,
    descartarCambios,
    showDialogCambioActividad,
    aceptarCambioActividad,
    cancelarCambioActividad,
    getTareasPorActividad,

    //func
    inicializar,
    reset,
  }
})
