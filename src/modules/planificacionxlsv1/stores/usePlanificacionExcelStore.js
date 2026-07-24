import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
import { procesarRespuestaProyecto } from '../utils'

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

  // ── Getters ──
  const count = computed(() => actividades.value.length)
  const proyecto = computed(() => proyectoActual)
  const metadatos = computed(() => metadata)

  // ── Acciones ──
  const inicializar = async (proyectoId) => {
    if (initialized.value) return

    loading.value = true
    error.value = null

    try {
      // Cargar proyecto con toda su estructura
      await cargarProyectoCompleto(proyectoId)
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

      // 2. ═══ PROCESAR TODO DE UNA VEZ ═══
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
    initialized.value = false
    error.value = null
  }
  return {
    //estado de carga
    loading,
    error,
    //datos
    proyectoActual,
    initialized,
    actividades,
    tareas,
    //computed
    count,
    proyecto,
    metadatos,
    //

    //func
    inicializar,
    reset,
  }
})
