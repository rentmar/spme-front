import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiServicios } from '@/modules/pei/services/peiService'

export const usePlanificacionPeiStore = defineStore('planificacion-pei', () => {
  //Estados del Store
  const loading = ref(true)
  const error = ref(false)
  const peiSeleccionado = ref(null)
  const actividadesPeiSeleccionado = ref([])
  const estructuraPeiSeleccionado = ref()

  //Cargar la informacion del Pei por Id
  const obtenerPeiPorId = async (id) => {
    loading.value = true
    try {
      peiSeleccionado.value = await peiServicios.obtenerPorId(id)
      const respuesta = await peiServicios.obtenerEstructuraPeiPorId(id)
      estructuraPeiSeleccionado.value = respuesta || ''
      const respuestaActividad = await peiServicios.obtenerActividadesPeiPorId(id)
      actividadesPeiSeleccionado.value = respuestaActividad?.actividades || ''
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
    peiSeleccionado,
    actividadesPeiSeleccionado,
    estructuraPeiSeleccionado,
    //Func
    obtenerPeiPorId,
  }
})
