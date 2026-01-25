// Control de navegacion para planificacion del proyecto
// @/composables/useNavigationGuardSimple.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export function useNavigationGuardSimple(getHasUnsavedChanges) {
  const router = useRouter()
  const showDialog = ref(false)
  const pendingNavigation = ref(null)

  // Flag para controlar si estamos activos
  let isActive = true

  // Handler para beforeunload del navegador
  const handleBeforeUnload = (event) => {
    if (getHasUnsavedChanges()) {
      event.preventDefault()
      event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?'
    }
  }

  // Handler para navegación del router
  const handleRouteChange = (to, from, next) => {
    // Si no estamos activos o no hay cambios, permitir navegación
    if (!isActive || !getHasUnsavedChanges() || to.path === from.path) {
      next()
      return
    }

    console.log('Interceptando navegación por cambios sin guardar', {
      from: from.path,
      to: to.path,
      hasChanges: getHasUnsavedChanges(),
    })

    // Guardar la navegación pendiente
    pendingNavigation.value = { to, from, next }

    // Mostrar diálogo
    showDialog.value = true

    // NO llamar a next() - la navegación se reanudará cuando el usuario confirme
  }

  // Confirmar navegación
  const confirmLeave = () => {
    if (pendingNavigation.value && pendingNavigation.value.next) {
      console.log('Confirmando navegación')
      showDialog.value = false

      // Desactivar temporalmente el guard para permitir la navegación
      isActive = false

      // Continuar con la navegación
      pendingNavigation.value.next()
      pendingNavigation.value = null

      // Reactivar después de un breve delay
      setTimeout(() => {
        isActive = true
      }, 100)
    }
  }

  // Cancelar navegación
  const cancelLeave = () => {
    console.log('Cancelando navegación')
    showDialog.value = false
    pendingNavigation.value = null
  }

  // Configurar
  onMounted(() => {
    console.log('Configurando guard de navegación')
    router.beforeEach(handleRouteChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  // Limpiar
  onBeforeUnmount(() => {
    console.log('Limpiando guard de navegación')
    isActive = false
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    showDialog,
    confirmLeave,
    cancelLeave,
    pendingNavigation,
  }
}
