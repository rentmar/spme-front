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

          <!-- Barra de advertencia de cambios sin guardar -->
          <v-alert
            v-if="storePeiPlan.tieneCambiosSinGuardar"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4 d-flex align-center"
          >
            <v-icon start>mdi-content-save-alert</v-icon>
            Tienes cambios sin guardar
            <!-- <template v-slot:append>
              <v-btn
                size="small"
                color="primary"
                variant="text"
                @click="guardarCambios"
                :loading="guardando"
              >
                Guardar ahora
              </v-btn>
              <v-btn size="small" variant="text" @click="descargarCambios" class="ml-2">
                Descartar cambios
              </v-btn>
            </template> -->
          </v-alert>

          <PeiHeader v-if="storePeiPlan.peiActual" :pei="storePeiPlan.peiActual"></PeiHeader>

          <v-card class="mb-4" min-height="1000">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title>PLANIFICACION</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="contenedor-planificacion">
              <PlanificacionPeiActividades
                v-if="storePeiPlan.peiSeleccionado && storePeiPlan.estructuraPeiSeleccionado"
                :pei="storePeiPlan.peiSeleccionado"
                :pei-estructura="storePeiPlan.estructuraPeiSeleccionado"
                ref="planificacionRef"
              ></PlanificacionPeiActividades>
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
          <p>Tienes cambios sin guardar en la planificación.</p>
          <p class="font-weight-medium">¿Estás seguro de que quieres abandonar esta página?</p>
          <p class="text-caption text-medium-emphasis mt-2">
            Si abandonas, perderás todos los cambios no guardados.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="cancelNavigation"> Cancelar </v-btn>
          <v-btn color="primary" @click="confirmNavigation"> Abandonar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { usePlanificacionPeiStore } from '@/modules/planificacionpeixls/store/usePlanificacionPeiStore'
import { useNavigationGuard } from '@/composables/useNavigationGuard'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import PeiHeader from '@/modules/pei/components/partials/PeiHeader.vue'
import PlanificacionPeiActividades from '@/modules/planificacionpeixls/components/PlanificacionPeiActividades.vue'

// Route
const route = useRoute()

// Estado de carga
const cargaCompleta = ref(false)
const errorCarga = ref(null)

// Obtener el id del pei, desde la ruta
const idpei = route.params.id

// Iniciar el Store
const storePeiPlan = usePlanificacionPeiStore()

// Referencia al componente hijo
const planificacionRef = ref(null)

// Estado para el botón de guardar
const guardando = ref(false)

// Composable de navegación
const {
  hasUnsavedChanges,
  setUnsavedChanges,
  setupRouterGuard,
  removeRouterGuard,
  confirmNavigation: confirmNav,
  cancelNavigation: cancelNav,
} = useNavigationGuard()

// Diálogo de cambios sin guardar
const showUnsavedDialog = ref(false)

// Configurar listener para el evento del diálogo
const setupEventListener = () => {
  window.addEventListener('show-unsaved-changes-dialog', handleNavigationAttempt)
}

const removeEventListener = () => {
  window.removeEventListener('show-unsaved-changes-dialog', handleNavigationAttempt)
}

// Manejar intento de navegación
const handleNavigationAttempt = (event) => {
  console.log('Navigation attempt detected:', event.detail)
  showUnsavedDialog.value = true
}

// Confirmar navegación
const confirmNavigation = () => {
  console.log('User confirmed navigation')

  // Resetear cambios en el store
  storePeiPlan.setTieneCambiosSinGuardar(false)
  setUnsavedChanges(false)

  // Confirmar navegación en el composable
  confirmNav()

  // Cerrar diálogo
  showUnsavedDialog.value = false
}

// Cancelar navegación
const cancelNavigation = () => {
  console.log('User cancelled navigation')
  cancelNav()
  showUnsavedDialog.value = false
}

// Función para descartar cambios
const descargarCambios = () => {
  if (confirm('¿Estás seguro de que quieres descartar todos los cambios?')) {
    storePeiPlan.setTieneCambiosSinGuardar(false)
    setUnsavedChanges(false)
    removeRouterGuard()

    // Si el componente hijo tiene un método para resetear, lo llamamos
    if (planificacionRef.value && planificacionRef.value.resetChanges) {
      planificacionRef.value.resetChanges()
    }
  }
}

// Función para guardar cambios desde la barra de advertencia
const guardarCambios = async () => {
  guardando.value = true
  try {
    if (planificacionRef.value) {
      console.log('Saving changes from warning bar')
      await planificacionRef.value.confirmarEnvio()

      // Después de guardar, actualizamos el estado
      setUnsavedChanges(false)
    }
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  } finally {
    guardando.value = false
  }
}

// Manejar cierre de pestaña/ventana
const handleBeforeUnload = (event) => {
  if (storePeiPlan.tieneCambiosSinGuardar) {
    console.log('Blocking page unload due to unsaved changes')
    event.preventDefault()
    event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?'
  }
}

// Función de carga de datos
const cargarDatos = async () => {
  try {
    console.log('Loading PEI data for ID:', idpei)
    await storePeiPlan.obtenerPeiPorId(idpei)
    cargaCompleta.value = true
    console.log('PEI data loaded successfully')
  } catch (err) {
    console.error('Error al cargar la información del PEI', err)
    errorCarga.value = err.message || 'Error al cargar el PEI'
  }
}

// Observar cambios en el store
watch(
  () => storePeiPlan.tieneCambiosSinGuardar,
  (newValue, oldValue) => {
    console.log('tieneCambiosSinGuardar changed:', { oldValue, newValue })

    // Sincronizar con el composable
    setUnsavedChanges(newValue)

    if (newValue && !oldValue) {
      // Cuando se detectan cambios por primera vez
      console.log('Setting up router guard for unsaved changes')
      setupRouterGuard()
      setupEventListener()
    } else if (!newValue && oldValue) {
      // Cuando se guardan los cambios
      console.log('Changes saved or discarded, removing router guard')
      removeRouterGuard()
      removeEventListener()
    }
  },
)

// Hook de ciclo de vida
onMounted(async () => {
  console.log('Component mounted, loading data...')

  // 1. Primero cargar los datos
  await cargarDatos()

  // 2. Esperar un tick para asegurar que todo esté renderizado
  await nextTick()

  // 3. Configurar evento para el botón "atrás" del navegador
  window.addEventListener('beforeunload', handleBeforeUnload)

  // 4. Configurar guardia del router si ya hay cambios iniciales
  if (storePeiPlan.tieneCambiosSinGuardar) {
    console.log('Initial unsaved changes detected, setting up guard')
    setUnsavedChanges(true)
    setupRouterGuard()
    setupEventListener()
  }

  console.log('Component setup complete')
})

onBeforeUnmount(() => {
  console.log('Component unmounting, cleaning up...')

  // Remover event listeners
  removeEventListener()
  window.removeEventListener('beforeunload', handleBeforeUnload)

  console.log('Component cleanup complete')
})
</script>

<style scoped>
/* ... tus estilos existentes ... */
</style>
