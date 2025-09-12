<script setup>
import { BezierEdge } from '@vue-flow/core'
import { BaseEdge } from '@vue-flow/core'
import { computed } from 'vue'

// props were passed from the slot using `v-bind="customEdgeProps"`
const props = defineProps([
  'sourceX',
  'sourceY',
  'targetX',
  'targetY',
  'sourcePosition',
  'targetPosition',
])
const edgeStyle = computed(() => ({
  stroke: '#2196F3', // Azul estándar de Material Design
  strokeWidth: 2,
  ...props.style,
}))
</script>

<template>
  <BezierEdge
    :source-x="sourceX"
    :source-y="sourceY"
    :target-x="targetX"
    :target-y="targetY"
    :source-position="sourcePosition"
    :target-position="targetPosition"
    :style="edgeStyle"
  />
</template>
