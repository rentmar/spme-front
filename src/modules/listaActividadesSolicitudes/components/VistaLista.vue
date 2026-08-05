<template>
  <div>
    <v-list v-if="actividades.length > 0" class="py-0">
      <ActividadItem
        v-for="actividad in actividades"
        :key="`l-${actividad.id}`"
        :actividad="actividad"
        @accion="$emit('accion', $event)"
      />
    </v-list>
    <v-list-item v-else>
      <v-list-item-title class="text-grey">No se encontraron actividades</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script setup>
import ActividadItem from './ActividadItem.vue'

defineProps({ actividades: { type: Array, default: () => [] } })
defineEmits(['accion'])
</script>
