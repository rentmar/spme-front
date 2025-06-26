<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>

    <!-- CONTENIDO -->
    <v-row v-if="!cargandoGeneral">
      <!-- Columna principal (100% ancho) -->
      <v-col cols="12" md="12">
        <PaginaTituloIcono :titulo="'Estructura'" :icon="'mdi-file-cog'" />
        <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />

        <!-- Tarjeta principal con diagrama Vue Flow -->
        <v-card class="mb-4" min-height="800">
          <v-toolbar color="info" density="compact">
            <v-toolbar-title>ESTRUCTURA DEL PROYECTO</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- Contenedor del diagrama -->
          <v-card-text style="height: 900px; position: relative">
            <template v-if="!cargandoGeneral && proyecto">
              <EditorEstructuraMain></EditorEstructuraMain>
            </template>
            <template v-else>
              <div class="d-flex flex-column align-center justify-center" style="height: 100%">
                <v-progress-circular indeterminate color="primary" />
                <p class="mt-2">Cargando estructura...</p>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed, provide, readonly } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import EditorEstructuraMain from '@/modules/editorEstructura/components/EditorEstructuraMain.vue'

// Store y rutas
const proyectoStore = useProyectoStore()
const route = useRoute()
const idproyecto = route.params.id

// Estado
const cargandoGeneral = computed(() => cargandoProyecto.value)

//Desestructurar store
const { proyectoEstructuraNodos: proyecto, cargando: cargandoProyecto } = storeToRefs(proyectoStore)
const { obtenerProyectoEstructuraNodosPorId } = proyectoStore

//Inyectar el proyecto y su estructura
provide('proyectoEstructura', readonly(proyecto))

onMounted(async () => {
  await cargarDatos()
})

const cargarDatos = async () => {
  try {
    await obtenerProyectoEstructuraNodosPorId(idproyecto)
  } catch (err) {
    console.error(err)
  }
}
</script>
<style scoped>
/* Estilos generales para las tarjetas */
.v-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Estilos para hacer la tarjeta de herramientas pegajosa */
.sticky-card {
  position: sticky;
  top: 20px;
}

/* Estilos para el contenedor del diagrama */
.vue-flow__container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #f8fafc;
}

/* Estilos para el minimapa */
.vue-flow__minimap {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Ajustes para los controles */
.vue-flow__controls {
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* Estilos para los nodos del diagrama */
.vue-flow__node {
  background: white;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: grab;
}

/* Estilos para las conexiones */
.vue-flow__edge-path {
  stroke: #4caf50;
  stroke-width: 2;
}
/* Estilos para el Node Toolbar */
.custom-node-toolbar {
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 10;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

/* Estilos para los botones del toolbar */
.custom-node-toolbar .v-btn {
  margin: 0;
  transition: all 0.2s ease;
}

.custom-node-toolbar .v-btn:hover {
  transform: scale(1.1);
}

/* Estilos para el contenedor del diagrama */
.vue-flow__container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #f8fafc;
  border-radius: 4px;
}
</style>
