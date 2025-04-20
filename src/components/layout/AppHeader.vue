<template>
  <v-app-bar color="primary" height="48" scroll-behavior="hide">
    <v-app-bar-nav-icon icon="mdi-menu" @click="$emit('toogle-drawer')"></v-app-bar-nav-icon>
    <v-app-bar-title class="text-h6 ms-1">SPME</v-app-bar-title>
    <v-spacer></v-spacer>
    <user-menu :user="usuario" @logout="handleLogout"></user-menu>
  </v-app-bar>
</template>
<script setup>
import { reactive } from 'vue'
import UserMenu from './partials/UserMenu.vue'

//Props del componente
const props = defineProps({
  usuario: Object,
})

const usuario = reactive(props.usuario)

//Señales al principal
const emit = defineEmits(['toogle-drawer', 'logout'])

const handleLogout = () => {
  emit('logout')
}
</script>
<style scoped></style>
