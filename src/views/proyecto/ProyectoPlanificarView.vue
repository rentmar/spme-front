<template>
  <v-container>
    <v-overlay :model-value="!cargaCompleta" class="align-center justify-center">
      <template v-if="errorCarga">
        <v-alert type="error" class="mb-4">
          {{ errorCarga }}
        </v-alert>
        <v-btn color="primary" @click="cargarDatos">Reintentar</v-btn>
      </template>
      <template v-else>
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Cargando Proyecto...</p>
      </template>
    </v-overlay>

    <!-- CONTENIDO -->
    <template v-if="cargaCompleta">
      <v-row>
        <v-col cols="12" md="12">
          <PaginaTituloIcono :titulo="'planificacion'" :icon="'mdi-calendar'" />
          <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />

          <v-card class="mb-4" min-height="800">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title>PLANIFICACION</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="contenedor-planificacion">
              <!-- Componente hijo con prop de carga -->
              <!-- <PlanificacionXls
                :proyecto="proyecto"
                :proyecto-estructura="proyectoEstructura"
                :cargando="!cargaCompleta"
              /> -->
              <PlanificacionActividadXls
                :proyecto="proyecto"
                :proyecto-estructura="proyectoEstructura"
                :cargando="!cargaCompleta"
              ></PlanificacionActividadXls>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import PlanificacionXls from '@/modules/planificacionxls/components/PlanificacionXls.vue'
import PlanificacionActividadXls from '@/modules/planificacionxls/components/PlanificacionActividadXls.vue'

//Estado de carga
const cargaCompleta = ref(false) //Cambiar a false en produccion
const errorCarga = ref(null)

//Obtener el id del proyecto de la ruta
const route = useRoute()
const idproyecto = route.params.id
//console.log(idproyecto)

//Composables

// Inicializar Store
const proyectoStore = useProyectoStore()

/****** Iniciar y desestructurar stores **********/
//Store del Proyecto
const {
  proyectoActual: proyecto,
  cargando: cargandoProyecto,
  proyectoEstructura,
} = storeToRefs(proyectoStore)
const { obtenerProyectoPorId, obtenerProyectoEstructuraPorId } = proyectoStore

onMounted(async () => {
  await cargarDatos()
})

//Watch para la carga completa
watch(
  [cargandoProyecto, proyecto, proyectoEstructura],
  ([cargando, proy, estructura]) => {
    if (!cargando && proy && estructura) {
      cargaCompleta.value = true
    }
  },
  { immediate: true },
)

const cargarDatos = async () => {
  try {
    errorCarga.value = null
    await Promise.all([
      await obtenerProyectoPorId(idproyecto),
      await obtenerProyectoEstructuraPorId(idproyecto),
    ])
  } catch (err) {
    console.erro('Error al cargar datos', err)
    errorCarga
  }
}

// Estado de carga
const cargandoGeneral = computed(() => {
  return cargandoProyecto.value
})
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

.contenedor-planificacion {
  width: 100%;
  height: 100%;
  min-height: 600px;
  position: relative;
  padding: 0;
}
</style>
