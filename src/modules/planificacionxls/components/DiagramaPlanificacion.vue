<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="text-h5 font-weight-bold text-center py-4">
        Jerarquía de Proyecto
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-alert v-if="error" type="error" outlined>{{ error }}</v-alert>

        <div v-else-if="loading" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">Cargando...</p>
        </div>

        <v-list v-else>
          <v-list-item v-for="item in proyectoConJerarquia" :key="item.id" class="my-2">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ item.data.label }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Código: {{ item.data.datosNodo.codigo }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ----------------------------------------------------
// Datos de ejemplo
// ----------------------------------------------------
const datosProyecto = {
  nodos: [
    { id: '1', type: 'proyecto', data: { label: 'Proyecto', datosNodo: { codigo: 'P01' } } },
    {
      id: '2',
      type: 'objetivo',
      data: { label: 'Objetivo General', datosNodo: { codigo: 'OG1' } },
    },
    { id: '3', type: 'resultado', data: { label: 'Resultado OG', datosNodo: { codigo: 'R1' } } },
    { id: '4', type: 'actividad', data: { label: 'Actividad OG', datosNodo: { codigo: 'A1' } } },
    {
      id: '5',
      type: 'objetivo',
      data: { label: 'Objetivo Específico', datosNodo: { codigo: 'OE1' } },
    },
    { id: '6', type: 'resultado', data: { label: 'Resultado OE', datosNodo: { codigo: 'R2' } } },
    { id: '7', type: 'actividad', data: { label: 'Actividad OE', datosNodo: { codigo: 'A2' } } },
  ],
  conexiones: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    { source: '3', target: '4' },
    { source: '1', target: '5' },
    { source: '5', target: '6' },
    { source: '6', target: '7' },
  ],
}

// ----------------------------------------------------
// Lógica principal de la vista
// ----------------------------------------------------
const loading = ref(true)
const error = ref(null)
const proyectoConJerarquia = ref([])

/**
 * Procesa los datos del proyecto y los ordena según las conexiones.
 * @param {Object[]} nodos - La lista de nodos del proyecto.
 * @param {Object[]} conexiones - Las conexiones entre los nodos.
 * @returns {Object[]} Una lista ordenada de nodos para su visualización.
 */
const procesarDatos = (nodos, conexiones) => {
  const nodosOrdenados = []
  const nodoMap = new Map(nodos.map((n) => [n.id, n]))

  // Buscar el nodo raíz (Proyecto)
  const rootNode = nodos.find((n) => !conexiones.some((c) => c.target === n.id))
  if (!rootNode) return []

  // Función para agregar nodos y sus descendientes a la lista
  const agregarHijos = (nodoId) => {
    const nodoActual = nodoMap.get(nodoId)
    if (!nodoActual) return

    nodosOrdenados.push(nodoActual)

    // Encontrar todos los nodos hijos y agregarlos
    const hijos = conexiones
      .filter((c) => c.source === nodoId)
      .map((c) => c.target)
      .sort() // Opcional: ordenar para consistencia

    hijos.forEach((hijoId) => agregarHijos(hijoId))
  }

  agregarHijos(rootNode.id)
  return nodosOrdenados
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    // Simular carga de datos asíncrona
    await new Promise((resolve) => setTimeout(resolve, 500))
    proyectoConJerarquia.value = procesarDatos(datosProyecto.nodos, datosProyecto.conexiones)
  } catch (e) {
    error.value = 'Error al procesar los datos del proyecto.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Vuetify se encarga de la mayoría de los estilos */
.v-container {
  max-width: 800px;
}
</style>
