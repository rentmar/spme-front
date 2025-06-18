// src/composables/useLoading.js
import { ref } from 'vue'

export default function useLoading(initialState = false) {
  const isLoading = ref(initialState)
  const loadingMessage = ref('')
  const loadingProgress = ref(0)
  const loadingError = ref(null)

  /**
   * Ejecuta una operación asíncrona mostrando el estado de carga
   * @param {Promise} asyncFunction - Función asíncrona a ejecutar
   * @param {string} message - Mensaje opcional para mostrar durante la carga
   * @param {boolean} showProgress - Si se debe mostrar progreso
   */
  const withLoading = async (asyncFunction, message = '', showProgress = false) => {
    isLoading.value = true
    loadingMessage.value = message
    loadingError.value = null

    if (showProgress) {
      loadingProgress.value = 0
    }

    try {
      const result = await asyncFunction
      return result
    } catch (error) {
      loadingError.value = error
      throw error
    } finally {
      isLoading.value = false
      loadingMessage.value = ''
      loadingProgress.value = 100
    }
  }

  /**
   * Actualiza el progreso de carga
   * @param {number} progress - Valor entre 0 y 100
   */
  const setProgress = (progress) => {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
  }

  return {
    isLoading,
    loadingMessage,
    loadingProgress,
    loadingError,
    withLoading,
    setProgress,
    startLoading: (message = '') => {
      isLoading.value = true
      loadingMessage.value = message
    },
    stopLoading: () => {
      isLoading.value = false
      loadingMessage.value = ''
    },
  }
}
