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
          <!-- <h3>Indicadores OG:</h3>
        <pre>{{ JSON.stringify(indicadorog, null, 2) }}</pre> -->
          <indicadores-og-registro
            :datos="indicadorog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'og')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'og')"
          ></indicadores-og-registro>
        </div>

        <!-- Indicador OE -->
        <div v-if="indicadoroe" class="mb-4">
          <!-- <h3>Indicadores OE:</h3>
        <pre>{{ JSON.stringify(indicadoroe, null, 2) }}</pre> -->
          <indicadores-oe-registro
            :datos="indicadoroe"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'oe')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'oe')"
          ></indicadores-oe-registro>
        </div>

        <!-- Indicador ROG -->
        <div v-if="indicadorrog" class="mb-4">
          <!-- <h3>Indicadores ROG:</h3>
        <pre>{{ JSON.stringify(indicadorrog, null, 2) }}</pre> -->
          <indicadores-rog-registro
            :datos="indicadorrog"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'rog')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'rog')"
          ></indicadores-rog-registro>
        </div>

        <!-- Indicador ROE -->
        <div v-if="indicadorroe" class="mb-4">
          <!-- <h3>Indicadores ROE:</h3>
        <pre>{{ JSON.stringify(indicadorroe, null, 2) }}</pre> -->
          <indicadores-roe-registro
            :datos="indicadorroe"
            @registro-guardado="(payload) => manejarRegistroIndicador(payload, 'roe')"
            @registro-eliminado="(payload) => manejarEliminacionIndicador(payload, 'roe')"
          ></indicadores-roe-registro>
        </div>

        <!-- IDs de indicadores -->
        <div v-if="indicadoresIds" class="mb-4">
          <!-- <h3>IDs de Indicadores:</h3>
        <pre>{{ JSON.stringify(indicadoresIds, null, 2) }}</pre> -->
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
import { ref, computed, watch } from 'vue'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
import IndicadoresOgRegistro from './partials-indicador-registro/IndicadoresOgRegistro.vue'
import IndicadoresOeRegistro from './partials-indicador-registro/IndicadoresOeRegistro.vue'
import IndicadoresRogRegistro from './partials-indicador-registro/IndicadoresRogRegistro.vue'
import IndicadoresRoeRegistro from './partials-indicador-registro/IndicadoresRoeRegistro.vue'
// Store
const store = useInformeActividadStore()

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
      console.log('Indicadores cargados en el hijo:')
      console.log('- OG:', newOg)
      console.log('- OE:', newOe)
      console.log('- ROG:', newRog)
      console.log('- ROE:', newRoe)
      console.log('- IDs:', indicadoresIds.value)
    }
  },
  { immediate: true, deep: true },
)

// También podemos emitir los datos al padre si es necesario
const emit = defineEmits(['indicadores-cargados'])

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

// Opcional: Si necesitas acceder a los datos de forma reactiva localmente
// (aunque ya lo haces con computed)
const datosLocales = ref({
  indicadorog: null,
  indicadoroe: null,
  indicadorrog: null,
  indicadorroe: null,
})

// Sincronizar datos locales con el store (si necesitas manipularlos)
watch(
  [indicadorog, indicadoroe, indicadorrog, indicadorroe],
  ([og, oe, rog, roe]) => {
    datosLocales.value = {
      indicadorog: og,
      indicadoroe: oe,
      indicadorrog: rog,
      indicadorroe: roe,
    }
  },
  { immediate: true, deep: true },
)

// Método para recargar manualmente si es necesario
const recargarIndicadores = async () => {
  // No necesitas hacer nada, los computed se actualizan automáticamente
  console.log('Indicadores actuales:', {
    og: indicadorog.value,
    oe: indicadoroe.value,
    rog: indicadorrog.value,
    roe: indicadorroe.value,
  })
}

// Exponer métodos al padre si es necesario
defineExpose({
  recargarIndicadores,
  datosLocales,
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
