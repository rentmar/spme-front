import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserPermissions } from './useUserPermissions'

export const useProjectPermissions = defineStore('projectPermissions', () => {
  // ========== STATE ==========
  const permisosProyecto = ref({})
  const verificacionesPendientes = ref({})

  // ========== ACTIONS ==========
  const verificarPermisosProyecto = async (proyectoId) => {
    const userPermissions = useUserPermissions()

    // Evitar verificaciones duplicadas
    if (verificacionesPendientes.value[proyectoId]) {
      return verificacionesPendientes.value[proyectoId]
    }

    // Verificar cache primero
    const cacheKey = `proyecto_${proyectoId}`
    const cached = permisosProyecto.value[cacheKey]

    if (cached) {
      const ahora = Date.now()
      const tiempoCache = 5 * 60 * 1000 // 5 minutos

      if (ahora - cached.timestamp < tiempoCache) {
        return cached.data
      }
    }

    // Verificación con userPermissions (puedes cambiar por API si necesitas)
    const permisos = {
      puedeVer: userPermissions.puedeVerProyecto(proyectoId),
      puedeEditar: userPermissions.puedeEditarProyecto(proyectoId),
      puedeAdministrar: userPermissions.puedeAdministrarProyecto(proyectoId),
      nivelAcceso: userPermissions.obtenerNivelAccesoProyecto(proyectoId),
    }

    // Actualizar cache
    permisosProyecto.value[cacheKey] = {
      data: permisos,
      timestamp: Date.now(),
    }

    return permisos
  }

  const obtenerPermisosProyecto = (proyectoId) => {
    const cacheKey = `proyecto_${proyectoId}`
    const cached = permisosProyecto.value[cacheKey]

    if (cached) {
      return cached.data
    }

    return verificarPermisosProyecto(proyectoId)
  }

  const invalidarCacheProyecto = (proyectoId) => {
    const cacheKey = `proyecto_${proyectoId}`
    delete permisosProyecto.value[cacheKey]
  }

  const limpiarCache = () => {
    permisosProyecto.value = {}
    verificacionesPendientes.value = {}
  }

  return {
    // State
    permisosProyecto,

    // Actions
    verificarPermisosProyecto,
    obtenerPermisosProyecto,
    invalidarCacheProyecto,
    limpiarCache,
  }
})
