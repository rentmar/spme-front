<template>
  <v-card class="my-card">
    <v-card-item>
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <span>Resultados del Proyecto: {{ nuevoProyectoStore.nuevoProyecto.proyecto.titulo }}</span>
        <v-btn icon @click="addResultado" color="primary" size="small" :disabled="editing">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top">Agregar resultado</v-tooltip>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Código: {{ nuevoProyectoStore.nuevoProyecto.proyecto.codigo }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-tabs v-model="activeTab">
        <v-tab
          v-for="(res, index) in nuevoProyectoStore.nuevoProyecto.resultados"
          :key="'res-' + index"
          :value="'result-' + index"
          :disabled="editing"
        >
          <v-icon start>mdi-checkbox-marked-circle-outline</v-icon>
          Resultado {{ res.codigo }}
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            @click.stop="removeResultado(index)"
            class="ml-2"
            :disabled="editing"
          ></v-btn>
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item
          v-for="(res, index) in nuevoProyectoStore.nuevoProyecto.resultados"
          :key="'res-content-' + index"
          :value="'result-' + index"
        >
          <v-card flat class="pa-4">
            <v-text-field
              :model-value="res.codigo"
              label="Código"
              variant="outlined"
              readonly
              disabled
            ></v-text-field>
            <v-textarea
              v-model="res.descripcion"
              label="Descripción"
              rows="3"
              variant="outlined"
              :readonly="editing"
            ></v-textarea>
            <v-textarea
              v-model="res.supuestos"
              label="Supuestos"
              variant="outlined"
              :readonly="editing"
              rows="2"
            ></v-textarea>
            <v-textarea
              v-model="res.riesgos"
              label="Riesgos"
              variant="outlined"
              :readonly="editing"
              rows="2"
            ></v-textarea>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useNuevoProyectoStore } from '../store/nuevoProyectoStore'

//Inicializar el store
const nuevoProyectoStore = useNuevoProyectoStore()

const activeTab = ref(0)
const editing = ref(false)

const addResultado = () => {
  nuevoProyectoStore.addResultado()
}

const removeResultado = (index) => {
  nuevoProyectoStore.removeResultado(index)
}

// Inicializar códigos automáticos R01, R02, etc.
/*watch(
  () => nuevoProyecto.resultados,
  (resultados) => {
    resultados.forEach((res, index) => {
      if (!res.codigo || !res.codigo.startsWith('R')) {
        res.codigo = generateResultCode(index)
      }
    })
  },
  { immediate: true, deep: true },
)*/

/*const addResultado = () => {
  nuevoProyecto.resultados.push({
    codigo: generateResultCode(nuevoProyecto.resultados.length),
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
  activeTab.value = 'result-' + (nuevoProyecto.resultados.length - 1)
}*/

/*const removeResultado = (index) => {
  // Permitir eliminar todos los resultados
  nuevoProyecto.resultados.splice(index, 1)

  // Reindexar los códigos
  nuevoProyecto.resultados.forEach((res, idx) => {
    res.codigo = generateResultCode(idx)
  })

  // Ajustar tab activo si es necesario
  if (activeTab.value === `result-${index}`) {
    activeTab.value =
      nuevoProyecto.resultados.length > 0 ? `result-${Math.max(0, index - 1)}` : null
  }
}*/
</script>

<style scoped>
.my-card {
  margin: 20px;
}
.v-tab {
  min-width: 160px;
}
</style>
