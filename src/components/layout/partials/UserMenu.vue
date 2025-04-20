<template>
  <v-menu>
    <template #activator="{ props: menuActivator }">
      <v-btn v-bind="menuActivator" variant="text" class="text-none user-menu-btn">
        <v-badge dot color="success" v-if="user.isActive">
          <v-avatar size="32" color="indigo-lighten-2">
            <v-icon icon="mdi-account" color="white" />
          </v-avatar>
        </v-badge>

        <span class="ml-2 d-none d-sm-inline">
          {{ user.name || 'Usuario' }}
        </span>

        <v-icon icon="mdi-chevron-down" class="ml-1" />
      </v-btn>
    </template>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account" :title="user.name" :subtitle="user.email">
        <template #subtitle>
          <span class="text-caption">{{ user.email }}</span>
          <v-chip v-if="user.isActive" size="x-small" class="ml-2" color="success"> Activo </v-chip>
        </template>
      </v-list-item>

      <v-divider />

      <v-list-item prepend-icon="mdi-account-cog" title="Mi perfil" value="profile" to="/profile" />

      <v-list-item prepend-icon="mdi-cog" title="Configuración" value="settings" />

      <v-divider />

      <v-list-item
        prepend-icon="mdi-logout"
        title="Cerrar sesión"
        value="logout"
        @click="handleLogout"
      />
    </v-list>
  </v-menu>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

//Props del componente
defineProps({
  user: Object,
})

const emit = defineEmits(['logout'])

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.user-menu-btn {
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.text-caption {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>
