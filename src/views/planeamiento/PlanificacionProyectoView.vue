<!-- PlanificacionProyectoView.vue -->
<template>
  <div class="proyecto-excel-wrapper">
    <!-- OVERLAY DE CARGA -->
    <v-overlay :model-value="!cargaLista" class="align-center justify-center" persistent>
      <template v-if="errorCarga">
        <v-alert type="error" class="mb-4">{{ errorCarga }}</v-alert>
        <v-btn color="primary" @click="cargarDatos">Reintentar</v-btn>
      </template>
      <template v-else>
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando proyecto...</p>
      </template>
    </v-overlay>

    <!-- CABECERA COLAPSABLE -->
    <div class="proyecto-header">
      <div class="header-main" @click="headerCollapsed = !headerCollapsed">
        <div class="proyecto-info">
          <div class="proyecto-codigo">{{ proyectoData.codigo || '' }}</div>
          <div class="proyecto-titulo">{{ proyectoData.titulo || '' }}</div>
        </div>
        <div class="header-meta-compact">
          <span>Bs. {{ fmt(proyectoData.presupuesto) }}</span>
          <span class="header-sep">|</span>
          <span class="badge-sm" :class="estadoBadgeClass">{{ proyectoData.estado || '' }}</span>
          <span class="header-sep">|</span>
          <span>{{ proyectoMetadata.total_actividades || 0 }} act.</span>
        </div>
        <v-icon size="20" class="header-toggle">
          {{ headerCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
        </v-icon>
      </div>

      <v-expand-transition>
        <div v-show="!headerCollapsed" class="header-detail">
          <div class="proyecto-meta">
            <div class="meta-item">
              <span class="meta-label">Periodo:</span>
              <span class="meta-value"
                >{{ proyectoData.fecha_inicio }} - {{ proyectoData.fecha_finalizacion || '' }}</span
              >
            </div>
            <div class="meta-item">
              <span class="meta-label">Propietario:</span>
              <span class="meta-value">{{ proyectoData.propietario_nombre || '' }}</span>
            </div>
          </div>
          <div class="proyecto-subtitle" v-if="proyectoData.financiadores?.length">
            <span class="subtitle-label">Financiadores:</span>
            <span class="subtitle-value">{{
              proyectoData.financiadores.map((f) => f.sigla).join(', ')
            }}</span>
            <span class="footer-sep">|</span>
            <span class="subtitle-label">Instancias:</span>
            <span class="subtitle-value">{{
              proyectoData.instancias_gestoras?.map((i) => i.codigo).join(', ') || ''
            }}</span>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <!-- GRILLA -->
    <div class="excel-wrapper">
      <PlanificacionProyectoActividadesV4 v-if="store.initialized" />
    </div>

    <!-- PIE DEL PROYECTO -->
    <div class="proyecto-footer">
      <span>🕐 Fecha de hoy: {{ fechaActual }}</span>
      <span class="footer-sep">|</span>
      <span>👤 {{ usuarioActual }}</span>
      <span class="footer-sep">|</span>
      <span>📊 PEI 2022-2027</span>
      <span class="footer-sep">|</span>
      <span>📋 {{ proyectoMetadata.total_actividades || 0 }} actividades registradas</span>
      <span style="flex: 1"></span>
      <span>SPME</span>
    </div>
  </div>

  <!--Dialogo de confirmacion para la carga de tareas -->
  <ConfirmDialogTareas
    v-model="store.showDialogCambioActividad"
    @confirmar="store.aceptarCambioActividad"
    @cancelar="store.cancelarCambioActividad"
  />

  <!-- Diálogo de confirmación para salir/navegar -->
  <v-dialog v-model="showDialogSalir" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
        Cambios sin guardar
      </v-card-title>
      <v-card-text>
        Tienes cambios sin guardar en la planificación.
        <br /><br />
        <strong>Si sales ahora, perderás todas las modificaciones realizadas.</strong>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancelarSalir">Cancelar</v-btn>
        <v-btn color="primary" variant="text" @click="confirmarSalir">💾 Guardar y salir</v-btn>
        <v-btn color="error" variant="text" @click="forceLeave">Salir sin guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import PlanificacionProyectoActividadesV4 from '@/modules/planificacionxlsv1/components/PlanificacionProyectoActividadesV4.vue'
import ConfirmDialogTareas from '@/modules/planificacionxlsv1/components/Dialogs/ConfirmDialogTareas.vue'
import { usePlanificacionExcelStore } from '@/modules/planificacionxlsv1/stores/usePlanificacionExcelStore'
import { useUserStore } from '@/stores/user'
import { obtenerClaseEstadoProyecto, obtenerFechaActual } from '@/modules/planificacionxlsv1/utils'

const route = useRoute()
const proyectoID = route.params.id
const store = usePlanificacionExcelStore()
const userStore = useUserStore()

const cargaLista = ref(false)
const errorCarga = ref(null)
const showDialogSalir = ref(false)
const pendingNext = ref(null)
const headerCollapsed = ref(true)

const usuarioActual = computed(() => userStore.usuario || 'admin')
const fechaActual = computed(() => obtenerFechaActual())
const estadoBadgeClass = computed(() => obtenerClaseEstadoProyecto(proyectoData.value?.estado))

const proyectoData = computed(
  () =>
    store.proyectoActual || {
      codigo: '',
      titulo: 'Cargando...',
      presupuesto: 0,
      estado: '',
      fecha_inicio: '',
      fecha_finalizacion: '',
      propietario_nombre: '',
      financiadores: [],
      instancias_gestoras: [],
    },
)

const proyectoMetadata = computed(
  () =>
    store.metadata || {
      proyecto_id: '',
      codigo_proyecto: '',
      total_actividades: 0,
      estado_proyecto: '',
    },
)

const cargarDatos = async () => {
  cargaLista.value = false
  errorCarga.value = null
  try {
    await store.inicializar(proyectoID)
    cargaLista.value = true
  } catch (error) {
    console.error('Error al cargar la información', error)
    errorCarga.value = error.message
  }
}

const fmt = (n) => {
  const num = parseFloat(n || 0)
  return num.toLocaleString('es-BO', { minimumFractionDigits: 2 })
}

const prevenirCierre = (event) => {
  if (store.tieneCambiosSinGuardar) {
    event.preventDefault()
    event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de salir?'
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (store.tieneCambiosSinGuardar) {
    showDialogSalir.value = true
    pendingNext.value = next
  } else {
    next()
  }
})

const forceLeave = () => {
  showDialogSalir.value = false
  if (pendingNext.value) {
    pendingNext.value()
    pendingNext.value = null
  }
}

const confirmarSalir = async () => {
  try {
    alert('Guardar')
  } catch (e) {
    console.error('Error al guardar:', e)
  }
  showDialogSalir.value = false
  if (pendingNext.value) {
    pendingNext.value()
    pendingNext.value = null
  }
}

const cancelarSalir = () => {
  showDialogSalir.value = false
  if (pendingNext.value) {
    pendingNext.value(false)
    pendingNext.value = null
  }
}

onMounted(() => {
  cargarDatos()
  window.addEventListener('beforeunload', prevenirCierre)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', prevenirCierre)
  store.reset()
})
</script>

<style>
.v-container {
  padding: 0 !important;
  max-width: 100% !important;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}

.proyecto-excel-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  margin: 4px 0 0 0;
  background: #fff;
  border: 1px solid #c4c7c9;
  border-radius: 6px;
  overflow: hidden;
}

/* CABECERA COLAPSABLE */
.proyecto-header {
  flex-shrink: 0;
  background: #37474f;
  border-bottom: 2px solid #263238;
  cursor: pointer;
  user-select: none;
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 16px;
}

.proyecto-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.proyecto-codigo {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 10px;
  border-radius: 3px;
  font-family: monospace;
}

.proyecto-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.header-meta-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.header-sep {
  color: rgba(255, 255, 255, 0.3);
}

.badge-sm {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.badge-blue {
  background: rgba(66, 165, 245, 0.8);
  color: #fff;
}
.badge-green {
  background: rgba(76, 175, 80, 0.8);
  color: #fff;
}
.badge-gray {
  background: rgba(158, 158, 158, 0.8);
  color: #fff;
}

.header-toggle {
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.header-detail {
  padding: 0 16px 8px 16px;
}

.proyecto-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.meta-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}
.meta-value {
  color: #fff;
  font-weight: 600;
}

.proyecto-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 11px;
}

.subtitle-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}
.subtitle-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}
.footer-sep {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
}

/* GRILLA */
.excel-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* PIE */
.proyecto-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  background: #f1f3f4;
  border-top: 1px solid #c4c7c9;
  font-size: 11px;
  color: #5f6368;
  gap: 8px;
}
</style>
