// @/composables/useNavigationGuard.js
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export function useNavigationGuard() {
  const router = useRouter()
  const hasUnsavedChanges = ref(false)
  const nextNavigation = ref(null)

  // Guardamos una referencia a la función del guard y su remoción
  let guardRemover = null

  // Función para configurar cambios sin guardar
  const setUnsavedChanges = (value) => {
    hasUnsavedChanges.value = value
    console.log('setUnsavedChanges called:', value)
  }

  // Función del guard del router
  const routeGuard = (to, from, next) => {
    console.log('Route guard checking:', {
      from: from.path,
      to: to.path,
      hasChanges: hasUnsavedChanges.value,
    })

    if (hasUnsavedChanges.value && to.path !== from.path) {
      console.log('Blocking navigation due to unsaved changes')
      // Guardar la navegación pendiente
      nextNavigation.value = { to, from, next }

      // Mostrar diálogo
      window.dispatchEvent(
        new CustomEvent('show-unsaved-changes-dialog', {
          detail: { from, to },
        }),
      )

      // IMPORTANTE: No llamamos a next() cuando bloqueamos
      // La navegación se reanudará cuando el usuario confirme
      return
    }
    console.log('Allowing navigation')
    next()
  }

  // Configurar el guard del router
  const setupRouterGuard = () => {
    console.log('Setting up router guard')

    // Si ya hay un guard configurado, primero lo eliminamos
    if (guardRemover) {
      removeRouterGuard()
    }

    // Agregar el guard y guardar la función para removerlo
    router.beforeEach(routeGuard)
    guardRemover = () => {
      // En Vue Router 4, necesitamos manejar esto de manera diferente
      console.log('Router guard removed')
    }
  }

  // Eliminar el guard del router (versión corregida)
  const removeRouterGuard = () => {
    if (guardRemover) {
      console.log('Removing router guard')

      // En Vue Router 4, no hay acceso directo a beforeHooks
      // Necesitamos una solución diferente

      // Opción 1: Usar un flag para ignorar el guard
      hasUnsavedChanges.value = false

      // Opción 2: Usar una solución más robusta
      guardRemover = null
      console.log('Router guard marked for removal')
    }
  }

  // Confirmar navegación (llamado desde el diálogo)
  const confirmNavigation = () => {
    if (nextNavigation.value) {
      console.log('Confirming navigation')

      // 1. Resetear el flag de cambios
      hasUnsavedChanges.value = false

      // 2. Obtener la función next pendiente
      const { next } = nextNavigation.value

      // 3. Limpiar
      nextNavigation.value = null

      // 4. Remover el guard
      removeRouterGuard()

      // 5. Continuar con la navegación
      if (next) {
        next()
      }
    }
  }

  // Cancelar navegación
  const cancelNavigation = () => {
    console.log('Cancelling navigation')
    nextNavigation.value = null
  }

  // Limpiar cuando el componente se desmonta
  onBeforeUnmount(() => {
    console.log('Cleaning up navigation guard')
    removeRouterGuard()
    hasUnsavedChanges.value = false
    nextNavigation.value = null
  })

  return {
    hasUnsavedChanges,
    setUnsavedChanges,
    setupRouterGuard,
    removeRouterGuard,
    confirmNavigation,
    cancelNavigation,
  }
}
