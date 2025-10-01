import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIndicadoresStore = defineStore('indicadores', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  const indicadorogLista = ref([])
  const indicadoroeLista = ref([])
  const indicadorrogLista = ref([])
  const indicadorroeLista = ref([])

  return {
    loading,
    error,
    indicadorogLista,
    indicadoroeLista,
    indicadorrogLista,
    indicadorroeLista,
  }
})
