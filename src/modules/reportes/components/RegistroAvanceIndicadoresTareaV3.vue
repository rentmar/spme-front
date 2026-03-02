<template>
  <v-container>
    <div>
      <!-- Indicadores de carga -->
      <div v-if="loading" class="text-center pa-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2">Cargando indicadores...</p>
      </div>

      <!-- Mostrar datos cuando estén disponibles -->
      <div v-else-if="tieneIndicadores">
        <!-- Indicador OG -->
        <div v-if="indicadorog" class="mb-4">
          <indicadores-og-registro
            :datos="indicadorog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadorog')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadorog')"
          />
        </div>

        <!-- Indicador OE -->
        <div v-if="indicadoroe" class="mb-4">
          <indicadores-oe-registro
            :datos="indicadoroe"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadoroe')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadoroe')"
          />
        </div>

        <!-- Indicador ROG -->
        <div v-if="indicadorrog" class="mb-4">
          <indicadores-rog-registro
            :datos="indicadorrog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadorrog')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadorrog')"
          />
        </div>

        <!-- Indicador ROE -->
        <div v-if="indicadorroe" class="mb-4">
          <indicadores-roe-registro
            :datos="indicadorroe"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadorroe')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadorroe')"
          />
        </div>
      </div>

      <!-- Mensaje si no hay datos -->
      <div v-else class="text-center pa-4">
        <v-alert type="info" variant="tonal">
          No hay indicadores disponibles para esta actividad
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useInformeTareaStore } from '@/modules/formularios/store/useInformeTareaStore'
import IndicadoresOgRegistro from './partials-indicador-registro/IndicadoresOgRegistro.vue'
import IndicadoresOeRegistro from './partials-indicador-registro/IndicadoresOeRegistro.vue'
import IndicadoresRogRegistro from './partials-indicador-registro/IndicadoresRogRegistro.vue'
import IndicadoresRoeRegistro from './partials-indicador-registro/IndicadoresRoeRegistro.vue'

// ============================================
// Store
// ============================================
const store = useInformeTareaStore()

// Emits
const emit = defineEmits([
  'indicadores-cargados',
  'indicadores-actualizados',
  'todos-los-registros-enviados',
])

// ============================================
// Estados computados del store
// ============================================
const loading = computed(() => store.loading)
const indicadorog = computed(() => store.indicadorog)
const indicadoroe = computed(() => store.indicadoroe)
const indicadorrog = computed(() => store.indicadorrog)
const indicadorroe = computed(() => store.indicadorroe)
const indicadoresIds = computed(() => store.indicadoresIds)
const actividadId = computed(() => store.actividad?.id) // ID de actividad desde el store
const tareaId = computed(() => store.tarea?.id)

// Computed para verificar si hay indicadores
const tieneIndicadores = computed(() => {
  return indicadorog.value || indicadoroe.value || indicadorrog.value || indicadorroe.value
})

// ============================================
// Watchers
// ============================================
watch(
  [indicadorog, indicadoroe, indicadorrog, indicadorroe],
  ([newOg, newOe, newRog, newRoe]) => {
    if (newOg || newOe || newRog || newRoe) {
      console.log('Indicadores cargados en tarea:')
      console.log('- OG:', newOg)
      console.log('- OE:', newOe)
      console.log('- ROG:', newRog)
      console.log('- ROE:', newRoe)
    }
  },
  { immediate: true, deep: true },
)

// Cuando los indicadores estén disponibles, emitir al padre
watch(
  tieneIndicadores,
  (nuevoValor) => {
    if (nuevoValor) {
      const payload = {
        indicadorog: indicadorog.value,
        indicadoroe: indicadoroe.value,
        indicadorrog: indicadorrog.value,
        indicadorroe: indicadorroe.value,
        ids: indicadoresIds.value,
      }
      emit('indicadores-cargados', payload)
      emit('todos-los-registros-enviados', payload)
    }
  },
  { immediate: true },
)

// ============================================
// Manejadores de eventos
// ============================================
const manejarRegistroIndicador = (payload, tipo) => {
  console.log(`📝 Registro ${tipo} recibido en tarea:`, payload)

  // Guardar en el store
  store.guardarRegistroIndicador(tipo, payload.indicadorId, payload.registro)

  // Emitir eventos
  emit('indicadores-actualizados', {
    tipo,
    accion: 'guardado',
    indicadorId: payload.indicadorId,
  })

  emit('todos-los-registros-enviados', {
    tipo,
    accion: 'guardado',
    indicadorId: payload.indicadorId,
    registro: payload.registro,
  })
}

const manejarEliminacionIndicador = (payload, tipo) => {
  console.log(`🗑️ Eliminación ${tipo} recibida en tarea:`, payload)

  // Eliminar del store
  store.eliminarRegistroIndicador(tipo, payload.indicadorId)

  // Emitir eventos
  emit('indicadores-actualizados', {
    tipo,
    accion: 'eliminado',
    indicadorId: payload.indicadorId,
  })

  emit('todos-los-registros-enviados', {
    tipo,
    accion: 'eliminado',
    indicadorId: payload.indicadorId,
  })
}

// ============================================
// Métodos expuestos
// ============================================
const recargarIndicadores = async () => {
  console.log('Recargando indicadores...')
  if (actividadId.value) {
    await store.obtenerTareasPorIdMasDetalles(tareaId.value)
  }
  console.log('Indicadores actuales:', {
    og: indicadorog.value,
    oe: indicadoroe.value,
    rog: indicadorrog.value,
    roe: indicadorroe.value,
  })
}

const obtenerJSONIndicadores = () => {
  return store.indicadoresParaAPI
}

const resetearRegistros = () => {
  store.resetearRegistrosIndicadores()
}

// ============================================
// Carga inicial
// ============================================
const cargarIndicadores = async () => {
  // Esperar a que el store tenga el ID de actividad
  // (viene desde el padre que ya cargó los datos)
  if (actividadId.value) {
    await store.obtenerTareasPorIdMasDetalles(tareaId.value)
  } else {
    console.warn('No hay ID de actividad disponible para cargar indicadores')
  }
}

onMounted(() => {
  cargarIndicadores()
})

// Exponer métodos al padre
defineExpose({
  recargarIndicadores,
  obtenerJSONIndicadores,
  resetearRegistros,
})
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 300px;
  font-size: 0.85rem;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1976d2;
}

.mb-4 {
  margin-bottom: 1rem;
}

.pa-4 {
  padding: 1rem;
}

.text-center {
  text-align: center;
}
</style>
