import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useUserPermissions } from './useUserPermissions'

export const useUserStore = defineStore('user', () => {
  //Variables de estado
  const userData = ref(null) //Datos completos del usuario actual
  const accessToken = ref(localStorage.getItem('access_token')) //Acceso
  const refreshToken = ref(localStorage.getItem('refresh_token')) //Refresco
  const isLoading = ref(false) //Bandera de carga
  const initialized = ref(false)
  const listaUsuarios = ref(null)
  const listaUsuariosCompleta = ref([])

  //Iniciar composables
  const {
    tokens,
    permisosUsuario,
    listaUsuariosMensajes,
    listaDeUsuarioCompleta,
    obtenerPermisos,
    obtenerTokens,
    obtenerListaUsuarios,
    obtenerListaUsuariosCompleta,
  } = useUsuario()

  //GETTERS
  /*const isAuthenticated = computed(() => !!userData.value)
  const usuario = computed(() => userData.value?.usuario || '')
  const rol = computed(() => userData.value?.rol || '')
  const permisos = computed(() => userData.value?.permisos || '')*/

  /**** GETTERS ****/
  //Verifica si hay accion activa
  const isAuthenticated = computed(() => !!accessToken.value)
  //Identificador del usuario
  const id = computed(() => userData.value?.user?.id || 0)
  //Nombre del usuario actual
  const usuario = computed(() => userData.value?.user?.username || 'invitado')
  //Rol del usuario actual
  const rol = computed(() => userData.value?.user?.cargo || 'invitado')
  //Correo electronico del usuario
  const correo = computed(() => userData.value?.user?.correo || 'NoCorreo')
  //Permisos del usuario
  //const permisos = computed(() => userData.value?.permisos || '')

  /***** ACCIONES ******/

  //Guarda datos del usuario en el estado  y sessionStorage
  //username, rol, permisoso
  const setUserData = async (data) => {
    userData.value = data.value
    sessionStorage.setItem('userData', JSON.stringify(data.value))
  }

  //Limpia los datos de session y tokens
  const clearUserData = () => {
    userData.value = null
    accessToken.value = null
    refreshToken.value = null

    //Limpiar todo el almacenamiento
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('userData')
  }

  //Carga datos de usuario desde sessionStorage
  //Recupera datos de session previa (sin autenticar)
  const loadFromSession = () => {
    const storedData = sessionStorage.getItem('userData')
    if (storedData) {
      userData.value = JSON.parse(storedData)
    }
  }

  //Verifica si el usuario tiene un rol especifico
  const hasRole = (requiredRole) => {
    if (!userData.value || !userData.value.rol) return false
    return userData.value.rol === requiredRole
  }

  //Verifica si el usuario tiene al menos uno de los roles
  const hasAnyRole = (requiredRoles) => {
    if (!userData.value || !userData.value.rol) return false
    return requiredRoles.includes(userData.value.rol)
  }

  //Almacena tokens JWT en state y localStorage
  //Tokens de autenticacion
  //tokens.access Token de acceso JWT
  //tokens.refresh Token de refresco JWT
  const setTokens = (tokens) => {
    accessToken.value = tokens.value.access
    refreshToken.value = tokens.value.refresh
    localStorage.setItem('access_token', tokens.value.access)
    localStorage.setItem('refresh_token', tokens.value.refresh)
  }

  /**
   * @action login - Autentica usuario con credenciales y obtiene JWT
   * @param {Object} credentials - Credenciales de login
   * @param {string} credentials.username - Nombre de usuario
   * @param {string} credentials.password - Contraseña
   * @returns {Promise<Object>} Respuesta del servidor con tokens
   * @throws {Error} Si falla la autenticación
   */
  const login = async (credentials) => {
    isLoading.value = true
    try {
      //Obtener tokens JWT
      await obtenerTokens(credentials)
      //Guardar los tokens en el store y localStorage
      setTokens(tokens)
      //Cargar Informacion adicional del usuario
      await loadUserInfo()
      //Cargar lista de usuarios
      await cargarListaUsuarios()

      return tokens
    } catch (error) {
      clearUserData()
      console.error('Error en el Login', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * @action loadUserInfo - Carga información del usuario usando JWT
   * @returns {Promise<void>}
   * @throws {Error} Si falla la carga de información
   */
  const loadUserInfo = async () => {
    console.log('Rutina loadUserInfo')
    if (!accessToken.value) return
    try {
      //Obtener datos del usuario desde el enpoint de permisos
      await obtenerPermisos(accessToken.value)
      console.log('(Debug)permisosUsuario: ', permisosUsuario)
      setUserData(permisosUsuario)
      //Integrando los permisos
      const userPermissions = useUserPermissions()
      userPermissions.setPermisosGlobales(permisosUsuario.value)
    } catch (error) {
      console.error('Error cargando informacion del usuario: ', error)
      throw error
    }
  }

  /**
   * @action initialize - Inicializa sesión automáticamente al cargar la app
   * @returns {Promise<void>}
   * @description Verifica tokens existentes y carga datos de usuario
   */
  const initialize = async () => {
    if (initialized.value) return

    if (accessToken.value) {
      try {
        console.log('Inicializando sesion con token existente')
        await loadUserInfo()
        console.log('Sesion inicializada correctamente')
      } catch (error) {
        console.error('Error inicializando auth:', error)
        clearUserData()
      }
    }

    //Si hay datos en el sessionStorage, cargar en useUserPermissions
    const storedUserData = sessionStorage.getItem('userData')
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        const userPermissions = useUserPermissions()
        userPermissions.setPermisosGlobales(userData)
      } catch (error) {
        console.error('Error cargando permisos desde sessionStorage:', error)
      }
    }

    initialized.value = true
  }

  //Lista de usuarios
  const cargarListaUsuarios = async () => {
    isLoading.value = true
    try {
      await obtenerListaUsuarios()
      listaUsuarios.value = listaUsuariosMensajes.value.data
    } catch (error) {
      console.error('Error cargando la lista de usuarios', error)
    } finally {
      isLoading.value = false
    }
  }

  //obtener la lista de usuarios completa
  const cargarListaUsuariosCompleta = async () => {
    isLoading.value = true
    try {
      await obtenerListaUsuariosCompleta()
      listaUsuariosCompleta.value = listaDeUsuarioCompleta.value
    } catch (err) {
      console.error('Error al cargar la lista de usuarios completa', err)
    } finally {
      isLoading.value = false
    }
  }

  const obtenerCorreosPorIds = (ids) => {
    if (!ids || !ids.length || !listaUsuariosCompleta.value) {
      return []
    }

    // Filtrar usuarios por IDs y extraer emails
    const correos = listaUsuariosCompleta.value
      .filter((usuario) => {
        // Acceder al ID del usuario
        const usuarioData = usuario._custom?.value || usuario
        const userId = usuarioData.id
        return ids.includes(userId)
      })
      .map((usuario) => {
        // Extraer email - PRIMERO buscar 'email', luego 'correo'
        const usuarioData = usuario._custom?.value || usuario

        // 1. Buscar 'email' (para usuarios nuevos)
        // 2. Si está vacío, buscar 'correo'
        // 3. Si ambos están vacíos, devolver null
        const email = usuarioData.email || usuarioData.correo

        return { email }
      })
      .filter((item) => item.email && item.email.trim() !== '' && item.email.includes('@'))

    return correos
  }

  /********************** Usuario  ****************************/

  // Verificación mejorada que considera admin siempre ve todo
  const canSee = (roles) => {
    if (!userData.value || !userData.value.user?.cargo) return false

    const currentRole = userData.value.user.cargo // Mantener exacto

    // Admin siempre ve todo (comparación exacta)
    if (currentRole === 'admin') return true

    // Verificar si los roles son un array
    if (Array.isArray(roles)) {
      return roles.includes(currentRole)
    }

    // Si es string, comparar directamente
    return currentRole === roles
  }

  // NUEVA: Verificación inversa
  const cannotSee = (roles) => {
    return !canSee(roles)
  }

  // NUEVOS getters para verificación rápida (sin modificar rol existente)
  const isAdminUser = computed(() => {
    return rol.value === 'admin' // Comparación exacta
  })

  const isCoordinator = computed(() => {
    return rol.value === 'coordinador' // Comparación exacta
  })

  const isTechnician = computed(() => {
    return rol.value === 'tecnico' // Comparación exacta
  })

  const isAccountant = computed(() => {
    return rol.value === 'contable' // Comparación exacta
  })

  // Atajos comunes usando canSee
  const canManageTeams = computed(() => canSee(['administrador', 'coordinador']))
  const canViewTasks = computed(() => canSee(['administrador', 'coordinador', 'tecnico']))

  return {
    //Estado
    userData, //Datos del usuario
    accessToken, //Token JWT de acceso
    refreshToken, //Token JWT de refresco
    isLoading, //Estado de carga
    initialized, //Inicializado
    listaUsuarios, //Lista de usuarios, superusuarios excluido
    listaDeUsuarioCompleta,

    //Getters
    isAuthenticated, //Comprobacion de autenticacion
    usuario, //Nombre de usuario
    rol, //Rol de usuario
    //Permisos del usuario
    id, //Id del usuario
    correo, //Correo del usuario

    //Actiones - Gestion de datos
    setUserData, //Guardar datos de usuario
    clearUserData, //Limpiar session logout
    loadFromSession, //Cargar desde sessionStorage

    //Acciones - Verificacion de permisos
    hasRole, //Verificar rol especifico
    hasAnyRole, //Verificar multiples roles

    //Acciones - Autenticacion JWT
    login, //login con credenciales
    initialize, //Inicializar session automatica
    loadUserInfo, //Cargar informacion del usuario
    cargarListaUsuarios,
    cargarListaUsuariosCompleta,
    obtenerCorreosPorIds, //Obtiene los correos por Ids
    //Funciones para UIX
    cannotSee,
    canSee,
    isAdminUser,
    isCoordinator,
    isTechnician,
    isAccountant,
    canManageTeams,
    canViewTasks,
  }
})
