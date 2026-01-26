import { useUserPermissions } from '@/stores/useUserPermissions'

export const usePermissions = () => {
  const permissionsStore = useUserPermissions()

  // Verificar acceso a nivel de proyecto
  const canViewProject = (projectId) => {
    return permissionsStore.puedeVerProyecto(projectId)
  }

  const canEditProject = (projectId) => {
    return permissionsStore.puedeEditarProyecto(projectId)
  }

  const canAdminProject = (projectId) => {
    return permissionsStore.puedeAdministrarProyecto(projectId)
  }

  // Verificar acceso general
  const hasAccessLevel = (projectId, requiredLevel) => {
    const accessLevel = permissionsStore.obtenerNivelAccesoProyecto(projectId)
    return accessLevel >= requiredLevel
  }

  // Acceso a nivel de UI (sin proyecto específico)
  const hasAnyProjectsWithAccess = (minLevel = 1) => {
    return permissionsStore.proyectosAccesibles.some((p) => p.nivel_acceso >= minLevel)
  }

  // Obtener proyectos filtrados por nivel
  const getProjectsByAccess = (minLevel = 1) => {
    return permissionsStore.proyectosAccesibles.filter((p) => p.nivel_acceso >= minLevel)
  }

  return {
    canViewProject,
    canEditProject,
    canAdminProject,
    hasAccessLevel,
    hasAnyProjectsWithAccess,
    getProjectsByAccess,
    levels: permissionsStore.nivelesAcceso,
    isLoading: permissionsStore.isLoading,
  }
}
