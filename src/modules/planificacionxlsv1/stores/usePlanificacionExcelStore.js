import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
import { procesarRespuestaProyecto } from '../utils'
import { formatearPayload } from '../utils'

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

  // ── Getters ──
  const count = computed(() => actividades.value.length)
  const proyecto = computed(() => proyectoActual)
  const metadatos = computed(() => metadata)

  //-- Historial de cambios
  const historialCambiosActividades = ref([])
  const historialCambiosTareas = ref([])
  const tieneCambiosSinGuardar = ref(false)
  const tieneCambiosTareas = ref(false)

  //--- Acciones del historial ---
  //Agrega un cambio de Actividad
  const agregarCambioActividad = (registro) => {
    historialCambiosActividades.value.push(registro)
    tieneCambiosSinGuardar.value = true
  }

  //Agrega un cambio de tarea
  const agregarCambioTarea = (registro) => {
    historialCambiosTareas.value.push(registro)
    tieneCambiosSinGuardar.value = true
    tieneCambiosTareas.value = true
  }

  //Confirma cambio de actividad - al cargar con el menu contextual
  //Carga tareas de una nueva actividad
  const confirmarCambioActividad = () => {
    return new Promise((resolve) => {
      if (tieneCambiosTareas.value) {
        const confirmado = confirm(
          '¿Está seguro de cargar las nuevas tareas? Perderá las modificaciones no guardadas.',
        )
        if (confirmado) {
          tieneCambiosTareas.value = false
          resolve(true)
        } else {
          resolve(false)
        }
      } else {
        resolve(true)
      }
    })
  }

  //GUarda los cambios, enia la informacion a la rest api
  //Pendiente -- incluir los datos de las grillas actividad y tarea
  const guardarCambios = async () => {
    try {
      //Formatear el payload del historial de cambios
      const payload = formatearPayload(
        historialCambiosActividades.value,
        historialCambiosTareas.value,
        proyectoId.value,
      )
      //Rutina de envio al rest api
      //Llamada al bulk
      //rutina de ejemplo fectch
      const response = await fetch('/api/seguimiento/guardar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Error al guardar cambios')
      //Limpiar las variables
      historialCambiosActividades.value = []
      historialCambiosTareas.value = []
      tieneCambiosSinGuardar.value = false
      tieneCambiosTareas.value = false
      //Respuesta
      return await response.json()
    } catch (e) {
      console.error('Error al guardar cambios', e)
    }
  }

  //Descartar los cambios
  const descartarCambios = () => {
    historialCambiosActividades.value = []
    historialCambiosTareas.value = []
    tieneCambiosSinGuardar.value = false
    tieneCambiosTareas.value = false
  }

  // ── Acciones ──

  const inicializar = async (idproyecto) => {
    if (initialized.value) return

    loading.value = true
    error.value = null
    proyectoId.value = idproyecto //Colocar el valor de id de proyecto en los estados

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

      // 2. ═══ PROCESAR LA RESPUESTA ═══
      const datos = procesarRespuestaProyecto(respuesta)

      // 3. Asignar a los refs
      proyectoActual.value = datos.proyecto
      actividades.value = datos.actividades
      tareas.value = datos.tareas
      metadata.value = datos.metadata

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

  //Cargar todas las actividades de un proyecto

  //Funcion para extraer el proyecto

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
    //getters
    count,
    proyecto,
    metadatos,
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

    //func
    inicializar,
    reset,
  }
})
