<script setup>
import { inject } from 'vue'

const peiVigente = inject('peiVigente')
</script>

<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <v-icon icon="mdi-home" size="64"></v-icon>

    <div class="mt-3">Home</div>
    <p>{{ peiVigente }}</p>
  </v-container>
</template>
