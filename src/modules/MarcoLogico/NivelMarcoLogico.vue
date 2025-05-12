<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-icon left>{{ nivel.icon }}</v-icon>
      {{ nivel.title }}
    </v-expansion-panel-title>

    <v-expansion-panel-text> <h1>Contenido</h1> </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
//import DetallesTab from './DetallesTab.vue'
//import IndicadoresTab from './IndicadoresTab.vue'

defineProps({
  nivel: {
    type: Object,
    required: true,
  },
})
</script>
