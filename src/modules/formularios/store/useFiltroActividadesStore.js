import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFiltroActividadesStore = defineStore('filtro-actividades-tareas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  return {
    //Estados
    loading,
    error,
  }
})
