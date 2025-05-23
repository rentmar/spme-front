<template>
  <v-app>
    <!--Componente Barra Superior-->
    <AppHeader :usuario="usuarioActivo" @toogle-drawer="toogleDrawer"></AppHeader>
    <!--Componente SideBar-->
    <AppDrawer :usuario="usuarioActivo" :drawer-state="isDrawerOpen"></AppDrawer>
    <!--Contenido Principal-->
    <v-main>
      <v-container fluid>
        <RouterView></RouterView>
        <AppSnackBar></AppSnackBar>
      </v-container>
    </v-main>
    <!--Componente Footer-->
    <AppFooter></AppFooter>
  </v-app>
</template>
<script setup>
import { ref, onMounted, provide } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppDrawer from './components/layout/AppDrawer.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { RouterView } from 'vue-router'
import AppSnackBar from './components/layout/AppSnackBar.vue'
//Store del PEI Vigente
import { usePeiVigenteStore } from './modules/pei/store/usePeiVigenteStore'

// El PEI vigente
const peiVigenteStore = usePeiVigenteStore()
const peiVigente = ref(null)

//Estado del drawer
const isDrawerOpen = ref(false)

//Datos del usuario - Reactivo
const usuarioActivo = ref({
  nombre: 'Admin',
  email: 'admin@admin.com',
  role: 'administrador',
  isActive: true,
})

//Inyeccion de dependencias - PEI VIGENTE
provide('peiVigente', peiVigente)

//Activar/Desactivar el drawer
const toogleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

onMounted(async () => {
  cargarPEI()
})
const cargarPEI = async () => {
  try {
    await peiVigenteStore.obtenerPeiVigente()
    peiVigente.value = peiVigenteStore.peiVigente
  } catch (error) {
    console.error('Error al cargar PEI vigente:', error)
  }
}
</script>

<style scoped>
/* Estilos personalizados */
.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.08);
}

.v-list-item--active .v-icon {
  color: rgb(25, 118, 210);
}

.v-avatar {
  transition: all 0.3s ease;
}
</style>
