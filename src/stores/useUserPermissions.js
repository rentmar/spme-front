import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

export const useUserPermissions = defineStore('userPermisos', () => {
  //Estado
  const permisosGlobales = ref(null)
  const instanciasGestoras = ref([])
  const proyectosAccesibles = ref([])
  const isLoading = ref(false)

  //Getters
  const tienePermisosCargados = computed(() => !!permisosGlobales.value)

  const nivelesAcceso = computed(() => ({
    SIN_ACCESO: 0,
    LECTURA: 1,
    EDICION: 2,
    ADMINISTRACION: 3,
  }))

  const proyectosAccesiblesIds = computed(() => {
    return proyectosAccesibles.value.map((proyecto) => proyecto.id)
  })

  const proyectosLectura = computed(() =>
    proyectosAccesibles.value.filter((p) => p.nivel_acceso >= nivelesAcceso.value.LECTURA),
  )

  const proyectosEdicion = computed(() =>
    proyectosAccesibles.value.filter((p) => p.nivel_acceso >= nivelesAcceso.value.EDICION),
  )

  const proyectosAdministracion = computed(() =>
    proyectosAccesibles.value.filter((p) => p.nivel_acceso >= nivelesAcceso.value.ADMINISTRACION),
  )

  // ========== ACTIONS ==========
  //Fija los permisos del usuario
  const setPermisosGlobales = (data) => {
    console.log('💾 useUserPermissions - setPermisosGlobales:', data)

    permisosGlobales.value = data
    instanciasGestoras.value = data?.instancias_gestoras || []
    proyectosAccesibles.value = data?.proyectos_accesibles || []

    sessionStorage.setItem('userPermissions', JSON.stringify(data))

    console.log('✅ Permisos globales configurados:')
    console.log('- Instancias gestoras:', instanciasGestoras.value.length)
    console.log('- Proyectos accesibles:', proyectosAccesibles.value.length)
  }

  const cargarPermisosGlobales = async () => {
    const userStore = useUserStore()

    if (!userStore.isAuthenticated) {
      throw new Error('Usuario no autenticado')
    }

    isLoading.value = true

    try {
      if (userStore.userData) {
        setPermisosGlobales(userStore.userData)
        return permisosGlobales.value
      }

      await userStore.loadUserInfo()
      return permisosGlobales.value
    } catch (error) {
      console.error('Error cargando permisos globales:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  //Verificacion de permisos

  const puedeVerProyecto = (proyectoId) => {
    const proyecto = proyectosAccesibles.value.find((p) => p.id == proyectoId)
    return proyecto ? proyecto.nivel_acceso >= nivelesAcceso.value.LECTURA : false
  }

  const puedeEditarProyecto = (proyectoId) => {
    const proyecto = proyectosAccesibles.value.find((p) => p.id == proyectoId)
    return proyecto ? proyecto.nivel_acceso >= nivelesAcceso.value.EDICION : false
  }

  const puedeAdministrarProyecto = (proyectoId) => {
    const proyecto = proyectosAccesibles.value.find((p) => p.id == proyectoId)
    return proyecto ? proyecto.nivel_acceso >= nivelesAcceso.value.ADMINISTRACION : false
  }

  const obtenerNivelAccesoProyecto = (proyectoId) => {
    const proyecto = proyectosAccesibles.value.find((p) => p.id == proyectoId)
    return proyecto ? proyecto.nivel_acceso : nivelesAcceso.value.SIN_ACCESO
  }

  const limpiarPermisos = () => {
    permisosGlobales.value = null
    instanciasGestoras.value = []
    proyectosAccesibles.value = []
    sessionStorage.removeItem('userPermissions')
  }

  return {
    //Estados
    permisosGlobales,
    instanciasGestoras,
    proyectosAccesibles,
    isLoading,
    // Getters
    tienePermisosCargados,
    nivelesAcceso,
    proyectosLectura,
    proyectosEdicion,
    proyectosAdministracion,
    proyectosAccesiblesIds,

    //Acciones
    setPermisosGlobales,
    cargarPermisosGlobales,
    puedeVerProyecto,
    puedeEditarProyecto,
    puedeAdministrarProyecto,
    obtenerNivelAccesoProyecto,
    limpiarPermisos,
  }
})
