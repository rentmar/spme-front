import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useDropdownStore = defineStore('dropdowns', () => {
  // Estado
  const loading = ref(false)
  const error = ref(null)
  const objetivosPei = ref([])
  const indicadoresPei = ref({})
  const objetivosEspecificos = ref([])
  const indicadoresOe = ref({})
  const actividades = ref([])
  const procesos = ref([])

  // Actions
  const fetchInitialData = async (idProyecto) => {
    try {
      loading.value = true
      error.value = null
      await Promise.all([
        fetchObjetivosPei(),
        fetchObjetivosEspecificos(idProyecto),
        fetchActividades(idProyecto),
        fetchProcesos(idProyecto),
      ])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchObjetivosPei = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/pei/objetivos')
      objetivosPei.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchIndicadoresPei = async (objetivoId) => {
    if (!indicadoresPei.value[objetivoId]) {
      try {
        loading.value = true
        const response = await axios.get(`/api/objetivos/${objetivoId}/indicadores`)
        indicadoresPei.value[objetivoId] = response.data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    return indicadoresPei.value[objetivoId] || []
  }

  const fetchObjetivosEspecificos = async (proyectoId) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/proyectos/${proyectoId}/objetivos-especificos`)
      objetivosEspecificos.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchIndicadoresOe = async (objetivoEspecificoId) => {
    if (!indicadoresOe.value[objetivoEspecificoId]) {
      try {
        loading.value = true
        const response = await axios.get(
          `/api/objetivos-especificos/${objetivoEspecificoId}/indicadores`,
        )
        indicadoresOe.value[objetivoEspecificoId] = response.data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    return indicadoresOe.value[objetivoEspecificoId] || []
  }

  const fetchActividades = async (proyectoId) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/proyectos/${proyectoId}/actividades`)
      actividades.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProcesos = async (proyectoId) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/proyectos/${proyectoId}/procesos`)
      procesos.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const resetStore = () => {
    loading.value = false
    error.value = null
    objetivosPei.value = []
    indicadoresPei.value = {}
    objetivosEspecificos.value = []
    indicadoresOe.value = {}
    actividades.value = []
    procesos.value = []
  }

  return {
    loading,
    error,
    objetivosPei,
    indicadoresPei,
    objetivosEspecificos,
    indicadoresOe,
    actividades,
    procesos,
    fetchInitialData,
    fetchObjetivosPei,
    fetchIndicadoresPei,
    fetchObjetivosEspecificos,
    fetchIndicadoresOe,
    fetchActividades,
    fetchProcesos,
    resetStore,
  }
})
