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

    <!-- CABECERA -->
    <div class="proyecto-header">
      <div class="proyecto-info">
        <div class="proyecto-codigo">{{ proyectoData.codigo || '' }}</div>
        <div class="proyecto-titulo">{{ proyectoData.titulo || '' }}</div>
      </div>
      <div class="proyecto-meta">
        <div class="meta-item">
          <span class="meta-label">Presupuesto:</span>
          <span class="meta-value">Bs. {{ fmt(proyectoData.presupuesto) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Estado:</span>
          <span class="meta-value badge" :class="estadoBadgeClass">{{
            proyectoData.estado || ''
          }}</span>
        </div>
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
        <div class="meta-item">
          <span class="meta-label">Actividades:</span>
          <span class="meta-value">{{ proyectoMetadata.total_actividades || 0 }}</span>
        </div>
      </div>
      <!-- Subtítulo con financiadores -->
      <div
        class="proyecto-subtitle"
        v-if="proyectoData.financiadores && proyectoData.financiadores.length"
      >
        <span class="subtitle-label">Financiadores:</span>
        <span class="subtitle-value">
          {{ proyectoData.financiadores.map((f) => f.sigla).join(', ') }}
        </span>
        <span class="footer-sep">|</span>
        <span class="subtitle-label">Instancias:</span>
        <span class="subtitle-value">
          {{ proyectoData.instancias_gestoras?.map((i) => i.codigo).join(', ') || '' }}
        </span>
      </div>
    </div>

    <!-- GRILLA -->
    <div class="excel-wrapper">
      <PlanificacionProyectoActividadesV4 v-if="store.initialized" />
    </div>

    <!-- PIE DEL PROYECTO -->
    <div class="proyecto-footer">
      <span>🕐 Fecha de hoy: {{ fechaActual }}</span>
      <span class="footer-sep">|</span>
      <span>👤 {{ proyectoData.propietario_nombre || 'admin' }}</span>
      <span class="footer-sep">|</span>
      <span>📊 PEI 2022-2027</span>
      <span class="footer-sep">|</span>
      <span>📋 {{ proyectoMetadata.total_actividades || 0 }} actividades registradas</span>
      <span style="flex: 1"></span>
      <span>SPME</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
//componentes
import PlanificacionProyectoActividadesV4 from '@/modules/planificacionxlsv1/components/PlanificacionProyectoActividadesV4.vue'
//stores
import { usePlanificacionExcelStore } from '@/modules/planificacionxlsv1/stores/usePlanificacionExcelStore'
//helpers
import { obtenerClaseEstadoProyecto, obtenerFechaActual } from '@/modules/planificacionxlsv1/utils'
// ──── DATOS MOCK (ANULAR STORE TEMPORALMENTE) ────
const proyectoData = ref({
  id: 47,
  codigo: 'TEST-ESTRUC0001',
  titulo: 'Test de Estructura para el repositorio',
  descripcion: 'Proyecto para sincronizacion del proyecto con el repositorio',
  estado: 'EP',
  fecha_inicio: '2026-08-01',
  fecha_finalizacion: '2026-12-31',
  fecha_creacion: '2026-07-22T10:15:09.953244-04:00',
  presupuesto: '5000000.00',
  esta_habilitado: true,
  propietario_nombre: 'admin',
  instancias_gestoras: [
    {
      id: 6,
      codigo: 'URBANO',
      clasificador: 'E',
      instancia: 'Programa Urbano',
    },
    {
      id: 1,
      codigo: 'UG',
      clasificador: null,
      instancia: 'Unidad de Gestion',
    },
  ],
  financiadores: [
    {
      id: 2,
      sigla: 'MISEREOR',
      financiera: 'GOBAL',
    },
    {
      id: 4,
      sigla: 'UNITAS',
      financiera: 'UNITAS',
    },
    {
      id: 6,
      sigla: 'OMSA',
      financiera: 'OMSA',
    },
  ],
})

const proyectoMetadata = ref({
  proyecto_id: 47,
  codigo_proyecto: 'TEST-ESTRUC0001',
  total_actividades: 3,
  estado_proyecto: 'EP',
})

//Capturar el id de la url
const route = useRoute()
const proyectoID = route.params.id

// ──── ESTADOS DE CARGA ────
const cargaLista = ref(false)
const errorCarga = ref(null)

//Stores
const store = usePlanificacionExcelStore()

// ──── COMPUTED ────
const estadoBadgeClass = computed(() => obtenerClaseEstadoProyecto(proyectoData.value?.estado))

// const fechaActual = computed(() => {
//   const now = new Date()
//   return now.toLocaleDateString('es-BO', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   })
// })
const fechaActual = computed(() => obtenerFechaActual())

// ──── FUNCIONES ────
const cargarDatos = async () => {
  cargaLista.value = false
  errorCarga.value = null

  try {
    // Simular carga (quitar cuando el store funcione)
    //await new Promise((resolve) => setTimeout(resolve, 800))

    // Aquí iría la carga real:
    await store.inicializar(proyectoID)
    // proyectoData.value = store.proyectoActual
    // proyectoMetadata.value = store.metadata

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

// ──── HOOKS ────
onMounted(() => {
  cargarDatos()
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

/* CABECERA AZUL */
.proyecto-header {
  flex-shrink: 0;
  padding: 12px 18px;
  background: #37474f;
  border-bottom: 2px solid #263238;
}

.proyecto-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
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

.proyecto-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
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

.badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
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

/* GRILLA */
.excel-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* PIE GRIS */
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
