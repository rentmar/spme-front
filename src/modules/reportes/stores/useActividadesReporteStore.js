import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useActividadesStore = defineStore('actividades', {
  state: () => ({
    actividades: [],
    loading: false,
    error: null,
  }),

  actions: {
    async cargarActividades() {
      this.loading = true
      this.error = null

      try {
        const { get } = useApi()
        const response = await get('/api/actividades/')
        this.actividades = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
})
