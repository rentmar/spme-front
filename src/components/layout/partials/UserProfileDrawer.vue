<template>
  <v-list-item
    prepend-icon="mdi-account-circle"
    :title="usuario.nombre"
    :subtitle="usuario.role"
    nav
  >
    <template v-slot:prepend>
      <v-avatar color="indigo-lighten-2" size="40">
        <v-icon icon="mdi-account" color="white" size="24"></v-icon>
      </v-avatar>
    </template>
    <template v-slot:append>
      <v-btn
        variant="text"
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        @click.stop="rail = !rail"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
import { reactive, ref } from 'vue'

//Props del componente
const props = defineProps({
  usuario: Object,
})

const rail = ref(false)

//Usuario activo
const usuario = reactive(props.usuario)
</script>

<style scoped></style>
