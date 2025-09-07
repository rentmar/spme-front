<script setup>
import { inject } from 'vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const userName = computed(() => userStore.usuario)
const userRole = computed(() => userStore.rol)
const peiVigente = inject('peiVigente')
</script>

<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <v-icon icon="mdi-home" size="64"></v-icon>

    <div class="mt-3">Home</div>
    <p>{{ peiVigente }}</p>
    <p>Bienvenido, {{ userName }} rol: {{ userRole }}</p>
  </v-container>
</template>
