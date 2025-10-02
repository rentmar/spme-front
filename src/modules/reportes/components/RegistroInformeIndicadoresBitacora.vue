<template>
  <div>
    <h1>Registro de Indicadores</h1>
    <div class="text-caption text-grey mb-4">ID Actividad: {{ props.idactividad }}</div>

    <!-- Indicador de carga -->
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <!-- Lista de indicadores -->
    <div v-if="!isLoading && indicadoresLista.length > 0">
      <v-expansion-panels multiple>
        <v-expansion-panel
          v-for="indicador in indicadoresLista"
          :key="`${indicador.type}-${indicador.id}`"
        >
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-avatar :color="getColorTipoIndicador(indicador.type)" size="32" class="mr-3">
                <v-icon dark>{{ getIconoTipoIndicador(indicador.type) }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ indicador.data.label }}</div>
                <div class="text-caption text-grey">
                  {{ indicador.data.nodoProyecto.codigo }} -
                  {{ getTipoTextoIndicador(indicador.data.nodoProyecto.tipo) }}
                </div>
              </div>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <!-- Renderizar componente específico según el tipo -->
            <ComponenteIndicadorOG v-if="indicador.type === 'indicadorog'" :indicador="indicador" />
            <ComponenteIndicadorOE
              v-else-if="indicador.type === 'indicadoroe'"
              :indicador="indicador"
            />
            <ComponenteIndicadorROG
              v-else-if="indicador.type === 'indicadorrog'"
              :indicador="indicador"
            />
            <ComponenteIndicadorROE
              v-else-if="indicador.type === 'indicadorroe'"
              :indicador="indicador"
            />
            <v-alert v-else type="warning">
              Tipo de indicador no soportado: {{ indicador.type }}
            </v-alert>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Mensaje cuando no hay indicadores -->
    <v-card v-if="!isLoading && indicadoresLista.length === 0" class="mt-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-chart-line</v-icon>
        <h3 class="text-h5 mt-4">No hay indicadores registrados</h3>
        <p class="text-grey mt-2">No se encontraron indicadores para esta actividad</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useIndicadoresStore } from '../stores/useIndicadoresStore'
import ComponenteIndicadorOG from './indicadores/ComponenteIndicadorOG.vue'
import ComponenteIndicadorOE from './indicadores/ComponenteIndicadorOE.vue'
import ComponenteIndicadorROG from './indicadores/ComponenteIndicadorROG.vue'
import ComponenteIndicadorROE from './indicadores/ComponenteIndicadorROE.vue'
import {
  getTipoTextoIndicador,
  getColorTipoIndicador,
  getIconoTipoIndicador,
} from '@/utility/formatters'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  idactividad: {
    type: [Number, String],
    required: true,
  },
})

// Inicializar el store
const storeIndicadores = useIndicadoresStore()

const isLoading = ref(false)

const cargarInformacion = async () => {
  isLoading.value = true
  try {
    await storeIndicadores.cargarActividad(props.idactividad)
  } catch (err) {
    console.error('Error de carga', err)
  } finally {
    isLoading.value = false
  }
}

const indicadoresLista = computed(() => {
  return storeIndicadores.filtrarIndicadores() || []
})

onMounted(() => {
  if (props.idactividad) {
    cargarInformacion()
  }
})
</script>

<style scoped>
.v-expansion-panel {
  margin-bottom: 8px;
}
</style>
