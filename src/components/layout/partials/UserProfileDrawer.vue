<template>
  <v-list-item
    class="user-list-item"
    :class="{ 'rail-active': rail }"
    nav
    active-class="user-active"
  >
    <template #prepend>
      <v-avatar
        :color="usuario.activo ? 'indigo-darken-2' : 'grey-darken-1'"
        size="44"
        class="user-avatar"
      >
        <v-icon v-if="!usuario.avatar" icon="mdi-account-circle" color="white" size="28" />
        <img v-else :src="usuario.avatar" alt="Avatar del usuario" />
      </v-avatar>
    </template>

    <v-list-item-title class="user-name">
      {{ usuario.nombre || 'Usuario' }}
    </v-list-item-title>

    <v-list-item-subtitle class="user-role">
      {{ usuario.role || 'Rol no definido' }}
    </v-list-item-subtitle>

    <template #append>
      <v-btn
        variant="text"
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        size="small"
        class="toggle-btn"
        @click.stop="$emit('toggle-rail')"
      />
    </template>

    <v-tooltip v-if="rail" activator="parent" location="end">
      <div class="tooltip-content">
        <div class="tooltip-name">{{ usuario.nombre }}</div>
        <div class="tooltip-role">{{ usuario.role }}</div>
        <v-chip
          v-if="usuario.activo"
          size="x-small"
          color="success"
          prepend-icon="mdi-check-circle"
          class="mt-1"
        >
          Activo
        </v-chip>
      </div>
    </v-tooltip>
  </v-list-item>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  usuario: {
    type: Object,
    required: true,
    default: () => ({
      nombre: 'Usuario',
      role: 'Invitado',
      activo: false,
      avatar: null,
    }),
  },
  rail: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-rail'])
</script>

<style scoped>
.user-list-item {
  position: relative;
  padding: 12px 16px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-list-item.rail-active {
  padding: 12px;
  justify-content: center;
}

.user-active {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.user-avatar {
  transition: transform 0.2s ease;
  border: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.user-list-item:hover .user-avatar {
  transform: scale(1.05);
}

.user-name {
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.user-role {
  font-size: 0.8125rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.rail-active .user-name,
.rail-active .user-role {
  display: none;
}

.toggle-btn {
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  color: rgba(var(--v-theme-primary), 0.8);
  transform: scale(1.1);
}

.tooltip-content {
  padding: 4px 8px;
  text-align: center;
}

.tooltip-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.tooltip-role {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>
