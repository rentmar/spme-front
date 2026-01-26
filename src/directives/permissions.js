import { useUserPermissions } from '@/stores/useUserPermissions'

export const vPermission = {
  mounted(el, binding) {
    const permissionsStore = useUserPermissions()

    // binding.value puede ser:
    // - projectId para verificar acceso específico
    // - { projectId, level } para nivel específico
    // - 'global' para verificar permisos generales

    let shouldHide = false

    if (typeof binding.value === 'number') {
      // Solo projectId - verifica acceso básico
      shouldHide = !permissionsStore.puedeVerProyecto(binding.value)
    } else if (binding.value && typeof binding.value === 'object') {
      // Objeto con projectId y nivel requerido
      const { projectId, level } = binding.value
      const currentLevel = permissionsStore.obtenerNivelAccesoProyecto(projectId)
      shouldHide = currentLevel < level
    } else if (binding.value === 'global:write') {
      // Verificar si tiene algún proyecto con nivel de edición
      shouldHide = permissionsStore.proyectosEdicion.length === 0
    }

    if (shouldHide) {
      el.style.display = 'none'
    }
  },
}
