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
          <PaginaTituloIcono :titulo="'Planificacion PEI'" :icon="'mdi-calendar'" />

          <PeiHeader v-if="storePeiPlan.peiActual" :pei="storePeiPlan.peiActual"></PeiHeader>

          <!-- <ProyectoHeader v-if="proyecto" :proyecto="proyecto" /> -->

          <v-card class="mb-4" min-height="1000">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title>PLANIFICACION</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="contenedor-planificacion">
              <!-- <PlanificacionPeiXls :pei-id="idpei"></PlanificacionPeiXls> -->
              <PlanificacionPeiActividades
                v-if="storePeiPlan.peiSeleccionado && storePeiPlan.estructuraPeiSeleccionado"
                :pei="storePeiPlan.peiSeleccionado"
                :pei-estructura="storePeiPlan.estructuraPeiSeleccionado"
              ></PlanificacionPeiActividades>
              <!-- <PlanificacionActividadXls
                :proyecto="proyecto"
                :proyecto-estructura="proyectoEstructura"
                :cargando="!cargaCompleta"
              ></PlanificacionActividadXls> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlanificacionPeiStore } from '@/modules/planificacionpeixls/store/usePlanificacionPeiStore'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import PeiHeader from '@/modules/pei/components/partials/PeiHeader.vue'
// import PlanificacionPeiXls from '@/modules/planificacionpeixls/components/PlanificacionPeiXls.vue'
import PlanificacionPeiActividades from '@/modules/planificacionpeixls/components/PlanificacionPeiActividades.vue'
//Estado de carga
const cargaCompleta = ref(true)
const errorCarga = ref(false)

//Obtener el id del pei, desde la ruta
const route = useRoute()
const idpei = route.params.id

//Iniciar el Store
const storePeiPlan = usePlanificacionPeiStore()

//Hook
onMounted(async () => {
  await cargarDatos()
})

//Funcion de carga de datos
const loadingDatos = ref(false)
const error = ref(null)
const cargarDatos = async () => {
  cargaCompleta.value = true
  try {
    storePeiPlan.obtenerPeiPorId(idpei)
  } catch (err) {
    console.log('Error al cargar la informacion del PEI', err)
    error.value = err
  } finally {
    loadingDatos.value = false
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

.contenedor-planificacion {
  width: 100%;
  height: 100%;
  min-height: 800px;
  position: relative;
  padding: 0;
}
</style>
