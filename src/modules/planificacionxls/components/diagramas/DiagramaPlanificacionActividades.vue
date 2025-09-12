<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title>Buscar Múltiples Nodos por ID</v-card-title>
      <v-card-text>
        <v-text-field
          v-model.number="idABuscar"
          label="ID del Nodo Proyecto"
          type="number"
          variant="outlined"
          density="compact"
          hint="Ingresa el ID numérico para encontrar todos los nodos asociados"
        ></v-text-field>

        <v-btn
          color="primary"
          @click="realizarBusqueda"
          :disabled="cargando || !nodosClasificados"
          class="mt-3"
        >
          <v-icon start>mdi-magnify</v-icon>
          Buscar Nodos
        </v-btn>
      </v-card-text>
    </v-card>

    <v-alert v-if="cargando" type="info" class="mt-4">
      Cargando estructura del proyecto...
    </v-alert>

    <v-alert v-if="error" type="error" class="mt-4"> Error: {{ error }} </v-alert>

    <v-card v-if="nodosEncontrados.length > 0" class="mt-4">
      <v-card-title class="bg-blue-grey-lighten-5">
        {{ nodosEncontrados.length }} Nodo(s) Encontrado(s) ✅
      </v-card-title>
      <v-list density="compact">
        <v-list-item v-for="nodo in nodosEncontrados" :key="nodo.id">
          <v-list-item-title> ID del Nodo: {{ nodo.id }} </v-list-item-title>
          <v-list-item-subtitle>
            {{ JSON.stringify(nodo.data, null, 2) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card v-if="nodosEncontrados.length === 0 && busquedaRealizada" class="mt-4">
      <v-card-text>
        <p class="text-subtitle-1">
          No se encontraron nodos con el ID <strong>{{ idABuscar }}</strong
          >.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'

const storeProyecto = useProyectoStore()
const { cargando, error, nodosClasificados } = storeToRefs(storeProyecto)

const idABuscar = ref(null)
const nodosEncontrados = ref([])
const busquedaRealizada = ref(false)

const realizarBusqueda = () => {
  busquedaRealizada.value = true
  if (!nodosClasificados.value) {
    alert('La estructura del proyecto aún no ha sido cargada.')
    return
  }
  // Llama a la función del store que devuelve todos los nodos coincidentes
  nodosEncontrados.value = storeProyecto.buscarNodosPorId(idABuscar.value)
}

onMounted(() => {
  // Asegúrate de llamar a esta acción para cargar los datos en el store
  storeProyecto.obtenerProyectoEstructuraNodosPorId(1)
})
</script>
