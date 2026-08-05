<template>
  <div>
    <div v-for="grupo in proyectos" :key="`p-${grupo.proyecto_id}`" class="mb-4">
      <v-card
        class="cursor-pointer"
        :color="expandidos[grupo.proyecto_id] ? 'grey-lighten-3' : ''"
        @click="toggle(grupo.proyecto_id)"
      >
        <v-card-text class="py-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon
                :icon="expandidos[grupo.proyecto_id] ? 'mdi-folder-open' : 'mdi-folder'"
                color="primary"
                size="28"
                class="mr-3"
              />
              <div>
                <div class="text-h6 font-weight-bold">{{ grupo.proyecto_nombre }}</div>
                <div class="text-caption text-grey">
                  {{ grupo.total_actividades }} actividades | Presupuesto:
                  {{ formatCurrency(grupo.presupuesto_total) }}
                </div>
              </div>
            </div>
            <v-icon>{{
              expandidos[grupo.proyecto_id] ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}</v-icon>
          </div>
        </v-card-text>
      </v-card>

      <v-expand-transition>
        <div v-if="expandidos[grupo.proyecto_id]">
          <v-card elevation="0" class="bg-grey-lighten-5">
            <v-list class="py-0">
              <ActividadItem
                v-for="actividad in grupo.actividades"
                :key="`pa-${actividad.id}`"
                :actividad="actividad"
                compact
                @accion="$emit('accion', $event)"
              />
            </v-list>
          </v-card>
        </div>
      </v-expand-transition>
    </div>

    <v-card v-if="proyectos.length === 0" class="pa-8 text-center bg-grey-lighten-4" elevation="0">
      <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-folder-remove</v-icon>
      <div class="text-body-1 text-grey-darken-1">No hay proyectos disponibles</div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ActividadItem from './ActividadItem.vue'

defineProps({ proyectos: { type: Array, default: () => [] } })
defineEmits(['accion'])

const expandidos = ref({})

function toggle(id) {
  expandidos.value[id] = !expandidos.value[id]
}

function formatCurrency(v) {
  const n = Number(v)
  return !isNaN(n) ? `Bs. ${n.toFixed(2)}` : 'N/A'
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
