<template>
  <v-navigation-drawer v-model="drawer">
    <!--Perfil de usuario-->
    <user-profile :usuario="usuario"></user-profile>
    <v-divider></v-divider>
    <!-- Sección PEI Vigente minimalista -->
    <div class="pei-minimal-container" @click="navigateToPei">
      <div class="d-flex align-center px-3 py-2">
        <v-icon
          icon="mdi-file-document-outline"
          size="24"
          class="mr-2 text-medium-emphasis"
        ></v-icon>
        <div class="flex-grow-1">
          <div class="text-caption font-weight-medium text-medium-emphasis">PEI VIGENTE</div>
          <div class="text-body-2">{{ pei.nombre }}</div>
        </div>
        <v-chip
          size="x-small"
          variant="outlined"
          :color="pei.activo ? 'success' : 'grey'"
          class="ml-2"
        >
          {{ pei.activo ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </div>
    </div>

    <v-divider class="my-1"></v-divider>

    <!-- Menu de Navegacion-->
    <nav-menu-drawer></nav-menu-drawer>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavMenuDrawer from './partials/NavMenuDrawer.vue'
import UserProfile from './partials/UserProfileDrawer.vue'

const router = useRouter()

const props = defineProps({
  drawerState: Boolean,
  usuario: Object,
  pei: {
    type: Object,
    default: () => ({
      nombre: 'PEI',
      periodo: '454',
      activo: true,
      id: null,
    }),
  },
})

const drawer = ref(props.drawerState)
const usuario = ref(props.usuario)

watch(
  () => props.drawerState,
  (nuevoValor) => {
    drawer.value = nuevoValor
  },
)

const navigateToPei = () => {
  if (props.pei.id) {
    router.push(`/pei/${props.pei.id}`)
  }
}
</script>

<style scoped>
.pei-minimal-container {
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin: 4px;
  border-radius: 4px;
}

.pei-minimal-container:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.pei-minimal-container .v-chip {
  border-width: 1px;
  font-size: 0.625rem;
  height: 18px;
}
</style>
