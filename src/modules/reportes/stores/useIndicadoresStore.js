// stores/useIndicadoresStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIndicadoresStore = defineStore('reportes', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  return {
    loading,
    error,
  }
})
