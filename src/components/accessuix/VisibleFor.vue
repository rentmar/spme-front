<!-- components/accessuix/VisibleFor.vue -->
<template>
  <slot v-if="shouldShow" />
</template>

<script setup>
import { useUserRole } from '@/composables/useUserRole'

const props = defineProps({
  roles: {
    type: [String, Array],
    required: true,
    default: 'admin',
  },
})

const { canSee } = useUserRole()
const shouldShow = canSee(props.roles)
</script>
