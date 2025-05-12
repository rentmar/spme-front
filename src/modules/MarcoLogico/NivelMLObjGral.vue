<template>
  <v-expansion-panels multiple class="marco-logico-panels">
    <!-- Panel Objetivo General -->
    <v-expansion-panel elevation="2" class="marco-logico-panel">
      <v-expansion-panel-title expand-icon="mdi-chevron-down" collapse-icon="mdi-chevron-up">
        <v-icon icon="mdi-target" color="primary" class="mr-3" />
        <span class="panel-title">Objetivo General</span>
        <v-chip color="primary" variant="outlined" size="small" class="ml-2">
          {{ cantidadObjetivos }} Items
        </v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text class="panel-content">
        <v-row dense>
          <!-- Columna Objetivos -->
          <v-col cols="12" md="6">
            <v-card class="marco-logico-card">
              <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-bullseye-arrow" class="mr-2" />
                <span class="card-title">Objetivos Generales</span>
              </v-card-title>

              <v-card-text>
                <v-expansion-panels v-model="panelObjetivoAbierto" multiple>
                  <v-expansion-panel
                    v-for="(objetivo, index) in props.objetivosGenerales"
                    :key="objetivo.codigo"
                    :value="objetivo.codigo"
                  >
                    <v-expansion-panel-title>
                      <v-icon icon="mdi-circle-small" class="mr-2" />
                      {{ objetivo.codigo }} -{{ index }}
                      {{ objetivo.descripcion.substring(0, 50) }}...
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <p>{{ objetivo.descripcion }}</p>
                      <v-btn size="small" color="primary" @click="seleccionarObjetivo(objetivo)">
                        Ver Indicadores
                      </v-btn>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Columna Indicadores -->
          <v-col cols="12" md="6">
            <v-card class="marco-logico-card">
              <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-clipboard-list" class="mr-2" />
                <span class="card-title">Indicadores</span>
              </v-card-title>

              <v-card-text>
                <div v-if="objetivoSeleccionado">
                  <v-expansion-panels multiple>
                    <template v-if="objetivoSeleccionado.indicadores?.length > 0">
                      <v-expansion-panel
                        v-for="(indicador, idx) in objetivoSeleccionado.indicadores"
                        :key="idx"
                      >
                        <v-expansion-panel-title>
                          <v-icon icon="mdi-chart-line" class="mr-2" />
                          {{ indicador.codigo }} - {{ indicador.redaccion.substring(0, 50) }}...
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <p><strong>Redacción:</strong> {{ indicador.redaccion }}</p>
                          <p><strong>Fuente:</strong> {{ indicador.fuente_verificacion }}</p>
                          <p><strong>Meta Población:</strong> {{ indicador.target_poblacion }}</p>
                          <p><strong>Línea Base:</strong> {{ indicador.baseline }}</p>
                          <!-- Puedes agregar más campos aquí si quieres -->
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </template>

                    <template v-else>
                      <div class="text-center text-grey">
                        No hay indicadores asociados a este objetivo.
                      </div>
                    </template>
                  </v-expansion-panels>
                </div>

                <div v-else class="text-center text-grey">
                  Selecciona un objetivo para ver sus indicadores.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  objetivosGenerales: { type: Array, required: true },
})

const cantidadObjetivos = computed(() => props.objetivosGenerales?.length ?? 0)

const objetivoSeleccionado = ref(null)
const panelObjetivoAbierto = ref([])

const seleccionarObjetivo = (objetivo) => {
  objetivoSeleccionado.value = objetivo
}
</script>

<style scoped>
.marco-logico-panels {
  border-radius: 8px;
}

.marco-logico-panel {
  margin-bottom: 24px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.marco-logico-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08) !important;
}

.panel-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: rgba(0, 0, 0, 0.87);
}

.marco-logico-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.marco-logico-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08) !important;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
}

.panel-content {
  padding: 16px;
  background-color: #fafafa;
}

.text-grey {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  margin-top: 16px;
}
</style>
