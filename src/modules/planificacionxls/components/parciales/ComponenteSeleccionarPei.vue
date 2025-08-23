<script setup>
import { ref } from 'vue'
import { useVueFlow, VueFlow } from '@vue-flow/core'

const { onInit, findNode, fitView, snapToGrid } = useVueFlow()

const nodes = ref([
  /* ... */
])

const edges = ref([
  /* ... */
])
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" />
</template>
