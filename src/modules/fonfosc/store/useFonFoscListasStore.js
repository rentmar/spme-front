import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fonfoscServicios } from '../services/fonfoscService'

export const useFonFoscListasStore = defineStore('fonfosc-listas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  const fonfoscLista = ref([])

  //Cargar los proyecto fonfosc
  const cargarListaFonfosc = async () => {
    loading.value = true
    try {
      const respuesta = await fonfoscServicios.fftodos()
      fonfoscLista.value = respuesta
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
    fonfoscLista,
    //Func
    cargarListaFonfosc,
  }
})
