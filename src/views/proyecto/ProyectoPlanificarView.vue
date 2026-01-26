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

          <!-- Barra de advertencia de cambios sin guardar -->
          <v-alert
            v-if="storePlanificacion.tieneCambiosSinGuardar"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4 d-flex align-center"
          >
            <v-icon start>mdi-content-save-alert</v-icon>
            Tienes cambios sin guardar en la planificación
            <!-- <template v-slot:append>
              <v-btn
                size="small"
                color="primary"
                variant="text"
                @click="guardarCambios"
                :loading="guardando"
                class="ml-2"
              >
                <v-icon start size="16">mdi-content-save</v-icon>
                Guardar ahora
              </v-btn>
              <v-btn size="small" variant="text" @click="descargarCambios" class="ml-2">
                Descartar cambios
              </v-btn>
            </template> -->
          </v-alert>

          <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />

          <v-card class="mb-4" min-height="1000">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title>PLANIFICACION</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="contenedor-planificacion">
              <!-- Planificación V2 -->
              <PlanificacionProyectoActividadesV2
                :proyecto="proyecto"
                :proyecto-estructura="proyectoEstructura"
                :cargando="!cargaCompleta"
                ref="planificacionRef"
              ></PlanificacionProyectoActividadesV2>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogo de confirmación para cambios sin guardar -->
    <v-dialog v-model="showUnsavedDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
          Cambios sin guardar
        </v-card-title>

        <v-card-text class="pt-4">
          <p>Tienes cambios sin guardar en la planificación del proyecto.</p>
          <p class="font-weight-medium">¿Estás seguro de que quieres abandonar esta página?</p>
          <p class="text-caption text-medium-emphasis mt-2">
            Si abandonas, perderás todos los cambios no guardados.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="cancelLeave"> Cancelar </v-btn>
          <v-btn color="primary" @click="confirmLeave"> Abandonar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { usePlanificacionStore } from '@/modules/planificacionxls/store/usePlanificacionStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useNavigationGuardSimple } from '@/composables/useNavigationGuardSimple'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import PlanificacionProyectoActividadesV2 from '@/modules/planificacionxls/components/PlanificacionProyectoActividadesV2.vue'

// Router y store
const route = useRoute()
const idproyecto = route.params.id

// Stores
const proyectoStore = useProyectoStore()
const storePlanificacion = usePlanificacionStore()

// Estado de carga
const cargaCompleta = ref(false)
const errorCarga = ref(null)

// Referencia al componente hijo
const planificacionRef = ref(null)

// Estado para el botón de guardar
const guardando = ref(false)

// Desestructurar stores
const {
  proyectoActual: proyecto,
  cargando: cargandoProyecto,
  proyectoEstructura,
  proyectoEstructuraNodos,
} = storeToRefs(proyectoStore)

const {
  obtenerProyectoPorId,
  obtenerProyectoEstructuraPorId,
  obtenerProyectoEstructuraNodosPorId,
} = proyectoStore

// Función para verificar si hay cambios sin guardar
const hasUnsavedChanges = computed(() => {
  return storePlanificacion.tieneCambiosSinGuardar
})

// Usar el composable de guard de navegación
const {
  showDialog: showUnsavedDialog,
  confirmLeave,
  cancelLeave,
} = useNavigationGuardSimple(() => hasUnsavedChanges.value)

// Función para guardar cambios desde la barra de advertencia
const guardarCambios = async () => {
  guardando.value = true
  try {
    if (planificacionRef.value && planificacionRef.value.confirmarEnvio) {
      console.log('Guardando cambios desde barra de advertencia')
      await planificacionRef.value.confirmarEnvio()
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  } finally {
    guardando.value = false
  }
}

// Función para descartar cambios
const descargarCambios = () => {
  if (confirm('¿Estás seguro de que quieres descartar todos los cambios sin guardar?')) {
    storePlanificacion.setTieneCambiosSinGuardar(false)

    // Si el componente hijo tiene un método para resetear, lo llamamos
    if (planificacionRef.value && planificacionRef.value.resetChanges) {
      planificacionRef.value.resetChanges()
    }
  }
}

// Función de carga de datos
const cargarDatos = async () => {
  try {
    errorCarga.value = null
    await Promise.all([
      obtenerProyectoPorId(idproyecto),
      obtenerProyectoEstructuraPorId(idproyecto),
      obtenerProyectoEstructuraNodosPorId(idproyecto),
    ])
    cargaCompleta.value = true
  } catch (err) {
    console.error('Error al cargar datos', err)
    errorCarga.value = err.message || 'Error al cargar el proyecto'
  }
}

// Cargar datos al montar
onMounted(async () => {
  await cargarDatos()
})
</script>

<style scoped>
/* Mantén tus estilos existentes */
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

.contenedor-planificacion {
  width: 100%;
  height: 100%;
  min-height: 1000px;
  position: relative;
  padding: 0;
}
</style>
