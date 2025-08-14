<template>
  <v-menu>
    <template #activator="{ props: menuActivator }">
      <v-btn v-bind="menuActivator" variant="text" class="text-none user-menu-btn" rounded="lg">
        <v-badge
          dot
          location="bottom end"
          offset-x="4"
          offset-y="4"
          :color="user.isActive ? 'success' : 'grey'"
        >
          <v-avatar size="36" :color="user.isActive ? 'indigo-darken-2' : 'grey-darken-1'">
            <v-icon v-if="!user.avatar" icon="mdi-account-circle" size="24" color="white" />
            <img v-else :src="user.avatar" alt="User avatar" />
          </v-avatar>
        </v-badge>

        <span class="ml-2 d-none d-sm-inline user-name">
          {{ user.name || 'Usuario' }}
        </span>

        <v-icon icon="mdi-chevron-down" class="ml-1 menu-arrow" />
      </v-btn>
    </template>

    <v-list density="comfortable" min-width="240" class="py-2">
      <v-list-item class="user-info-item">
        <template #prepend>
          <v-avatar
            size="48"
            :color="user.isActive ? 'indigo-darken-2' : 'grey-darken-1'"
            class="mr-3"
          >
            <v-icon v-if="!user.avatar" icon="mdi-account-circle" size="28" color="white" />
            <img v-else :src="user.avatar" alt="User avatar" />
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">{{ user.name }}</v-list-item-title>
        <v-list-item-subtitle class="d-flex align-center mt-1">
          <span class="text-caption">{{ user.email }}</span>
          <v-chip
            v-if="user.isActive"
            size="x-small"
            class="ml-2"
            color="success"
            prepend-icon="mdi-check-circle"
          >
            Activo
          </v-chip>
          <v-chip v-else size="x-small" class="ml-2" color="grey" prepend-icon="mdi-close-circle">
            Inactivo
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item
        prepend-icon="mdi-account-edit"
        title="Mi perfil"
        value="profile"
        to="/usuario/perfil/"
        class="menu-item"
      />

      <v-list-item
        prepend-icon="mdi-cog-outline"
        title="Configuración"
        value="settings"
        class="menu-item"
      />

      <v-list-item prepend-icon="mdi-account-group" title="Equipo" value="team" class="menu-item" />

      <v-divider class="my-2" />

      <v-list-item
        prepend-icon="mdi-logout-variant"
        title="Cerrar sesión"
        value="logout"
        class="menu-item logout-item"
        @click="handleLogout"
      />
    </v-list>
  </v-menu>
</template>

<script setup>
import { defineEmits } from 'vue'

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

const emit = defineEmits(['logout'])

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.user-menu-btn {
  transition: all 0.2s ease;
  padding: 4px 8px !important;
}

.user-menu-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.user-name {
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.menu-arrow {
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: transform 0.2s ease;
}

.v-menu--active .menu-arrow {
  transform: rotate(180deg);
}

.user-info-item {
  padding: 12px 16px;
  cursor: default;
}

.user-info-item:hover {
  background-color: transparent !important;
}

.menu-item {
  border-radius: 6px;
  margin: 0 8px;
  padding: 0 8px;
  min-height: 40px;
}

.menu-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.menu-item :deep(.v-list-item__prepend) {
  margin-right: 12px;
}

.menu-item :deep(.v-list-item__prepend i) {
  opacity: 0.8;
}

.logout-item {
  color: rgb(var(--v-theme-error));
}

.logout-item :deep(.v-list-item__prepend i) {
  color: inherit;
}

.text-caption {
  font-size: 0.75rem;
  opacity: 0.8;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
