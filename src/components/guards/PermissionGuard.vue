<template>
  <slot v-if="hasAccess" />
  <slot v-else name="no-access">
    <div class="no-access-message">
      <h3>Acceso restringido</h3>
      <p>No tienes permisos para acceder a este recurso.</p>
    </div>
  </slot>
</template>

<script setup>
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'

const props = defineProps({
  projectId: {
    type: [Number, String],
    default: null,
  },
  requiredLevel: {
    type: Number,
    default: 1, // LECTURA por defecto
  },
  requiredLevelName: {
    type: String,
    default: 'LECTURA',
  },
})

const { hasAccessLevel, levels } = usePermissions()

const hasAccess = computed(() => {
  if (props.projectId) {
    return hasAccessLevel(props.projectId, props.requiredLevel)
  }

  // Sin projectId, verificar permisos globales
  // Aquí puedes añadir lógica adicional para permisos globales
  return true // O false según tu lógica
})
</script>
