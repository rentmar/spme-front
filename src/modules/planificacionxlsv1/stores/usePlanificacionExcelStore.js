import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'

export const usePlanificacionExcelStore = defineStore('excel-store', () => {
  //Estados de carga
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  const proyectoActual = ref(null)
  const actividades = ref([])

  // ── Getters ──
  const count = computed(() => actividades.value.length)
  const proyecto = computed(() => proyectoActual)

  // ── Acciones ──
  const inicializar = async (proyectoId) => {
    if (initialized.value) return
    loading.value = true
    error.value = null
    try {
      // Simular carga
      await Promise.all([cargarProyecto(proyectoId)])
      await new Promise((resolve) => setTimeout(resolve, 600))
      actividades.value = [
        {
          id: 1,
          codigo: 'ACT001',
          nombreCorto: 'Seminario Video',
          presupuesto: 15000,
          totalEjecutado: 8500,
          saldo: 6500,
          estado: 'EJEC',
        },
        {
          id: 2,
          codigo: 'ACT002',
          nombreCorto: 'Reunion Asociados',
          presupuesto: 20000,
          totalEjecutado: 12000,
          saldo: 8000,
          estado: 'EJEC',
        },
      ]
      initialized.value = true
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  //Cargar informacion del proyecto
  const cargarProyecto = async (idproyecto) => {
    loading.value = true
    try {
      const respuesta = await proyectoServicios.obtenertPorId(idproyecto)
      proyectoActual.value = respuesta
      return respuesta
    } catch (error) {
      console.error('Error al cargar la informacin del proyecto', error)
    } finally {
      loading.value = false
    }
  }

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
    actividades,
    //computed
    count,
    proyecto,
    //func
    inicializar,
    reset,
  }
})
