<template>
  <div v-if="!store.loading">
    <!-- Selector de nodo -->
    <v-select
      v-model="selectedNodeId"
      :items="store.nodes"
      item-title="data.label"
      item-value="id"
      label="Seleccionar nodo"
      outlined
      dense
      class="mb-4"
      return-object
    >
      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="item.raw.data?.label || 'Sin etiqueta'"
          :subtitle="`ID: ${item.raw.id} - Tipo: ${item.raw.type}`"
        ></v-list-item>
      </template>
    </v-select>

    <!-- Botón para buscar relaciones -->
    <v-btn color="primary" @click="buscarRelaciones" :loading="loading" class="mb-4">
      <v-icon left>mdi-connection</v-icon>
      Buscar Relaciones
    </v-btn>

    <!-- Resultados -->
    <div v-if="relaciones.length > 0">
      <h3 class="mb-2">
        Relaciones del nodo: {{ selectedNodeId.data?.label || selectedNodeId.id }}
      </h3>

      <v-alert v-if="relaciones.length === 0" type="info" density="compact">
        El nodo no tiene relaciones
      </v-alert>

      <v-list v-else lines="two">
        <v-list-item v-for="relacion in relaciones" :key="relacion.id">
          <template v-slot:prepend>
            <v-icon :color="relacion.tipo === 'saliente' ? 'primary' : 'secondary'">
              {{ relacion.tipo === 'saliente' ? 'mdi-arrow-right' : 'mdi-arrow-left' }}
            </v-icon>
          </template>

          <v-list-item-title>{{ relacion.descripcion }}</v-list-item-title>
          <v-list-item-subtitle>
            Tipo: {{ relacion.tipo }} | ID: {{ relacion.id }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>

    <!-- Uso en tiempo real con watch -->
    <v-divider class="my-6"></v-divider>

    <h3 class="mb-2">Relaciones en tiempo real (automático)</h3>
    <v-select
      v-model="nodeIdTiempoReal"
      :items="store.nodes"
      item-title="data.label"
      item-value="id"
      label="Seleccionar nodo para ver relaciones en tiempo real"
      outlined
      dense
      class="mb-4"
    ></v-select>

    <v-list v-if="relacionesTiempoReal.length > 0" lines="two">
      <v-list-item v-for="relacion in relacionesTiempoReal" :key="relacion.id">
        <template v-slot:prepend>
          <v-icon :color="relacion.tipo === 'saliente' ? 'primary' : 'secondary'">
            {{ relacion.tipo === 'saliente' ? 'mdi-arrow-right' : 'mdi-arrow-left' }}
          </v-icon>
        </template>

        <v-list-item-title>{{ relacion.descripcion }}</v-list-item-title>
        <v-list-item-subtitle>
          Tipo: {{ relacion.tipo }} | ID: {{ relacion.id }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
  {{}}
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useProyectoEstructuraStore } from '../store/useProyectoEstructuraStore'
import { useDiagramaCrud } from '@/modules/editorEstructura/composables/useDiagramaCrud'
const store = useProyectoEstructuraStore()
const selectedNodeId = ref(null)
const nodeIdTiempoReal = ref(null)
const relaciones = ref([])
const loading = ref(false)

onMounted(async () => {
  store.loading = true
  try {
    await store.obtenerDiagramaPorId(5)
  } catch (e) {
    console.error(e)
  } finally {
    store.loading = false
  }
})

// 1. Uso directo de la función en un método
const buscarRelaciones = async () => {
  if (!selectedNodeId.value) return

  loading.value = true
  try {
    // ✅ USO CORRECTO: llamar directamente a la función del store
    relaciones.value = store.obtenerRelacionesDeNodo(selectedNodeId.value.id)
  } catch (error) {
    console.error('Error al buscar relaciones:', error)
  } finally {
    loading.value = false
  }
}

// 2. Uso con watch para cambios en tiempo real
watch(nodeIdTiempoReal, (newNodeId) => {
  if (newNodeId) {
    relacionesTiempoReal.value = store.obtenerRelacionesDeNodo(newNodeId)
  } else {
    relacionesTiempoReal.value = []
  }
})

const relacionesTiempoReal = ref([])

// 3. Uso en una computed property para un nodo específico
const relacionesDePrimerNodo = computed(() => {
  if (store.nodes.length > 0) {
    return store.obtenerRelacionesDeNodo(store.nodes[0].id)
  }
  return []
})

// 4. Función para obtener estadísticas de relaciones
const estadisticasRelaciones = (nodeId) => {
  const relaciones = store.obtenerRelacionesDeNodo(nodeId)
  const salientes = relaciones.filter((r) => r.tipo === 'saliente').length
  const entrantes = relaciones.filter((r) => r.tipo === 'entrante').length

  return {
    total: relaciones.length,
    salientes,
    entrantes,
  }
}

// 5. Uso para encontrar relaciones específicas
const encontrarRelacionesPorTipo = (nodeId, tipo) => {
  const todasRelaciones = store.obtenerRelacionesDeNodo(nodeId)
  return todasRelaciones.filter((rel) => rel.tipo === tipo)
}
</script>
