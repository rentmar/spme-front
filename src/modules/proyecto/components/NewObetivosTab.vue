<template>
  <v-card class="my-card">
    <!-- Header con título y subtítulo -->
    <v-card-item>
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <span>{{ nuevoProyectoStore.nuevoProyecto.proyecto.titulo }}</span>
        <v-btn icon @click="addObjetivoEspecifico" color="primary" size="small" :disabled="editing">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top">Agregar objetivo específico</v-tooltip>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Código: {{ nuevoProyectoStore.nuevoProyecto.proyecto.codigo }}
      </v-card-subtitle>
    </v-card-item>

    <!-- Contenido principal -->
    <v-card-text>
      <v-tabs v-model="activeTab">
        <!-- Tab de Objetivo General (fijo) -->
        <v-tab value="general" :disabled="editing">
          <v-icon start>mdi-bullseye</v-icon>
          Objetivo General
          <v-tooltip activator="parent" location="bottom">
            Este objetivo no se puede eliminar
          </v-tooltip>
        </v-tab>

        <!-- Tabs de Objetivos Específicos -->
        <v-tab
          v-for="(obj, index) in nuevoProyectoStore.nuevoProyecto.objetivoEspecifico"
          :key="'obj-' + index"
          :value="'specific-' + index"
          :disabled="editing"
        >
          <v-icon start>mdi-target</v-icon>
          Obj Espec {{ index + 1 }}
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            class="ml-2"
            @click.stop="removeObjetivo(index)"
            :disabled="editing"
          ></v-btn>
        </v-tab>
      </v-tabs>

      <!-- Contenido de los Tabs -->
      <v-window v-model="activeTab">
        <!-- Objetivo General -->
        <v-window-item value="general">
          <v-card flat class="pa-4">
            <v-text-field
              label="Código"
              variant="outlined"
              :model-value="'POO'"
              readonly
            ></v-text-field>
            <v-textarea
              label="Descripción"
              variant="outlined"
              v-model="nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].descripcion"
              :readonly="editing"
              rows="3"
            ></v-textarea>
            <v-textarea
              label="Supuestos"
              variant="outlined"
              v-model="nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].supuestos"
              :readonly="editing"
              rows="2"
            ></v-textarea>
            <v-textarea
              label="Riesgos"
              variant="outlined"
              v-model="nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].riesgos"
              :readonly="editing"
              rows="2"
            ></v-textarea>
          </v-card>
        </v-window-item>

        <!-- Objetivos Específicos -->
        <v-window-item
          v-for="(obj, index) in nuevoProyectoStore.nuevoProyecto.objetivoEspecifico"
          :key="'obj-content-' + index"
          :value="'specific-' + index"
        >
          <v-card flat class="pa-4">
            <v-text-field
              :model-value="'PSO' + (index + 1)"
              label="Código"
              variant="outlined"
              readonly
              disabled
            ></v-text-field>
            <v-textarea
              v-model="obj.descripcion"
              :label="`Descripción del Objetivo Específico ${index + 1}`"
              rows="3"
              variant="outlined"
              :readonly="editing"
            ></v-textarea>
            <v-textarea
              v-model="obj.supuestos"
              label="Supuestos"
              variant="outlined"
              :readonly="editing"
              rows="2"
            ></v-textarea>
            <v-textarea
              v-model="obj.riesgos"
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

// Injectamos la estructura reactiva y funciones del padre
//const nuevoProyecto = inject('nuevoProyecto')
//const addObjetivoEspecifico = inject('addObjetivoEspecifico')

const addObjetivoEspecifico = nuevoProyectoStore.addObjetivoEspecifico

// Métodos
const removeObjetivo = (index) => {
  nuevoProyectoStore.removeObjetivoEspecifico(index)
  //store.removeObjetivoEspecifico(index)
  // Si estamos viendo el tab que se eliminó, volver al general
  if (activeTab.value === `specific-${index}`) {
    activeTab.value = 'general'
  }
}

// Estado reactivo para control de tabs
const activeTab = ref('general')
const editing = ref(false)

// Inicializar códigos automáticos
/*watch(
  () => nuevoProyectoStore.nuevoProyecto.objetivoEspecifico,
  (objetivos) => {
    objetivos.forEach((obj, index) => {
      if (!obj.codigo || !obj.codigo.startsWith('PSO')) {
        obj.codigo = `PSO${index + 1}`
      }
    })

    // Asegurar que el objetivo general tenga POO
    if (
      !nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].codigo ||
      nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].codigo !== 'POO'
    ) {
      nuevoProyectoStore.nuevoProyecto.objetivoGeneral[0].codigo = 'POO'
    }
  },
  { immediate: true, deep: true },
)*/

// Eliminar objetivo específico (excepto el primero)
/* const removeObjective = (index) => {
  if (index > 0 && nuevoProyectoStore.nuevoProyecto.objetivoEspecifico.length > 1) {
    const wasActive = activeTab.value === 'specific-' + index

    nuevoProyectoStore.nuevoProyecto.objetivoEspecifico.splice(index, 1)

    // Reindexar los códigos
    nuevoProyectoStore.nuevoProyecto.objetivoEspecifico.forEach((obj, idx) => {
      obj.codigo = `PSO${idx + 1}`
    })

    if (wasActive) {
      activeTab.value = index > 1 ? 'specific-' + (index - 1) : 'general'
    }
  }
}
 */
// Función para verificar cambios
/* const hasChanges = () => {
  return (
    nuevoProyectoStore.nuevoProyecto.objetivoGeneral.descripcion.trim() !== '' ||
    nuevoProyectoStore.nuevoProyecto.objetivoEspecifico.some(
      (obj) =>
        obj.descripcion.trim() !== '' || obj.supuestos.trim() !== '' || obj.riesgos.trim() !== '',
    )
  )
}

// Exponemos funciones al padre si es necesario
defineExpose({
  hasChanges,
}) */
</script>

<style scoped>
.my-card {
  margin: 20px;
}

.v-tab {
  min-width: 160px;
  position: relative;
}

.v-card-text {
  padding-top: 16px;
}
</style>
