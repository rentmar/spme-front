<template>
  <v-navigation-drawer v-model="drawer">
    <!--Perfil de usuario-->
    <user-profile :usuario="usuario"></user-profile>
    <v-divider></v-divider>
    <!-- Menu de Navegacion-->
    <nav-menu-drawer></nav-menu-drawer>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import NavMenuDrawer from './partials/NavMenuDrawer.vue'
import UserProfile from './partials/UserProfileDrawer.vue'
//Props del componente
const props = defineProps({
  drawerState: Boolean,
  usuario: Object,
})

//Estado del drawer
const drawer = ref(props.drawerState)
//Usuario activo
const usuario = ref(props.usuario)

//Sincronizar Valor del drawer para Mostrar/esconder
watch(
  () => props.drawerState,
  (nuevoValor) => {
    drawer.value = nuevoValor
  },
)
</script>

<style scoped></style>
