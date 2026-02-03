import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useInformeActividadListaStore = defineStore('informes-actividad-listas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  return {
    loading,
    error,
  }
})
