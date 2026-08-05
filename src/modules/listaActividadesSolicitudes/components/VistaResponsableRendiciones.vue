<template>
  <div>
    <div v-for="grupo in responsablesPaginados" :key="`r-${grupo.responsable_id}`" class="mb-4">
      <v-card
        class="cursor-pointer"
        :color="expandidos[`r-${grupo.responsable_id}`] ? 'grey-lighten-3' : ''"
        @click="toggle(`r-${grupo.responsable_id}`)"
      >
        <v-card-text class="py-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="40" class="mr-3">
                <v-icon dark size="22">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-bold">{{ grupo.responsable_nombre }}</div>
                <div class="text-caption text-grey">
                  {{ grupo.total_actividades }} actividades | Presupuesto:
                  {{ formatCurrency(grupo.presupuesto_total) }}
                </div>
              </div>
            </div>
            <v-icon>{{
              expandidos[`r-${grupo.responsable_id}`] ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}</v-icon>
          </div>
        </v-card-text>
      </v-card>

      <v-expand-transition>
        <div v-if="expandidos[`r-${grupo.responsable_id}`]">
          <v-card elevation="0" class="bg-grey-lighten-5">
            <v-list class="py-0">
              <ActividadItemRendicion
                v-for="actividad in grupo.actividades"
                :key="`rr-${actividad.id}`"
                :actividad="actividad"
                compact
                @accion="$emit('accion', $event)"
              />
            </v-list>
          </v-card>
        </div>
      </v-expand-transition>
    </div>

    <v-card
      v-if="responsables.length === 0"
      class="pa-8 text-center bg-grey-lighten-4"
      elevation="0"
    >
      <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-account-remove</v-icon>
      <div class="text-body-1 text-grey-darken-1">No hay responsables disponibles</div>
    </v-card>

    <v-pagination
      v-if="totalPages > 1"
      v-model="pagina"
      :length="totalPages"
      :total-visible="5"
      size="small"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActividadItemRendicion from './ActividadItemRendicion.vue'

const props = defineProps({ responsables: { type: Array, default: () => [] } })
defineEmits(['accion'])

const expandidos = ref({})
const pagina = ref(1)
const pageSize = 5

const responsablesPaginados = computed(() => {
  const s = (pagina.value - 1) * pageSize
  return props.responsables.slice(s, s + pageSize)
})
const totalPages = computed(() => Math.ceil(props.responsables.length / pageSize))

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
