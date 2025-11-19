import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // ========== STATE ==========
  const globalLoading = ref(false)
  const loadingStack = ref([])
  const modales = ref({})
  const notificaciones = ref([])
  const tema = ref(localStorage.getItem('tema') || 'claro')

  // ========== GETTERS ==========
  const isLoading = computed(() => loadingStack.value.length > 0)
  const notificacionesActivas = computed(() => notificaciones.value.filter((n) => !n.leida))

  // ========== ACTIONS ==========
  const iniciarLoading = (id = 'global') => {
    loadingStack.value.push(id)
    globalLoading.value = true
  }

  const detenerLoading = (id = 'global') => {
    const index = loadingStack.value.indexOf(id)
    if (index > -1) {
      loadingStack.value.splice(index, 1)
    }
    globalLoading.value = loadingStack.value.length > 0
  }

  const abrirModal = (modalId, props = {}) => {
    modales.value[modalId] = { abierto: true, props }
  }

  const cerrarModal = (modalId) => {
    if (modales.value[modalId]) {
      modales.value[modalId].abierto = false
    }
  }

  const agregarNotificacion = (notificacion) => {
    const id = Date.now().toString()
    notificaciones.value.push({
      id,
      tipo: 'info',
      tiempo: 5000,
      ...notificacion,
      leida: false,
      timestamp: Date.now(),
    })

    // Auto-remover después del tiempo especificado
    if (notificacion.tiempo !== 0) {
      setTimeout(() => {
        removerNotificacion(id)
      }, notificacion.tiempo)
    }
  }

  const removerNotificacion = (id) => {
    const index = notificaciones.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notificaciones.value.splice(index, 1)
    }
  }

  const marcarNotificacionLeida = (id) => {
    const notificacion = notificaciones.value.find((n) => n.id === id)
    if (notificacion) {
      notificacion.leida = true
    }
  }

  const alternarTema = () => {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro'
    localStorage.setItem('tema', tema.value)
    document.documentElement.setAttribute('data-tema', tema.value)
  }

  const inicializarTema = () => {
    document.documentElement.setAttribute('data-tema', tema.value)
  }

  const limpiarNotificaciones = () => {
    notificaciones.value = []
  }

  return {
    // State
    globalLoading,
    modales,
    notificaciones,
    tema,

    // Getters
    isLoading,
    notificacionesActivas,

    // Actions
    iniciarLoading,
    detenerLoading,
    abrirModal,
    cerrarModal,
    agregarNotificacion,
    removerNotificacion,
    marcarNotificacionLeida,
    limpiarNotificaciones,
    alternarTema,
    inicializarTema,
  }
})
