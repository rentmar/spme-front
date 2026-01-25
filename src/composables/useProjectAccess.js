import { computed } from 'vue'
import { usePermissions } from './usePermissions'
import { useUserPermissions } from '@/stores/useUserPermissions'

export const useProjectAccess = (projectId) => {
  const { canViewProject, canEditProject, canAdminProject, hasAccessLevel, levels } =
    usePermissions()

  const accessLevel = computed(() => {
    const permissionsStore = useUserPermissions()
    return permissionsStore.obtenerNivelAccesoProyecto(projectId)
  })

  const accessLevelName = computed(() => {
    const level = accessLevel.value
    const levelNames = {
      [levels.SIN_ACCESO]: 'Sin acceso',
      [levels.LECTURA]: 'Lectura',
      [levels.EDICION]: 'Edición',
      [levels.ADMINISTRACION]: 'Administración',
    }
    return levelNames[level] || 'Desconocido'
  })

  return {
    canView: computed(() => canViewProject(projectId)),
    canEdit: computed(() => canEditProject(projectId)),
    canAdmin: computed(() => canAdminProject(projectId)),
    accessLevel,
    accessLevelName,
    hasAccess: (requiredLevel) => hasAccessLevel(projectId, requiredLevel),
    levels,
  }
}
