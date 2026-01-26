import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListaProyectosStore = defineStore('proyectos-pei-lista', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listadoTotal = ref([])
  const listaProyectos = ref([])

  return {
    loading,
    error,
  }
})
