// composables/useUserRole.js
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

export const useUserRole = () => {
  const userStore = useUserStore()

  // Usa los nuevos getters del store
  const userRole = computed(() => userStore.rol) // 'administrador', 'coordinador', etc.
  const isAdmin = computed(() => userStore.isAdminUser) // true si es 'administrador'
  const isCoordinador = computed(() => userStore.isCoordinator) // true si es 'coordinador'
  const isTecnico = computed(() => userStore.isTechnician) // true si es 'tecnico'
  const isContable = computed(() => userStore.isAccountant) // true si es 'contable'

  // Método principal usando canSee (que ya maneja admin)
  const canSee = (roles) => {
    return userStore.canSee(roles)
  }

  // Método para compatibilidad (usa canSee internamente)
  const hasRole = (roles) => {
    return userStore.canSee(roles)
  }

  // Lógica inversa
  const cannotSee = (roles) => {
    return userStore.cannotSee(roles)
  }

  // Atajos usando las nuevas funciones del store
  const canManageTeams = computed(() => userStore.canManageTeams)
  const canViewTasks = computed(() => userStore.canViewTasks)

  return {
    // Estado exacto del store
    userRole, // 'administrador', 'coordinador', 'tecnico', 'contable'
    isAdmin, // true solo si userRole === 'administrador'
    isCoordinador, // true solo si userRole === 'coordinador'
    isTecnico, // true solo si userRole === 'tecnico'
    isContable, // true solo si userRole === 'contable'

    // Métodos de verificación (usan canSee internamente)
    canSee, // ✅ RECOMENDADO: admin siempre ve todo
    hasRole, // ✅ Para compatibilidad (usa canSee)
    cannotSee, // Para lógica inversa

    // Atajos predefinidos
    canManageTeams, // true para 'administrador' o 'coordinador'
    canViewTasks, // true para 'administrador', 'coordinador' o 'tecnico'

    // Datos del usuario
    userData: computed(() => userStore.userData),
    username: computed(() => userStore.usuario),
    email: computed(() => userStore.correo),
    isAuthenticated: computed(() => userStore.isAuthenticated),

    // Para compatibilidad con código existente que usa hasAnyRole
    hasAnyRole: userStore.hasAnyRole,
  }
}
