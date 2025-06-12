<template>
  <v-card class="nodo-base" :elevation="5" :color="colorNodo" v-bind="filteredAttrs">
    <v-toolbar density="compact" flat :color="colorNodo">
      <v-toolbar-title
        class="text-h6 font-weight-bold text-white d-flex align-center flex-wrap gap-2"
        style="white-space: normal"
      >
        <v-icon size="20" class="me-1 text-white">{{ iconoNodo }}</v-icon>
        {{ data.label }}
      </v-toolbar-title>

      <v-spacer />

      <!-- Menú -->
      <template v-if="showMenu">
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon size="small" variant="text">
              <v-icon class="text-white">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense class="pa-1">
            <slot name="menu">
              <v-list-item>
                <v-list-item-title>Opción por defecto</v-list-item-title>
              </v-list-item>
            </slot>
          </v-list>
        </v-menu>
      </template>

      <!-- Botón de cierre -->
      <template v-if="showDelete">
        <v-btn icon size="small" variant="text" color="white" @click="eliminarNodo">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-toolbar>

    <v-card-text class="pa-4 bg-white text-grey-darken-3">
      <div class="mb-2">
        <v-chip size="small" :color="colorNodo" text-color="white" variant="flat">
          {{ tipoNodo }}
        </v-chip>
        <!-- Chip del estado -->
        <v-chip
          v-if="showEstado"
          size="small"
          :color="getStatusColor(data.estado)"
          variant="elevated"
        >
          {{ getEstadoTexto(data.estado) || 'Sin estado' }}
        </v-chip>
        <v-chip size="small" :color="colorNodo" text-color="white" variant="flat">
          ID: {{ currentNode.id }}
        </v-chip>
      </div>

      <slot>
        <p class="text-body-2 text-grey-darken-3 text-center">Contenido del nodo</p>
      </slot>
    </v-card-text>
  </v-card>
  <slot name="handles" />
</template>

<script setup>
import { useVueFlow } from '@vue-flow/core'
import { useAttrs, computed } from 'vue'
import { getStatusColor, getEstadoTexto } from '@/utility/formatters'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
  showMenu: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showEstado: { type: Boolean, default: false },
})

const { removeNodes, findNode } = useVueFlow()

const currentNode = findNode(props.id)
//Inyectar el curren node en los hijos

const eliminarNodo = () => removeNodes([{ id: props.id }])

const attrs = useAttrs()
const filteredAttrs = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const { position, ...rest } = attrs
  return rest
})

// Computed para tipo, color e ícono
const tipoNodo = computed(() => props.data.type || 'Sin tipo')

const iconoNodo = computed(() => {
  return (
    {
      proyecto: 'mdi-briefcase-outline',
      objetivogeneral: 'mdi-bullseye-arrow',
      objetivoespecifico: 'mdi-target-variant',
      Kpi: 'mdi-chart-line',
      indicadores: 'mdi-speedometer',
      indicadorog: 'mdi-speedometer',
      indicadorrog: 'mdi-speedometer',
      indicadoroe: 'mdi-speedometer',
      indicadorroe: 'mdi-speedometer',
      resultado: 'mdi-flag-checkered',
      resultadoog: 'mdi-flag-checkered',
      resultadooe: 'mdi-flag-checkered',
      producto: 'mdi-package-variant-closed',
      productoog: 'mdi-package-variant-closed',
      productooe: 'mdi-package-variant-closed',
      productoroe: 'mdi-package-variant-closed',
      procesos: 'mdi-cogs',
      procesorog: 'mdi-cogs',
      procesoroe: 'mdi-cogs',
      procesopoe: 'mdi-cogs',
    }[tipoNodo.value] || 'mdi-help-circle-outline'
  )
})

const colorNodo = computed(() => {
  return (
    {
      proyecto: '#3F51B5',
      objetivogeneral: '#1976D2',
      objetivoespecifico: '#03A9F4',
      kpi: '#673AB7',
      indicadorog: '#009688',
      indicadorrog: '#009688',
      indicadoroe: '#009688',
      indicadorroe: '#009688',
      resultadoog: '#4CAF50',
      resultadooe: '#4CAF50',
      productoog: '#FFC107',
      productooe: '#FFC107',
      productoroe: '#FFC107',
      procesos: '#FF5722',
      procesorog: '#FF5722',
      procesoroe: '#FF5722',
      procesopoe: '#FF5722',
    }[tipoNodo.value] || '#BDBDBD'
  )
})
</script>

<style scoped>
.nodo-base {
  width: 500px;
  min-height: 200px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
