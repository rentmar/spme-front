import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userData = ref(null)

  const setUserData = (data) => {
    //console.log('🟢 [userStore] setUserData recibido:', data)
    userData.value = data
    sessionStorage.setItem('userData', JSON.stringify(data))
    //console.log('🟢 [userStore] userData después de set:', userData.value)
  }

  const clearUserData = () => {
    userData.value = null
    sessionStorage.removeItem('userData')
  }

  const loadFromSession = () => {
    const storedData = sessionStorage.getItem('userData')
    //console.log('🟡 [userStore] loadFromSession data cruda:', storedData)
    if (storedData) {
      userData.value = JSON.parse(storedData)
      //console.log('🟡 [userStore] userData después de load:', userData.value)
    }
  }

  loadFromSession()

  const isAuthenticated = computed(() => !!userData.value)
  const usuario = computed(() => userData.value?.usuario || '')
  const rol = computed(() => userData.value?.rol || '')
  const permisos = computed(() => userData.value?.permisos || '')
  const userId = computed(() => userData.value?.id || null)   // agregado por will

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
    userId,  // agregado por will
    isAuthenticated,
    usuario,
    rol,
    permisos,
    hasRole,
    hasAnyRole,
  }
})
