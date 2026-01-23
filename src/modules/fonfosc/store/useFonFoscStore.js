import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fonfoscServicios } from '../services/fonfoscService'

export const useFonFoscStore = defineStore('fonfosc-proyecto', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  const fonfoscEstructura = ref(null)

  //Cargar los proyecto fonfosc
  const cargarEstrcuturaFonfosc = async (idproyectoff) => {
    loading.value = true
    try {
      const respuesta = await fonfoscServicios.ffestructura(idproyectoff)
      fonfoscEstructura.value = respuesta.data
      return respuesta
    } catch (err) {
      console.error('Error al cargarl los proyectos')
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fonfoscEstructura,
    //Func
    cargarEstrcuturaFonfosc,
  }
})
