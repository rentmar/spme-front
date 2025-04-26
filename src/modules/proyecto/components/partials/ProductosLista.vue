<template>
  <div>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel v-for="item in items" :key="item.id" class="mb-2">
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-chip size="small" color="green" class="mr-2">
              {{ item.codigo }}
            </v-chip>
            <span
              >{{ item.descripcion.substring(0, 80)
              }}{{ item.descripcion.length > 80 ? '...' : '' }}</span
            >
            <v-spacer></v-spacer>
            <v-icon :color="item.entregado ? 'green' : 'orange'">
              {{ item.entregado ? 'mdi-checkbox-marked-circle' : 'mdi-package-variant-closed' }}
            </v-icon>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <p class="mb-4">{{ item.descripcion }}</p>

          <div v-if="item.riesgos" class="mb-4">
            <v-alert type="warning" variant="tonal">
              <strong>Riesgos:</strong> {{ item.riesgos }}
            </v-alert>
          </div>

          <v-btn
            v-if="item.indicadores?.length"
            color="primary"
            variant="outlined"
            @click="$emit('ver-indicadores', item)"
          >
            <v-icon left>mdi-chart-line</v-icon>
            Ver indicadores ({{ item.indicadores.length }})
          </v-btn>

          <v-alert v-else type="info" variant="tonal">
            No hay indicadores asociados a este producto
          </v-alert>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['ver-indicadores'])
</script>
