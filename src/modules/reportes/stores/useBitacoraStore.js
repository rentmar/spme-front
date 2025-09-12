import { defineStore } from 'pinia'
import api from '@/services/axios'

export const useBitacoraStore = defineStore('bitacora', {
  state: () => ({
    bitacoras: [],
    indicadoresReportados: [], // IDs de indicadores ya reportados
    isLoading: false,
  }),

  actions: {
    async cargarBitacorasActividad(actividadId) {
      this.isLoading = true
      try {
        const response = await api.get(`/api/bitacoras/actividad/${actividadId}/`)
        this.bitacoras = response.data
        // Extraer IDs de indicadores ya reportados
        this.indicadoresReportados = response.data.map((b) => b.indicador)
      } catch (error) {
        console.error('Error cargando bitácoras:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async obtenerBitacoraPorIndicador(indicadorId) {
      try {
        const response = await api.get(`/api/bitacoras/indicador/${indicadorId}/`)
        return response.data
      } catch (error) {
        if (error.response?.status === 404) {
          return null // No existe bitácora para este indicador
        }
        console.error('Error obteniendo bitácora:', error)
        throw error
      }
    },

    async crearBitacora(formData) {
      try {
        const response = await api.post('/api/bitacoras/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.bitacoras.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error creando bitácora:', error)
        throw error
      }
    },

    agregarIndicadorReportado(indicadorId) {
      if (!this.indicadoresReportados.includes(indicadorId)) {
        this.indicadoresReportados.push(indicadorId)
      }
    },
  },
})
