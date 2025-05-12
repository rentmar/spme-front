<template>
  <v-overlay
    :model-value="estadoCarga"
    :persistent="persistent"
    class="align-center justify-center"
  >
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </v-overlay>
</template>

<script setup>
defineProps({
  estadoCarga: { type: Boolean, required: true },
  persistent: { type: Boolean, default: false },
})
</script>

<style scoped>
/* Transición suave para la aparición/desaparición */
.v-overlay {
  transition: opacity 0.3s ease;
}

/* Mejor alineación del contenido */
.text-center {
  text-align: center;
}
</style>
