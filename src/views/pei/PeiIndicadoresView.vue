<template>
  <div>
    <h1>Indicadores Edit</h1>
  </div>
  {{ idpei }}
</template>

<script setup>
import { useRoute } from 'vue-router'

//Captura del ID
const route = useRoute()
const idpei = route.params.id
</script>

<style scoped></style>
