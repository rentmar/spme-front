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
            :registros="store.indicadoresParaAPI.indicadorog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadorog')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadorog')"
          />
        </div>

        <!-- Indicador OE -->
        <div v-if="indicadoroe" class="mb-4">
          <indicadores-oe-registro
            :datos="indicadoroe"
            :registros="store.indicadoresParaAPI.indicadoroe"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadoroe')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadoroe')"
          />
        </div>

        <!-- Indicador ROG -->
        <div v-if="indicadorrog" class="mb-4">
          <indicadores-rog-registro
            :datos="indicadorrog"
            :registros="store.indicadoresParaAPI.indicadorrog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'indicadorrog')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'indicadorrog')"
          />
        </div>

        <!-- Indicador ROE -->
        <div v-if="indicadorroe" class="mb-4">
          <indicadores-roe-registro
            :datos="indicadorroe"
            :registros="store.indicadoresParaAPI.indicadorroe"
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
import { computed, watch } from 'vue'
import { useInformeTareaStore } from '@/modules/formularios/store/useInformeTareaStore'
import IndicadoresOgRegistro from './partials-indicador-registro/IndicadoresOgRegistro.vue'
import IndicadoresOeRegistro from './partials-indicador-registro/IndicadoresOeRegistro.vue'
import IndicadoresRogRegistro from './partials-indicador-registro/IndicadoresRogRegistro.vue'
import IndicadoresRoeRegistro from './partials-indicador-registro/IndicadoresRoeRegistro.vue'

// Store
const store = useInformeTareaStore()

// Emits
const emit = defineEmits(['indicadores-cargados', 'indicadores-actualizados'])

// Estados computados que se sincronizan automáticamente con el store
const loading = computed(() => store.loading)
const indicadorog = computed(() => store.indicadorog)
const indicadoroe = computed(() => store.indicadoroe)
const indicadorrog = computed(() => store.indicadorrog)
const indicadorroe = computed(() => store.indicadorroe)
const indicadoresIds = computed(() => store.indicadoresIds)

// Computed para verificar si hay indicadores
const tieneIndicadores = computed(() => {
  return indicadorog.value || indicadoroe.value || indicadorrog.value || indicadorroe.value
})

// Watch para detectar cuando los indicadores se cargan
watch(
  [indicadorog, indicadoroe, indicadorrog, indicadorroe],
  ([newOg, newOe, newRog, newRoe]) => {
    if (newOg || newOe || newRog || newRoe) {
      console.log('Indicadores cargados:')
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
      emit('indicadores-cargados', {
        indicadorog: indicadorog.value,
        indicadoroe: indicadoroe.value,
        indicadorrog: indicadorrog.value,
        indicadorroe: indicadorroe.value,
        ids: indicadoresIds.value,
      })
    }
  },
  { immediate: true },
)

/**
 * Manejador para registros guardados - PASA AL STORE
 */
const manejarRegistroIndicador = (payload, tipo) => {
  console.log(`📝 Registro ${tipo} recibido:`, payload)

  // Guardar en el store
  store.guardarRegistroIndicador(tipo, payload.indicadorId, payload.registro)

  // Emitir evento de actualización
  emit('indicadores-actualizados', {
    tipo,
    accion: 'guardado',
    indicadorId: payload.indicadorId,
  })
}

/**
 * Manejador para eliminaciones - PASA AL STORE
 */
const manejarEliminacionIndicador = (payload, tipo) => {
  console.log(`🗑️ Eliminación ${tipo} recibida:`, payload)

  // Eliminar del store
  store.eliminarRegistroIndicador(tipo, payload.indicadorId)

  // Emitir evento de actualización
  emit('indicadores-actualizados', {
    tipo,
    accion: 'eliminado',
    indicadorId: payload.indicadorId,
  })
}

// Método para recargar manualmente
const recargarIndicadores = async () => {
  console.log('Indicadores actuales:', {
    og: indicadorog.value,
    oe: indicadoroe.value,
    rog: indicadorrog.value,
    roe: indicadorroe.value,
  })
}

// ✅ NUEVO: Obtener el JSON completo para enviar al backend
const obtenerJSONIndicadores = () => {
  return store.indicadoresParaAPI
}

// ✅ NUEVO: Resetear todos los registros
const resetearRegistros = () => {
  store.resetearRegistrosIndicadores()
}

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
