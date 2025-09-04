import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userData = ref(null)

  const setUserData = (data) => {
    userData.value = data
    sessionStorage.setItem('userData', JSON.stringify(data))
  }

  const clearUserData = () => {
    userData.value = null
    sessionStorage.removeItem('userData')
  }

  const loadFromSession = () => {
    const storedData = sessionStorage.getItem('userData')
    if (storedData) {
      userData.value = JSON.parse(storedData)
    }
  }

  const isAuthenticated = computed(() => !!userData.value)
  const usuario = computed(() => userData.value?.usuario || '')
  const rol = computed(() => userData.value?.rol || '')

  const hasRole = (requiredRole) => {
    if (!userData.value || !userData.value.rol) return false
    return userData.value.rol === requiredRole
  }

  const hasAnyRole = (requiredRoles) => {
    if (!userData.value || !userData.value.rol) return false
    return requiredRoles.includes(userData.value.rol)
  }

  return {
    userData,
    setUserData,
    clearUserData,
    loadFromSession,
    isAuthenticated,
    usuario,
    rol,
    hasRole,
    hasAnyRole
  }
})
