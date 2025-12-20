<template>
  <v-app-bar color="primary" height="48" scroll-behavior="hide">
    <v-app-bar-nav-icon icon="mdi-menu" @click="$emit('toogle-drawer')"></v-app-bar-nav-icon>
    <v-app-bar-title class="text-h6 ms-1">SPME</v-app-bar-title>
    <v-spacer></v-spacer>
    <div v-if="usuarioStore.isAuthenticated">
      <notification-bell></notification-bell>
    </div>
    <user-menu :user="usuario" @logout="handleLogout"></user-menu>
  </v-app-bar>
</template>
<script setup>
import { reactive } from 'vue'
import UserMenu from './partials/UserMenu.vue'
import NotificationBell from '@/modules/notificacion/components/NotificationBell.vue'
import { useUserStore } from '@/stores/user'

//Props del componente
const props = defineProps({
  usuario: Object,
})

const usuario = reactive(props.usuario)

//Iniciar el store
const usuarioStore = useUserStore()

console.log('Autenticado: ', usuarioStore.isAuthenticated)

//Señales al principal
const emit = defineEmits(['toogle-drawer', 'logout'])

const handleLogout = () => {
  emit('logout')
}
</script>
<style scoped></style>
