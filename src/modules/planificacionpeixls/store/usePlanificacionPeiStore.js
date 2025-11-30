import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiServicios } from '@/modules/pei/services/peiService'

export const usePlanificacionPeiStore = defineStore('planificacion-pei', () => {
  //Estados del Store
  const loading = ref(true)
  const error = ref(false)
  const peiActual = ref(null)
  const ActividadesPeiActual = ref([])
  const TareasPeiActual = ref([])

  //Cargar la informacion del Pei por Id
  const obtenerPeiPorId = async (id) => {
    loading.value = true
    try {
      peiActual.value = await peiServicios.obtenerPorId(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    peiActual,
    ActividadesPeiActual,
    TareasPeiActual,
    //Func
    obtenerPeiPorId,
  }
})
