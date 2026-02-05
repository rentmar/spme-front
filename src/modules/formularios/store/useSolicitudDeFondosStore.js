import { defineStore } from 'pinia'
import { ref } from 'vue'
// Asegúrate de que esta ruta sea correcta en tu proyecto

export const useSolicitudFondosStore = defineStore('solicitud-fondos', () => {
  // === ESTADOS ===
  const loading = ref(false)
  const error = ref(null)
  const SolicitudDeFondos = ref(null)
  const SolicitudDeFondosTarea = ref(null)
  const SolicitudDeFondosPei = ref(null)
  const SolicitudDeFondosTareaPei = ref(null)

  return {
    // Estados
    loading,
    error,
  }
})
