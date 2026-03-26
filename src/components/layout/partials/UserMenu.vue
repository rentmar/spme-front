<template>
  <v-menu>
    <template #activator="{ props: menuActivator }">
      <v-btn
        v-bind="menuActivator"
        variant="text"
        class="text-none user-menu-btn pa-0"
        :ripple="false"
        height="auto"
        min-width="auto"
      >
        <div class="user-trigger d-flex align-center px-3 py-2 rounded-lg">
          <!-- Avatar con efecto sutil -->
          <div class="avatar-wrapper position-relative">
            <v-badge
              dot
              location="bottom end"
              offset-x="3"
              offset-y="3"
              bordered
              :color="getStatusColor()"
              class="status-badge"
            >
              <v-avatar
                size="42"
                :color="getAvatarColor()"
                class="avatar-main elevation-2"
                :class="{ 'active-user': isUserActive }"
              >
                <div v-if="!user.avatar" class="avatar-placeholder">
                  <v-icon icon="mdi-account" size="24" color="white" />
                </div>
                <img v-else :src="user.avatar" alt="User avatar" class="avatar-img" />
                <!-- Efecto de brillo sutil -->
                <div class="avatar-glow"></div>
              </v-avatar>
            </v-badge>

            <!-- Indicador de actividad sutil -->
            <div v-if="isUserActive" class="pulse-indicator"></div>
          </div>

          <!-- Información del usuario -->
          <div class="user-details ml-3 text-left">
            <div class="d-flex align-center">
              <span class="user-name font-weight-semibold text-body-1 text-white">
                {{ getDisplayName() }}
              </span>
              <v-icon
                icon="mdi-chevron-down"
                class="menu-arrow ml-2 text-white"
                size="18"
                :class="{ rotated: menuActivator['aria-expanded'] === 'true' }"
              />
            </div>
            <div class="user-meta d-flex align-center mt-1">
              <v-chip
                v-if="showOnlineStatus"
                size="x-small"
                density="compact"
                class="status-chip"
                color="success"
                label
              >
                <v-icon icon="mdi-circle" size="8" class="mr-1" />
                <span class="text-caption">En línea</span>
              </v-chip>
              <span v-else class="text-caption text-white text-lighten-1">
                {{ getRoleDisplay() }}
              </span>
            </div>
          </div>
        </div>
      </v-btn>
    </template>

    <!-- Menú desplegable -->
    <v-card elevation="4" class="overflow-hidden" rounded="lg" width="280">
      <v-list density="compact" class="py-2">
        <!-- Header del usuario -->
        <v-list-item class="user-header px-4 py-3 bg-indigo-lighten-5">
          <template #prepend>
            <v-avatar
              size="52"
              :color="isUserActive ? 'indigo-darken-2' : 'grey-darken-1'"
              class="elevation-2 mr-3"
            >
              <v-icon v-if="!user.avatar" icon="mdi-account-circle" size="32" color="white" />
              <img v-else :src="user.avatar" alt="User avatar" class="avatar-img" />
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-body-1">
            {{ usuario?.username || userStore.usuario || 'Usuario' }}
          </v-list-item-title>
          <v-list-item-subtitle class="d-flex align-center flex-wrap mt-2">
            <span class="text-caption text-medium-emphasis">
              {{ usuario?.correo || 'Sin email' }}
            </span>
            <v-chip
              v-if="showOnlineStatus"
              size="x-small"
              density="comfortable"
              class="ml-2 mt-1"
              color="success"
              prepend-icon="mdi-check-circle"
            >
              Activo
            </v-chip>
            <v-chip
              v-else
              size="x-small"
              density="comfortable"
              class="ml-2 mt-1"
              color="grey"
              prepend-icon="mdi-close-circle"
            >
              Inactivo
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-1" />

        <!-- Menú de opciones -->
        <v-list-item
          prepend-icon="mdi-account-edit-outline"
          title="Mi perfil"
          value="profile"
          to="/usuario/perfil/"
          class="menu-item"
          rounded="lg"
        >
          <template #append>
            <v-icon icon="mdi-chevron-right" size="16" class="text-medium-emphasis" />
          </template>
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-cog-outline"
          title=" Mis Mensajes"
          value="settings"
          class="menu-item"
          rounded="lg"
          to="/notificaciones/"
        >
          <template #append>
            <v-icon icon="mdi-chevron-right" size="16" class="text-medium-emphasis" />
          </template>
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Mis Proyectos"
          value="team"
          class="menu-item"
          to="/proyectos/mis-proyectos/"
          rounded="lg"
        >
          <template #append>
            <v-icon icon="mdi-chevron-right" size="16" class="text-medium-emphasis" />
          </template>
        </v-list-item>

        <v-divider class="my-1" />

        <!-- Cerrar sesión -->
        <v-list-item
          prepend-icon="mdi-logout-variant"
          title="Cerrar sesión"
          value="logout"
          class="menu-item logout-item"
          rounded="lg"
          @click="handleLogout"
        >
          <template #prepend>
            <v-icon icon="mdi-logout-variant" color="error" />
          </template>
        </v-list-item>
      </v-list>

      <!-- Footer informativo -->
      <div class="px-4 py-2 bg-grey-lighten-4 text-center">
        <span class="text-caption text-medium-emphasis"> v{{ appVersion }} </span>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useUserPermissions } from '@/stores/useUserPermissions'
import { computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const userPermisosStore = useUserPermissions()
// App version
const appVersion = '1.0.0'

defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Usuario',
      email: '',
      isActive: false,
      avatar: null,
    }),
  },
})

// Computed properties
const usuario = computed(() => {
  return userStore.userData?.user || null
})

// Determina si el usuario está activo basado en la autenticación
const isUserActive = computed(() => {
  return userStore.isAuthenticated
})

// Específico para mostrar el chip "En línea" (más estricto)
const showOnlineStatus = computed(() => {
  // Solo mostrar "En línea" si está autenticado Y tiene is_active = true
  return userStore.isAuthenticated && usuario.value?.is_active === true
})

const handleLogout = async () => {
  // userStore.clearUserData()
  // userPermisosStore.limpiarPermisos()
  // router.push('/')
  console.log('🚪 Cerrando sesión...')

  try {
    // Limpiar datos
    userStore.clearUserData()
    userPermisosStore.limpiarPermisos()
    sessionStorage.clear()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Redirigir al login usando Vue Router
    await router.push('/')

    // Forzar recarga después de la redirección
    setTimeout(() => {
      window.location.reload()
    }, 100)
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    window.location.href = '/'
  }
}

const getDisplayName = () => {
  if (!usuario.value && !userStore.isAuthenticated) return 'Invitado'

  const name = usuario.value?.username || userStore.usuario || 'Usuario'
  if (name.length > 15) {
    return name.substring(0, 12) + '...'
  }
  return name
}

const getRoleDisplay = () => {
  if (!usuario.value && !userStore.isAuthenticated) return 'Invitado'

  const role = userStore.rol || usuario.value?.cargo
  if (!role) return 'Usuario'

  const rolesMap = {
    admin: 'Admin',
    supervisor: 'Supervisor',
    user: 'Usuario',
    invitado: 'Invitado',
  }
  return rolesMap[role] || role
}

const getStatusColor = () => {
  return isUserActive.value ? 'success' : 'grey'
}

const getAvatarColor = () => {
  if (!usuario.value && !userStore.isAuthenticated) return 'grey-darken-1'

  if (isUserActive.value) {
    const role = userStore.rol || usuario.value?.cargo
    const colors = {
      admin: 'deep-purple-darken-2',
      supervisor: 'blue-darken-2',
      user: 'indigo-darken-2',
      default: 'indigo-darken-2',
    }
    return colors[role] || colors.default
  }
  return 'grey-darken-1'
}
</script>

<style scoped>
.user-menu-btn {
  padding: 0 !important;
  margin: 0 !important;
}

.user-trigger {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-menu--active .user-trigger {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Avatar mejorado */
.avatar-wrapper {
  position: relative;
}

.avatar-main {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-trigger:hover .avatar-main {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.avatar-main.active-user {
  border-color: rgba(76, 175, 80, 0.4);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.user-trigger:hover .avatar-img {
  transform: scale(1.1);
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-trigger:hover .avatar-glow {
  opacity: 1;
}

/* Indicador de pulso para usuarios activos */
.pulse-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
  z-index: 2;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

/* Status badge */
.status-badge :deep(.v-badge__badge) {
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Detalles del usuario */
.user-details {
  min-width: 120px;
}

.user-name {
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.user-meta {
  min-height: 20px;
}

.status-chip {
  height: 18px !important;
  padding: 0 6px !important;
  background-color: rgba(76, 175, 80, 0.9) !important;
}

.status-chip :deep(.v-chip__content) {
  font-size: 0.65rem;
  color: white !important;
}

.status-chip :deep(.v-icon) {
  color: white !important;
}

.text-white {
  color: white !important;
}

.text-lighten-1 {
  opacity: 0.9;
}

.menu-arrow {
  color: white !important;
  opacity: 0.9;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-arrow.rotated {
  transform: rotate(180deg);
}

/* Responsive */
@media (max-width: 960px) {
  .user-details {
    min-width: 100px;
  }

  .user-name {
    font-size: 0.8125rem !important;
  }
}

@media (max-width: 768px) {
  .user-trigger {
    padding: 6px 10px !important;
  }

  .user-details {
    display: none !important;
  }

  .avatar-main {
    width: 36px !important;
    height: 36px !important;
  }
}

@media (max-width: 480px) {
  .user-trigger {
    padding: 4px 8px !important;
  }

  .avatar-main {
    width: 32px !important;
    height: 32px !important;
  }
}

/* Efecto de elevación para el menú */
.v-menu__content {
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(var(--v-theme-on-background), 0.08);
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.95);
}
</style>
